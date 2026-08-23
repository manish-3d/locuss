"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, Map } from "lucide-react";
import { useTransition } from "react";

export default function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentView = searchParams.get("view") || "list";

  const toggleView = (view: "list" | "map") => {
    if (currentView === view) return;

    const params = new URLSearchParams(searchParams.toString());
    if (view === "list") {
      params.delete("view");
    } else {
      params.set("view", "map");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center rounded-lg border bg-white p-1 shadow-sm">
      <button
        onClick={() => toggleView("list")}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          currentView === "list"
            ? "bg-gray-100 text-black shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        } disabled:opacity-50`}
      >
        <LayoutGrid className="h-4 w-4" />
        List
      </button>
      <button
        onClick={() => toggleView("map")}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          currentView === "map"
            ? "bg-gray-100 text-black shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        } disabled:opacity-50`}
      >
        <Map className="h-4 w-4" />
        Map
      </button>
    </div>
  );
}
