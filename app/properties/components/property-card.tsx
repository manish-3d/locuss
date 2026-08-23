import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin } from "lucide-react";

export type PropertyCardProps = {
  id: string;
  title: string;
  price: bigint;
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
};

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
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${id}`}
      className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            For {listingType === "SALE" ? "Sale" : "Rent"}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black backdrop-blur-sm">
            {propertyType}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-gray-900">
            {title}
          </h3>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {city}, {state}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-gray-400" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-gray-400" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-gray-400" />
            <span>{area} sqft</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {furnished && (
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
              Furnished
            </span>
          )}
          {parking ? (
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
              Parking
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <p className="text-xl font-bold text-black">
            ₹{Number(price).toLocaleString("en-IN")}
            {listingType === "RENT" && (
              <span className="text-sm font-normal text-gray-500"> /month</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
