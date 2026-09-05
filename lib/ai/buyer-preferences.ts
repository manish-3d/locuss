import { z } from "zod";

export const buyerPreferencesSchema = z.object({
  budgetMin: z
    .number()
    .positive()
    .optional()
    .describe("Minimum budget in Indian rupees."),
  budgetMax: z
    .number()
    .positive()
    .optional()
    .describe("Maximum budget in Indian rupees."),
  bedrooms: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Preferred bedroom count, e.g. 3 for 3 BHK."),
  city: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Target city for property search."),
  propertyType: z
    .enum(["HOUSE", "APARTMENT", "VILLA", "PLOT", "OFFICE", "SHOP"])
    .optional()
    .describe("Preferred property category."),
  listingType: z
    .enum(["SALE", "RENT"])
    .optional()
    .describe("Whether the buyer is looking to buy (SALE) or rent (RENT)."),
  furnished: z
    .boolean()
    .optional()
    .describe("Whether the property must be furnished."),
  parking: z
    .boolean()
    .optional()
    .describe("Whether parking space is required."),
  minArea: z
    .number()
    .positive()
    .optional()
    .describe("Minimum carpet/built-up area in square feet."),
  maxArea: z
    .number()
    .positive()
    .optional()
    .describe("Maximum area in square feet."),
  priorities: z
    .array(z.enum(["budget", "space", "location", "furnished", "parking", "area"]))
    .optional()
    .describe("User preference priorities ordered by importance, e.g. ['space', 'budget']."),
});

export type BuyerPreferences = z.infer<typeof buyerPreferencesSchema>;

// In-memory preference cache keyed by authenticated user ID
const userPreferencesCache = new Map<string, BuyerPreferences>();

export function getCachedUserPreferences(userId: string): BuyerPreferences | undefined {
  return userPreferencesCache.get(userId);
}

export function setCachedUserPreferences(userId: string, preferences: BuyerPreferences): void {
  userPreferencesCache.set(userId, preferences);
}

/**
 * Merges updated preferences into current preferences.
 * The latest explicit user preference overrides the previous conflicting preference.
 * Existing non-conflicting preferences are preserved.
 */
