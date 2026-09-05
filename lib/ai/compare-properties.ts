import { prisma } from "@/lib/prisma";
import {
  brokerPropertySelect,
  normalizeBrokerProperty,
} from "@/lib/ai/property-data";

export async function compareProperties(propertyIds: string[]) {
  const uniquePropertyIds = Array.from(
    new Set(propertyIds.map((propertyId) => propertyId.trim()).filter(Boolean)),
  );

  if (uniquePropertyIds.length < 2 || uniquePropertyIds.length > 5) {
    throw new Error("Choose between 2 and 5 different properties to compare.");
  }

  const properties = await prisma.property.findMany({
    where: {
      id: { in: uniquePropertyIds },
      status: "PUBLISHED",
    },
    select: brokerPropertySelect,
  });

  const propertiesById = new Map(
    properties.map((property) => [property.id, property]),
  );
  const orderedProperties = uniquePropertyIds
    .map((propertyId) => propertiesById.get(propertyId))
    .filter((property): property is (typeof properties)[number] => Boolean(property));

  if (orderedProperties.length < 2) {
    throw new Error("At least two of those properties are no longer available.");
  }

  return {
    properties: orderedProperties.map(normalizeBrokerProperty),
    missingPropertyIds: uniquePropertyIds.filter(
      (propertyId) => !propertiesById.has(propertyId),
    ),
  };
}
