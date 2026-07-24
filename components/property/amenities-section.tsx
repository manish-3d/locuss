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
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Amenities</h2>

        <p className="mt-1 text-sm text-gray-500">
          Select everything available in your property.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {AMENITIES.map((amenity) => {
          const active = selected.includes(amenity);

          return (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full border px-5 py-2 text-sm transition-all duration-200 ${
                active
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-black"
              }`}
            >
              {active && "✓ "}
              {amenity}
            </button>
          );
        })}
      </div>
    </section>
  );
}
