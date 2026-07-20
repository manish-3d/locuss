import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/constants/navigation";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Locus
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-blue-600"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
