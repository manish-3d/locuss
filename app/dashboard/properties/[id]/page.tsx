import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
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
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{property.title}</h1>

        <p className="mt-2 text-gray-500">
          {property.city}, {property.state}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex h-[450px] items-center justify-center rounded-2xl border bg-gray-100">
            Property Images
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border p-6">
          <h2 className="text-2xl font-semibold">Property Info</h2>

          <div className="space-y-3">
            <p>
              <strong>Price:</strong> ₹
              {Number(property.price).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Bedrooms:</strong> {property.bedrooms}
            </p>

            <p>
              <strong>Bathrooms:</strong> {property.bathrooms}
            </p>

            <p>
              <strong>Area:</strong> {property.area} sqft
            </p>

            <p>
              <strong>Status:</strong> {property.status}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-8">
        <h2 className="text-2xl font-semibold">Description</h2>

        <p className="mt-4 leading-8 text-gray-600">{property.description}</p>
      </div>
    </div>
  );
}
