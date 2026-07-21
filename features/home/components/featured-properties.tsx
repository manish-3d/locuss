import PropertyCard from "@/features/property/components/property-card";
import { getFeaturedProperties } from "@/lib/property";

export default async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold">
          Featured Properties
        </h2>

        <p className="mt-3 text-muted-foreground">
          Explore our latest properties powered by Prisma & PostgreSQL.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="text-2xl font-semibold">
            No Properties Found
          </h3>

          <p className="mt-3 text-muted-foreground">
            Seed the database or create your first property.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price.toString()}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              image={property.image}
            />
          ))}
        </div>
      )}
    </section>
  );
}