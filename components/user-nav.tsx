import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import LogoutButton from "./logout-button";

export default async function UserNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-[#7a7268] transition-colors duration-200 hover:text-[#1e1b17] px-2 py-1"
        >
          Log in
        </Link>

        <Link
          href="/sign-up"
          className="group inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-md"
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
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      <span className="text-sm font-medium text-[#1e1b17]">
        {session.user.name}
      </span>

      <Link
        href="/dashboard"
        className="rounded-full border border-[#e5ddd0] bg-white px-4 py-1.5 text-sm font-medium text-[#1e1b17] transition-all duration-200 hover:border-[#b8924a] hover:bg-[#b8924a]/5"
      >
        Dashboard
      </Link>

      <LogoutButton />
    </div>
  );
}
