import { prisma } from "@/lib/prisma";

export async function getPropertyDetails(propertyId: string) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      listingType: true,
      propertyType: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      address: true,
      city: true,
      state: true,
      country: true,
      furnished: true,
      parking: true,
      balconies: true,
      status: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
      images: {
        orderBy: {
          order: "asc",
        },
      },
      owner: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!property) return null;

  return {
    ...property,
    price: Number(property.price),
    amenities: property.amenities.map((pa) => pa.amenity.name),
    images: property.images.map((img) => img.url),
  };
}
