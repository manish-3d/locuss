import PropertyList from "@/components/property-list";

export default function PropertiesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Properties</h1>
        <p className="mt-3 text-muted-foreground">
          Browse every available listing on Locus.
        </p>
      </div>

      <PropertyList emptyMessage="No properties found" />
    </main>
  );
}
