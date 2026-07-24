import PropertyList from "@/components/property-list";

export default function RentPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Rent</h1>
        <p className="mt-3 text-muted-foreground">
          Explore properties currently available for rent.
        </p>
      </div>

      <PropertyList listingType="RENT" emptyMessage="No rentals found" />
    </main>
  );
}
