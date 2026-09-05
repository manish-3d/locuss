"use client";

import { AMENITIES } from "@/lib/constants/amenities";

type Props = {
  watch: any;
  setValue: any;
};

export default function AmenitiesSection({ watch, setValue }: Props) {
  const selected = watch("amenities") || [];

  function toggleAmenity(name: string) {
    if (selected.includes(name)) {
      setValue(
        "amenities",
        selected.filter((item: string) => item !== name),
      );
    } else {
      setValue("amenities", [...selected, name]);
    }
  }

  return (
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Features & Amenities
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Select premium amenities and infrastructure highlights available at this property.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {AMENITIES.map((amenity) => {
          const active = selected.includes(amenity);

          return (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                active
                  ? "border-[#1e1b17] bg-[#1e1b17] text-white shadow-xs"
                  : "border-[#e5ddd0] bg-[#faf7f2]/50 text-[#1e1b17] hover:border-[#b8924a]"
              }`}
            >
              {active && <span className="text-[#b8924a] mr-1">✦</span>}
              {amenity}
            </button>
          );
        })}
      </div>
    </section>
  );
}
