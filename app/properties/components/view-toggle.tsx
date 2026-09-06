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
    <div className="flex flex-1 items-center rounded-md border border-[#e5ddd0] bg-[#faf7f2] p-0.5 sm:flex-none">
      <button
        onClick={() => toggleView("list")}
        disabled={isPending}
        className={`locus-touch flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition sm:flex-none ${
          currentView === "list"
            ? "bg-white text-[#1e1b17] shadow-xs font-semibold"
            : "text-[#7a7268] hover:text-[#1e1b17]"
        } disabled:opacity-50`}
      >
        <LayoutGrid className="h-3 w-3" />
        List
      </button>
      <button
        onClick={() => toggleView("map")}
        disabled={isPending}
        className={`locus-touch flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium transition sm:flex-none ${
          currentView === "map"
            ? "bg-white text-[#1e1b17] shadow-xs font-semibold"
            : "text-[#7a7268] hover:text-[#1e1b17]"
        } disabled:opacity-50`}
      >
        <Map className="h-3 w-3" />
        Map
      </button>
    </div>
  );
}
