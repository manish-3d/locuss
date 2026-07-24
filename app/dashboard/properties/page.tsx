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
    return <div className="p-8 text-center">Unauthorized</div>;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Properties</h1>
          <p className="mt-2 text-gray-500">
            Manage all your property listings.
          </p>
        </div>

        <Link
          href="/dashboard/properties/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <h2 className="text-2xl font-semibold">No properties yet</h2>
          <p className="mt-3 text-gray-500">
            Create your first property listing to get started.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
