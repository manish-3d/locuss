"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  SlidersHorizontal,
  SquareParking,
  ArrowUpDown,
  Zap,
  Trees,
  Waves,
  Building2,
  Dumbbell,
  PawPrint,
} from "lucide-react";

interface MobileFilterSheetProps {
  totalCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

const PROPERTY_TYPES = ["Any", "House", "Apartment", "Villa", "Plot", "Penthouse", "Studio"];
const TRANSACTION_TYPES = [
  { label: "Buy", value: "SALE" },
  { label: "Rent", value: "RENT" },
  { label: "New Launch", value: "NEW" },
  { label: "Resale", value: "RESALE" },
];
const BEDROOMS = ["Any", "1", "2", "3", "4+"];
const BATHROOMS = ["Any", "1", "2", "3", "4+"];
const FURNISHING = ["Any", "Furnished", "Semi-Furnished", "Unfurnished"];

const AMENITIES = [
  { label: "Parking", icon: SquareParking },
  { label: "Lift", icon: ArrowUpDown },
  { label: "Power Backup", icon: Zap },
  { label: "Garden", icon: Trees },
  { label: "Swimming Pool", icon: Waves },
  { label: "Clubhouse", icon: Building2 },
  { label: "Gym", icon: Dumbbell },
  { label: "Pet Friendly", icon: PawPrint },
];

export function MobileFilterSheet({
  totalCount = 2834,
  isOpen,
  onClose,
}: MobileFilterSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Internal filter state initialized from active URL searchParams
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>(
    searchParams.get("propertyType") || "Any"
  );
  const [selectedListingType, setSelectedListingType] = useState<string>(
    searchParams.get("listingType") || "SALE"
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(
    searchParams.get("bedrooms") || "Any"
  );
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>("Any");
  const [selectedFurnishing, setSelectedFurnishing] = useState<string>(
    searchParams.get("furnished") === "true" ? "Furnished" : "Any"
  );
  const [minPrice, setMinPrice] = useState<number>(
    parseInt(searchParams.get("minPrice") || "5000000", 10)
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    parseInt(searchParams.get("maxPrice") || "50000000", 10)
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleAmenity = (label: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const handleReset = () => {
    setSelectedPropertyType("Any");
    setSelectedListingType("SALE");
    setSelectedBedrooms("Any");
    setSelectedBathrooms("Any");
    setSelectedFurnishing("Any");
    setMinPrice(5000000);
    setMaxPrice(50000000);
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedPropertyType && selectedPropertyType !== "Any") {
      params.set("propertyType", selectedPropertyType.toUpperCase());
    } else {
      params.delete("propertyType");
    }

    if (selectedListingType) {
      params.set("listingType", selectedListingType);
    } else {
      params.delete("listingType");
    }

    if (selectedBedrooms && selectedBedrooms !== "Any") {
      params.set("bedrooms", selectedBedrooms.replace("+", ""));
    } else {
      params.delete("bedrooms");
    }

    if (selectedFurnishing === "Furnished") {
      params.set("furnished", "true");
    } else {
      params.delete("furnished");
    }

    if (minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    }
    if (maxPrice > 0) {
      params.set("maxPrice", maxPrice.toString());
    }

    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
    onClose();
  };

  const formatLakhOrCr = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    return `₹${Math.round(num / 100000)} L`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[#faf7f2] shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1 w-10 rounded-full bg-[#d5cdbf]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5ddd0] px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white text-[#524b42]"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-serif text-base font-bold text-[#1e1b17]">Filters</h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-[#7a7268] hover:text-[#b8924a] px-2 py-1"
          >
            Reset
          </button>
        </div>

        {/* Filter Scrollable Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* 1. Property Type */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Property Type
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedPropertyType(type)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedPropertyType.toLowerCase() === type.toLowerCase()
                      ? "bg-[#6b583f] text-white shadow-2xs"
                      : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Transaction Type */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Transaction Type
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {TRANSACTION_TYPES.map((tx) => (
                <button
                  key={tx.value}
                  type="button"
                  onClick={() => setSelectedListingType(tx.value)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedListingType === tx.value
                      ? "bg-[#6b583f] text-white shadow-2xs"
                      : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                  }`}
                >
                  {tx.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Budget
              </h3>
              <span className="text-xs font-bold text-[#b8924a]">
                {formatLakhOrCr(minPrice)} – {formatLakhOrCr(maxPrice)}
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min={2000000}
                max={100000000}
                step={1000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b8924a]"
              />
              <div className="flex items-center justify-between text-[10px] text-[#7a7268] px-0.5">
                <span>₹20 L</span>
                <span>₹2 Cr</span>
                <span>₹10 Cr+</span>
              </div>
            </div>
          </div>

          {/* 4. Bedrooms */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Bedrooms
            </h3>
            <div className="flex gap-1.5">
              {BEDROOMS.map((bed) => (
                <button
                  key={bed}
                  type="button"
                  onClick={() => setSelectedBedrooms(bed)}
                  className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all text-center ${
                    selectedBedrooms === bed
                      ? "bg-[#6b583f] text-white shadow-2xs"
                      : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                  }`}
                >
                  {bed}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Bathrooms */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Bathrooms
            </h3>
            <div className="flex gap-1.5">
              {BATHROOMS.map((bath) => (
                <button
                  key={bath}
                  type="button"
                  onClick={() => setSelectedBathrooms(bath)}
                  className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all text-center ${
                    selectedBathrooms === bath
                      ? "bg-[#6b583f] text-white shadow-2xs"
                      : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                  }`}
                >
                  {bath}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Furnishing */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Furnishing
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {FURNISHING.map((furn) => (
                <button
                  key={furn}
                  type="button"
                  onClick={() => setSelectedFurnishing(furn)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedFurnishing === furn
                      ? "bg-[#6b583f] text-white shadow-2xs"
                      : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                  }`}
                >
                  {furn}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Amenities */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
              Amenities
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {AMENITIES.map(({ label, icon: Icon }) => {
                const isSelected = selectedAmenities.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleAmenity(label)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all ${
                      isSelected
                        ? "border border-[#b8924a] bg-[#fbf6ec] text-[#b8924a] shadow-2xs"
                        : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#f2ece0]"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] font-medium leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Submit Button */}
        <div className="border-t border-[#e5ddd0] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e1b17] py-3.5 text-xs font-semibold text-white shadow-md hover:bg-[#2b241e] transition-colors"
          >
            <span>Show {totalCount.toLocaleString("en-IN")} Properties</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
