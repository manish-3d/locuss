"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import LuxuryDropdown from "@/components/ui/luxury-dropdown";

const budgetRanges = [
  { label: "Any Budget", value: "" },
  { label: "Under ₹25L", value: "0-2500000" },
  { label: "₹25L – ₹50L", value: "2500000-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr – ₹5Cr", value: "30000000-50000000" },
  { label: "₹5Cr+", value: "50000000-" },
];

const intentOptions = [
  { label: "Any Intent", value: "" },
  { label: "Buy", value: "SALE" },
  { label: "Rent", value: "RENT" },
];

const propertyTypeOptions = [
  { label: "Property Type", value: "" },
  { label: "Apartment", value: "APARTMENT" },
  { label: "House", value: "HOUSE" },
  { label: "Villa", value: "VILLA" },
  { label: "Plot", value: "PLOT" },
  { label: "Office", value: "OFFICE" },
  { label: "Shop", value: "SHOP" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [budget, setBudget] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<"intent" | "type" | "budget" | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveDropdown(null);
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

  return (
    <div className="relative w-full rounded-[0.85rem] border border-[#e5ddd0] bg-white p-1 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:rounded-[1rem] sm:p-1.5">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-2 gap-1.5 md:flex md:items-center md:gap-0"
      >
        {/* Location Input */}
        <div className="relative col-span-2 min-w-0 md:flex-[2]">
          <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9a8f7e]" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setActiveDropdown(null)}
            placeholder="Search city, locality, or area"
            className="h-10 w-full rounded-[0.7rem] bg-[#faf7f2]/60 py-2 pl-9 pr-3 text-xs font-medium text-[#1e1b17] outline-none transition-colors placeholder:text-[#9a8f7e] focus:bg-[#f8f4ee] md:rounded-none md:rounded-l-[0.75rem] md:bg-transparent md:border-r md:border-[#e5ddd0]"
          />
        </div>

        {/* Intent Dropdown */}
        <div className="relative min-w-0 col-span-1 md:flex-1 md:border-r md:border-[#e5ddd0]">
          <LuxuryDropdown
            id="search-intent-dropdown"
            label="Any Intent"
            value={listingType}
            options={intentOptions}
            onChange={setListingType}
            isOpen={activeDropdown === "intent"}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === "intent" ? null : "intent"))
            }
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="relative min-w-0 col-span-1 md:flex-1 md:border-r md:border-[#e5ddd0]">
          <LuxuryDropdown
            id="search-type-dropdown"
            label="Property Type"
            value={propertyType}
            options={propertyTypeOptions}
            onChange={setPropertyType}
            isOpen={activeDropdown === "type"}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === "type" ? null : "type"))
            }
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {/* Budget Dropdown */}
        <div className="relative min-w-0 col-span-2 sm:col-span-1 md:col-span-1 md:flex-1 md:border-r md:border-[#e5ddd0]">
          <LuxuryDropdown
            id="search-budget-dropdown"
            label="Any Budget"
            value={budget}
            options={budgetRanges}
            onChange={setBudget}
            isOpen={activeDropdown === "budget"}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === "budget" ? null : "budget"))
            }
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          onClick={() => setActiveDropdown(null)}
          className="col-span-2 sm:col-span-1 md:col-span-1 flex h-10 items-center justify-center gap-1.5 rounded-[0.7rem] bg-[#1e1b17] px-6 text-[0.68rem] uppercase tracking-wider font-semibold text-white transition-all duration-300 hover:bg-black hover:shadow-lg md:ml-1 md:flex-1 md:rounded-[0.75rem]"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
