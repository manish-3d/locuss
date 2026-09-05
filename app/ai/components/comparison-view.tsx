"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyResult, formatPrice } from "./property-result-card";
import LocusTake from "./locus-take";

type ComparisonViewProps = {
  properties: PropertyResult[];
  conclusion?: string;
};

export default function ComparisonView({
  properties,
  conclusion,
}: ComparisonViewProps) {
  if (!properties || properties.length < 2) return null;

  // Limit to at most 4 properties for side-by-side readability
  const displayProperties = properties.slice(0, 4);

  // Determine best values for subtle highlighting
  const minPrice = Math.min(...displayProperties.map((p) => p.price));
  const maxArea = Math.max(...displayProperties.map((p) => p.area || 0));
  const maxBedrooms = Math.max(...displayProperties.map((p) => p.bedrooms || 0));
  const maxBathrooms = Math.max(...displayProperties.map((p) => p.bathrooms || 0));

  const fallbackImage =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="space-y-2.5">
      {/* Comparison Table / Grid */}
      <div className="overflow-x-auto rounded-xl border border-[#e5ddd0] bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e5ddd0] bg-[#faf7f2]">
              <th className="p-2 sm:p-2.5 font-semibold text-[#7a7268] w-20 sm:w-28 text-[11px]">
                Feature
              </th>
              {displayProperties.map((prop) => (
                <th key={prop.id} className="p-2 sm:p-2.5 min-w-[110px] sm:min-w-[140px] align-top">
                  <div className="space-y-1.5">
                    <div className="relative h-14 sm:h-16 w-full overflow-hidden rounded-md bg-[#f2ece0]">
                      <Image
                        src={prop.image || fallbackImage}
                        alt={prop.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#1e1b17] line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-[10px] text-[#7a7268] line-clamp-1">
                        {prop.city}{prop.state ? `, ${prop.state}` : ""}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ece0]">
            {/* Price / Rent */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">
                {displayProperties[0].listingType === "RENT" ? "Monthly Rent" : "Price"}
              </td>
              {displayProperties.map((prop) => {
                const isBest = prop.price === minPrice;
                return (
                  <td
                    key={prop.id}
                    className={`p-2 sm:p-2.5 font-bold text-xs ${
                      isBest
                        ? "bg-[#faf7f2] text-[#1e1b17]"
                        : "text-[#1e1b17]"
                    }`}
                  >
                    {formatPrice(prop.price, prop.listingType)}
                    {isBest && (
                      <span className="ml-1 inline-block rounded bg-[#f2ece0] px-1 py-0.5 text-[9px] font-medium text-[#b8924a]">
                        Lower
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Area */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Area</td>
              {displayProperties.map((prop) => {
                const isBest = prop.area && prop.area === maxArea && maxArea > 0;
                return (
                  <td
                    key={prop.id}
                    className={`p-2 sm:p-2.5 text-xs ${isBest ? "bg-[#faf7f2] font-semibold text-[#1e1b17]" : "text-[#524b42]"}`}
                  >
                    {prop.area ? `${prop.area.toLocaleString("en-IN")} sq.ft.` : "—"}
                    {isBest && (
                      <span className="ml-1 inline-block rounded bg-[#f2ece0] px-1 py-0.5 text-[9px] font-medium text-[#b8924a]">
                        Larger
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Bedrooms */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Bedrooms</td>
              {displayProperties.map((prop) => {
                const isBest = prop.bedrooms === maxBedrooms && maxBedrooms > 0;
                return (
                  <td
                    key={prop.id}
                    className={`p-2 sm:p-2.5 text-xs ${isBest ? "bg-[#faf7f2] font-semibold text-[#1e1b17]" : "text-[#524b42]"}`}
                  >
                    {prop.bedrooms} BHK
                  </td>
                );
              })}
            </tr>

            {/* Bathrooms */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Bathrooms</td>
              {displayProperties.map((prop) => {
                const isBest = prop.bathrooms === maxBathrooms && maxBathrooms > 0;
                return (
                  <td
                    key={prop.id}
                    className={`p-2 sm:p-2.5 text-xs ${isBest ? "bg-[#faf7f2] font-semibold text-[#1e1b17]" : "text-[#524b42]"}`}
                  >
                    {prop.bathrooms} Baths
                  </td>
                );
              })}
            </tr>

            {/* Furnishing */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Furnishing</td>
              {displayProperties.map((prop) => (
                <td key={prop.id} className="p-2 sm:p-2.5 text-xs text-[#524b42]">
                  {prop.furnished === true
                    ? "Furnished"
                    : prop.furnished === false
                    ? "Unfurnished"
                    : "Standard"}
                </td>
              ))}
            </tr>

            {/* Property Type */}
            <tr>
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Property Type</td>
              {displayProperties.map((prop) => (
                <td key={prop.id} className="p-2 sm:p-2.5 capitalize text-xs text-[#524b42]">
                  {prop.propertyType ? prop.propertyType.toLowerCase() : "Residential"}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-[#faf7f2]/50">
              <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Details</td>
              {displayProperties.map((prop) => (
                <td key={prop.id} className="p-2 sm:p-2.5">
                  <Link
                    href={`/properties/${prop.id}`}
                    className="inline-flex items-center gap-0.5 font-semibold text-[11px] text-[#b8924a] hover:underline"
                  >
                    View
                    <ArrowRight size={10} />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conclusion / My Pick */}
      {conclusion && (
        <LocusTake
          title="My Pick"
          insight={conclusion}
        />
      )}
    </div>
  );
}
