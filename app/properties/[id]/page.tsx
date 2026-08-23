import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Bath, BedDouble, MapPin, Building, CheckCircle2, Navigation } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPropertyById } from "@/lib/property";
import { getNearbyProperties } from "@/lib/property-nearby";
import PropertyInteractions from "@/components/property/property-interactions";
import PropertyCard from "@/app/properties/components/property-card";
import PropertyMap from "@/app/properties/components/maps/property-map";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: `${property.title} | Locus`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Increment view count
  await prisma.property.update({
    where: { id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  let isFavorited = false;
  if (session?.user.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: id,
        },
      },
    });
    isFavorited = !!fav;
  }

  const image = property.images[0]?.url ?? "/next.svg";
  const location = `${property.city}, ${property.state}, ${property.country}`;

  // Fetch similar properties
  const similarProperties = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      status: "PUBLISHED",
      OR: [
        { city: property.city },
        { propertyType: property.propertyType },
        { listingType: property.listingType }
      ]
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1
      }
    },
    take: 3,
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch nearby properties if coordinates exist
  let nearbyProperties: any[] = [];
  if (property.latitude != null && property.longitude != null) {
    nearbyProperties = await getNearbyProperties(
      property.latitude,
      property.longitude,
      property.id,
      10, // 10km radius
      3 // Limit to 3
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 space-y-12">
      {/* Title & Header info */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase mb-2">
            For {property.listingType} • {property.propertyType}
          </span>
          <h1 className="text-4xl font-bold">{property.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-gray-500">
            <MapPin size={18} className="text-gray-400" />
            {property.address}, {location}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-semibold">Price</p>
          <h2 className="text-3xl font-extrabold text-blue-600">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative h-[420px] overflow-hidden rounded-2xl md:col-span-2 shadow-md">
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid gap-4">
          {property.images.slice(1, 3).map((img, index) => (
            <div key={img.id || index} className="relative h-[200px] overflow-hidden rounded-2xl shadow-sm">
              <Image src={img.url} alt={`Photo ${index + 2}`} fill className="object-cover" />
            </div>
          ))}
          {property.images.length <= 1 && (
            <div className="flex h-[420px] items-center justify-center rounded-2xl border bg-gray-50 text-gray-400 text-sm font-medium">
              No Additional Images
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:grid-cols-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <BedDouble size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Bedrooms</p>
            <p className="text-lg font-bold">{property.bedrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <Bath size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Bathrooms</p>
            <p className="text-lg font-bold">{property.bathrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <Building size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Area</p>
            <p className="text-lg font-bold">{property.area} sqft</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Furnished</p>
            <p className="text-lg font-bold">{property.furnished ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-4">
        <h3 className="text-2xl font-bold">About Property</h3>
        <p className="leading-relaxed text-gray-600 whitespace-pre-line">{property.description}</p>
      </div>

        {/* Location Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Location</h2>
            {property.latitude != null && property.longitude != null && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}
          </div>
          <p className="text-gray-600">
            {property.address}, {property.city}, {property.state}, {property.country}
          </p>
          {property.latitude != null && property.longitude != null ? (
            <PropertyMap latitude={property.latitude} longitude={property.longitude} title={property.title} />
          ) : (
            <p className="text-sm text-gray-500">Location coordinates not available.</p>
          )}
        </div>

      {/* Interactive Section (Favorites, Inquiries, Reviews) */}
      <PropertyInteractions
        propertyId={property.id}
        isFavorited={isFavorited}
        ownerName={property.owner.name}
        ownerEmail={property.owner.email}
        reviews={property.reviews}
      />
      
      {/* Nearby Properties */}
      {nearbyProperties.length > 0 && (
        <div className="pt-12 border-t space-y-6">
          <h3 className="text-2xl font-bold">Properties Near This Location</h3>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {nearbyProperties.map((simProp) => (
              <div key={simProp.id} className="flex flex-col">
                <PropertyCard
                  id={simProp.id}
                  title={simProp.title}
                  price={simProp.price}
                  city={simProp.city}
                  state={simProp.state}
                  bedrooms={simProp.bedrooms}
                  bathrooms={simProp.bathrooms}
                  area={simProp.area}
                  propertyType={simProp.propertyType}
                  listingType={simProp.listingType}
                  furnished={simProp.furnished}
                  parking={simProp.parking}
                  imageUrl={simProp.imageUrl}
                />
                <p className="mt-2 text-sm text-gray-500 text-center font-medium">
                  {simProp.distance.toFixed(1)} km away
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t space-y-6">
          <h3 className="text-2xl font-bold">Similar Properties</h3>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {similarProperties.map((simProp) => (
              <PropertyCard
                key={simProp.id}
                id={simProp.id}
                title={simProp.title}
                price={simProp.price}
                city={simProp.city}
                state={simProp.state}
                bedrooms={simProp.bedrooms}
                bathrooms={simProp.bathrooms}
                area={simProp.area}
                propertyType={simProp.propertyType}
                listingType={simProp.listingType}
                furnished={simProp.furnished}
                parking={simProp.parking}
                imageUrl={simProp.images[0]?.url || null}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
