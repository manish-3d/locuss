import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5ddd0] bg-[#faf7f2] text-[#7a7268] text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e4de] bg-white transition-colors group-hover:border-[#b8924a]">
                <Home className="h-4 w-4 text-[#1e1b17]" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-[#1e1b17] font-sans">
                Locus
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#7a7268]">
              Delivering curated spatial intelligence and bespoke property discovery. Powered by autonomous broker reasoning and editorial presentation.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd0] bg-white px-3 py-1 text-[11px] text-[#1e1b17]">
              <span className="text-[#b8924a]">✦</span> Intelligent Real Estate Network
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e1b17]">
              Discovery
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/properties" className="hover:text-[#1e1b17] transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/buy" className="hover:text-[#1e1b17] transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-[#1e1b17] transition-colors">
                  Rental Residences
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#1e1b17] transition-colors">
                  Sell With Locus
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e1b17]">
              AI Workspace
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/ai" className="hover:text-[#1e1b17] transition-colors">
                  Locus AI Broker
                </Link>
              </li>
              <li>
                <Link href="/properties?view=map" className="hover:text-[#1e1b17] transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard/favorites" className="hover:text-[#1e1b17] transition-colors">
                  Saved Shortlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e1b17]">
              Portal
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-[#1e1b17] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/properties/new" className="hover:text-[#1e1b17] transition-colors">
                  List Property
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#1e1b17] transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#1e1b17] transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer divider */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e5ddd0] pt-6 text-[11px] text-[#7a7268]">
          <p>© {new Date().getFullYear()} Locus Real Estate Technologies. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Crafted with editorial precision for discerning buyers, owners, and advisors.
          </p>
        </div>
      </div>
    </footer>
  );
}
