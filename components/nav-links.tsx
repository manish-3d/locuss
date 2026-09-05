"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/constants/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {navigationLinks.map((link) => {
        const isActive =
          link.href === "/properties"
            ? pathname === "/properties"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-1 text-[0.9rem] font-medium transition-colors duration-200 ${
              isActive
                ? "text-[#1e1b17] font-semibold"
                : "text-[#7a7268] hover:text-[#1e1b17]"
            }`}
          >
            {link.title}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#b8924a]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
