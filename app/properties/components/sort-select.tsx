"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Most Viewed", value: "views" },
  { label: "Largest Area", value: "area" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="sort" className="text-xs font-medium text-[#7a7268]">
        Sort:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        disabled={isPending}
        className="rounded-md border border-[#e5ddd0] bg-white px-2 py-1 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a] disabled:opacity-50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
