import Link from "next/link";
import { Home } from "lucide-react";
import NavLinks from "./nav-links";
import UserNav from "./user-nav";
import NavbarVisibility from "./navbar-visibility";

export default function Navbar() {
  return (
    <NavbarVisibility>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Home className="h-6 w-6" />
            <span>Locus</span>
          </Link>

          <NavLinks />

          <UserNav />
        </div>
      </header>
    </NavbarVisibility>
  );
}


