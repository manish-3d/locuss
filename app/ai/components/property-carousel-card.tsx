"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import ResilientImage from "@/components/ui/resilient-image";
import { Bed, Bath, Square, Heart, Box, Check, MapPin } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/interactions";
import type { PropertyResult } from "./property-result-card";

type Props = {
  property: PropertyResult;
  initialFavorited?: boolean;
};

export function formatIndianPrice(price: number, listingType?: "SALE" | "RENT"): string {
  const isRent = listingType === "RENT";
  if (isRent) {
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(2) : cr.toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyCarouselCard({
  property,
  initialFavorited = false,
}: Props) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [, startTransition] = useTransition();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorited;
    setIsFavorited(next);
    startTransition(async () => {
      try {
        await toggleFavorite(property.id);
      } catch (err) {
        setIsFavorited(!next);
        console.error("Failed to toggle favorite:", err);
      }
    });
  };

  const locationText = [property.address, property.city].filter(Boolean).join(", ") || property.city;

  return (
    <div className="w-[240px] sm:w-[260px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#e5ddd0] bg-white shadow-xs transition-all hover:border-[#b8924a]/60 hover:shadow-md flex flex-col">
      {/* ── Image with Badges ── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece0]">
        <ResilientImage
          src={property.image || "/property-placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="260px"
        />

        {/* Top Badges */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1e1b17]/90 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-2xs shadow-xs">
            <Box className="h-2.5 w-2.5 text-[#b8924a]" />
            <span>3D Tour</span>
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavorite}
          className="locus-touch absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1e1b17] shadow-xs backdrop-blur-2xs transition-colors hover:bg-white"
          aria-label="Save to favorites"
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isFavorited ? "fill-rose-500 text-rose-500" : "text-[#7a7268]"
            }`}
          />
        </button>

        {/* Bottom Left Verified Badge */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50/95 border border-emerald-200/80 px-2 py-0.5 text-[9px] font-semibold text-emerald-800 backdrop-blur-2xs shadow-2xs">
            <Check className="h-2.5 w-2.5 text-emerald-600 stroke-[2.5]" />
            <span>Verified</span>
          </span>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Price */}
          <div className="font-serif text-base font-bold text-[#1e1b17] tracking-tight">
            {formatIndianPrice(property.price, property.listingType)}
          </div>

          {/* Title */}
          <h4 className="mt-0.5 font-semibold text-xs text-[#1e1b17] truncate" title={property.title}>
            {property.title}
          </h4>

          {/* Location */}
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#7a7268] truncate">
            <MapPin size={11} className="shrink-0 text-[#b8924a]" />
            <span className="truncate">{locationText}</span>
          </p>

          {/* Specs */}
          <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-[#7a7268]">
            <span className="inline-flex items-center gap-1">
              <Bed size={11} className="text-[#1e1b17]" />
              <span>{property.bedrooms} Beds</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Bath size={11} className="text-[#1e1b17]" />
              <span>{property.bathrooms} Baths</span>
            </span>
            {property.area && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Square size={11} className="text-[#1e1b17]" />
                  <span>{property.area.toLocaleString()} sq ft</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* View Details Action Button */}
        <Link
          href={`/properties/${property.id}`}
          className="locus-touch mt-3 block w-full rounded-lg border border-[#e5ddd0] bg-[#faf7f2] py-2 text-center text-xs font-semibold text-[#1e1b17] shadow-2xs transition-colors hover:border-[#b8924a] hover:bg-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
