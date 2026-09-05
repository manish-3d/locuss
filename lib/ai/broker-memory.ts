import { prisma } from "@/lib/prisma";
import type { BuyerPreferences } from "./buyer-preferences";
import { mergePreferences, formatPreferencesForPrompt } from "./buyer-preferences";

export type PersistentInteraction = {
  timestamp: string;
  summary: string;
  action?: string;
  propertyTitle?: string;
};

export type PersistentBrokerMemory = {
  userId: string;
  preferences: BuyerPreferences;
  notablePreferences: string[];
  interactionHistory: PersistentInteraction[];
  updatedAt: string;
};

// In-memory read-through cache for low-latency retrieval
const memoryCache = new Map<string, PersistentBrokerMemory>();

/**
 * Load persistent memory for a specific authenticated user from PostgreSQL via Prisma.
 * Strictly user-isolated: Returns empty initial state if not found.
 */
export async function loadPersistentMemory(userId?: string): Promise<PersistentBrokerMemory | null> {
  if (!userId) return null;

  if (memoryCache.has(userId)) {
    return memoryCache.get(userId)!;
  }

  const brokerMemoryDb = (prisma as any)?.brokerMemory;
  if (brokerMemoryDb) {
    try {
      const record = await brokerMemoryDb.findUnique({
        where: { userId },
      });

      if (record) {
        const memory: PersistentBrokerMemory = {
          userId: record.userId,
          preferences: (record.preferences as BuyerPreferences) || {},
          notablePreferences: Array.isArray(record.notablePreferences) ? record.notablePreferences : [],
          interactionHistory: Array.isArray(record.interactionHistory)
            ? (record.interactionHistory as unknown as PersistentInteraction[])
            : [],
          updatedAt: record.updatedAt.toISOString(),
        };
        memoryCache.set(userId, memory);
        return memory;
      }
    } catch (error) {
      console.warn(`[BrokerMemory] Database read error for user ${userId}:`, error);
    }
  }

  const initial: PersistentBrokerMemory = {
    userId,
    preferences: {},
    notablePreferences: [],
    interactionHistory: [],
    updatedAt: new Date().toISOString(),
  };

  memoryCache.set(userId, initial);
  return initial;
}

/**
 * Save persistent memory for a specific authenticated user to PostgreSQL via Prisma.
 * Atomic upsert ensures ACID safety across concurrent requests and serverless instances.
 */
export async function savePersistentMemory(userId: string, memory: PersistentBrokerMemory): Promise<void> {
  if (!userId) return;

  memory.updatedAt = new Date().toISOString();
  memoryCache.set(userId, memory);

  const brokerMemoryDb = (prisma as any)?.brokerMemory;
  if (brokerMemoryDb) {
    try {
      await brokerMemoryDb.upsert({
        where: { userId },
        create: {
          userId,
          preferences: memory.preferences as any,
          notablePreferences: memory.notablePreferences,
          interactionHistory: memory.interactionHistory as any,
        },
        update: {
          preferences: memory.preferences as any,
          notablePreferences: memory.notablePreferences,
          interactionHistory: memory.interactionHistory as any,
        },
      });
    } catch (error) {
      console.warn(`[BrokerMemory] Database write error for user ${userId}:`, error);
    }
  }
}

/**
 * Update persistent memory with new explicit preferences and/or notable interactions.
 * Durable update: latest explicit user values override previous conflicting ones.
 */
export async function updatePersistentMemory(
  userId?: string,
  preferenceUpdate?: Partial<BuyerPreferences>,
  interaction?: { summary: string; action?: string; propertyTitle?: string },
): Promise<PersistentBrokerMemory | null> {
  if (!userId) return null;

  const current = (await loadPersistentMemory(userId)) || {
    userId,
    preferences: {},
    notablePreferences: [],
    interactionHistory: [],
    updatedAt: new Date().toISOString(),
  };

  let updatedPreferences = current.preferences;
  if (preferenceUpdate && Object.keys(preferenceUpdate).length > 0) {
    updatedPreferences = mergePreferences(current.preferences, preferenceUpdate);
  }

  const updatedHistory = [...(current.interactionHistory || [])];
  if (interaction?.summary) {
    updatedHistory.unshift({
      timestamp: new Date().toISOString(),
      summary: interaction.summary,
      action: interaction.action,
      propertyTitle: interaction.propertyTitle,
    });
    // Keep bounded history (last 10 meaningful items) to avoid prompt bloat
    if (updatedHistory.length > 10) {
      updatedHistory.length = 10;
    }
  }

  const updatedMemory: PersistentBrokerMemory = {
    ...current,
    preferences: updatedPreferences,
    interactionHistory: updatedHistory,
    updatedAt: new Date().toISOString(),
  };

  await savePersistentMemory(userId, updatedMemory);
  return updatedMemory;
}

