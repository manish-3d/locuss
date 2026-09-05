import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin, ArrowUpRight } from "lucide-react";
import FavoriteButton from "./favorite-button";

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
};

export function formatPrice(price: number | bigint, listingType?: string): string {
  const numPrice = Number(price);
  const isRent = listingType === "RENT";

  if (isRent) {
    return `₹${numPrice.toLocaleString("en-IN")}/mo`;
  }

  if (numPrice >= 10000000) {
    const cr = numPrice / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
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
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${id}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-[#e5ddd0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#b8924a]/60 hover:shadow-md motion-reduce:hover:translate-y-0"
    >
      {/* Image Thumbnail — Sleek 16:10 aspect ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece0]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-[#7a7268]">
            No image available
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 z-10">
          <span className="rounded-full bg-[#1e1b17]/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white tracking-wide">
            For {listingType === "SALE" ? "Sale" : "Rent"}
          </span>
          <span className="rounded-full bg-white/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-medium text-[#1e1b17] capitalize">
            {propertyType.toLowerCase()}
          </span>
        </div>

        {/* Optional AI Match or Favorite Button */}
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 z-10">
          {aiMatchScore && (
            <span className="flex items-center gap-0.5 rounded-full bg-[#b8924a] px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-xs">
              ✦ {aiMatchScore}%
            </span>
          )}
          <FavoriteButton propertyId={id} initialFavorited={initialFavorited} />
        </div>
      </div>

      {/* Card Content — Information Dense & Proportional */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between gap-1.5">
            <p className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
              {formatPrice(price, listingType)}
            </p>
            <div className="flex items-center gap-0.5 text-[10px] text-[#7a7268] shrink-0 truncate max-w-[50%]">
              <MapPin size={10} className="shrink-0 text-[#b8924a]" />
              <span className="truncate">{city}, {state}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-0.5 line-clamp-1 font-serif text-xs sm:text-[13px] font-semibold text-[#1e1b17] transition-colors group-hover:text-[#b8924a]">
            {title}
          </h3>

          {/* Key Specs Row */}
          <div className="mt-1.5 flex items-center gap-2 border-t border-[#f2ece0] pt-1.5 text-[10px] sm:text-[11px] text-[#524b42]">
            <div className="flex items-center gap-0.5">
              <Bed size={11} className="text-[#b8924a]" />
              <span>{bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Bath size={11} className="text-[#b8924a]" />
              <span>{bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Square size={11} className="text-[#b8924a]" />
              <span>{Number(area).toLocaleString("en-IN")} sqft</span>
            </div>
          </div>
        </div>

        {/* Footer Meta & Arrow */}
        <div className="mt-2 flex items-center justify-between border-t border-[#f2ece0]/80 pt-1.5 text-[9px] sm:text-[10px] text-[#7a7268]">
          <div className="flex items-center gap-1">
            {furnished && (
              <span className="rounded bg-[#f2ece0] px-1.5 py-0.5 font-medium text-[#524b42]">
                Furnished
              </span>
            )}
            {parking ? (
              <span className="rounded bg-[#f2ece0] px-1.5 py-0.5 font-medium text-[#524b42]">
                Parking
              </span>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-0.5 font-medium text-[#1e1b17] group-hover:text-[#b8924a] transition-colors">
            Details
            <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
