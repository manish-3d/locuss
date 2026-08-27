import Link from "next/link";
import { Home } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { navigationLinks } from "@/constants/navigation";
import HomepageMobileMenu from "./homepage-mobile-menu";
import LogoutButton from "@/components/logout-button";

export default async function HomepageNavbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-[#e5ddd0]">
      {/* Left — Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e8e4de] bg-white transition-colors group-hover:border-locus-gold">
          <Home className="h-4.5 w-4.5 text-locus-charcoal" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-locus-charcoal font-sans">
          Locus
        </span>
      </Link>

      {/* Center — Nav Links (desktop) */}
      <div className="hidden items-center gap-10 md:flex">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[0.9rem] font-medium text-locus-warm-gray transition-colors duration-200 hover:text-locus-charcoal"
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* Right — Auth (desktop) */}
      <div className="hidden items-center gap-3 md:flex">
        {session ? (
          <>
            <span className="text-sm font-medium text-locus-charcoal">
              {session.user.name}
            </span>
            <Link
              href="/dashboard"
              className="rounded-full border border-[#e8e4de] px-5 py-2 text-sm font-medium text-locus-charcoal transition-all duration-200 hover:border-locus-gold hover:bg-locus-gold/5"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-locus-warm-gray transition-colors duration-200 hover:text-locus-charcoal"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-locus-charcoal px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-lg"
            >
              Get Started
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <HomepageMobileMenu isAuthenticated={!!session} userName={session?.user?.name ?? null} />
    </nav>
  );
}
