import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SearchPropertyResult = Prisma.PropertyGetPayload<{
  include: {
    images: {
      orderBy: {
        order: "asc";
      };
      take: 1;
    };
  };
}>;

export type PropertySearchFilters = {
  city?: string;
  listingType?: "SALE" | "RENT";
  propertyType?:
  | "HOUSE"
  | "APARTMENT"
  | "VILLA"
  | "PLOT"
  | "OFFICE"
  | "SHOP";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnished?: boolean;
  limit?: number;
};

export async function searchProperties(
  filters: PropertySearchFilters
): Promise<SearchPropertyResult[]> {
  const limit = Math.min(Math.max(filters.limit ?? 5, 1), 20);

  const properties = await prisma.property.findMany({
    where: {
      status: "PUBLISHED",

      ...(filters.city && {
        city: {
          contains: filters.city.trim(),
          mode: "insensitive",
        },
      }),

      ...(filters.listingType && {
        listingType: filters.listingType,
      }),

      ...(filters.propertyType && {
        propertyType: filters.propertyType,
      }),

      ...(filters.bedrooms !== undefined && {
        bedrooms: filters.bedrooms,
      }),

      ...(filters.furnished !== undefined && {
        furnished: filters.furnished,
      }),

      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
          price: {
            ...(filters.minPrice !== undefined && {
              gte: BigInt(Math.floor(filters.minPrice)),
            }),
            ...(filters.maxPrice !== undefined && {
              lte: BigInt(Math.floor(filters.maxPrice)),
            }),
          },
        }
        : {}),

      ...(filters.minArea !== undefined || filters.maxArea !== undefined
        ? {
          area: {
            ...(filters.minArea !== undefined && {
              gte: filters.minArea,
            }),
            ...(filters.maxArea !== undefined && {
              lte: filters.maxArea,
            }),
          },
        }
        : {}),
    },

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

    take: limit,
  });

  return properties;
}
