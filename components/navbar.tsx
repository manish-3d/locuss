import Link from "next/link";
import { Home } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import NavLinks from "./nav-links";
import UserNav from "./user-nav";
import MobileNav from "./mobile-nav";
import NavbarVisibility from "./navbar-visibility";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <NavbarVisibility>
      <header className="sticky top-0 z-50 border-b border-[#e5ddd0] bg-[#faf7f2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6">
          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e4de] bg-white transition-colors group-hover:border-[#b8924a] sm:h-9 sm:w-9">
              <Home className="h-4 w-4 text-[#1e1b17] sm:h-4.5 sm:w-4.5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#1e1b17] font-sans sm:text-xl">
              Locus
            </span>
          </Link>

          {/* Center — Nav Links (desktop) */}
          <NavLinks />

          {/* Right — Auth Actions (desktop) */}
          <UserNav />

          {/* Mobile Navigation Drawer */}
          <MobileNav
            isAuthenticated={!!session}
            userName={session?.user?.name ?? null}
          />
        </div>
      </header>
    </NavbarVisibility>
  );
}
