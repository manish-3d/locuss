type LocationInformationProps = {
  register: any;
  errors: any;
};

export default function LocationInformation({
  register,
  errors,
}: LocationInformationProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Location</h2>

        <p className="mt-1 text-sm text-gray-500">
          Help buyers find your property.
        </p>
      </div>

      <div className="space-y-6">
        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Street Address
          </label>

          <input
            {...register("address")}
            placeholder="Sector 150"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />

          {errors.address && (
            <p className="mt-2 text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* City */}
          <div>
            <label className="mb-2 block text-sm font-medium">City</label>

            <input
              {...register("city")}
              placeholder="Noida"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block text-sm font-medium">State</label>

            <input
              {...register("state")}
              placeholder="Uttar Pradesh"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-medium">Country</label>

            <input
              {...register("country")}
              placeholder="India"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>

        {/* Map Placeholder */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            Property Location
          </label>

          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">Interactive Map Coming Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
