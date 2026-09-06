"use client";

import { usePathname } from "next/navigation";

export default function NavbarVisibility({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Homepage has its own premium in-container navbar
  if (pathname === "/") return null;

  // Screens with their own bespoke mobile headers hide the desktop navbar on mobile screens
  const hasDedicatedMobileHeader =
    pathname.startsWith("/properties") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/spatial") ||
    pathname.startsWith("/dashboard");

  if (hasDedicatedMobileHeader) {
    return <div className="hidden md:block">{children}</div>;
  }

  return <>{children}</>;
}
