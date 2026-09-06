"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "@/constants/navigation";
import LogoutButton from "@/components/logout-button";

type Props = {
  isAuthenticated: boolean;
  userName: string | null;
};

export default function MobileNav({ isAuthenticated, userName }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="locus-touch flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] transition-colors hover:border-[#b8924a]"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[4.25rem] z-50 max-h-[calc(100svh-5.25rem)] overflow-y-auto rounded-2xl border border-[#e5ddd0] bg-[#faf7f2]/98 px-4 py-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => {
              const isActive =
                link.href === "/properties"
                  ? pathname === "/properties"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`locus-touch flex items-center rounded-xl px-3 text-sm font-medium transition-colors ${
                    isActive
                    ? "bg-white text-[#1e1b17] font-semibold border-l-2 border-[#b8924a]"
                      : "text-[#7a7268] hover:text-[#1e1b17]"
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-[#e5ddd0] pt-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  {userName && (
                    <span className="text-sm font-medium text-[#7a7268]">
                      Signed in as <span className="text-[#1e1b17] font-semibold">{userName}</span>
                    </span>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-[#e5ddd0] bg-white px-5 py-2.5 text-center text-sm font-medium text-[#1e1b17] transition-colors hover:border-[#b8924a]"
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
                    className="text-center text-sm font-medium text-[#7a7268] transition-colors hover:text-[#1e1b17] py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-[#1e1b17] px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-black"
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
