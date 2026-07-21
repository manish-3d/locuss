import Image from "next/image";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative h-[500px] overflow-hidden rounded-xl">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="mt-8 text-5xl font-bold">{property.title}</h1>

      <p className="mt-3 text-xl text-muted-foreground">{property.location}</p>

      <p className="mt-6 text-3xl font-bold text-primary">
        ₹{property.price.toLocaleString("en-IN")}
      </p>

      <div className="mt-8 flex gap-10">
        <div>
          <strong>{property.bedrooms}</strong> Bedrooms
        </div>

        <div>
          <strong>{property.bathrooms}</strong> Bathrooms
        </div>
      </div>

      <p className="mt-10 max-w-3xl leading-8 text-muted-foreground">
        {property.description}
      </p>
    </main>
  );
}
