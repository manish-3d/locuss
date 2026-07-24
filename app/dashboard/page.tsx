import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatCard from "@/components/dashboard/stat-card";
import RecentProperties from "@/components/dashboard/recent-properties";

import { Building2, Eye, Heart, MessageCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Properties"
          value={12}
          icon={Building2}
          description="Active Listings"
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Views"
          value="1,284"
          icon={Eye}
          description="This Month"
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Favorites"
          value={48}
          icon={Heart}
          description="Saved by Buyers"
          color="bg-pink-100 text-pink-600"
        />

        <StatCard
          title="Inquiries"
          value={16}
          icon={MessageCircle}
          description="Pending Replies"
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <RecentProperties />
    </div>
  );
}
