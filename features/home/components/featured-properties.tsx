import PropertyCard from "@/app/properties/components/property-card";
import { getFeaturedProperties } from "@/lib/property";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProperties() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mx-auto max-w-7xl overflow-hidden border-t border-[#e5ddd0] px-3 py-10 sm:px-6 sm:py-24">
      <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c5] bg-white/70 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a8f7e] mb-3">
          <span className="text-[#b8924a]">✦</span> Curated Portfolio
        </span>

        <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17] sm:text-4xl lg:text-[2.6rem]">
          Featured Residences
        </h2>

        <p className="mt-2.5 text-xs sm:text-sm text-[#7a7268] leading-relaxed">
          Explore exceptional architectural residences, luxury apartments, and prime estates curated by Locus.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5ddd0] bg-white p-12 text-center shadow-xs">
          <h3 className="font-serif text-xl font-semibold text-[#1e1b17]">
            No Featured Properties Found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
            Browse all listings or add a new property from your dashboard.
          </p>
          <Link
            href="/properties"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1e1b17] px-5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-black"
          >
            Explore All Properties
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          <div className="locus-scroll-x grid grid-flow-col auto-cols-[82%] gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3">
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

          <div className="mt-12 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd0] bg-white px-7 py-3 text-xs sm:text-sm font-medium text-[#1e1b17] transition-all hover:border-[#b8924a] hover:bg-[#b8924a]/5 shadow-xs"
            >
              Browse All Properties
              <ArrowRight size={14} className="text-[#b8924a]" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
