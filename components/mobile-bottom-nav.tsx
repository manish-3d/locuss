"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, User, Sparkles } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide bottom nav inside full 3D Tour fullscreen mode or specific immersive views if needed
  const isHome = pathname === "/";
  const isMap = pathname === "/map" || (pathname === "/properties" && typeof window !== "undefined" && window.location.search.includes("view=map"));
  const isAi = pathname === "/ai";
  const isSaved = pathname === "/dashboard/favorites" || pathname === "/saved";
  const isProfile = pathname.startsWith("/dashboard") && !isSaved;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5ddd0]/90 bg-[#faf7f2]/95 px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(30,27,23,0.06)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-medium transition-colors ${
            isHome
              ? "text-[#1e1b17] font-semibold"
              : "text-[#7a7268] hover:text-[#1e1b17]"
          }`}
          aria-current={isHome ? "page" : undefined}
        >
          <Home className={`h-5 w-5 ${isHome ? "text-[#b8924a] stroke-[2.25]" : "stroke-[1.75]"}`} />
          <span>Home</span>
        </Link>

        {/* 2. Map */}
        <Link
          href="/properties?view=map"
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-medium transition-colors ${
            isMap
              ? "text-[#1e1b17] font-semibold"
              : "text-[#7a7268] hover:text-[#1e1b17]"
          }`}
          aria-current={isMap ? "page" : undefined}
        >
          <Map className={`h-5 w-5 ${isMap ? "text-[#b8924a] stroke-[2.25]" : "stroke-[1.75]"}`} />
          <span>Map</span>
        </Link>

        {/* 3. AI Broker (Elevated Center Button) */}
        <Link
          href="/ai"
          className="group relative -translate-y-2.5 flex flex-col items-center justify-center focus:outline-hidden"
          aria-label="AI Real Estate Broker"
          aria-current={isAi ? "page" : undefined}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200 group-active:scale-95 ${
              isAi
                ? "bg-[#b8924a] text-white shadow-[#b8924a]/30"
                : "bg-[#1e1b17] text-white hover:bg-[#2b241e] shadow-[#1e1b17]/25"
            }`}
          >
            <span className="font-serif text-sm font-bold tracking-tight">AI</span>
          </div>
          <span
            className={`text-[10px] font-medium transition-colors mt-0.5 ${
              isAi ? "text-[#b8924a] font-semibold" : "text-[#7a7268]"
            }`}
          >
            AI Broker
          </span>
        </Link>

        {/* 4. Saved */}
        <Link
          href="/dashboard/favorites"
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-medium transition-colors ${
            isSaved
              ? "text-[#1e1b17] font-semibold"
              : "text-[#7a7268] hover:text-[#1e1b17]"
          }`}
          aria-current={isSaved ? "page" : undefined}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "text-[#b8924a] fill-[#b8924a] stroke-[2]" : "stroke-[1.75]"}`} />
          <span>Saved</span>
        </Link>

        {/* 5. Profile */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-medium transition-colors ${
            isProfile
              ? "text-[#1e1b17] font-semibold"
              : "text-[#7a7268] hover:text-[#1e1b17]"
          }`}
          aria-current={isProfile ? "page" : undefined}
        >
          <User className={`h-5 w-5 ${isProfile ? "text-[#b8924a] stroke-[2.25]" : "stroke-[1.75]"}`} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
