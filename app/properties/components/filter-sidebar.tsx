"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

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

  // Sync state if URL changes outside of this component
  useEffect(() => {
    // eslint-disable-next-line
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
    
    // For checkboxes, handle 'true' or empty string
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({ ...prev, [name]: checked ? "true" : "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page on new filter
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
    
    // Keep sort if it exists
    const params = new URLSearchParams();
    if (searchParams.has("sort")) {
      params.set("sort", searchParams.get("sort")!);
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 sticky top-24">
      <h2 className="mb-6 text-xl font-bold">Filters</h2>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleChange}
              placeholder="Title, address..."
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="e.g. Noida"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        {/* Listing Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Listing Type
          </label>
          <select
            name="listingType"
            value={filters.listingType}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">All</option>
            <option value="SALE">Buy</option>
            <option value="RENT">Rent</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">All Types</option>
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="PLOT">Plot</option>
            <option value="OFFICE">Office</option>
            <option value="SHOP">Shop</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Price Range (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bedrooms
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Area Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Area (sqft)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minArea"
              value={filters.minArea}
              onChange={handleChange}
              placeholder="Min"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              type="number"
              name="maxArea"
              value={filters.maxArea}
              onChange={handleChange}
              placeholder="Max"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Furnished Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="furnished"
            id="furnished"
            checked={filters.furnished === "true"}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-black"
          />
          <label htmlFor="furnished" className="text-sm font-medium text-gray-700">
            Furnished Only
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={applyFilters}
            disabled={isPending}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70"
          >
            {isPending ? "Applying..." : "Apply Filters"}
          </button>
          <button
            onClick={clearFilters}
            className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
