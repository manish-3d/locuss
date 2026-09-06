"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Map as MapIcon,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import PropertyCard from "./property-card";
import { MobileFilterSheet } from "@/components/property/mobile-filter-sheet";

interface MobilePropertiesViewProps {
  properties: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const SORT_OPTIONS = [
  { label: "Relevance", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Most Viewed", value: "views" },
  { label: "Area Size", value: "area" },
];

export function MobilePropertiesView({
  properties = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
}: MobilePropertiesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeQuery = searchParams.get("q") || searchParams.get("city") || "Gurgaon, Haryana";
  const activeListingType = searchParams.get("listingType") || "SALE";
  const activePropertyType = searchParams.get("propertyType");
  const activeBedrooms = searchParams.get("bedrooms");
  const activeMinPrice = searchParams.get("minPrice");
  const activeMaxPrice = searchParams.get("maxPrice");
  const activeSort = searchParams.get("sort") || "newest";

  // Calculate total active filters count
  const activeFilterCount = [
    activePropertyType,
    activeBedrooms,
    activeMinPrice || activeMaxPrice,
    searchParams.get("furnished"),
  ].filter(Boolean).length;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
    setIsSortOpen(false);
  };

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === activeSort)?.label || "Relevance";

  return (
    <div className="flex flex-col bg-[#faf7f2] min-h-screen pb-24 md:hidden">
      {/* ── 1. Top Bar: Back, Search Query, Map Toggle ── */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-[#e5ddd0]/80 bg-[#faf7f2]/95 px-3 py-2.5 backdrop-blur-md pt-[max(0.6rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] shadow-2xs hover:bg-[#faf7f2]"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Search / Location Pill */}
        <div className="flex-1 flex items-center rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 shadow-2xs text-xs text-[#1e1b17]">
          <Search className="h-3.5 w-3.5 text-[#7a7268] mr-2 shrink-0" />
          <span className="truncate font-medium">{activeQuery}</span>
        </div>

        {/* Map Toggle Button */}
        <Link
          href="/properties?view=map"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] shadow-2xs hover:bg-[#faf7f2]"
          title="Switch to Map View"
        >
          <MapIcon className="h-4 w-4 text-[#524b42]" />
        </Link>
      </div>

      {/* ── 2. Horizontally Scrollable Quick Filter Chips ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-2 border-b border-[#e5ddd0]/50 bg-white/70">
        {/* Transaction Type chip */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="rounded-lg bg-[#6b583f] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs shrink-0"
        >
          {activeListingType === "RENT" ? "Rent" : "Buy"}
        </button>

        {/* Property Type chip if selected */}
        {activePropertyType && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#6b583f] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs shrink-0">
            <span>{activePropertyType}</span>
            <button
              type="button"
              onClick={() => removeFilter("propertyType")}
              className="hover:opacity-75"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Price chip if selected */}
        {(activeMinPrice || activeMaxPrice) && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#6b583f] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs shrink-0">
            <span>Budget</span>
            <button
              type="button"
              onClick={() => {
                removeFilter("minPrice");
                removeFilter("maxPrice");
              }}
              className="hover:opacity-75"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Bedrooms chip if selected */}
        {activeBedrooms && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#6b583f] px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs shrink-0">
            <span>{activeBedrooms} BHK</span>
            <button
              type="button"
              onClick={() => removeFilter("bedrooms")}
              className="hover:opacity-75"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Main Filters Button */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold shadow-2xs shrink-0 transition-colors ${
            activeFilterCount > 0
              ? "border-[#b8924a] bg-[#fbf6ec] text-[#b8924a]"
              : "border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#faf7f2]"
          }`}
        >
          <SlidersHorizontal className="h-3 w-3" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#b8924a] text-[9px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── 3. Properties Counter & Sort Selector ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 text-xs text-[#7a7268]">
        <span className="font-medium text-[#1e1b17]">
          {totalCount.toLocaleString("en-IN")} properties
        </span>

        {/* Sort dropdown toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e1b17] hover:text-[#b8924a]"
          >
            <span>Sort: {currentSortLabel}</span>
            <ChevronDown className="h-3 w-3 text-[#7a7268]" />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1 z-30 w-44 rounded-xl border border-[#e5ddd0] bg-white py-1 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSortChange(opt.value)}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                    activeSort === opt.value
                      ? "bg-[#faf7f2] font-semibold text-[#b8924a]"
                      : "text-[#524b42] hover:bg-[#faf7f2]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Dense 2-Column Property Grid ── */}
      <div className="px-2.5">
        {properties.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                city={property.city}
                state={property.state}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                propertyType={property.propertyType}
                listingType={property.listingType}
                furnished={property.furnished}
                parking={property.parking}
                imageUrl={property.images?.[0]?.url || null}
                has3D={true}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-8 text-center mt-4">
            <h3 className="font-serif text-sm font-semibold text-[#1e1b17]">
              No matching properties
            </h3>
            <p className="mt-1 text-xs text-[#7a7268]">
              Try adjusting your filters or search criteria.
            </p>
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#1e1b17] px-4 py-2 text-xs font-medium text-white shadow-2xs"
            >
              Adjust Filters
            </button>
          </div>
        )}

        {/* Pagination indicator */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-5 pb-2 text-xs text-[#7a7268]">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        )}
      </div>

      {/* ── 5. Mobile Filter Bottom Sheet ── */}
      <MobileFilterSheet
        totalCount={totalCount}
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
      />
    </div>
  );
}
