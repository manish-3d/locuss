"use client";

import Link from "next/link";
import Image from "next/image";
import { Property, PropertyImage } from "@prisma/client";
import { MapPin, BedDouble, Bath, Square, Pencil, Trash2, ArrowUpRight, Box } from "lucide-react";
import { useTransition } from "react";
import { deleteProperty } from "@/app/dashboard/properties/actions";

type Props = {
  property: Property & {
    images?: PropertyImage[];
  };
};

function formatPrice(price: bigint | number, listingType?: string): string {
  const numPrice = Number(price);
  if (listingType === "RENT") {
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

export default function PropertyCard({ property }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this property?")) {
      startTransition(async () => {
        try {
          await deleteProperty(property.id);
        } catch (error) {
          alert("Failed to delete property.");
          console.error(error);
        }
      });
    }
  };

  const firstImageUrl = property.images && property.images[0]?.url;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-[#e5ddd0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#b8924a]/60 hover:shadow-md motion-reduce:hover:translate-y-0">
      <Link href={`/dashboard/properties/${property.id}`} className="flex flex-col flex-1">
        {/* Compact 16:10 aspect image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece0]">
          {firstImageUrl ? (
            <img
              src={firstImageUrl}
              alt={property.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/property-placeholder.svg";
              }}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#7a7268]">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1b17]/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white tracking-wide shadow-xs">
              <Box className="h-2.5 w-2.5 text-[#b8924a]" />
              <span>3D</span>
            </span>
            <span className="rounded-full bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-[#1e1b17] capitalize">
              {property.propertyType.toLowerCase()}
            </span>
          </div>

          <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-[#1e1b17] shadow-xs uppercase tracking-wider">
            {property.status}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
          <div>
            <div className="flex items-baseline justify-between gap-1.5">
              <p className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                {formatPrice(property.price, property.listingType)}
              </p>
              <div className="flex items-center gap-0.5 text-[10px] text-[#7a7268] shrink-0 truncate max-w-[50%]">
                <MapPin size={10} className="shrink-0 text-[#b8924a]" />
                <span className="truncate">{property.city}, {property.state}</span>
              </div>
            </div>

            <h3 className="mt-0.5 line-clamp-1 font-serif text-xs sm:text-[13px] font-semibold text-[#1e1b17] transition-colors group-hover:text-[#b8924a]">
              {property.title}
            </h3>

            {/* Specs row */}
            <div className="mt-1.5 flex items-center gap-2 border-t border-[#f2ece0] pt-1.5 text-[10px] sm:text-[11px] text-[#524b42]">
              <div className="flex items-center gap-0.5">
                <BedDouble size={11} className="text-[#b8924a]" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Bath size={11} className="text-[#b8924a]" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Square size={11} className="text-[#b8924a]" />
                <span>{Number(property.area).toLocaleString("en-IN")} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Dashboard Action Controls */}
      <div className="flex items-center gap-2 border-t border-[#f2ece0] p-2.5 bg-[#faf7f2]/50">
        <Link
          href={`/dashboard/properties/${property.id}/edit`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e5ddd0] bg-white py-1.5 text-xs font-medium text-[#1e1b17] transition-colors hover:border-[#b8924a] hover:bg-[#b8924a]/5"
        >
          <Pencil size={13} />
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
          title="Delete Property"
        >
          <Trash2 size={13} />
          {isPending ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
