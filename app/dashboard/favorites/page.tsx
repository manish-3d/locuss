import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/property/property-card";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      property: {
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Favorites</h1>
        <p className="mt-2 text-gray-500">
          Properties you have saved for later.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <h2 className="text-2xl font-semibold">No favorites yet</h2>
          <p className="mt-3 text-gray-500">
            Explore listings and click the heart icon to save properties.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((fav) => (
            <PropertyCard key={fav.propertyId} property={fav.property} />
          ))}
        </div>
      )}
    </div>
  );
}
