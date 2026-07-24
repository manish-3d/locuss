import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RecentProperties() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const properties = await prisma.property.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Recent Properties</h2>

        <Link
          href="/dashboard/properties"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-gray-500">No properties found.</p>

          <Link
            href="/dashboard/properties/new"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold">{property.title}</h3>

                <p className="text-sm text-gray-500">
                  {property.city}, {property.state}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                </p>

                <span className="text-sm text-green-600">
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
