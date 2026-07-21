import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin } from "lucide-react";

import { getPropertyById } from "@/lib/property";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Image */}
      <div className="relative h-[500px] overflow-hidden rounded-2xl">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <section className="mt-10 space-y-6">
        <div>
          <h1 className="text-5xl font-bold">{property.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin size={18} />
            {property.location}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-primary">
          ₹{property.price.toLocaleString("en-IN")}
        </h2>

        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <BedDouble />
            {property.bedrooms} Bedrooms
          </div>

          <div className="flex items-center gap-2">
            <Bath />
            {property.bathrooms} Bathrooms
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="mb-3 text-2xl font-semibold">Description</h3>

          <p className="leading-8 text-muted-foreground">
            {property.description}
          </p>
        </div>
      </section>
    </main>
  );
}
