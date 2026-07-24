import PropertyCard from "@/features/property/components/property-card";
import { getProperties } from "@/lib/property";
import { ListingType } from "@prisma/client";

type PropertyListProps = {
  emptyMessage: string;
  listingType?: ListingType;
};

export default async function PropertyList({
  emptyMessage,
  listingType,
}: PropertyListProps) {
  const properties = await getProperties({ listingType });

  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h2 className="text-2xl font-semibold">{emptyMessage}</h2>
        <p className="mt-3 text-muted-foreground">
          Check back soon or add a listing from your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={property.address}
          price={`Rs. ${property.price.toLocaleString("en-IN")}`}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          image={property.images[0]?.url ?? "/next.svg"}
        />
      ))}
    </div>
  );
}
