"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const navigateToPage = (page: number) => {
    router.push(createPageUrl(page));
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#7a7268] transition hover:border-[#b8924a] hover:text-[#1e1b17] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => navigateToPage(page)}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition ${
              currentPage === page
                ? "bg-[#1e1b17] text-white shadow-xs"
                : "border border-[#e5ddd0] bg-white text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#f2ece0]/50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#7a7268] transition hover:border-[#b8924a] hover:text-[#1e1b17] disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
