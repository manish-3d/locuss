import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { PropertySchema } from "@/lib/validations/property";
import LocationPicker from "@/components/maps/location-picker";

type LocationInformationProps = {
  register: any;
  errors: any;
  setValue: UseFormSetValue<PropertySchema>;
  watch: UseFormWatch<PropertySchema>;
};

export default function LocationInformation({
  register,
  errors,
  setValue,
  watch,
}: LocationInformationProps) {
  return (
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Location & Geography
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Pinpoint coordinates on the interactive map and enter locality address.
        </p>
      </div>

      <div className="space-y-5">
        {/* Location Picker with Geocoding */}
        <LocationPicker setValue={setValue} watch={watch} />

        {/* Address */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
            Street / Neighborhood Address
          </label>
          <input
            {...register("address")}
            placeholder="e.g. Sector 150, Express Highway"
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
          {errors.address && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* City */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
              City
            </label>
            <input
              {...register("city")}
              placeholder="e.g. Noida"
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]">
              State / Province
            </label>
            <input
              {...register("state")}
              placeholder="e.g. Uttar Pradesh"
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
