import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPropertyById } from "@/lib/property";
import { getNearbyProperties } from "@/lib/property-nearby";
import { PropertyDetailView } from "./property-detail-view";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} | Locus`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Increment view count
  await prisma.property.update({
    where: { id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  let isFavorited = false;
  if (session?.user.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: id,
        },
      },
    });
    isFavorited = !!fav;
  }

  // Fetch similar properties
  const similarProperties = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      status: "PUBLISHED",
      OR: [
        { city: property.city },
        { propertyType: property.propertyType },
        { listingType: property.listingType },
      ],
    },
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch nearby properties if coordinates exist
  let nearbyProperties: any[] = [];
  if (property.latitude != null && property.longitude != null) {
    nearbyProperties = await getNearbyProperties(
      property.latitude,
      property.longitude,
      property.id,
      10, // 10km radius
      4
    );
  }

  return (
    <PropertyDetailView
      property={property}
      isFavorited={isFavorited}
      similarProperties={similarProperties}
      nearbyProperties={nearbyProperties}
    />
  );
}
