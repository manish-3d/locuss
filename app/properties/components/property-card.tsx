import Link from "next/link";
import { Bed, Bath, Square, MapPin, ArrowRight, Box, Check } from "lucide-react";
import FavoriteButton from "./favorite-button";
import ResilientImage from "@/components/ui/resilient-image";

export type PropertyCardProps = {
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
  imageUrl: string | null;
  initialFavorited?: boolean;
  aiMatchScore?: number;
  has3D?: boolean;
  isNew?: boolean;
  isVerified?: boolean;
};

export function formatPrice(price: number | bigint, listingType?: string): string {
  const numPrice = Number(price);
  const isRent = listingType === "RENT";

  if (isRent) {
    return `₹${numPrice.toLocaleString("en-IN")}/mo`;
  }

  if (numPrice >= 10000000) {
    const cr = numPrice / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(2) : cr.toFixed(2)} Cr`;
  }

  if (numPrice >= 100000) {
    const lakh = numPrice / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }

  return `₹${numPrice.toLocaleString("en-IN")}`;
}

export default function PropertyCard({
  id,
  title,
  price,
  city,
  state,
  bedrooms,
  bathrooms,
  area,
  propertyType,
  listingType,
  furnished,
  parking,
  imageUrl,
  initialFavorited = false,
  aiMatchScore,
  has3D = true, // Real 3D tour model available
  isNew = false,
  isVerified = true,
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${id}`}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#e5ddd0] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8924a]/60 hover:shadow-md sm:rounded-2xl"
    >
      {/* ── Image Thumbnail with Badges ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f2ece0] sm:aspect-[16/10]">
        {imageUrl ? (
          <ResilientImage
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-[#7a7268]">
            No image
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1 sm:left-2 sm:top-2">
          {has3D && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1e1b17]/90 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold tracking-wide text-white shadow-xs backdrop-blur-2xs">
              <Box className="h-2.5 w-2.5 text-[#b8924a]" />
              <span>3D</span>
            </span>
          )}
          {isNew && (
            <span className="rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold text-[#1e1b17] shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Top Right Heart Favorite Button */}
        <div className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1 sm:right-2 sm:top-2">
          {aiMatchScore && (
            <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-[#b8924a] px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-xs">
              ✦ {aiMatchScore}%
            </span>
          )}
          <FavoriteButton propertyId={id} initialFavorited={initialFavorited} />
        </div>
      </div>

      {/* ── Card Content: Highly Scannable & Compact ── */}
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-3 space-y-1 sm:space-y-2">
        <div className="space-y-0.5">
          {/* Price */}
          <p className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
            {formatPrice(price, listingType)}
          </p>

          {/* Title */}
          <h3 className="line-clamp-1 font-serif text-xs font-semibold text-[#1e1b17] transition-colors group-hover:text-[#b8924a]">
            {title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-0.5 text-[10px] text-[#7a7268] truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0 text-[#a39a8c]" />
            <span className="truncate">{city}, {state}</span>
          </p>
        </div>

        {/* Specs & Verified Badge Row */}
        <div className="border-t border-[#f2ece0] pt-1.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#524b42]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5" title={`${bedrooms} Bedrooms`}>
                <Bed className="h-3 w-3 text-[#7a7268]" />
                <span className="font-medium">{bedrooms}</span>
              </div>
              <div className="flex items-center gap-0.5" title={`${bathrooms} Bathrooms`}>
                <Bath className="h-3 w-3 text-[#7a7268]" />
                <span className="font-medium">{bathrooms}</span>
              </div>
              <div className="flex items-center gap-0.5" title={`${area} sq.m`}>
                <Square className="h-3 w-3 shrink-0 text-[#7a7268]" />
                <span className="truncate font-medium">{Math.round(Number(area))} m²</span>
              </div>
            </div>
          </div>

          {/* Verified Badge */}
          {isVerified && (
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#eef7ee] px-1.5 py-0.5 text-[9px] font-semibold text-[#2d7a36]">
                <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                <span>Verified</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
