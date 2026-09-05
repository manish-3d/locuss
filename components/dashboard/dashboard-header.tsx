import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Plus, Search } from "lucide-react";

export default async function DashboardHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5ddd0] pb-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1e1b17]">
          Welcome back, {session?.user.name}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">{today}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:bg-black hover:shadow-md"
        >
          <Plus size={15} />
          Add Property
        </Link>
      </div>
    </div>
  );
}
