"use client";

import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants/property";

type Props = {
  watch: any;
  setValue: any;
};

export default function ListingInformation({ watch, setValue }: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Listing Information</h2>

        <p className="mt-1 text-sm text-gray-500">
          Select how your property will appear.
        </p>
      </div>

      {/* Listing Type */}

      <div className="mb-10">
        <h3 className="mb-4 font-medium">Listing Type</h3>

        <div className="grid grid-cols-2 gap-4">
          {LISTING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("listingType", type)}
              className={`rounded-xl border p-5 text-left transition ${
                watch("listingType") === type
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}

      <div>
        <h3 className="mb-4 font-medium">Property Type</h3>

        <div className="grid gap-4 md:grid-cols-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("propertyType", type)}
              className={`rounded-xl border p-5 text-left transition ${
                watch("propertyType") === type
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