export function mergePreferences(
  current: BuyerPreferences = {},
  update: Partial<BuyerPreferences> = {},
): BuyerPreferences {
  const merged: BuyerPreferences = { ...current };

  for (const [key, value] of Object.entries(update)) {
    if (value !== undefined && value !== null) {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  // Ensure budgetMin <= budgetMax if both present
  if (
    merged.budgetMin !== undefined &&
    merged.budgetMax !== undefined &&
    merged.budgetMin > merged.budgetMax
  ) {
    // If update explicitly set budgetMax, adjust budgetMin; if set budgetMin, adjust budgetMax
    if (update.budgetMax !== undefined) {
      delete merged.budgetMin;
    } else if (update.budgetMin !== undefined) {
      delete merged.budgetMax;
    }
  }

  return merged;
}

/**
 * Parse Indian currency amounts (lakh/crore) to numbers.
 */
export function parseIndianAmount(amountStr: string, unitStr: string): number | undefined {
  const num = parseFloat(amountStr.replace(/,/g, ""));
  if (isNaN(num)) return undefined;

  const unit = unitStr.toLowerCase();
  if (unit.startsWith("cr") || unit.includes("crore")) {
    return Math.round(num * 10000000);
  }
  if (unit.startsWith("l") || unit.includes("lakh") || unit.includes("lac")) {
    return Math.round(num * 100000);
  }
  return Math.round(num);
}

/**
 * Server-side extractor for explicit preferences mentioned in the user message.
 * Extracts: budget, bedrooms, city, listingType, propertyType, furnishing, parking, priorities.
 * Does NOT store arbitrary text.
 */
export function extractExplicitPreferences(
  text: string,
  current?: BuyerPreferences,
): Partial<BuyerPreferences> {
  const extracted: Partial<BuyerPreferences> = {};
  const lower = text.toLowerCase();

  // 1. Budget Range extraction: "70 to 80 lakh", "between 70 and 80 lakh"
  const rangeMatch = lower.match(
    /(?:between\s+)?(?:₹\s*)?(\d+(?:\.\d+)?)\s*(?:to|-|and)\s*(?:₹\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|cr|crore|crores)/i,
  );
  if (rangeMatch) {
    const minVal = parseIndianAmount(rangeMatch[1], rangeMatch[3]);
    const maxVal = parseIndianAmount(rangeMatch[2], rangeMatch[3]);
    if (minVal && maxVal) {
      extracted.budgetMin = Math.min(minVal, maxVal);
      extracted.budgetMax = Math.max(minVal, maxVal);
    }
  } else {
    // Single upper bound: "under 80 lakh", "80 lakh max", "max 90 lakh", "up to 85 lakh", "make it 90 lakh max"
    const maxMatch = lower.match(
      /(?:under|below|max(?:imum)?|up\s*to|less\s*than|within|make\s*it|go\s*up\s*to)\s*(?:₹\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|cr|crore|crores)?(?:\s*max)?/i,
    );
    if (maxMatch) {
      const unit = maxMatch[2] || (current?.budgetMax ? (current.budgetMax >= 10000000 ? "crore" : "lakh") : "lakh");
      const val = parseIndianAmount(maxMatch[1], unit);
      if (val) {
        extracted.budgetMax = val;
      }
    }

    // Single lower bound: "above 50 lakh", "min 50 lakh", "at least 50 lakh"
    const minMatch = lower.match(
      /(?:above|min(?:imum)?|at\s*least|more\s*than|starting\s*from)\s*(?:₹\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|cr|crore|crores)/i,
    );
    if (minMatch) {
      const val = parseIndianAmount(minMatch[1], minMatch[2]);
      if (val) {
        extracted.budgetMin = val;
      }
    }

    // Direct statement: "my budget is 70 lakh", "budget 80 lakh"
    const directBudget = lower.match(
      /(?:budget\s*(?:is|=|:)?\s*)(?:₹\s*)?(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs|cr|crore|crores)/i,
    );
    if (directBudget && !extracted.budgetMax) {
      const val = parseIndianAmount(directBudget[1], directBudget[2]);
      if (val) {
        extracted.budgetMax = val;
      }
    }
  }

  // 2. Bedrooms extraction: "3 BHK", "3 bedroom", "3 beds"
  const bhkMatch = lower.match(/(\d+)\s*(?:bhk|bedroom|bed\b)/i);
  if (bhkMatch) {
    const beds = parseInt(bhkMatch[1], 10);
    if (beds > 0 && beds <= 10) {
      extracted.bedrooms = beds;
    }
  }

  // 3. City extraction: known common cities in marketplace
  const commonCities = [
    "greater noida",
    "noida",
    "gurgaon",
    "gurugram",
    "pune",
    "mumbai",
    "delhi",
    "bangalore",
    "bengaluru",
    "hyderabad",
    "chennai",
    "kolkata",
  ];
  for (const city of commonCities) {
    const cityRegex = new RegExp(`\\b${city}\\b`, "i");
    if (cityRegex.test(lower)) {
      // Capitalize properly
      extracted.city = city
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      break;
    }
  }

  // 4. Listing Type: Rent vs Buy
  if (/\b(?:rent|renting|for rent|to rent)\b/i.test(lower)) {
    extracted.listingType = "RENT";
  } else if (/\b(?:buy|buying|purchase|for sale|to buy)\b/i.test(lower)) {
    extracted.listingType = "SALE";
  }

  // 5. Property Type
  if (/\b(?:apartment|apartments|flat|flats)\b/i.test(lower)) {
    extracted.propertyType = "APARTMENT";
  } else if (/\b(?:villa|villas)\b/i.test(lower)) {
    extracted.propertyType = "VILLA";
  } else if (/\b(?:house|houses|independent house|home)\b/i.test(lower)) {
    extracted.propertyType = "HOUSE";
  } else if (/\b(?:plot|plots|land)\b/i.test(lower)) {
    extracted.propertyType = "PLOT";
  } else if (/\b(?:office|offices|commercial space)\b/i.test(lower)) {
    extracted.propertyType = "OFFICE";
  } else if (/\b(?:shop|shops|retail)\b/i.test(lower)) {
    extracted.propertyType = "SHOP";
  }

  // 6. Furnished
  if (/\b(?:unfurnished|non-furnished)\b/i.test(lower)) {
    extracted.furnished = false;
  } else if (/\b(?:furnished|fully furnished|semi-furnished)\b/i.test(lower)) {
    extracted.furnished = true;
  }

  // 7. Parking
  if (/\b(?:with parking|parking is important|need parking|include parking|includes parking|has parking)\b/i.test(lower)) {
    extracted.parking = true;
  }

  // 8. Priorities
  if (
    lower.includes("space is more important than price") ||
    lower.includes("space matters more than price") ||
    lower.includes("space over price") ||
    lower.includes("space is priority") ||
    lower.includes("more space than price")
  ) {
    extracted.priorities = ["space", "budget"];
  } else if (
    lower.includes("price is more important than space") ||
    lower.includes("budget matters more") ||
    lower.includes("budget is top priority")
  ) {
    extracted.priorities = ["budget", "space"];
  } else if (lower.includes("location is most important") || lower.includes("location matters most")) {
    extracted.priorities = ["location", "budget"];
  }

  return extracted;
}

/**
 * Format active preferences into a clear section for the LLM system prompt.
 */
export function formatPreferencesForPrompt(preferences: BuyerPreferences): string {
  const items: string[] = [];

  if (preferences.city) {
    items.push(`City: ${preferences.city}`);
  }
  if (preferences.budgetMax !== undefined) {
    const formattedMax = formatInr(preferences.budgetMax);
    if (preferences.budgetMin !== undefined) {
      items.push(`Budget Range: ${formatInr(preferences.budgetMin)} – ${formattedMax}`);
    } else {
      items.push(`Maximum Budget: ${formattedMax} (₹${preferences.budgetMax.toLocaleString("en-IN")})`);
    }
  } else if (preferences.budgetMin !== undefined) {
    items.push(`Minimum Budget: ${formatInr(preferences.budgetMin)}`);
  }
  if (preferences.bedrooms !== undefined) {
    items.push(`Bedrooms: ${preferences.bedrooms} BHK`);
  }
  if (preferences.propertyType) {
    items.push(`Property Type: ${preferences.propertyType}`);
  }
  if (preferences.listingType) {
    items.push(`Listing Type: For ${preferences.listingType === "SALE" ? "Sale (Buying)" : "Rent"}`);
  }
  if (preferences.furnished !== undefined) {
    items.push(`Furnishing: ${preferences.furnished ? "Furnished required" : "Unfurnished"}`);
  }
  if (preferences.parking !== undefined) {
    items.push(`Parking: ${preferences.parking ? "Required" : "Not required"}`);
  }
  if (preferences.minArea !== undefined) {
    items.push(`Min Area: ${preferences.minArea} sq ft`);
  }
  if (preferences.maxArea !== undefined) {
    items.push(`Max Area: ${preferences.maxArea} sq ft`);
  }
  if (preferences.priorities && preferences.priorities.length > 0) {
    items.push(`Explicit Priorities: ${preferences.priorities.join(" > ")}`);
  }

  if (items.length === 0) {
    return "No active buyer preferences recorded yet.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function formatInr(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2)} Crore`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
