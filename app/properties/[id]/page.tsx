import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Bath, BedDouble, MapPin, Building, CheckCircle2, Navigation } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPropertyById } from "@/lib/property";
import { getNearbyProperties } from "@/lib/property-nearby";
import PropertyInteractions from "@/components/property/property-interactions";
import PropertyCard, { formatPrice } from "@/app/properties/components/property-card";
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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Title & Header info */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[#e5ddd0] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c5] bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9a8f7e] mb-2.5">
            <span className="text-[#b8924a]">✦</span> For {property.listingType === "SALE" ? "Sale" : "Rent"} • {property.propertyType}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1e1b17] leading-tight">
            {property.title}
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-[#7a7268]">
            <MapPin size={14} className="text-[#b8924a] shrink-0" />
            <span>{property.address}, {location}</span>
          </div>
        </div>

        <div className="md:text-right shrink-0">
          <p className="text-[11px] text-[#7a7268] uppercase font-semibold tracking-wider">Guide Price</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1e1b17]">
            {formatPrice(property.price, property.listingType)}
          </h2>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative h-[320px] sm:h-[420px] overflow-hidden rounded-2xl md:col-span-2 border border-[#e5ddd0] shadow-sm bg-[#f2ece0]">
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
            <div key={img.id || index} className="relative h-[155px] sm:h-[200px] overflow-hidden rounded-2xl border border-[#e5ddd0] shadow-sm bg-[#f2ece0]">
              <Image src={img.url} alt={`Photo ${index + 2}`} fill className="object-cover" />
            </div>
          ))}
          {property.images.length <= 1 && (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-[#e5ddd0] bg-white text-[#7a7268] text-xs font-medium">
              No Additional Photos
            </div>
          )}
        </div>
      </div>

      {/* Overview Specs Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl border border-[#e5ddd0] bg-white p-4 sm:p-6 shadow-xs sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] border border-[#e5ddd0]/60 p-3 sm:p-3.5">
          <div className="rounded-lg bg-white p-2 text-[#b8924a] border border-[#e5ddd0]/50 shadow-xs">
            <BedDouble size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#7a7268] uppercase font-semibold tracking-wider">Bedrooms</p>
            <p className="font-serif text-base sm:text-lg font-bold text-[#1e1b17]">{property.bedrooms} Beds</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] border border-[#e5ddd0]/60 p-3 sm:p-3.5">
          <div className="rounded-lg bg-white p-2 text-[#b8924a] border border-[#e5ddd0]/50 shadow-xs">
            <Bath size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#7a7268] uppercase font-semibold tracking-wider">Bathrooms</p>
            <p className="font-serif text-base sm:text-lg font-bold text-[#1e1b17]">{property.bathrooms} Baths</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] border border-[#e5ddd0]/60 p-3 sm:p-3.5">
          <div className="rounded-lg bg-white p-2 text-[#b8924a] border border-[#e5ddd0]/50 shadow-xs">
            <Building size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#7a7268] uppercase font-semibold tracking-wider">Area</p>
            <p className="font-serif text-base sm:text-lg font-bold text-[#1e1b17]">{property.area} sqft</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#faf7f2] border border-[#e5ddd0]/60 p-3 sm:p-3.5">
          <div className="rounded-lg bg-white p-2 text-[#b8924a] border border-[#e5ddd0]/50 shadow-xs">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#7a7268] uppercase font-semibold tracking-wider">Furnished</p>
            <p className="font-serif text-base sm:text-lg font-bold text-[#1e1b17]">{property.furnished ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs space-y-3">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1e1b17]">About Property</h3>
        <p className="leading-relaxed text-xs sm:text-sm text-[#524b42] whitespace-pre-line">{property.description}</p>
      </div>

      {/* Location Section */}
      <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1e1b17]">Location</h2>
            <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
              {property.address}, {property.city}, {property.state}, {property.country}
            </p>
          </div>
          {property.latitude != null && property.longitude != null && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-4 py-2 text-xs font-semibold text-[#1e1b17] transition hover:border-[#b8924a] hover:bg-white"
            >
              <Navigation size={14} className="text-[#b8924a]" />
              Get Directions
            </a>
          )}
        </div>
        {property.latitude != null && property.longitude != null ? (
          <PropertyMap latitude={property.latitude} longitude={property.longitude} title={property.title} />
        ) : (
          <p className="text-xs text-[#7a7268]">Location coordinates not available for map rendering.</p>
        )}
      </div>

      {/* Interactive Section (Favorites, Inquiries, Reviews) */}
      <PropertyInteractions
        propertyId={property.id}
        isFavorited={isFavorited}
        ownerName={property.owner?.name || "Property Owner"}
        ownerEmail={property.owner?.email || ""}
        reviews={property.reviews || []}
      />
      
      {/* Nearby Properties */}
      {nearbyProperties.length > 0 && (
        <div className="pt-8 border-t border-[#e5ddd0] space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1e1b17]">Properties Near This Location</h3>
            <p className="text-xs sm:text-sm text-[#7a7268] mt-0.5">Explore neighboring homes within 10 km</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                <p className="mt-1.5 text-xs text-[#7a7268] text-center font-medium">
                  {simProp.distance.toFixed(1)} km away
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-8 border-t border-[#e5ddd0] space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1e1b17]">Similar Properties</h3>
            <p className="text-xs sm:text-sm text-[#7a7268] mt-0.5">Other curated listings you might like</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
