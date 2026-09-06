"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search, FolderHeart, Sparkles } from "lucide-react";
import PropertyCard from "@/app/properties/components/property-card";
import DesktopPropertyCard from "@/components/property/property-card";

type PropertyWithImages = {
  id: string;
  title: string;
  price: bigint | number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: string;
  furnished: boolean;
  parking: number | null;
  status: string;
  images: { id?: string; url: string }[];
};

type Props = {
  favorites: {
    propertyId: string;
    property: PropertyWithImages;
  }[];
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "properties", label: "Properties" },
  { id: "searches", label: "Searches" },
  { id: "collections", label: "Collections" },
];

export default function FavoritesView({ favorites }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── MOBILE VIEW (Board 1 Screen 7) ── */}
      <div className="block md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17]">
              Saved
            </h1>
            <span className="rounded-full bg-[#f2ece0] px-2 py-0.5 text-[11px] font-semibold text-[#b8924a]">
              {favorites.length}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`locus-touch shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#1e1b17] text-white shadow-xs font-semibold"
                    : "border border-[#e5ddd0] bg-white text-[#7a7268] hover:border-[#b8924a]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content based on tab */}
        {selectedCategory === "searches" ? (
          <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-8 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a]">
              <Search size={18} />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#1e1b17]">
              No saved searches yet
            </h3>
            <p className="mt-1 text-xs text-[#7a7268]">
              Save search filters on the discovery page to get notified of new matching listings.
            </p>
            <Link
              href="/properties"
              className="mt-4 inline-flex items-center rounded-full bg-[#1e1b17] px-5 py-2 text-xs font-medium text-white transition hover:bg-black"
            >
              Explore Search
            </Link>
          </div>
        ) : selectedCategory === "collections" ? (
          <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-8 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a]">
              <FolderHeart size={18} />
            </div>
            <h3 className="font-serif text-base font-semibold text-[#1e1b17]">
              Curated Collections
            </h3>
            <p className="mt-1 text-xs text-[#7a7268]">
              Group your saved homes into custom private boards or share with family.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center rounded-full bg-[#1e1b17] px-5 py-2 text-xs font-medium text-white transition hover:bg-black"
            >
              + Create Collection
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a]">
              <Heart size={20} className="text-[#b8924a]" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-[#1e1b17]">
              No saved properties yet
            </h2>
            <p className="mx-auto mt-1 max-w-xs text-xs text-[#7a7268]">
              Explore listings across the platform and click the heart icon to save your favorite homes.
            </p>
            <Link
              href="/properties"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-black"
            >
              Explore Properties →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {favorites.map((fav) => (
              <PropertyCard
                key={fav.propertyId}
                id={fav.property.id}
                title={fav.property.title}
                price={fav.property.price}
                city={fav.property.city}
                state={fav.property.state}
                bedrooms={fav.property.bedrooms}
                bathrooms={fav.property.bathrooms}
                area={fav.property.area}
                propertyType={fav.property.propertyType}
                listingType={fav.property.listingType}
                furnished={fav.property.furnished}
                parking={fav.property.parking}
                imageUrl={fav.property.images?.[0]?.url || null}
                initialFavorited={true}
                has3D={true}
                isVerified={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP VIEW (100% Intact & Untouched) ── */}
      <div className="hidden md:block space-y-6">
        <div className="border-b border-[#e5ddd0] pb-6">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-[#1e1b17]">
            My Saved Properties
          </h1>
          <p className="mt-1 text-sm text-[#7a7268]">
            Curated listings you have bookmarked for comparison and review.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a]">
              <Heart size={20} className="text-[#b8924a]" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1e1b17]">
              No saved properties yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#7a7268]">
              Explore listings across the platform and click the heart icon to save your favorite homes.
            </p>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#1e1b17] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black shadow-xs"
            >
              Explore Properties →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((fav) => (
              <DesktopPropertyCard key={fav.propertyId} property={fav.property as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
