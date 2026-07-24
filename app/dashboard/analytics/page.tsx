import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BarChart3, Eye, Building2, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  // Fetch properties owned by the user
  const properties = await prisma.property.findMany({
    where: {
      ownerId: session.user.id,
    },
  });

  const totalProperties = properties.length;
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const averagePrice = totalProperties
    ? Number(properties.reduce((acc, p) => acc + p.price, 0n) / BigInt(totalProperties))
    : 0;

  const forSale = properties.filter((p) => p.listingType === "SALE").length;
  const forRent = properties.filter((p) => p.listingType === "RENT").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="mt-2 text-gray-500">
          Insights and performance metrics for your listings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Listings</p>
              <h3 className="mt-2 text-3xl font-bold">{totalProperties}</h3>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Active and draft listings</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="mt-2 text-3xl font-bold">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Total accumulated property views</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Listing Price</p>
              <h3 className="mt-2 text-3xl font-bold">
                ₹{averagePrice.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Based on active properties</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Distribution Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Listing Type Distribution</h3>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>For Sale</span>
                <span className="font-semibold">{forSale}</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${totalProperties ? (forSale / totalProperties) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>For Rent</span>
                <span className="font-semibold">{forRent}</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${totalProperties ? (forRent / totalProperties) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Properties Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Top Performing Listings</h3>
          <div className="mt-6 divide-y divide-gray-100">
            {properties.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No listings to analyze.</p>
            ) : (
              properties
                .sort((a, b) => b.views - a.views)
                .slice(0, 3)
                .map((property) => (
                  <div key={property.id} className="flex justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-800 line-clamp-1">{property.title}</p>
                      <p className="text-xs text-gray-500">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">{property.views}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
