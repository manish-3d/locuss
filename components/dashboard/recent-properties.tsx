import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

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
    <div className="rounded-2xl border border-[#e5ddd0] bg-white p-5 sm:p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between border-b border-[#f2ece0] pb-3">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1e1b17]">
          Recent Properties
        </h2>

        <Link
          href="/dashboard/properties"
          className="text-xs sm:text-sm font-medium text-[#7a7268] hover:text-[#1e1b17] transition-colors"
        >
          View all →
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e5ddd0] p-8 text-center bg-[#faf7f2]/50">
          <p className="text-xs sm:text-sm text-[#7a7268]">No properties listed yet.</p>

          <Link
            href="/dashboard/properties/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-5 py-2 text-xs sm:text-sm font-medium text-white transition hover:bg-black"
          >
            <Plus size={14} />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/properties/${property.id}`}
              className="flex items-center justify-between rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/30 p-3.5 transition-all hover:bg-white hover:border-[#b8924a]/60 hover:shadow-xs"
            >
              <div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#1e1b17] line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  {property.city}, {property.state} • For {property.listingType === "RENT" ? "Rent" : "Sale"}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                </p>
                <span className="inline-block mt-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  {property.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
