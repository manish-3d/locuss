import { prisma } from "@/lib/prisma";

/**
 * Haversine formula: calculates the great-circle distance between two points
 * on a sphere given their latitudes and longitudes in decimal degrees.
 *
 * @returns distance in kilometers
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type NearbyProperty = {
  id: string;
  title: string;
  price: bigint;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: string;
  furnished: boolean;
  parking: number | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  distance: number; // in km
};

/**
 * Finds PUBLISHED properties near a given coordinate.
 *
 * Approach: Bounding-box pre-filter + Haversine exact distance calculation.
 *
 * 1. Converts the search radius into approximate lat/lng degree offsets
 *    to create a bounding box.
 * 2. Queries Prisma with latitude/longitude range filters (efficient WHERE).
 * 3. Computes exact Haversine distance for the smaller result set.
 * 4. Filters out properties beyond the exact radius.
 * 5. Sorts by distance ascending.
 *
 * @param latitude  - Center latitude (-90 to 90)
 * @param longitude - Center longitude (-180 to 180)
 * @param excludeId - Property ID to exclude (the current property)
 * @param radiusKm  - Search radius in kilometers (default: 10)
 * @param limit     - Maximum number of results (default: 6)
 */
export async function getNearbyProperties(
  latitude: number,
  longitude: number,
  excludeId: string,
  radiusKm: number = 10,
  limit: number = 6
): Promise<NearbyProperty[]> {
  // 1 degree of latitude ≈ 111.32 km
  // 1 degree of longitude ≈ 111.32 * cos(latitude) km
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((latitude * Math.PI) / 180));

  // Bounding box filter via Prisma
  const candidates = await prisma.property.findMany({
    where: {
      id: { not: excludeId },
      status: "PUBLISHED",
      latitude: {
        gte: latitude - latDelta,
        lte: latitude + latDelta,
      },
      longitude: {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta,
      },
    },
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
  });

  // Calculate exact distances and filter
  const withDistance = candidates
    .map((property) => ({
      id: property.id,
      title: property.title,
      price: property.price,
      city: property.city,
      state: property.state,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      propertyType: property.propertyType,
      listingType: property.listingType,
      furnished: property.furnished,
      parking: property.parking,
      latitude: property.latitude!,
      longitude: property.longitude!,
      imageUrl: property.images[0]?.url || null,
      distance: haversineDistance(
        latitude,
        longitude,
        property.latitude!,
        property.longitude!
      ),
    }))
    .filter((p) => p.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return withDistance;
}
