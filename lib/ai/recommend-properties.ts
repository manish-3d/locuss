import { prisma } from "@/lib/prisma";
import {
  brokerPropertySelect,
  normalizeBrokerProperty,
  type BrokerProperty,
} from "@/lib/ai/property-data";

export type RecommendationPreferences = {
  propertyIds: string[];
  maxBudget?: number;
  minBudget?: number;
  bedrooms?: number;
  minBedrooms?: number;
  minArea?: number;
  city?: string;
  listingType?: "SALE" | "RENT";
  propertyType?:
    | "HOUSE"
    | "APARTMENT"
    | "VILLA"
    | "PLOT"
    | "OFFICE"
    | "SHOP";
  furnished?: boolean;
  parking?: boolean;
  prioritize?: "balanced" | "budget" | "space" | "location";
  priorities?: Array<"budget" | "space" | "location" | "furnished" | "parking" | "area">;
};

type ScoredRecommendation = {
  property: BrokerProperty;
  score: number;
  reasons: string[];
};

function scoreProperty(
  property: BrokerProperty,
  preferences: RecommendationPreferences,
  candidates: BrokerProperty[],
): ScoredRecommendation {
  const reasons: string[] = [];
  const weightedMatches: Array<{ weight: number; ratio: number }> = [];
  const prioritize = preferences.prioritize ?? "balanced";
  const priorities = new Set(preferences.priorities ?? []);

  const isSpacePrioritized =
    prioritize === "space" || priorities.has("space") || priorities.has("area");
  const isBudgetPrioritized = prioritize === "budget" || priorities.has("budget");

  const weights = {
    budget: isBudgetPrioritized ? 45 : isSpacePrioritized ? 15 : 25,
    bedrooms: isSpacePrioritized ? 35 : 20,
    area: isSpacePrioritized ? 45 : 20,
    location: prioritize === "location" || priorities.has("location") ? 40 : 20,
    type: prioritize === "location" ? 20 : 10,
    furnished: priorities.has("furnished") ? 25 : 10,
    parking: priorities.has("parking") ? 25 : 10,
  };

  if (preferences.maxBudget !== undefined) {
    const ratio = Math.min(1, preferences.maxBudget / Math.max(property.price, 1));
    weightedMatches.push({ weight: weights.budget, ratio });
    if (property.price <= preferences.maxBudget) {
      reasons.push("stays within your budget");
    } else {
      reasons.push("is above your budget");
    }
  }

  if (preferences.minBudget !== undefined) {
    const ratio = Math.min(1, property.price / Math.max(preferences.minBudget, 1));
    weightedMatches.push({ weight: weights.budget / 2, ratio });
    if (property.price >= preferences.minBudget) {
      reasons.push("meets your minimum budget");
    }
  }

  const requestedBedrooms = preferences.bedrooms ?? preferences.minBedrooms;
  if (requestedBedrooms !== undefined) {
    const ratio =
      preferences.bedrooms !== undefined
        ? property.bedrooms === preferences.bedrooms
          ? 1
          : Math.max(
              0,
              1 -
                Math.abs(property.bedrooms - preferences.bedrooms) /
                  Math.max(preferences.bedrooms, 1),
            )
        : Math.min(1, property.bedrooms / preferences.minBedrooms!);
    weightedMatches.push({ weight: weights.bedrooms, ratio });
    if (preferences.bedrooms !== undefined && property.bedrooms === preferences.bedrooms) {
      reasons.push(`has ${preferences.bedrooms} bedrooms`);
    } else if (
      preferences.minBedrooms !== undefined &&
      property.bedrooms >= preferences.minBedrooms
    ) {
      reasons.push(`has at least ${preferences.minBedrooms} bedrooms`);
    }
  }

  if (preferences.minArea !== undefined) {
    const ratio = Math.min(1, property.area / preferences.minArea);
    weightedMatches.push({ weight: weights.area, ratio });
    if (property.area >= preferences.minArea) {
      reasons.push("meets your minimum area requirement");
    }
  } else if (isSpacePrioritized && candidates.length > 1) {
    const candidateAreas = candidates.map((c) => c.area);
    const maxArea = Math.max(...candidateAreas);
    const minArea = Math.min(...candidateAreas);
    const range = Math.max(maxArea - minArea, 1);
    const ratio = (property.area - minArea) / range;
    weightedMatches.push({ weight: weights.area, ratio });
    if (property.area === maxArea) {
      reasons.push("gives you more space than the other options");
    }
  }

  if (preferences.city) {
    const matchesCity = property.city
      .toLocaleLowerCase()
      .includes(preferences.city.trim().toLocaleLowerCase());
    weightedMatches.push({ weight: weights.location, ratio: matchesCity ? 1 : 0 });
    if (matchesCity) reasons.push(`is in ${property.city}`);
  }

  if (preferences.listingType) {
    const matchesListingType = property.listingType === preferences.listingType;
    weightedMatches.push({
      weight: weights.type,
      ratio: matchesListingType ? 1 : 0,
    });
    if (matchesListingType) reasons.push(`available for ${property.listingType.toLowerCase()}`);
  }

  if (preferences.propertyType) {
    const matchesPropertyType = property.propertyType === preferences.propertyType;
    weightedMatches.push({
      weight: weights.type,
      ratio: matchesPropertyType ? 1 : 0,
    });
    if (matchesPropertyType) reasons.push(`is a ${property.propertyType.toLowerCase()}`);
  }

  if (preferences.furnished !== undefined) {
    const matchesFurnished = property.furnished === preferences.furnished;
    weightedMatches.push({
      weight: weights.furnished,
      ratio: matchesFurnished ? 1 : 0,
    });
    if (matchesFurnished) reasons.push(property.furnished ? "is furnished" : "is unfurnished");
  }

  if (preferences.parking !== undefined) {
    const hasParking =
      (property.parking !== null && property.parking > 0) ||
      property.amenities.some((a) => a.toLowerCase().includes("parking"));
    const matchesParking = preferences.parking ? hasParking : !hasParking;
    weightedMatches.push({
      weight: weights.parking,
      ratio: matchesParking ? 1 : 0,
    });
    if (matchesParking && preferences.parking) {
      reasons.push("includes parking");
    }
  }

  if (weightedMatches.length === 0) {
    const prices = candidates.map(({ price }) => price);
    const areas = candidates.map(({ area }) => area);
    const maxCandidatePrice = Math.max(...prices, property.price);
    const minCandidatePrice = Math.min(...prices, property.price);
    const maxCandidateArea = Math.max(...areas, property.area);
    const minCandidateArea = Math.min(...areas, property.area);
    const priceRange = Math.max(maxCandidatePrice - minCandidatePrice, 1);
    const areaRange = Math.max(maxCandidateArea - minCandidateArea, 1);

    weightedMatches.push({
      weight: 50,
      ratio: 1 - (property.price - minCandidatePrice) / priceRange,
    });
    weightedMatches.push({
      weight: 50,
      ratio: (property.area - minCandidateArea) / areaRange,
    });
    reasons.push("offers a balanced value among the selected properties");
  }

  const totalWeight = weightedMatches.reduce((sum, item) => sum + item.weight, 0);
  const weightedScore = weightedMatches.reduce(
    (sum, item) => sum + item.weight * Math.max(0, Math.min(1, item.ratio)),
    0,
  );

  return {
    property,
    score: Math.round((weightedScore / totalWeight) * 100),
    reasons: reasons.slice(0, 3),
  };
}

