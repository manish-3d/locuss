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
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Basic Information
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Give your property a title and description that attracts buyers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Property Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="Luxury Villa in Noida Sector 150"
            {...register("title")}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={7}
            placeholder="Describe your property, nearby landmarks, lifestyle, unique features, and everything a buyer should know..."
            {...register("description")}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          {errors.description && (
            <p className="mt-2 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Price (₹)
          </label>

          <input
            id="price"
            type="number"
            placeholder="25000000"
            {...register("price")}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          {errors.price && (
            <p className="mt-2 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
