"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, ArrowRight, Box, Compass, Sparkles } from "lucide-react";
import { MobileHeader } from "@/components/mobile/mobile-header";
import PropertyCard from "@/app/properties/components/property-card";

interface MobileHomeProps {
  properties: any[];
}

const POPULAR_LOCATIONS = [
  {
    name: "Gurgaon",
    propertiesCount: "12.4K properties",
    cityQuery: "Gurgaon",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Noida",
    propertiesCount: "8.1K properties",
    cityQuery: "Noida",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bangalore",
    propertiesCount: "21.3K properties",
    cityQuery: "Bangalore",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mumbai",
    propertiesCount: "18.6K properties",
    cityQuery: "Mumbai",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
];

const INTENT_CHIPS = [
  { label: "Buy", href: "/properties?listingType=SALE" },
  { label: "Rent", href: "/properties?listingType=RENT" },
  { label: "New Launch", href: "/properties?sort=newest" },
  { label: "Villa", href: "/properties?propertyType=VILLA" },
  { label: "Apartment", href: "/properties?propertyType=APARTMENT" },
];

const CATEGORY_TABS = ["For You", "Villas", "Apartments", "New Launch"] as const;
type CategoryTab = typeof CATEGORY_TABS[number];

export default function MobileHome({ properties = [] }: MobileHomeProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("For You");

  const filteredProperties = useMemo(() => {
    if (activeTab === "Villas") {
      const villas = properties.filter(
        (p) => p.propertyType?.toUpperCase() === "VILLA" || p.title?.toLowerCase().includes("villa")
      );
      return villas.length > 0 ? villas : properties;
    }
    if (activeTab === "Apartments") {
      const apartments = properties.filter(
        (p) => p.propertyType?.toUpperCase() === "APARTMENT" || p.title?.toLowerCase().includes("apartment")
      );
      return apartments.length > 0 ? apartments : properties;
    }
    return properties;
  }, [properties, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/properties");
    }
  };

  return (
    <div className="flex flex-col bg-[#faf7f2] min-h-screen pb-24 md:hidden">
      {/* ── 1. Mobile Header with Locus branding and Notification bell ── */}
      <MobileHeader hasUnreadNotifications={true} />

      <div className="px-4 pt-3 pb-6 space-y-6">
        {/* ── 2. Editorial Heading ── */}
        <div className="space-y-1">
          <h1 className="font-serif text-[1.9rem] leading-[1.18] font-bold tracking-tight text-[#1e1b17]">
            Find a place<br />to call home
          </h1>
          <p className="text-xs text-[#7a7268] font-sans font-medium">
            Houses. People. Possibilities.
          </p>
        </div>

        {/* ── 3. Quick Search Bar ── */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center rounded-2xl border border-[#e5ddd0] bg-white px-3.5 py-3 shadow-xs transition-colors focus-within:border-[#b8924a] focus-within:ring-1 focus-within:ring-[#b8924a]">
            <Search className="h-4 w-4 text-[#7a7268] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, locality, or project"
              className="w-full text-xs text-[#1e1b17] placeholder:text-[#9a8f7e] outline-none bg-transparent"
            />
          </div>
        </form>

        {/* ── 4. Quick Intent Chips ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-0.5">
          {INTENT_CHIPS.map((chip, idx) => (
            <Link
              key={chip.label}
              href={chip.href}
              className={`inline-flex shrink-0 items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                idx === 0
                  ? "bg-[#1e1b17] text-white shadow-2xs"
                  : "border border-[#e5ddd0] bg-white text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#faf7f2]"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* ── 5. Popular Near You / Popular Locations ── */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-sm font-bold text-[#1e1b17]">
              Popular Locations
            </h2>
            <Link
              href="/properties"
              className="text-[11px] font-semibold text-[#b8924a] hover:underline"
            >
              See all &gt;
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {POPULAR_LOCATIONS.map((loc) => (
              <Link
                key={loc.name}
                href={`/properties?city=${loc.cityQuery}`}
                className="group flex flex-col shrink-0 w-28 overflow-hidden rounded-xl border border-[#e5ddd0] bg-white shadow-2xs transition-all hover:border-[#b8924a]"
              >
                <div className="relative h-18 w-full overflow-hidden bg-[#ede8df]">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="120px"
                  />
                </div>
                <div className="p-2 space-y-0.5">
                  <p className="font-serif text-xs font-bold text-[#1e1b17] group-hover:text-[#b8924a] transition-colors">
                    {loc.name}
                  </p>
                  <p className="text-[10px] text-[#7a7268] line-clamp-1">
                    {loc.propertiesCount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── 6. 3D Discovery Luxury Banner ── */}
        <Link
          href="/spatial"
          className="group relative block overflow-hidden rounded-2xl border border-[#3d332a] bg-[#1e1b17] p-4 text-white shadow-md transition-all hover:shadow-lg"
        >
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#b8924a]/20 border border-[#b8924a]/40 px-2 py-0.5 text-[9px] font-semibold text-[#dfc99a] uppercase tracking-wider">
                <Box className="h-2.5 w-2.5 text-[#b8924a]" />
                <span>3D Digital Twin</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white leading-tight">
                Explore Properties in 3D
              </h3>
              <p className="text-[11px] text-[#cfc7bc]">
                Step inside before you visit.
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 transition-all duration-300 group-hover:bg-[#b8924a] group-hover:scale-105">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-[#b8924a]/15 blur-2xl" />
        </Link>

        {/* ── 7. Recommended for You Category Tabs & 2-Column Grid ── */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-sm font-bold text-[#1e1b17]">
              Recommended for You
            </h2>
            <Link
              href="/properties"
              className="text-[11px] font-semibold text-[#b8924a] hover:underline"
            >
              See all
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-0.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#1e1b17] text-white shadow-2xs"
                    : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#faf7f2]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 2-Column Dense Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {filteredProperties.slice(0, 6).map((property) => (
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
            <div className="rounded-xl border border-dashed border-[#e5ddd0] bg-white p-6 text-center">
              <p className="text-xs text-[#7a7268]">No properties found in this category.</p>
            </div>
          )}

          {/* Browse All Link Button */}
          <div className="pt-2 text-center">
            <Link
              href="/properties"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#e5ddd0] bg-white py-2.5 text-xs font-semibold text-[#1e1b17] shadow-2xs hover:border-[#b8924a] hover:bg-[#faf7f2] transition-colors"
            >
              <span>Explore All {properties.length}+ Properties</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#b8924a]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
