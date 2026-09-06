"use client";

import { useState } from "react";
import ResilientImage from "@/components/ui/resilient-image";
import Link from "next/link";
import { ArrowRight, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { PropertyResult } from "./property-result-card";
import { formatIndianPrice } from "./property-carousel-card";
import LocusTake from "./locus-take";

type ComparisonViewProps = {
  properties: PropertyResult[];
  conclusion?: string;
};

export default function ComparisonView({
  properties,
  conclusion,
}: ComparisonViewProps) {
  const [showFullTable, setShowFullTable] = useState(false);
  if (!properties || properties.length < 2) return null;

  const displayProperties = properties.slice(0, 2);
  const fallbackImage = "/property-placeholder.svg";

  return (
    <div className="space-y-3">
      {/* ── MOCKUP STYLE: Compact Side-by-Side Card ── */}
      <div className="rounded-xl border border-[#e5ddd0] bg-white p-3 shadow-2xs">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 divide-x divide-[#e5ddd0]">
          {displayProperties.map((prop, idx) => (
            <div key={prop.id} className={idx > 0 ? "pl-2 sm:pl-3" : ""}>
              <div className="flex items-start gap-2">
                <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-lg bg-[#f2ece0]">
                  <ResilientImage
                    src={prop.image || fallbackImage}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs text-[#1e1b17] truncate" title={prop.title}>
                    {prop.title}
                  </h4>
                  <p className="text-[10px] text-[#7a7268] truncate">
                    {prop.city}{prop.state ? `, ${prop.state}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <div className="font-serif text-xs sm:text-sm font-bold text-[#1e1b17]">
                  {formatIndianPrice(prop.price, prop.listingType)}
                </div>
                <div className="text-[10px] text-[#7a7268] mt-0.5">
                  {prop.bedrooms ? `${prop.bedrooms} BHK` : ""}
                  {prop.bedrooms && prop.area ? " • " : ""}
                  {prop.area ? `${prop.area.toLocaleString()} sq ft` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Comparison Button */}
        <button
          type="button"
          onClick={() => setShowFullTable(!showFullTable)}
          className="locus-touch mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#e5ddd0] bg-[#faf7f2] py-2 text-xs font-semibold text-[#1e1b17] shadow-2xs transition hover:bg-white hover:border-[#b8924a]"
        >
          <BarChart3 size={13} className="text-[#b8924a]" />
          <span>{showFullTable ? "Hide Full Comparison" : "View Full Comparison"}</span>
          {showFullTable ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* ── Expanded Full Table ── */}
      {showFullTable && (
        <div className="overflow-x-auto rounded-xl border border-[#e5ddd0] bg-white shadow-xs animate-in fade-in duration-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ddd0] bg-[#faf7f2]">
                <th className="p-2 sm:p-2.5 font-semibold text-[#7a7268] w-20 sm:w-28 text-[11px]">
                  Feature
                </th>
                {displayProperties.map((prop) => (
                  <th key={prop.id} className="p-2 sm:p-2.5 min-w-[110px] align-top font-semibold text-xs text-[#1e1b17]">
                    {prop.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5ddd0]/60">
              <tr>
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Price</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5 font-serif font-bold text-xs text-[#1e1b17]">
                    {formatIndianPrice(prop.price, prop.listingType)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Bedrooms</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5 text-xs text-[#1e1b17]">
                    {prop.bedrooms} BHK
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Bathrooms</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5 text-xs text-[#1e1b17]">
                    {prop.bathrooms} Baths
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Carpet Area</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5 text-xs text-[#1e1b17]">
                    {prop.area ? `${prop.area.toLocaleString()} sq ft` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Location</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5 text-xs text-[#1e1b17]">
                    {prop.city}{prop.state ? `, ${prop.state}` : ""}
                  </td>
                ))}
              </tr>
              <tr className="bg-[#faf7f2]/50">
                <td className="p-2 sm:p-2.5 font-semibold text-[#7a7268] text-[11px]">Action</td>
                {displayProperties.map((prop) => (
                  <td key={prop.id} className="p-2 sm:p-2.5">
                    <Link
                      href={`/properties/${prop.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-[11px] text-[#b8924a] hover:underline"
                    >
                      View Details <ArrowRight size={10} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

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
