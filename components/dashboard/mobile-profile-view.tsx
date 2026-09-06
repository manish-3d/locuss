"use client";

import Link from "next/link";
import {
  User,
  Settings,
  MessageCircle,
  Calendar,
  Heart,
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import LogoutButton from "@/components/logout-button";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
};

export default function MobileProfileView({ user }: Props) {
  const menuItems = [
    {
      label: "My Inquiries",
      href: "/dashboard/messages",
      icon: MessageCircle,
    },
    {
      label: "Scheduled Visits",
      href: "/dashboard/messages",
      icon: Calendar,
    },
    {
      label: "Saved Properties",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      label: "My Searches",
      href: "/properties",
      icon: Search,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      label: "Help & Support",
      href: "mailto:support@locus.realestate",
      icon: HelpCircle,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="block md:hidden pb-10">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17]">
          My Profile
        </h1>
        <Link
          href="/dashboard/settings"
          className="locus-touch flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ddd0] bg-white text-[#7a7268] hover:text-[#1e1b17]"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>

      {/* ── User Avatar & Info Card ── */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-[#e5ddd0]">
        <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e5ddd0] bg-[#f2ece0] text-[#7a7268] overflow-hidden shadow-xs">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User size={38} className="text-[#a39a8c]" />
          )}
        </div>
        <h2 className="font-serif text-xl font-bold text-[#1e1b17]">{user.name}</h2>
        <p className="text-xs text-[#7a7268] mt-0.5">{user.email}</p>

        <Link
          href="/dashboard/profile"
          className="locus-touch mt-3 inline-flex items-center rounded-full border border-[#e5ddd0] bg-white px-5 py-1.5 text-xs font-semibold text-[#1e1b17] shadow-2xs transition-colors hover:border-[#b8924a] hover:bg-[#faf7f2]"
        >
          Edit Profile
        </Link>
      </div>

      {/* ── Menu List Rows ── */}
      <div className="divide-y divide-[#e5ddd0]/70 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="locus-touch flex items-center justify-between py-3.5 px-1 transition-colors hover:bg-black/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f2ece0]/70 text-[#7a7268]">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-[#1e1b17]">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-[#a39a8c]" />
            </Link>
          );
        })}
      </div>

      {/* ── Upgrade to Locus Premium Card ── */}
      <div className="mt-4 rounded-2xl border border-[#b8924a]/40 bg-gradient-to-br from-[#1e1b17] to-[#2e2924] p-4 text-white shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b8924a]/20 text-[#b8924a] border border-[#b8924a]/30">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-sm font-bold text-white tracking-wide">
              Upgrade to Locus Premium
            </h3>
            <p className="mt-1 text-xs text-[#d5cdc3] leading-relaxed">
              Get early access to off-market listings, deep AI spatial insights, and priority broker support.
            </p>
            <button
              type="button"
              className="locus-touch mt-3 rounded-full bg-[#b8924a] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#9a7738]"
            >
              Explore Benefits →
            </button>
          </div>
        </div>
      </div>

      {/* ── Sign Out ── */}
      <div className="mt-6 pt-4 border-t border-[#e5ddd0] flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
}
