import { prisma } from "@/lib/prisma";
import PropertyCard from "./components/property-card";
import FilterSidebar from "./components/filter-sidebar";
import SortSelect from "./components/sort-select";
import Pagination from "./components/pagination";
import ViewToggle from "./components/view-toggle";
import PropertyMapView from "./components/maps/property-map-view";
import { Prisma, ListingType, PropertyType } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    listingType?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    furnished?: string;
    minArea?: string;
    maxArea?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
    view?: string;
  }>;
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const isMapView = params.view === "map";

  // Pagination
  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || "12", 10);
  const skip = isMapView ? undefined : (page - 1) * pageSize;
  const take = isMapView ? undefined : pageSize;

  // Filters
  const where: Prisma.PropertyWhereInput = {
    status: "PUBLISHED",
  };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { address: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
      { state: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
  }

  if (params.listingType) {
    where.listingType = params.listingType as ListingType;
  }

  if (params.propertyType) {
    where.propertyType = params.propertyType as PropertyType;
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = BigInt(params.minPrice);
    if (params.maxPrice) where.price.lte = BigInt(params.maxPrice);
  }

  if (params.bedrooms) {
    where.bedrooms = { gte: parseInt(params.bedrooms, 10) };
  }

  if (params.furnished === "true") {
    where.furnished = true;
  }

  if (params.minArea || params.maxArea) {
    where.area = {};
    if (params.minArea) where.area.gte = parseFloat(params.minArea);
    if (params.maxArea) where.area.lte = parseFloat(params.maxArea);
  }

  // Sorting
  let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort) {
    switch (params.sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "views":
        orderBy = { views: "desc" };
        break;
      case "area":
        orderBy = { area: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.property.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Map data for Map View
  const mapProperties = properties.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    latitude: p.latitude,
    longitude: p.longitude,
    imageUrl: p.images[0]?.url || null,
  }));

  const listingTypeLabel =
    params.listingType === "SALE"
      ? "Properties for Sale"
      : params.listingType === "RENT"
      ? "Properties for Rent"
      : "Explore Properties";

  return (
    <main className="mx-auto w-full max-w-[1536px] 2xl:max-w-[1600px] px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
      {/* Header section — Compact & Proportional */}
      <div className="flex flex-col gap-2.5 sm:gap-3 md:flex-row md:items-center md:justify-between border-b border-[#e5ddd0] pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#ddd5c5] bg-white/70 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#9a8f7e]">
              <span className="text-[#b8924a]">✦</span> Curated Listings
            </span>
            <span className="text-[11px] text-[#7a7268]">
              • Showing {isMapView ? properties.length : `${properties.length} of ${totalCount}`} verified properties
            </span>
          </div>
          <h1 className="mt-1 font-serif text-xl sm:text-2xl lg:text-[1.85rem] font-bold tracking-tight text-[#1e1b17]">
            {listingTypeLabel}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {!isMapView && <SortSelect />}
          <ViewToggle />
        </div>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-col gap-3.5 lg:gap-4 lg:flex-row lg:items-start">
        {/* Sidebar Filters — Sleek & Compact */}
        <aside className="w-full lg:w-52 xl:w-56 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Content Area — 4 Cards In A Row on Desktop */}
        <div className="flex-1 min-w-0">
          {properties.length > 0 ? (
            isMapView ? (
              <PropertyMapView properties={mapProperties} />
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    city={property.city}
                    state={property.state}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    propertyType={property.propertyType}
                    listingType={property.listingType}
                    furnished={property.furnished}
                    parking={property.parking}
                    imageUrl={property.images[0]?.url || null}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#e5ddd0] bg-white p-6 text-center shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2ece0] text-[#b8924a] mb-2 text-sm">
                ✦
              </div>
              <h3 className="font-serif text-base font-semibold text-[#1e1b17]">
                No properties matched your criteria
              </h3>
              <p className="mt-1 text-xs text-[#7a7268] max-w-sm">
                Try widening your price range, clearing filters, or exploring nearby locations.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isMapView && <Pagination currentPage={page} totalPages={totalPages} />}
        </div>
      </div>
    </main>
  );
}
