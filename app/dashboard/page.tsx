import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatCard from "@/components/dashboard/stat-card";
import RecentProperties from "@/components/dashboard/recent-properties";

import { Building2, Eye, Heart, MessageCircle } from "lucide-react";
import MobileProfileView from "@/components/dashboard/mobile-profile-view";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Fetch real counts from DB
  const userProperties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    select: { id: true, views: true },
  });

  const propertyCount = userProperties.length;
  const totalViews = userProperties.reduce((acc, p) => acc + p.views, 0);

  const propertyIds = userProperties.map((p) => p.id);

  const favoritesCount = await prisma.favorite.count({
    where: {
      propertyId: { in: propertyIds },
    },
  });

  const inquiriesCount = await prisma.inquiry.count({
    where: {
      propertyId: { in: propertyIds },
    },
  });

  return (
    <>
      {/* ── MOBILE VIEW (Board 1 Screen 8: My Profile) ── */}
      <MobileProfileView
        user={{
          id: session.user.id,
          name: session.user.name || "Member",
          email: session.user.email,
          image: session.user.image,
          role: (session.user as any)?.role,
        }}
      />

      {/* ── DESKTOP DASHBOARD (100% Intact & Untouched) ── */}
      <div className="hidden md:block space-y-5 sm:space-y-8">
        <DashboardHeader />

        <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
          <StatCard
            title="Properties"
            value={propertyCount}
            icon={Building2}
            description="Active Listings"
            color="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Views"
            value={totalViews.toLocaleString()}
            icon={Eye}
            description="Total Views"
            color="bg-green-100 text-green-600"
          />

          <StatCard
            title="Favorites"
            value={favoritesCount}
            icon={Heart}
            description="Saved by Buyers"
            color="bg-pink-100 text-pink-600"
          />

          <StatCard
            title="Inquiries"
            value={inquiriesCount}
            icon={MessageCircle}
            description="Received Messages"
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        <RecentProperties />
      </div>
    </>
  );
}
