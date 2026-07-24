import Link from "next/link";

const links = [
  {
    href: "/properties",
    label: "Properties",
  },
  {
    href: "/buy",
    label: "Buy",
  },
  {
    href: "/rent",
    label: "Rent",
  },
  {
    href: "/sell",
    label: "Sell",
  },
  {
    href: "/ai",
    label: "AI Broker",
  },
];

export default function NavLinks() {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium transition hover:text-blue-600"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
