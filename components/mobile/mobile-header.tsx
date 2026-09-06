"use client";

import React from "react";
import Link from "next/link";
import { Home, Bell } from "lucide-react";

interface MobileHeaderProps {
  showNotification?: boolean;
  hasUnreadNotifications?: boolean;
  className?: string;
}

export function MobileHeader({
  showNotification = true,
  hasUnreadNotifications = true,
  className = "",
}: MobileHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-[#faf7f2] border-b border-[#e5ddd0]/60 md:hidden pt-[max(0.75rem,env(safe-area-inset-top))] ${className}`}
    >
      {/* Locus Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#e5ddd0] shadow-2xs">
          <Home className="h-4 w-4 text-[#1e1b17] group-hover:text-[#b8924a] transition-colors" />
        </div>
        <span className="font-serif text-xl font-bold tracking-tight text-[#1e1b17]">
          Locus
        </span>
      </Link>

      {/* Notifications Button */}
      {showNotification && (
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] shadow-2xs hover:bg-[#f2ece0] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-[#524b42]" />
          {hasUnreadNotifications && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8924a] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8924a]" />
            </span>
          )}
        </Link>
      )}
    </header>
  );
}
