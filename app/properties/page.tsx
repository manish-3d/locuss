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
  const pageSize = parseInt(params.pageSize || "9", 10);
  // Do not paginate on map view so we see all matching markers
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Explore Properties</h1>
          <p className="mt-2 text-gray-500">
            Showing {isMapView ? properties.length : `${properties.length} of ${totalCount}`} properties
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!isMapView && <SortSelect />}
          <ViewToggle />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {properties.length > 0 ? (
            isMapView ? (
              <PropertyMapView properties={mapProperties} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed text-gray-500">
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination (only in list view) */}
          {!isMapView && <Pagination currentPage={page} totalPages={totalPages} />}
        </div>
      </div>
    </main>
  );
}
