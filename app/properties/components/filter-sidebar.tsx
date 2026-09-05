"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    furnished: searchParams.get("furnished") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
  });

  useEffect(() => {
    setFilters({
      q: searchParams.get("q") || "",
      city: searchParams.get("city") || "",
      listingType: searchParams.get("listingType") || "",
      propertyType: searchParams.get("propertyType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      furnished: searchParams.get("furnished") || "",
      minArea: searchParams.get("minArea") || "",
      maxArea: searchParams.get("maxArea") || "",
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({ ...prev, [name]: checked ? "true" : "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setMobileExpanded(false);
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      city: "",
      listingType: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      furnished: "",
      minArea: "",
      maxArea: "",
    });

    const params = new URLSearchParams();
    if (searchParams.has("sort")) {
      params.set("sort", searchParams.get("sort")!);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setMobileExpanded(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-[#e5ddd0] bg-white p-3.5 sm:p-4 shadow-xs lg:sticky lg:top-20">
      {/* Mobile Toggle Bar */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-1.5 font-serif text-sm font-semibold text-[#1e1b17]"
        >
          <SlidersHorizontal size={14} className="text-[#b8924a]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1e1b17] text-[9px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
          {mobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] text-[#7a7268] hover:text-[#1e1b17]"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-3 border-b border-[#f2ece0] pb-2">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-[#b8924a]" />
          <h2 className="font-serif text-sm font-semibold text-[#1e1b17]">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1e1b17] text-[9px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[11px] text-[#7a7268] hover:text-[#1e1b17] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Body (Always visible on desktop, toggleable on mobile) */}
      <div className={`space-y-2.5 pt-2 lg:pt-0 ${mobileExpanded ? "block" : "hidden lg:block"}`}>
        {/* Search Query */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
            Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#7a7268]" />
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleChange}
              placeholder="Title, locality..."
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 py-1.5 pl-7 pr-2 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
            City
          </label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="e.g. Noida, Gurgaon"
            className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2.5 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
        </div>

        {/* Listing Type & Property Type */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Purpose
            </label>
            <select
              name="listingType"
              value={filters.listingType}
              onChange={handleChange}
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            >
              <option value="">Any</option>
              <option value="SALE">Buy</option>
              <option value="RENT">Rent</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
              Type
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-1.5 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            >
              <option value="">Any</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="PLOT">Plot</option>
              <option value="OFFICE">Office</option>
              <option value="SHOP">Shop</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
            Price Range (₹)
          </label>
          <div className="flex gap-1.5">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
            Bedrooms (Min)
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2.5 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
          >
            <option value="">Any BHK</option>
            <option value="1">1+ BHK</option>
            <option value="2">2+ BHK</option>
            <option value="3">3+ BHK</option>
            <option value="4">4+ BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        </div>

        {/* Furnished Checkbox */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <input
            type="checkbox"
            id="furnished"
            name="furnished"
            checked={filters.furnished === "true"}
            onChange={handleChange}
            className="h-3.5 w-3.5 rounded border-[#e5ddd0] text-[#b8924a] accent-[#b8924a] focus:ring-[#b8924a]"
          />
          <label htmlFor="furnished" className="text-xs text-[#1e1b17] select-none cursor-pointer">
            Furnished only
          </label>
        </div>

        {/* Area Range */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
            Area (sqft)
          </label>
          <div className="flex gap-1.5">
            <input
              type="number"
              name="minArea"
              value={filters.minArea}
              onChange={handleChange}
              placeholder="Min"
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            />
            <input
              type="number"
              name="maxArea"
              value={filters.maxArea}
              onChange={handleChange}
              placeholder="Max"
              className="w-full rounded-md border border-[#e5ddd0] bg-[#faf7f2]/50 px-2 py-1.5 text-xs text-[#1e1b17] outline-none transition focus:border-[#b8924a]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 pt-1.5">
          <button
            type="button"
            onClick={applyFilters}
            disabled={isPending}
            className="w-full rounded-lg bg-[#1e1b17] py-2 text-xs font-semibold text-white transition hover:bg-[#b8924a] disabled:opacity-50 shadow-xs"
          >
            {isPending ? "Filtering..." : "Apply Filters"}
          </button>

          <button
            type="button"
            onClick={clearFilters}
            disabled={isPending}
            className="w-full rounded-lg border border-[#e5ddd0] bg-white py-1.5 text-xs font-medium text-[#7a7268] transition hover:border-[#b8924a] hover:text-[#1e1b17]"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