/**
 * Server-side relevance retrieval:
 * Retrieves only durable memories relevant to the current user query.
 * Distinguishes between:
 * - Direct historical references ("similar to what we discussed yesterday", "my usual preferences")
 * - Specific localized criteria (city, budget, bedrooms)
 * - General queries with no property preference relevance
 */
export async function getRelevantBrokerMemory(userId?: string, query?: string): Promise<string | null> {
  if (!userId) return null;

  const memory = await loadPersistentMemory(userId);
  if (!memory) return null;

  const { preferences, interactionHistory, notablePreferences } = memory;
  const hasPreferences = preferences && Object.keys(preferences).length > 0;
  const hasHistory = interactionHistory && interactionHistory.length > 0;

  if (!hasPreferences && !hasHistory && notablePreferences.length === 0) {
    return null;
  }

  const lowerQuery = (query || "").toLowerCase();

  // 1. Detect direct memory recall requests:
  // "what we discussed yesterday", "like last time", "my usual preferences", "remember what I wanted", "as usual"
  const isRecallQuery =
    lowerQuery.includes("yesterday") ||
    lowerQuery.includes("last time") ||
    lowerQuery.includes("previous") ||
    lowerQuery.includes("usual") ||
    lowerQuery.includes("remember") ||
    lowerQuery.includes("what i wanted") ||
    lowerQuery.includes("we discussed") ||
    lowerQuery.includes("my preference") ||
    lowerQuery.includes("find me something similar");

  // 2. Detect property search intent where stored criteria would be relevant:
  const isSearchIntent =
    lowerQuery.includes("find") ||
    lowerQuery.includes("show") ||
    lowerQuery.includes("search") ||
    lowerQuery.includes("recommend") ||
    lowerQuery.includes("apartment") ||
    lowerQuery.includes("villa") ||
    lowerQuery.includes("house") ||
    lowerQuery.includes("bhk") ||
    lowerQuery.includes("budget") ||
    lowerQuery.includes("cheaper") ||
    lowerQuery.includes("pune") ||
    lowerQuery.includes("noida") ||
    lowerQuery.includes("gurgaon") ||
    lowerQuery.includes("mumbai") ||
    lowerQuery.includes("options");

  // If query is a general knowledge question (e.g. "What is RERA?", "Hello"), do not inject memory
  if (!isRecallQuery && !isSearchIntent && lowerQuery.length > 0) {
    return null;
  }

  const sections: string[] = [];

  // Format remembered preferences
  if (hasPreferences) {
    const formattedPrefs = formatPreferencesForPrompt(preferences);
    sections.push(`Remembered Buyer Profile:\n${formattedPrefs}`);
  }

  // Format notable preferences if any
  if (notablePreferences && notablePreferences.length > 0) {
    sections.push(`Notable Preferences: ${notablePreferences.join(", ")}`);
  }

  // If recall query or recent interactions exist, include recent context
  if ((isRecallQuery || hasHistory) && interactionHistory.length > 0) {
    const recent = interactionHistory.slice(0, 3);
    const historyText = recent
      .map((item) => `- [${new Date(item.timestamp).toLocaleDateString()}] ${item.summary}`)
      .join("\n");
    sections.push(`Recent Relevant Interactions:\n${historyText}`);
  }

  if (sections.length === 0) return null;

  return `LONG-TERM BROKER MEMORY (PERSISTENT CONTEXT ACROSS CONVERSATIONS):
${sections.join("\n\n")}

BROKER MEMORY INTEGRATION RULES:
1. This is persistent context saved from previous sessions for this authenticated buyer.
2. CURRENT REQUEST OVERRIDES: If the user's current request explicitly specifies new criteria (e.g., "Actually my budget is 2 crore" or "Now look in Gurgaon"), the new explicit input STRICTLY takes precedence over remembered values.
3. CONTEXTUAL RECALL: When the user says "Find something similar to what we discussed yesterday" or "use my usual preferences", apply the remembered preferences above as default search parameters.
4. DO NOT repeat the entire memory database verbatim to the user; reference it naturally as a trusted broker who remembers their client's taste.`;
}
