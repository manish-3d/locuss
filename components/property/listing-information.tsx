"use client";

import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants/property";

type Props = {
  watch: any;
  setValue: any;
};

export default function ListingInformation({ watch, setValue }: Props) {
  return (
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Listing Category & Structure
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Specify the transaction mode and architectural categorization.
        </p>
      </div>

      {/* Listing Type */}
      <div className="mb-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
          Transaction Intent
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {LISTING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("listingType", type)}
              className={`rounded-xl border p-4 text-center text-xs sm:text-sm font-medium transition-all ${
                watch("listingType") === type
                  ? "border-[#1e1b17] bg-[#1e1b17] text-white shadow-xs font-semibold"
                  : "border-[#e5ddd0] bg-[#faf7f2]/40 text-[#1e1b17] hover:border-[#b8924a]"
              }`}
            >
              For {type === "SALE" ? "Sale" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
          Property Classification
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("propertyType", type)}
              className={`rounded-xl border p-3.5 text-center text-xs sm:text-sm font-medium capitalize transition-all ${
                watch("propertyType") === type
                  ? "border-[#1e1b17] bg-[#1e1b17] text-white shadow-xs font-semibold"
                  : "border-[#e5ddd0] bg-[#faf7f2]/40 text-[#1e1b17] hover:border-[#b8924a]"
              }`}
            >
              {type.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
