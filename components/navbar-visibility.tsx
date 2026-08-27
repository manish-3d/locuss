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

  return <>{children}</>;
}
