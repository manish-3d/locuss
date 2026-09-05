import Link from "next/link";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/property/property-card";

export default async function MyPropertiesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center text-[#7a7268]">Unauthorized</div>;
  }

  const properties = await prisma.property.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5ddd0] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1e1b17]">
            My Properties
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
            Manage all your active and draft listings.
          </p>
        </div>

        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-black shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-12 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a] mx-auto mb-3">
            ✦
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#1e1b17]">No properties yet</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#7a7268] max-w-sm mx-auto">
            Create your first property listing to reach verified buyers across the platform.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-6 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-black shadow-xs"
          >
            <Plus size={15} />
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
