import PropertyForm from "@/components/property/property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Add Property</h1>

        <p className="mt-2 text-gray-500">
          Fill in the details below to list your property.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
