"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { PropertyResult, formatPrice } from "./property-result-card";

type ActionConfirmationProps = {
  type: "favorite" | "inquiry" | "viewing";
  title?: string;
  subtitle?: string;
  property?: PropertyResult;
  viewingDetails?: {
    dateTime?: string;
    status?: string;
    note?: string;
  };
};

export default function ActionConfirmation({
  type,
  title,
  subtitle,
  property,
  viewingDetails,
}: ActionConfirmationProps) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Viewing Appointment Confirmation (Panel 9)
  if (type === "viewing") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs sm:text-sm">
          <CheckCircle2 size={15} className="fill-emerald-100" />
          <span>{title || "Viewing request created!"}</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border border-[#f2ece0] bg-[#faf7f2] p-2 sm:p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f2ece0] text-[#b8924a]">
              <Calendar size={16} />
            </div>
            <div className="truncate">
              <p className="font-bold text-xs text-[#1e1b17] truncate">
                {viewingDetails?.dateTime || "Scheduled Viewing"}
              </p>
              <p className="text-[11px] text-[#7a7268] truncate">
                {property?.title || "Requested Property"}
              </p>
            </div>
          </div>

          {property && (
            <Link
              href={`/properties/${property.id}`}
              className="shrink-0 rounded-md border border-[#e5ddd0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#1e1b17] hover:border-[#b8924a] transition-colors"
            >
              View
            </Link>
          )}
        </div>

        <p className="mt-1.5 text-[11px] text-[#7a7268]">
          {subtitle || "We've sent a request to the seller. You'll be notified once it's confirmed."}
        </p>
      </div>
    );
  }

  // Favorite Confirmation (Panel 7)
  if (type === "favorite") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs sm:text-sm">
          <CheckCircle2 size={15} className="fill-emerald-100" />
          <span>{title || "Saved to your favorites!"}</span>
        </div>

        {property && (
          <div className="mt-2 flex items-center justify-between gap-2.5 rounded-lg border border-[#f2ece0] bg-[#faf7f2] p-1.5 sm:p-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded bg-[#f2ece0]">
                <Image
                  src={property.image || fallbackImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="truncate">
                <p className="truncate font-serif font-bold text-xs text-[#1e1b17]">
                  {property.title}
                </p>
                <p className="truncate text-[10px] text-[#7a7268]">
                  {property.city}{property.state ? `, ${property.state}` : ""} • {formatPrice(property.price, property.listingType)}
                </p>
              </div>
            </div>

            <Link
              href={`/properties/${property.id}`}
              className="shrink-0 rounded-md border border-[#e5ddd0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#1e1b17] hover:border-[#b8924a] transition-colors"
            >
              View
            </Link>
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7a7268]">
          <span>{subtitle || "Updated your saved list."}</span>
          <Link
            href="/dashboard/favorites"
            className="inline-flex items-center gap-0.5 font-semibold text-[#b8924a] hover:underline"
          >
            All Favorites
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    );
  }

  // Inquiry / Contact Confirmation (Panel 8)
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 shadow-xs">
      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs sm:text-sm">
        <CheckCircle2 size={15} className="fill-emerald-100" />
        <span>{title || "Inquiry sent successfully!"}</span>
      </div>

      {property && (
        <div className="mt-2 flex items-center justify-between gap-2.5 rounded-lg border border-[#f2ece0] bg-[#faf7f2] p-1.5 sm:p-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded bg-[#f2ece0]">
              <Image
                src={property.image || fallbackImage}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="truncate">
              <p className="truncate font-serif font-bold text-xs text-[#1e1b17]">
                {property.title}
              </p>
              <p className="truncate text-[10px] text-[#7a7268]">
                {property.city}{property.state ? `, ${property.state}` : ""} • {formatPrice(property.price, property.listingType)}
              </p>
            </div>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="shrink-0 rounded-md border border-[#e5ddd0] bg-white px-2 py-0.5 text-[10px] font-medium text-[#1e1b17] hover:border-[#b8924a] transition-colors"
          >
            View
          </Link>
        </div>
      )}

      <p className="mt-1.5 text-[11px] text-[#7a7268]">
        {subtitle || "The seller will get back to you soon. You'll be notified here and in your messages."}
      </p>
    </div>
  );
}
