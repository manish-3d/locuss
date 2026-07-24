import PropertyList from "@/components/property-list";

export default function BuyPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Buy</h1>
        <p className="mt-3 text-muted-foreground">
          Find homes and properties listed for sale.
        </p>
      </div>

      <PropertyList listingType="SALE" emptyMessage="No properties for sale" />
    </main>
  );
}
