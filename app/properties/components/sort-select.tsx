"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import LuxuryDropdown from "@/components/ui/luxury-dropdown";

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
  const [, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (newSort: string) => {
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
    <div className="flex flex-1 items-center gap-1.5 sm:flex-none">
      <span className="text-xs font-medium text-[#7a7268]">
        Sort:
      </span>
      <div className="min-w-[160px]">
        <LuxuryDropdown
          id="sort-dropdown"
          label="Sort By"
          value={currentSort}
          options={sortOptions}
          onChange={handleSortChange}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}