export async function recommendProperties(
  preferences: RecommendationPreferences,
) {
  const uniquePropertyIds = Array.from(
    new Set(preferences.propertyIds.map((propertyId) => propertyId.trim()).filter(Boolean)),
  );

  if (uniquePropertyIds.length === 0 || uniquePropertyIds.length > 10) {
    throw new Error("Choose between 1 and 10 properties to rank.");
  }

  const properties = await prisma.property.findMany({
    where: {
      id: { in: uniquePropertyIds },
      status: "PUBLISHED",
    },
    select: brokerPropertySelect,
  });
  const normalizedProperties = properties.map(normalizeBrokerProperty);
  const propertiesById = new Map(normalizedProperties.map((property) => [property.id, property]));
  const orderedProperties = uniquePropertyIds
    .map((propertyId) => propertiesById.get(propertyId))
    .filter((property): property is BrokerProperty => Boolean(property));

  if (orderedProperties.length === 0) {
    throw new Error("None of the selected properties are currently available.");
  }

  const recommendations = orderedProperties
    .map((property) => scoreProperty(property, preferences, orderedProperties))
    .sort((a, b) => b.score - a.score);

  return {
    recommendations: recommendations.map((recommendation, index) => ({
      rank: index + 1,
      ...recommendation,
    })),
    missingPropertyIds: uniquePropertyIds.filter(
      (propertyId) => !propertiesById.has(propertyId),
    ),
  };
}
