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
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {session?.user.name} 👋
        </h1>

        <p className="mt-2 text-gray-500">{today}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search properties..."
            className="w-72 rounded-xl border bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
          />
        </div>

        <Link
          href="/dashboard/properties/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </Link>
      </div>
    </div>
  );
}
