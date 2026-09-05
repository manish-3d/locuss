"use client";

import { useState } from "react";
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
  Menu,
  X,
  Home,
} from "lucide-react";
import clsx from "clsx";
import { authClient } from "@/lib/auth-client";
import { NotificationsBell } from "@/components/notifications-bell";

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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const NavContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="border-b border-[#e5ddd0] p-5 sm:p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e4de] bg-[#faf7f2] transition-colors group-hover:border-[#b8924a]">
            <Home className="h-4 w-4 text-[#1e1b17]" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1e1b17]">Locus</h2>
            <p className="text-[11px] text-[#7a7268]">
              {isAdmin ? "Admin Console" : "Seller Dashboard"}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-[#7a7268] hover:text-[#1e1b17] rounded-lg"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all",
                isActive
                  ? "bg-[#1e1b17] text-white shadow-xs font-semibold"
                  : "text-[#7a7268] hover:bg-[#faf7f2] hover:text-[#1e1b17]",
              )}
            >
              <Icon className={clsx("h-4 w-4 shrink-0", isActive ? "text-[#b8924a]" : "text-[#7a7268]")} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Preview */}
      <div className="border-t border-[#e5ddd0] p-4 bg-[#faf7f2]/50">
        <Link href="/" className="text-xs text-[#7a7268] hover:text-[#1e1b17] flex items-center gap-1">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-[#e5ddd0] bg-[#faf7f2]/95 backdrop-blur-md px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5ddd0] bg-white text-[#1e1b17]"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </button>
        <span className="font-serif text-base font-semibold text-[#1e1b17]">Dashboard</span>
        <NotificationsBell />
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-[80vw] flex-1 flex-col shadow-2xl z-10">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-[#e5ddd0] sticky top-0">
        <NavContent />
      </aside>
    </>
  );
}
