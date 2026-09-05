import type { Prisma } from "@prisma/client";

export const brokerPropertySelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  bedrooms: true,
  bathrooms: true,
  area: true,
  address: true,
  city: true,
  state: true,
  country: true,
  listingType: true,
  propertyType: true,
  furnished: true,
  balconies: true,
  parking: true,
  amenities: {
    select: {
      amenity: {
        select: {
          name: true,
        },
      },
    },
  },
  images: {
    orderBy: {
      order: "asc",
    },
    take: 1,
    select: {
      url: true,
    },
  },
} satisfies Prisma.PropertySelect;

export type BrokerPropertyRecord = Prisma.PropertyGetPayload<{
  select: typeof brokerPropertySelect;
}>;

export type BrokerProperty = {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  country: string;
  listingType: "SALE" | "RENT";
  propertyType:
    | "HOUSE"
    | "APARTMENT"
    | "VILLA"
    | "PLOT"
    | "OFFICE"
    | "SHOP";
  furnished: boolean;
  balconies: number | null;
  parking: number | null;
  amenities: string[];
  image: string;
};

export function normalizeBrokerProperty(
  property: BrokerPropertyRecord,
): BrokerProperty {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: Number(property.price),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    address: property.address,
    city: property.city,
    state: property.state,
    country: property.country,
    listingType: property.listingType,
    propertyType: property.propertyType,
    furnished: property.furnished,
    balconies: property.balconies,
    parking: property.parking,
    amenities: property.amenities.map(({ amenity }) => amenity.name),
    image: property.images[0]?.url ?? "",
  };
}
