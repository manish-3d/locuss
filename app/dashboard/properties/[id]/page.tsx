import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const coverImage = property.images[0]?.url ?? null;
  const galleryImages = property.images.slice(1);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{property.title}</h1>
        <p className="mt-2 text-gray-500">
          {property.city}, {property.state}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {/* Cover image */}
          {coverImage ? (
            <div className="relative h-[450px] w-full overflow-hidden rounded-2xl border bg-gray-100">
              <Image
                src={coverImage}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex h-[450px] items-center justify-center rounded-2xl border bg-gray-100 text-gray-400">
              No Images
            </div>
          )}

          {/* Thumbnail gallery */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="relative h-24 overflow-hidden rounded-xl border bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
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

            <p>
              <strong>Type:</strong> {property.listingType}
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
