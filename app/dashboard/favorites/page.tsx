import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/property/property-card";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center text-[#7a7268]">Unauthorized</div>;
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
      <div className="border-b border-[#e5ddd0] pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1e1b17]">
          My Saved Properties
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Curated listings you have bookmarked for comparison and review.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-12 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a] mx-auto mb-3">
            <Heart size={20} className="text-[#b8924a]" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#1e1b17]">No saved properties yet</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#7a7268] max-w-sm mx-auto">
            Explore listings across the platform and click the heart icon to save your favorite homes.
          </p>
          <Link
            href="/properties"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-6 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-black shadow-xs"
          >
            Explore Properties →
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((fav) => (
            <PropertyCard key={fav.propertyId} property={fav.property} />
          ))}
        </div>
      )}
    </div>
  );
}
