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
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Property Details
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Provide the specifications of your property.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium">
            Bedrooms
          </label>

          <input
            id="bedrooms"
            type="number"
            {...register("bedrooms", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />

          {errors.bedrooms && (
            <p className="mt-2 text-sm text-red-500">
              {errors.bedrooms.message}
            </p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="mb-2 block text-sm font-medium">
            Bathrooms
          </label>

          <input
            id="bathrooms"
            type="number"
            {...register("bathrooms", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Area */}
        <div>
          <label htmlFor="area" className="mb-2 block text-sm font-medium">
            Area (sq.ft)
          </label>

          <input
            id="area"
            type="number"
            step="0.01"
            {...register("area", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Balconies */}
        <div>
          <label htmlFor="balconies" className="mb-2 block text-sm font-medium">
            Balconies
          </label>

          <input
            id="balconies"
            type="number"
            {...register("balconies", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Parking */}
        <div>
          <label htmlFor="parking" className="mb-2 block text-sm font-medium">
            Parking Spaces
          </label>

          <input
            id="parking"
            type="number"
            {...register("parking", {
              valueAsNumber: true,
            })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Furnished */}
        <div className="flex items-center gap-3 pt-9">
          <input
            id="furnished"
            type="checkbox"
            {...register("furnished")}
            className="h-5 w-5 rounded border-gray-300 accent-black"
          />

          <label htmlFor="furnished" className="text-sm font-medium">
            Furnished Property
          </label>
        </div>
      </div>
    </section>
  );
}
