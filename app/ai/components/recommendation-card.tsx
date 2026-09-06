"use client";

import { useState, useTransition } from "react";
import ResilientImage from "@/components/ui/resilient-image";
import Link from "next/link";
import { Check, Heart, ArrowRight, Sparkles, MapPin, Maximize2, BedDouble, Bath } from "lucide-react";
import { PropertyResult, formatPrice } from "./property-result-card";
import { toggleFavorite } from "@/lib/actions/interactions";

type RecommendationCardProps = {
  property: PropertyResult;
  reasons: string[];
  initialFavorited?: boolean;
  followUpPrompt?: string;
  onFollowUpClick?: (prompt: string) => void;
};

export default function RecommendationCard({
  property,
  reasons,
  initialFavorited = false,
  followUpPrompt,
  onFollowUpClick,
}: RecommendationCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const fallbackImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="overflow-hidden rounded-xl border border-[#b8924a]/40 bg-white shadow-xs transition-all hover:shadow-sm">
      {/* Featured Header Image */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-[#f2ece0]">
        <ResilientImage
          src={property.image || fallbackImage}
          alt={property.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
        />

        {/* Best Match Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[#1e1b17]/90 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
          <Sparkles size={10} className="fill-amber-300 text-amber-300" />
          <span>Best Match</span>
        </div>
      </div>

      <div className="p-3 sm:p-3.5 space-y-2.5">
        {/* Title, Location & Price */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 border-b border-[#f2ece0] pb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1e1b17] line-clamp-1">
              {property.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#7a7268]">
              <MapPin size={11} className="shrink-0 text-[#b8924a]" />
              <span className="truncate">{property.city}{property.state ? `, ${property.state}` : ""}</span>
            </p>
          </div>
          <div className="text-sm sm:text-base font-bold text-[#1e1b17] shrink-0">
            {formatPrice(property.price, property.listingType)}
          </div>
        </div>

        {/* Specs and tags */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#524b42]">
          {property.area && (
            <div className="flex items-center gap-0.5">
              <Maximize2 size={11} className="text-[#b8924a]" />
              <span>{property.area.toLocaleString("en-IN")} sq.ft.</span>
            </div>
          )}
          <div className="flex items-center gap-0.5">
            <BedDouble size={11} className="text-[#b8924a]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Bath size={11} className="text-[#b8924a]" />
            <span>{property.bathrooms} Baths</span>
          </div>

          <div className="flex items-center gap-1 ml-auto">
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
        </div>

        {/* Why I recommend this */}
        {reasons && reasons.length > 0 && (
          <div className="rounded-lg bg-[#faf7f2] p-2.5 border border-[#e5ddd0]">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1e1b17]">
              Why I recommend this:
            </h4>
            <ul className="mt-1.5 space-y-1">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-1.5 text-xs text-[#3b352e]">
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#1e1b17] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#b8924a]"
          >
            View Details
            <ArrowRight size={12} />
          </Link>

          <button
            onClick={handleFavoriteToggle}
            disabled={isPending}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              isFavorited
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-[#e5ddd0] bg-[#faf7f2] text-[#1e1b17] hover:border-[#b8924a] hover:bg-white"
            }`}
          >
            <Heart
              size={12}
              className={isFavorited ? "fill-red-600 stroke-red-600" : ""}
            />
            {isFavorited ? "Saved" : "Save"}
          </button>
        </div>

        {/* Optional follow-up prompt */}
        {followUpPrompt && (
          <div className="border-t border-[#f2ece0] pt-1.5">
            <button
              onClick={() => onFollowUpClick?.(followUpPrompt)}
              className="text-left text-[11px] text-[#7a7268] hover:text-[#b8924a] transition-colors flex items-center gap-1"
            >
              <span>💬</span>
              <span>{followUpPrompt}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
