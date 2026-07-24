"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Heart,
  BarChart3,
  Bot,
  MessageCircle,
  Settings,
  User,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import { authClient } from "@/lib/auth-client";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Properties",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    href: "/dashboard/ai",
    icon: Bot,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const visibleLinks = isAdmin
    ? [
        ...links,
        {
          name: "Admin Panel",
          href: "/dashboard/admin",
          icon: Shield,
        },
      ]
    : links;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">Locus</h2>
        <p className="text-sm text-gray-500">
          {isAdmin ? "Admin Console" : "Seller Dashboard"}
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {visibleLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

