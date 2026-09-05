import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PropertySchema } from "@/lib/validations/property";

type BasicInformationProps = {
  register: UseFormRegister<PropertySchema>;
  errors: FieldErrors<PropertySchema>;
};

export default function BasicInformation({
  register,
  errors,
}: BasicInformationProps) {
  return (
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="mb-6 border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Basic Information
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Give your property an evocative title and detailed description that captures buyer interest.
        </p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]"
          >
            Property Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Modern Minimalist Villa in Sector 150"
            {...register("title")}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe your property, architecture, natural lighting, finishes, neighborhood, and unique details..."
            {...register("description")}
            className="w-full resize-none rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-3 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#7a7268]"
          >
            Guide Price (₹)
          </label>
          <input
            id="price"
            type="number"
            placeholder="e.g. 25000000"
            {...register("price")}
            className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 px-4 py-2.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
          />
          {errors.price && (
            <p className="mt-1.5 text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
