"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const budgetRanges = [
  { label: "Any Budget", value: "" },
  { label: "Under ₹25L", value: "0-2500000" },
  { label: "₹25L – ₹50L", value: "2500000-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr – ₹5Cr", value: "30000000-50000000" },
  { label: "₹5Cr+", value: "50000000-" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (city.trim()) {
      params.set("city", city.trim());
    }

    if (listingType) {
      params.set("listingType", listingType);
    }

    if (propertyType) {
      params.set("propertyType", propertyType);
    }

    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }

    router.push(`/properties?${params.toString()}`);
  };

  const selectClasses =
    "h-full w-full appearance-none bg-transparent py-2 pl-3 pr-6 text-xs font-medium text-locus-charcoal outline-none cursor-pointer transition-colors placeholder:text-locus-warm-gray focus:text-black";

  return (
    <div className="w-full rounded-[1rem] border border-[#e5ddd0] bg-white p-1.5 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0"
      >
        {/* Location */}
        <div className="relative flex-[2] min-w-0">
          <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-locus-warm-gray" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city, locality, or area"
            className="h-10 w-full rounded-[0.75rem] bg-transparent py-2 pl-9 pr-3 text-xs font-medium text-[#1e1b17] outline-none transition-colors placeholder:text-[#9a8f7e] focus:bg-[#f8f4ee] md:rounded-none md:rounded-l-[0.75rem] md:border-r md:border-[#e5ddd0]"
          />
        </div>

        {/* Intent */}
        <div className="relative flex-1 min-w-0 md:border-r md:border-[#e5ddd0]">
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className={selectClasses}
          >
            <option value="">Any Intent</option>
            <option value="SALE">Buy</option>
            <option value="RENT">Rent</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-locus-warm-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Property Type */}
        <div className="relative flex-1 min-w-0 md:border-r md:border-[#e5ddd0]">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={selectClasses}
          >
            <option value="">Property Type</option>
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="VILLA">Villa</option>
            <option value="PLOT">Plot</option>
            <option value="OFFICE">Office</option>
            <option value="SHOP">Shop</option>
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-locus-warm-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Budget */}
        <div className="relative flex-1 min-w-0 md:border-r md:border-[#e5ddd0]">
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={selectClasses}
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-locus-warm-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex h-10 items-center justify-center gap-1.5 rounded-[0.75rem] bg-[#1e1b17] px-6 text-[0.7rem] uppercase tracking-wider font-semibold text-white transition-all duration-300 hover:bg-black hover:shadow-lg md:ml-1"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

