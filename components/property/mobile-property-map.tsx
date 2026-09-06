"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  MapPin,
  Bed,
  Bath,
  Square,
  Box,
  Heart,
  Check,
  X,
} from "lucide-react";
import { formatPrice } from "@/app/properties/components/property-card";
import { MobileFilterSheet } from "./mobile-filter-sheet";

export interface MobileMapProperty {
  id: string;
  title: string;
  price: bigint | number;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  listingType?: string;
}

interface MobilePropertyMapProps {
  properties: MobileMapProperty[];
  totalCount?: number;
}

export function MobilePropertyMap({
  properties = [],
  totalCount = properties.length,
}: MobilePropertyMapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<MobileMapProperty | null>(
    properties[0] || null
  );
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter properties that have valid latitude & longitude, or fallback coordinates around Gurgaon/Delhi
  const validProperties = properties.map((p, index) => {
    // Default fallback offsets around Gurgaon if coordinates are missing
    const lat = p.latitude ?? (28.4595 + (index % 4) * 0.03 - 0.05);
    const lng = p.longitude ?? (77.0266 + (index % 3) * 0.04 - 0.04);
    return { ...p, latitude: lat, longitude: lng };
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || "get_your_own_OpIi9ZULNHzrESv6T2vL";

    if (!map.current) {
      const initialCenter: [number, number] = [
        validProperties[0]?.longitude ?? 77.0266,
        validProperties[0]?.latitude ?? 28.4595,
      ];

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: apiKey
          ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`
          : "https://demotiles.maplibre.org/style.json",
        center: initialCenter,
        zoom: 12,
      });

      map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    }

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add custom Price Pin HTML markers matching design board
    validProperties.forEach((prop) => {
      if (prop.latitude == null || prop.longitude == null) return;

      const isSelected = selectedProperty?.id === prop.id;

      const el = document.createElement("div");
      el.className = `cursor-pointer transition-transform duration-200 ${
        isSelected ? "scale-110 z-20" : "hover:scale-105 z-10"
      }`;
      el.innerHTML = `
        <div class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-md border-2 ${
          isSelected
            ? "bg-[#b8924a] text-white border-white"
            : "bg-[#1e1b17] text-white border-white"
        }">
          <span>${formatPrice(prop.price, prop.listingType)}</span>
        </div>
      `;

      el.addEventListener("click", () => {
        setSelectedProperty(prop);
        map.current?.flyTo({
          center: [prop.longitude!, prop.latitude!],
          zoom: 13,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([prop.longitude, prop.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [validProperties, selectedProperty?.id]);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-[#faf7f2] md:hidden">
      {/* ── 1. Top Floating Search & Filter Bar ── */}
      <div className="absolute top-2.5 inset-x-3 z-20 space-y-2">
        <div className="flex items-center gap-2">
          <Link
            href="/properties"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] shadow-md hover:bg-[#faf7f2]"
            aria-label="Back to list view"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex-1 flex items-center rounded-xl border border-[#e5ddd0] bg-white px-3 py-2.5 shadow-md">
            <Search className="h-4 w-4 text-[#7a7268] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search this area…"
              className="w-full text-xs text-[#1e1b17] placeholder:text-[#9a8f7e] outline-none bg-transparent"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5ddd0] bg-white text-[#1e1b17] shadow-md hover:bg-[#faf7f2]"
            title="Open Filters"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#524b42]" />
          </button>
        </div>

        {/* Quick Filter Chips on Map */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="rounded-full bg-[#1e1b17] px-3 py-1 text-[11px] font-semibold text-white shadow-md shrink-0"
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="rounded-full border border-[#e5ddd0] bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#1e1b17] shadow-md shrink-0 backdrop-blur-xs"
          >
            Villa
          </button>
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="rounded-full border border-[#e5ddd0] bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#1e1b17] shadow-md shrink-0 backdrop-blur-xs"
          >
            ₹50L – 2Cr
          </button>
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="rounded-full border border-[#e5ddd0] bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#1e1b17] shadow-md shrink-0 backdrop-blur-xs"
          >
            3 BHK
          </button>
        </div>
      </div>

      {/* ── 2. Fullscreen Interactive Map ── */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* ── 3. Bottom Property Preview Sheet ── */}
      {selectedProperty && (
        <div className="absolute bottom-20 inset-x-3 z-30 animate-in slide-in-from-bottom duration-200">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd0] bg-white p-3 shadow-xl backdrop-blur-md">
            <div className="flex gap-3">
              {/* Image thumbnail */}
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f2ece0]">
                {selectedProperty.imageUrl ? (
                  <Image
                    src={selectedProperty.imageUrl}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] text-[#7a7268]">
                    No image
                  </div>
                )}
                <span className="absolute top-1 left-1 rounded-full bg-[#1e1b17]/90 px-1 py-0.5 text-[8px] font-bold text-white">
                  3D
                </span>
              </div>

              {/* Property Details */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <p className="font-serif text-sm font-bold text-[#1e1b17]">
                    {formatPrice(selectedProperty.price, selectedProperty.listingType)}
                  </p>
                  <h3 className="line-clamp-1 font-serif text-xs font-semibold text-[#1e1b17]">
                    {selectedProperty.title}
                  </h3>
                  <p className="flex items-center gap-0.5 text-[10px] text-[#7a7268] truncate">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-[#a39a8c]" />
                    <span className="truncate">
                      {selectedProperty.city || "Gurgaon"}, {selectedProperty.state || "Haryana"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#524b42]">
                  <span className="font-medium">{selectedProperty.bedrooms ?? 4} beds</span>
                  <span>•</span>
                  <span className="font-medium">{selectedProperty.bathrooms ?? 4} baths</span>
                  <span>•</span>
                  <span className="font-medium">{selectedProperty.area ?? 280} m²</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#f2ece0]">
              <Link
                href={`/properties/${selectedProperty.id}`}
                className="flex-1 flex items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] py-2 text-xs font-semibold text-[#1e1b17] hover:bg-white transition-colors"
              >
                View Details
              </Link>

              <Link
                href={`/properties/${selectedProperty.id}?tab=3dtour`}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#1e1b17] py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2b241e] transition-colors"
              >
                <Box className="h-3.5 w-3.5 text-[#b8924a]" />
                <span>Explore in 3D</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      <MobileFilterSheet
        totalCount={totalCount}
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
      />
    </div>
  );
}
