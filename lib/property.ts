import { prisma } from "@/lib/prisma";
import { ListingType } from "@prisma/client";

type GetPropertiesOptions = {
  listingType?: ListingType;
};

export async function getProperties(options: GetPropertiesOptions = {}) {
  return prisma.property.findMany({
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: options.listingType
      ? {
          listingType: options.listingType,
        }
      : undefined,
  });
}

export async function getFeaturedProperties() {
  return prisma.property.findMany({
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: {
      id,
    },
  });
}
