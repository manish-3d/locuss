import { properties } from "@/data/properties";
// The original import was failing: "@/features/property/components/property-card"
// Provide a lightweight local fallback PropertyCard to avoid module resolution errors.
import React from "react";

type Property = {
  id: string | number;
  title?: string;
  image?: string;
  price?: string | number;
  [key: string]: any;
};

function PropertyCard(props: Property) {
  return (
    <article className="rounded-lg border p-4">
      {props.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.image} alt={props.title || "property"} className="mb-3 h-40 w-full object-cover rounded" />
      )}
      <h3 className="text-lg font-semibold">{props.title || "Untitled"}</h3>
      {props.price && <p className="text-muted-foreground">{props.price}</p>}
    </article>
  );
}

export default function FeaturedProperties() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold">
          Featured Properties
        </h2>

        <p className="mt-3 text-muted-foreground">
          Discover homes selected for you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
          />
        ))}
      </div>
    </section>
  );
}