"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "@/constants/navigation";
import LogoutButton from "@/components/logout-button";

type Props = {
  isAuthenticated: boolean;
  userName: string | null;
};

export default function HomepageMobileMenu({ isAuthenticated, userName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="locus-touch flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8e4de] text-locus-charcoal transition-colors hover:border-locus-gold"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[4.25rem] z-50 max-h-[calc(100svh-5.25rem)] overflow-y-auto rounded-2xl border border-[#e8e4de] bg-locus-cream px-4 py-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="locus-touch flex items-center rounded-xl px-3 text-sm font-medium text-locus-charcoal transition-colors hover:bg-white hover:text-locus-gold"
              >
                {link.title}
              </Link>
            ))}

            <div className="mt-4 border-t border-[#e8e4de] pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  {userName && (
                    <span className="text-sm font-medium text-locus-warm-gray">
                      Signed in as {userName}
                    </span>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-[#e8e4de] px-5 py-2.5 text-center text-sm font-medium text-locus-charcoal transition-colors hover:border-locus-gold"
                  >
                    Dashboard
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="text-center text-sm font-medium text-locus-warm-gray transition-colors hover:text-locus-charcoal"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-locus-charcoal px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-black"
                  >
                    Get Started →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
