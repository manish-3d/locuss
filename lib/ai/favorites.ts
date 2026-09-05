import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  brokerPropertySelect,
  normalizeBrokerProperty,
} from "@/lib/ai/property-data";
import { requireBrokerUser } from "@/lib/ai/session";

type FavoriteAction = "add" | "remove" | "check" | "list";

export async function manageFavorites({
  propertyId,
  action,
}: {
  propertyId?: string;
  action: FavoriteAction;
}) {
  const user = await requireBrokerUser();

  if (action === "list") {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
        property: { status: "PUBLISHED" },
      },
      select: {
        createdAt: true,
        property: { select: brokerPropertySelect },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      action,
      favorites: favorites.map(({ createdAt, property }) => ({
        ...normalizeBrokerProperty(property),
        favoritedAt: createdAt.toISOString(),
      })),
    };
  }

  if (!propertyId) {
    throw new Error("A property is required for this favorite action.");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      status: "PUBLISHED",
    },
    select: { id: true, title: true },
  });

  if (!property) {
    throw new Error("Property not found or not available.");
  }

  const favoriteKey = {
    userId_propertyId: {
      userId: user.id,
      propertyId: property.id,
    },
  };

  if (action === "add") {
    await prisma.favorite.upsert({
      where: favoriteKey,
      create: {
        userId: user.id,
        propertyId: property.id,
      },
      update: {},
    });
  } else if (action === "remove") {
    await prisma.favorite.deleteMany({
      where: favoriteKey.userId_propertyId,
    });
  }

  const isFavorited = action === "add"
    ? true
    : action === "remove"
      ? false
      : Boolean(await prisma.favorite.findUnique({ where: favoriteKey }));

  if (action === "add" || action === "remove") {
    revalidateFavoritePaths(property.id);
  }

  return {
    action,
    propertyId: property.id,
    title: property.title,
    isFavorited,
  };
}

export function revalidateFavoritePaths(propertyId: string) {
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
}
