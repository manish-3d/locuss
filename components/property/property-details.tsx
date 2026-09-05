import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PropertySchema } from "@/lib/validations/property";

type PropertyDetailsProps = {
  register: UseFormRegister<PropertySchema>;
  errors: FieldErrors<PropertySchema>;
};

export default function PropertyDetails({
  register,
  errors,
}: PropertyDetailsProps) {
  return (
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="mb-6 border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Property Specifications
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Detail the spatial configuration, rooms, and floor area.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            type="number"
            {...register("bedrooms", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
          {errors.bedrooms && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.bedrooms.message}
            </p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Bathrooms
          </label>
          <input
            id="bathrooms"
            type="number"
            {...register("bathrooms", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
        </div>

        {/* Area */}
        <div>
          <label htmlFor="area" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Carpet Area (sq.ft)
          </label>
          <input
            id="area"
            type="number"
            step="0.01"
            {...register("area", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
        </div>

        {/* Balconies */}
        <div>
          <label htmlFor="balconies" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Balconies
          </label>
          <input
            id="balconies"
            type="number"
            {...register("balconies", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
        </div>

        {/* Parking */}
        <div>
          <label htmlFor="parking" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Parking Spaces
          </label>
          <input
            id="parking"
            type="number"
            {...register("parking", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
        </div>

        {/* Furnished */}
        <div className="flex items-center gap-3 pt-6">
          <input
            id="furnished"
            type="checkbox"
            {...register("furnished")}
            className="h-4 w-4 rounded border-[#e5ddd0] text-[#b8924a] accent-[#b8924a] focus:ring-[#b8924a]"
          />
          <label htmlFor="furnished" className="text-xs sm:text-sm font-medium text-[#1e1b17] select-none cursor-pointer">
            Furnished Residence
          </label>
        </div>
      </div>
    </section>
  );
}
