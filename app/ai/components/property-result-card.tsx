"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Maximize2, Heart, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/interactions";

export type PropertyResult = {
  id: string;
  title: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  address?: string;
  city: string;
  state?: string;
  listingType?: "SALE" | "RENT";
  propertyType?: string;
  furnished?: boolean;
  image?: string;
  isFeatured?: boolean;
};

type PropertyResultCardProps = {
  property: PropertyResult;
  initialFavorited?: boolean;
  featuredBadge?: string;
};

export function formatPrice(price: number, listingType?: "SALE" | "RENT"): string {
  const isRent = listingType === "RENT";

  if (isRent) {
    return `₹${price.toLocaleString("en-IN")} / mo`;
  }

  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }

  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyResultCard({
  property,
  initialFavorited = false,
  featuredBadge,
}: PropertyResultCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isFavorited;
    setIsFavorited(nextState);

    startTransition(async () => {
      try {
        await toggleFavorite(property.id);
      } catch (error) {
        setIsFavorited(!nextState);
        console.error("Failed to toggle favorite:", error);
      }
    });
  };

  const locationString = [property.city, property.state].filter(Boolean).join(", ");
  const fallbackImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden rounded-xl border border-[#e5ddd0] bg-white transition-all duration-200 hover:border-[#b8924a]/70 hover:shadow-xs">
      {/* Thumbnail Section */}
      <div className="relative h-28 sm:h-auto sm:w-28 md:w-32 shrink-0 overflow-hidden bg-[#f2ece0]">
        <Image
          src={property.image || fallbackImage}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, 130px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge on Image */}
        {(featuredBadge || property.isFeatured) && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-[#1e1b17]/85 backdrop-blur-xs px-1.5 py-0.5 text-[8px] font-medium tracking-wide text-amber-300 uppercase">
            <Sparkles size={8} />
            {featuredBadge || "Featured"}
          </div>
        )}

        {/* Listing Type Tag if not featured */}
        {!featuredBadge && !property.isFeatured && property.listingType && (
          <div className="absolute top-1.5 left-1.5 rounded bg-[#1e1b17]/75 backdrop-blur-xs px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-white">
            {property.listingType === "RENT" ? "Rent" : "Sale"}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-2.5">
        <div>
          {/* Top Row: Title + Favorite button */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#1e1b17] line-clamp-1 group-hover:text-[#b8924a] transition-colors">
                <Link href={`/properties/${property.id}`}>{property.title}</Link>
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#7a7268]">
                <MapPin size={10} className="shrink-0 text-[#b8924a]" />
                <span className="truncate">{locationString || property.address || "Prime Location"}</span>
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavoriteToggle}
              disabled={isPending}
              aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                isFavorited
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-[#e5ddd0] bg-[#faf7f2] text-[#7a7268] hover:border-[#b8924a] hover:text-[#1e1b17]"
              }`}
            >
              <Heart
                size={11}
                className={isFavorited ? "fill-red-600 stroke-red-600" : ""}
              />
            </button>
          </div>

          {/* Price */}
          <div className="mt-0.5 text-xs sm:text-sm font-bold text-[#1e1b17]">
            {formatPrice(property.price, property.listingType)}
          </div>

          {/* Specs Row */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#524b42]">
            {property.area ? (
              <div className="flex items-center gap-0.5">
                <Maximize2 size={10} className="text-[#b8924a]" />
                <span>{property.area.toLocaleString("en-IN")} sq.ft.</span>
              </div>
            ) : null}

            <div className="flex items-center gap-0.5">
              <BedDouble size={10} className="text-[#b8924a]" />
              <span>{property.bedrooms} Beds</span>
            </div>

            <div className="flex items-center gap-0.5">
              <Bath size={10} className="text-[#b8924a]" />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Feature pills + View Details CTA */}
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-[#f2ece0] pt-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {property.furnished !== undefined && (
              <span className="rounded bg-[#f2ece0] px-1.5 py-0.5 text-[9px] font-medium text-[#7a7268]">
                {property.furnished ? "Furnished" : "Unfurnished"}
              </span>
            )}
            {property.propertyType && (
              <span className="rounded bg-[#f2ece0] px-1.5 py-0.5 text-[9px] font-medium capitalize text-[#7a7268]">
                {property.propertyType.toLowerCase()}
              </span>
            )}
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center gap-1 rounded-md bg-[#1e1b17] px-2 py-0.5 text-[10px] font-medium text-white transition-all hover:bg-[#b8924a]"
          >
            View
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
