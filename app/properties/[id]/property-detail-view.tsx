"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import ResilientImage from "@/components/ui/resilient-image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Box,
  ShieldCheck,
  Bed,
  Bath,
  Square,
  Compass,
  Calendar,
  Phone,
  MessageSquare,
  MapPin,
  ArrowRight,
  Waves,
  Trees,
  SquareParking,
  Cpu,
  Building2,
  Zap,
  PawPrint,
  Car,
  Plane,
  Train,
  Star,
  Check,
  Maximize2,
  Layers,
  Sparkles,
  Wifi,
  Wind,
  Lock,
} from "lucide-react";
import PropertyCard, { formatPrice } from "../components/property-card";
import PropertyInteractions from "@/components/property/property-interactions";
import PropertyMap from "../components/maps/property-map";
import { ScheduleVisitModal } from "@/components/property/schedule-visit-modal";

const SpatialWorkspace = dynamic(
  () => import("@/components/spatial").then((mod) => mod.SpatialWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[540px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-6 text-center">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white shadow-xs">
          <Box className="h-6 w-6 animate-pulse text-[#b8924a]" />
        </div>
        <div>
          <p className="font-serif text-base font-semibold text-[#1e1b17]">
            Loading 3D Digital Twin
          </p>
          <p className="mt-0.5 text-xs text-[#7a7268]">
            Initializing interactive property model…
          </p>
        </div>
      </div>
    ),
  }
);

interface PropertyImageItem {
  id?: string;
  url: string;
}

interface PropertyDetailViewProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: bigint | number;
    listingType: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    parking?: number | null;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    images: PropertyImageItem[];
    owner?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
    reviews?: any[];
    createdAt?: Date | string;
  };
  isFavorited?: boolean;
  similarProperties?: any[];
  nearbyProperties?: any[];
}

export function PropertyDetailView({
  property,
  isFavorited = false,
  similarProperties = [],
  nearbyProperties = [],
}: PropertyDetailViewProps) {
  // Gallery & Tab state
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "keydetails"
    | "amenities"
    | "location"
    | "floorplan"
    | "3dtour"
    | "reviews"
    | "inquiries"
  >("overview");
  const [floorPlanLevel, setFloorPlanLevel] = useState<"ground" | "first">("ground");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSaved, setIsSaved] = useState(isFavorited);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Photos list
  const photos =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.url)
      : [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80",
        ];

  const totalPhotos = Math.max(photos.length, 12);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {}
  };

  return (
    <main className="locus-property-detail min-h-screen overflow-hidden bg-[#fbf9f5] pb-10 pt-3 sm:pb-16 sm:pt-6">
      <div className="mx-auto max-w-7xl space-y-4 px-3 sm:space-y-6 sm:px-6 lg:px-8">
        {/* ── 1. Top Action Navigation Bar ── */}
        <div className="flex items-center justify-between">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-[#1e1b17] hover:text-[#b8924a] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Properties</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="locus-touch inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-white px-3 py-1.5 text-xs font-medium text-[#1e1b17] shadow-2xs transition-colors hover:bg-[#faf7f2] sm:px-3.5"
            >
              <Share2 className="h-3.5 w-3.5 text-[#7a7268]" />
              <span className="hidden sm:inline">{copiedShare ? "Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`locus-touch inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors sm:px-3.5 ${
                isSaved
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-[#e5ddd0] bg-white text-[#1e1b17] hover:bg-[#faf7f2]"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  isSaved ? "fill-rose-500 text-rose-500" : "text-[#7a7268]"
                }`}
              />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              className="locus-touch inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5ddd0] bg-white text-[#7a7268] shadow-2xs transition-colors hover:bg-[#faf7f2]"
              title="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── 2. Hero Section: Split Gallery (Left) & Key Specs (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Hero Gallery (~60% = 7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-3">
            {/* Main Carousel Viewport */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#e5ddd0] bg-[#f2ece0] shadow-sm sm:aspect-[16/10]">
              <ResilientImage
                src={photos[activePhotoIndex] || photos[0]}
                alt={property.title}
                fill
                priority
                className="object-cover transition-all duration-300"
              />

              {/* Top-Left Featured Badge */}
              <div className="absolute left-3.5 top-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf7f2]/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#1e1b17] shadow-xs border border-[#e5ddd0]">
                  <span className="text-[#b8924a]">★</span>
                  <span>Featured</span>
                </span>
              </div>

              {/* Prev / Next Carousel Controls */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#1e1b17] shadow-md hover:bg-white hover:scale-105 transition-all"
                title="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#1e1b17] shadow-md hover:bg-white hover:scale-105 transition-all"
                title="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Bottom-Left Photo Counter */}
              <div className="absolute bottom-3.5 left-3.5 z-10">
                <span className="rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white tracking-wide">
                  {activePhotoIndex + 1} / {totalPhotos}
                </span>
              </div>

              {/* Bottom-Right "Explore in 3D" Button */}
              <div className="absolute bottom-3.5 right-3.5 z-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("3dtour")}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1e1b17]/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-md border border-white/20 hover:bg-[#1e1b17] hover:scale-105 transition-all"
                >
                  <Box className="h-3.5 w-3.5 text-[#dfc99a] transition-transform group-hover:rotate-12" />
                  <span>Explore in 3D</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Strip (Row of 6 photos) */}
            <div className="grid grid-cols-6 gap-2">
              {photos.slice(0, 6).map((imgUrl, idx) => {
                const isActive = idx === activePhotoIndex;
                const isLast = idx === 5;
                const remainingCount = totalPhotos - 6;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative aspect-[16/10] overflow-hidden rounded-xl border transition-all ${
                      isActive
                        ? "border-[#b8924a] ring-2 ring-[#b8924a]/50 scale-[1.02]"
                        : "border-[#e5ddd0] opacity-85 hover:opacity-100"
                    }`}
                  >
                    <ResilientImage
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {isLast && remainingCount > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-serif text-sm font-bold text-white">
                        +{remainingCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Hero Specs (~40% = 5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-4">
            {/* Header Title & Guide Price Row */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4eee2] px-2.5 py-0.5 text-[11px] font-medium text-[#8c7755]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#b8924a]" />
                  <span>Verified Property</span>
                </div>

                <div className="text-right">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1e1b17]">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  <p className="text-[10px] text-[#7a7268] uppercase tracking-wider font-semibold">
                    Guide Price
                  </p>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#1e1b17] leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7a7268]">
                <MapPin className="h-3.5 w-3.5 text-[#b8924a] shrink-0" />
                <span>
                  {property.address}, {property.city}, {property.state}
                </span>
              </div>
            </div>

            {/* 4 Stat Badges Row */}
            <div className="detail-stat-grid grid grid-cols-2 gap-2 py-1 sm:grid-cols-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 text-center shadow-2xs">
                <Bed className="h-4 w-4 text-[#7a7268] mb-1" />
                <span className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                  {property.bedrooms}
                </span>
                <span className="text-[10px] text-[#7a7268] uppercase tracking-wider font-medium">
                  Bedrooms
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 text-center shadow-2xs">
                <Bath className="h-4 w-4 text-[#7a7268] mb-1" />
                <span className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                  {property.bathrooms}
                </span>
                <span className="text-[10px] text-[#7a7268] uppercase tracking-wider font-medium">
                  Bathrooms
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 text-center shadow-2xs">
                <Square className="h-4 w-4 text-[#7a7268] mb-1" />
                <span className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                  {Number(property.area).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-[#7a7268] uppercase tracking-wider font-medium">
                  sqft
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 text-center shadow-2xs">
                <Compass className="h-4 w-4 text-[#7a7268] mb-1" />
                <span className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                  East
                </span>
                <span className="text-[10px] text-[#7a7268] uppercase tracking-wider font-medium">
                  Facing
                </span>
              </div>
            </div>

            {/* Description Snippet with Read More Toggle */}
            <div className="space-y-1 text-xs sm:text-sm text-[#524b42] leading-relaxed">
              <p className={isDescriptionExpanded ? "" : "line-clamp-3"}>
                {property.description}
              </p>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-xs font-semibold text-[#1e1b17] hover:text-[#b8924a] transition-colors"
              >
                {isDescriptionExpanded ? "Read less ▴" : "Read more ▾"}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3d332a] px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#2b241e] transition-colors"
              >
                <Calendar className="h-4 w-4 text-[#dfc99a]" />
                <span>Schedule a Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#3d332a] bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-[#3d332a] hover:bg-[#faf7f2] transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Agent</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Clean Interactive Navigation Bar ── */}
        <div className="sticky top-16 z-20 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e5ddd0] pt-2">
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
            {[
              { id: "overview", label: "Overview" },
              { id: "keydetails", label: "Key Details" },
              { id: "amenities", label: "Amenities" },
              { id: "location", label: "Location & Commute" },
              { id: "floorplan", label: "Floor Plan" },
              { id: "3dtour", label: "3D Tour", is3D: true },
              { id: "reviews", label: `Reviews (${property.reviews?.length || 24})` },
              { id: "inquiries", label: "Contact Agent" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "border-b-2 border-[#1e1b17] text-[#1e1b17] font-bold"
                      : "text-[#7a7268] hover:text-[#1e1b17] font-medium"
                  }`}
                >
                  {tab.is3D && <Box className="h-3.5 w-3.5 text-[#b8924a]" />}
                  <span>{tab.label}</span>
                  {tab.is3D && (
                    <span className="rounded-full bg-[#f4eee2] px-1.5 py-0.2 text-[9px] font-bold text-[#8c7755]">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── 4. Dedicated Views for Each Tab ── */}

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 1. At a Glance: Horizontal Specs Ribbon */}
            <div className="rounded-3xl border border-[#e5ddd0] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f2ece0]">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1e1b17]">
                    Property at a Glance
                  </h3>
                  <p className="text-xs text-[#7a7268]">
                    Essential architectural specifications and verified status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("keydetails")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#8c7755] hover:text-[#1e1b17] transition-colors"
                >
                  <span>View full specifications in Key Details</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 text-center">
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Type</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] capitalize mt-0.5">
                    {property.propertyType.toLowerCase()}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Status</p>
                  <p className="font-serif text-sm font-bold text-emerald-700 mt-0.5">Ready to Move</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Furnishing</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] mt-0.5">
                    {property.furnished ? "Furnished" : "Semi-Furnished"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Plot Area</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] mt-0.5">
                    {Math.round(property.area * 1.25)} sqft
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Built-up</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] mt-0.5">
                    {property.area} sqft
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Total Floors</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] mt-0.5">2 Floors</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <p className="text-[10px] text-[#7a7268] uppercase font-semibold">Possession</p>
                  <p className="font-serif text-sm font-bold text-[#1e1b17] mt-0.5">Immediate</p>
                </div>
              </div>
            </div>

            {/* 2. Three Feature Preview Cards: Amenities, Location, 3D Tour */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Amenities Preview */}
              <div
                onClick={() => setActiveTab("amenities")}
                className="group rounded-3xl border border-[#e5ddd0] bg-white p-6 shadow-xs hover:border-[#b8924a]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#faf7f2] border border-[#e5ddd0] text-[#8c7755]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#1e1b17]">
                        Lifestyle Amenities
                      </h4>
                    </div>
                    <span className="rounded-full bg-[#f4eee2] px-2 py-0.5 text-[10px] font-bold text-[#8c7755]">
                      12 Verified
                    </span>
                  </div>

                  <p className="text-xs text-[#524b42] leading-relaxed">
                    Designed for comfort and leisure, including private pool, landscaped gardens, and smart home automation.
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Waves className="h-3.5 w-3.5 text-[#8c7755] mb-1" />
                      <span className="text-[9px] font-medium text-[#1e1b17]">Pool</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Trees className="h-3.5 w-3.5 text-[#8c7755] mb-1" />
                      <span className="text-[9px] font-medium text-[#1e1b17]">Garden</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Cpu className="h-3.5 w-3.5 text-[#8c7755] mb-1" />
                      <span className="text-[9px] font-medium text-[#1e1b17]">Smart</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#8c7755] mb-1" />
                      <span className="text-[9px] font-medium text-[#1e1b17]">Security</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f2ece0] flex items-center justify-between text-xs font-semibold text-[#8c7755] group-hover:text-[#1e1b17]">
                  <span>Explore all amenities</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 2: Location & Commute Preview */}
              <div
                onClick={() => setActiveTab("location")}
                className="group rounded-3xl border border-[#e5ddd0] bg-white p-6 shadow-xs hover:border-[#b8924a]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#faf7f2] border border-[#e5ddd0] text-[#8c7755]">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#1e1b17]">
                        Location &amp; Commute
                      </h4>
                    </div>
                    <span className="text-xs text-[#7a7268]">{property.city}</span>
                  </div>

                  <p className="text-xs text-[#524b42] leading-relaxed line-clamp-2">
                    Located in {property.address}, {property.city} with outstanding connectivity to metro, commercial centers, and highways.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Train className="h-3.5 w-3.5 text-[#8c7755] mx-auto mb-1" />
                      <p className="font-bold text-[#1e1b17]">Metro</p>
                      <p className="text-[#7a7268]">8 min</p>
                    </div>
                    <div className="rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Building2 className="h-3.5 w-3.5 text-[#8c7755] mx-auto mb-1" />
                      <p className="font-bold text-[#1e1b17]">Cyber Hub</p>
                      <p className="text-[#7a7268]">10 min</p>
                    </div>
                    <div className="rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-2">
                      <Plane className="h-3.5 w-3.5 text-[#8c7755] mx-auto mb-1" />
                      <p className="font-bold text-[#1e1b17]">Airport</p>
                      <p className="text-[#7a7268]">28 min</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f2ece0] flex items-center justify-between text-xs font-semibold text-[#8c7755] group-hover:text-[#1e1b17]">
                  <span>View interactive map &amp; transit</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Card 3: Interactive 3D Digital Twin Promo */}
              <div
                onClick={() => setActiveTab("3dtour")}
                className="group rounded-3xl border border-[#e5ddd0] bg-white overflow-hidden shadow-xs hover:border-[#b8924a]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece0]">
                  <ResilientImage
                    src={photos[1] || photos[0]}
                    alt="3D Experience"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1b17]/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      <Box className="h-3 w-3 text-[#dfc99a]" />
                      <span>Interactive Twin</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3d332a] text-white">
                      <Box className="h-4 w-4 text-[#dfc99a]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1e1b17] leading-snug">
                        Experience in 3D
                      </h4>
                      <p className="text-[11px] text-[#7a7268]">
                        Walk rooms &amp; get AI guidance
                      </p>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3d332a] text-white transition-all group-hover:bg-[#b8924a] group-hover:scale-110">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bottom Row: Agent Strip & Buyer Testimonial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Quick Contact Strip */}
              <div className="rounded-3xl border border-[#e5ddd0] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-[#e5ddd0] bg-[#f2ece0]">
                    <ResilientImage
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                      alt="Priya Mehta"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
                        {property.owner?.name || "Priya Mehta"}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                        <Check className="h-2.5 w-2.5" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#7a7268]">Senior Property Advisor</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("inquiries")}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#3d332a] bg-white px-3.5 py-2 text-xs font-semibold text-[#3d332a] hover:bg-[#faf7f2] transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("inquiries")}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#3d332a] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2b241e] transition-colors"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#dfc99a]" />
                    <span>Schedule Visit</span>
                  </button>
                </div>
              </div>

              {/* Buyer Testimonial Strip */}
              <div className="rounded-3xl border border-[#e5ddd0] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden border border-[#e5ddd0]">
                    <ResilientImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Rohan K."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-xs sm:text-sm font-bold text-[#1e1b17]">Rohan K.</p>
                      <span className="text-[10px] font-semibold text-emerald-700">✓ Verified Buyer</span>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#524b42] italic mt-0.5 line-clamp-1 sm:line-clamp-2">
                      &ldquo;Excellent property and great location. The 3D tour helped us a lot in our buying decision.&rdquo;
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className="shrink-0 text-xs font-semibold text-[#8c7755] hover:underline"
                >
                  Read all 24 reviews →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: KEY DETAILS ── */}
        {activeTab === "keydetails" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece0] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                  Key Property Specifications &amp; Architectural Records
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  Verified structural data, ownership details, and spatial dimensions.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <Check className="h-3.5 w-3.5" />
                <span>Verified Documentation</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Full Specifications Table */}
              <div className="lg:col-span-8 rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-6 space-y-4">
                <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                  Comprehensive Property Records
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Property Type</span>
                    <span className="font-semibold text-[#1e1b17] capitalize">
                      {property.propertyType.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Status</span>
                    <span className="font-semibold text-emerald-700">Ready to Move</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Furnishing</span>
                    <span className="font-semibold text-[#1e1b17]">
                      {property.furnished ? "Furnished" : "Semi-Furnished"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Total Floors</span>
                    <span className="font-semibold text-[#1e1b17]">2 Floors</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Plot Area</span>
                    <span className="font-semibold text-[#1e1b17]">
                      {Math.round(property.area * 1.25)} sqft
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Built-up Area</span>
                    <span className="font-semibold text-[#1e1b17]">{property.area} sqft</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Bedrooms / Bathrooms</span>
                    <span className="font-semibold text-[#1e1b17]">
                      {property.bedrooms} Beds / {property.bathrooms} Baths
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Facing / Orientation</span>
                    <span className="font-semibold text-[#1e1b17]">East (Vastu Compliant)</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Car Parking</span>
                    <span className="font-semibold text-[#1e1b17]">
                      {property.parking || 2} Covered Bays
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Possession</span>
                    <span className="font-semibold text-[#1e1b17]">Immediate</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Ownership Type</span>
                    <span className="font-semibold text-[#1e1b17]">Freehold</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">RERA Registration</span>
                    <span className="font-semibold text-[#1e1b17]">RC/REP/HARERA/GGM/2023/84</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Valuation Card */}
              <div className="lg:col-span-4 rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                    Pricing &amp; Valuation
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#e5ddd0]">
                      <span className="text-[#7a7268]">Guide Price</span>
                      <span className="font-serif text-base font-bold text-[#1e1b17]">
                        {formatPrice(property.price, property.listingType)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#e5ddd0]">
                      <span className="text-[#7a7268]">Price per sqft</span>
                      <span className="font-semibold text-[#1e1b17]">
                        ₹{Math.round(Number(property.price) / (property.area || 1)).toLocaleString("en-IN")} / sqft
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#e5ddd0]">
                      <span className="text-[#7a7268]">Estimated Maintenance</span>
                      <span className="font-semibold text-[#1e1b17]">₹4,500 / month</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#7a7268]">Registration &amp; Stamp Duty</span>
                      <span className="font-semibold text-[#1e1b17]">Estimated ~6%</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("inquiries")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3d332a] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#2b241e] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#dfc99a]" />
                  <span>Request Full Price Sheet</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: LOCATION & COMMUTE ── */}
        {activeTab === "location" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece0] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                  Location &amp; Commute Highlights
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  {property.address}, {property.city}, {property.state}, {property.country}
                </p>
              </div>

              {property.latitude && property.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-semibold text-[#1e1b17] hover:border-[#b8924a] hover:bg-white transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#b8924a]" />
                  <span>Open in Google Maps →</span>
                </a>
              )}
            </div>

            {/* Big Interactive Map Canvas */}
            <div className="relative aspect-[21/9] min-h-[260px] w-full overflow-hidden rounded-2xl border border-[#e5ddd0] bg-[#f2ece0]">
              {property.latitude && property.longitude ? (
                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#7a7268]">
                  Map View Available
                </div>
              )}
            </div>

            {/* Transit Commute Highlights Grid */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                Commute &amp; Travel Times
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <Train className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">Rapid Metro</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">8 min</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <Building2 className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">Cyber Hub</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">10 min</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <Car className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">City Hub</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">12 min</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <MapPin className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">Hospital</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">15 min</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <Plane className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">Intl Airport</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">28 min</p>
                </div>
                <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                  <Building2 className="h-4 w-4 text-[#8c7755] mx-auto mb-1.5" />
                  <p className="font-bold text-[#1e1b17]">Top Schools</p>
                  <p className="text-[#7a7268] text-[11px] mt-0.5">7 min</p>
                </div>
              </div>
            </div>

            {/* About the Locality Card */}
            <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-6 space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                About {property.city}
              </h4>
              <p className="text-xs sm:text-sm text-[#524b42] leading-relaxed">
                {property.city} is an established, high-growth luxury residential destination known for its wide tree-lined boulevards, seamless connectivity to expressway networks, world-class healthcare centers, and curated social infrastructure. The locality attracts discerning homeowners seeking modern comfort with urban convenience.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: FLOOR PLAN ── */}
        {activeTab === "floorplan" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece0] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                  Architectural Floor Plan &amp; Layout
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  Detailed room dimensions and spatial plan for {property.title}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl border border-[#e5ddd0] bg-[#faf7f2] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setFloorPlanLevel("ground")}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                      floorPlanLevel === "ground"
                        ? "bg-[#1e1b17] text-white shadow-xs"
                        : "text-[#7a7268] hover:text-[#1e1b17]"
                    }`}
                  >
                    Ground Floor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloorPlanLevel("first")}
                    className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                      floorPlanLevel === "first"
                        ? "bg-[#1e1b17] text-white shadow-xs"
                        : "text-[#7a7268] hover:text-[#1e1b17]"
                    }`}
                  >
                    First Floor
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("3dtour")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#b8924a] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-semibold text-[#8c7755] hover:bg-[#b8924a] hover:text-white transition-colors"
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>Sync with 3D Tour</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Floor Plan Diagram Canvas */}
              <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] flex flex-col items-center justify-center p-8 text-center">
                <div className="border-2 border-dashed border-[#b8924a]/50 rounded-2xl p-8 max-w-md w-full bg-white/80 shadow-xs space-y-3">
                  <Layers className="h-8 w-8 text-[#b8924a] mx-auto" />
                  <h4 className="font-serif text-base font-bold text-[#1e1b17]">
                    {floorPlanLevel === "ground" ? "Level 0 — Living & Pavilion" : "Level 1 — Suites & Balcony"}
                  </h4>
                  <p className="text-xs text-[#7a7268]">
                    Master Bedroom (18&apos; x 14&apos;) • Living Room (24&apos; x 18&apos;) • Modern Kitchen (14&apos; x 12&apos;) • Open Balcony (20&apos; x 10&apos;)
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("3dtour")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3d332a] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2b241e]"
                    >
                      <span>Explore 3D Digital Twin</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Dimensions Table */}
              <div className="lg:col-span-4 rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-5 space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                  Room Dimensions
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Living Lounge</span>
                    <span className="font-semibold text-[#1e1b17]">24&apos; 0&quot; x 18&apos; 6&quot;</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Master Bedroom</span>
                    <span className="font-semibold text-[#1e1b17]">18&apos; 4&quot; x 14&apos; 2&quot;</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Modular Kitchen</span>
                    <span className="font-semibold text-[#1e1b17]">14&apos; 0&quot; x 12&apos; 0&quot;</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Dining Space</span>
                    <span className="font-semibold text-[#1e1b17]">15&apos; 6&quot; x 11&apos; 0&quot;</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#e5ddd0]">
                    <span className="text-[#7a7268]">Bedroom 2</span>
                    <span className="font-semibold text-[#1e1b17]">14&apos; 6&quot; x 13&apos; 0&quot;</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#7a7268]">Open Balcony</span>
                    <span className="font-semibold text-[#1e1b17]">20&apos; 0&quot; x 10&apos; 4&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: 3D TOUR ── */}
        {activeTab === "3dtour" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#f2ece0]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17] flex items-center gap-2">
                  <Box className="h-5 w-5 text-[#b8924a]" />
                  <span>Interactive 3D Property Digital Twin</span>
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  Walk through the rooms, orbit the estate, inspect dollhouse cutaways with the roof removed, or command the AI Broker.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/spatial"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-semibold text-[#1e1b17] hover:border-[#b8924a] hover:bg-white transition-colors"
                >
                  <Compass className="h-3.5 w-3.5 text-[#b8924a]" />
                  <span>Open Dedicated Workspace</span>
                </Link>
              </div>
            </div>

            <div className="w-full">
              <SpatialWorkspace />
            </div>
          </div>
        )}

        {/* ── TAB: AMENITIES ── */}
        {activeTab === "amenities" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece0] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                  Comprehensive Lifestyle Amenities
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  Full list of verified amenities, smart home technology, and community features.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4eee2] px-3 py-1 text-xs font-semibold text-[#8c7755]">
                12 Verified Amenities
              </span>
            </div>

            {/* 8 Quick Icon Tiles Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <Waves className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Private Pool</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <Trees className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Garden</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <SquareParking className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Parking</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <ShieldCheck className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Security</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <Cpu className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Smart Home</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <Building2 className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Clubhouse</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <Zap className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Power Backup</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-3">
                <PawPrint className="h-4 w-4 text-[#8c7755] mb-1.5" />
                <span className="text-[11px] font-medium text-[#1e1b17]">Pet Friendly</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Private & Leisure */}
              <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#8c7755]">
                  <Waves className="h-4 w-4" />
                  <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                    Private &amp; Leisure
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-[#524b42]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Private Outdoor Pool with Sun Deck</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Landscaped Designer Garden</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Open Sky Terrace &amp; Balcony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Resident Clubhouse Access</span>
                  </li>
                </ul>
              </div>

              {/* Comfort & Tech */}
              <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#8c7755]">
                  <Cpu className="h-4 w-4" />
                  <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                    Comfort &amp; Smart Tech
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-[#524b42]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Smart Home Lighting &amp; HVAC Control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>100% DG Power Backup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>High-Speed Fiber Optic Pre-Wired</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Designer Modular Kitchen Surfaces</span>
                  </li>
                </ul>
              </div>

              {/* Security & Convenience */}
              <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#8c7755]">
                  <ShieldCheck className="h-4 w-4" />
                  <h4 className="font-serif text-sm font-bold text-[#1e1b17]">
                    Security &amp; Convenience
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-[#524b42]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>24/7 Gated Multi-Tier Security</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Covered Car Parking Bays</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Pet Friendly Environment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Intercom &amp; Visitor Management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: REVIEWS ── */}
        {activeTab === "reviews" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece0] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                  Buyer Ratings &amp; Reviews
                </h3>
                <p className="text-xs text-[#7a7268] mt-0.5">
                  Verified feedback from homeowners and visitors.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-serif text-base font-bold text-[#1e1b17]">4.9 / 5.0</span>
                <span className="text-xs text-[#7a7268]">(24 verified reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-4.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#e5ddd0]">
                      <ResilientImage
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                        alt="Rohan K."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-xs font-bold text-[#1e1b17]">Rohan K.</p>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Verified Buyer</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7a7268]">2 weeks ago</span>
                </div>
                <p className="text-xs text-[#524b42] leading-relaxed">
                  &ldquo;Excellent property and great location. The 3D tour helped us a lot in understanding the spatial structure before visiting in person.&rdquo;
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] p-4.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#e5ddd0]">
                      <ResilientImage
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                        alt="Ananya S."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-xs font-bold text-[#1e1b17]">Ananya S.</p>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Verified Buyer</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7a7268]">1 month ago</span>
                </div>
                <p className="text-xs text-[#524b42] leading-relaxed">
                  &ldquo;The natural lighting in the master bedroom and living lounge is breathtaking. Scheduling the site visit through the broker was seamless.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: INQUIRIES & SCHEDULE VIEWING ── */}
        {activeTab === "inquiries" && (
          <div className="rounded-3xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
                Schedule a Visit &amp; Inquire
              </h3>
              <p className="text-xs text-[#7a7268] mt-0.5">
                Directly connect with the property advisor or book an on-site walkthrough.
              </p>
            </div>

            <PropertyInteractions
              propertyId={property.id}
              isFavorited={isFavorited}
              ownerName={property.owner?.name || "Priya Mehta"}
              ownerEmail={property.owner?.email || ""}
              reviews={property.reviews || []}
            />
          </div>
        )}

        {/* ── 5. "MORE HOMES FOR YOU" Similar Properties Section ── */}
        <div className="pt-12 border-t border-[#e5ddd0] space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a8f7e]">
              — MORE HOMES FOR YOU —
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e1b17]">
              Similar Properties
            </h2>
            <p className="text-xs sm:text-sm text-[#7a7268]">
              Explore other premium homes in and around {property.city}
            </p>
          </div>

          <div className="locus-scroll-x grid grid-flow-col auto-cols-[80%] gap-3 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
            {similarProperties && similarProperties.length > 0 ? (
              similarProperties.slice(0, 4).map((sim, index) => (
                <PropertyCard
                  key={sim.id}
                  id={sim.id}
                  title={sim.title}
                  price={sim.price}
                  city={sim.city}
                  state={sim.state}
                  bedrooms={sim.bedrooms}
                  bathrooms={sim.bathrooms}
                  area={sim.area}
                  propertyType={sim.propertyType}
                  listingType={sim.listingType}
                  furnished={sim.furnished}
                  parking={sim.parking}
                  imageUrl={sim.images?.[0]?.url || photos[index % photos.length]}
                  has3D={true}
                  isNew={index === 1}
                />
              ))
            ) : (
              [
                {
                  id: "sim-1",
                  title: "Palm Grove Villa",
                  price: 15500000,
                  city: "Sector 81",
                  state: property.city,
                  bedrooms: 4,
                  bathrooms: 3,
                  area: 2800,
                  propertyType: "VILLA",
                  listingType: "SALE",
                  furnished: true,
                  parking: 2,
                  imageUrl:
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
                  has3D: true,
                },
                {
                  id: "sim-2",
                  title: "The Metro Homes",
                  price: 19000000,
                  city: "Sector 57",
                  state: property.city,
                  bedrooms: 3,
                  bathrooms: 3,
                  area: 2360,
                  propertyType: "APARTMENT",
                  listingType: "SALE",
                  furnished: true,
                  parking: 1,
                  imageUrl:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                  isNew: true,
                  has3D: true,
                },
                {
                  id: "sim-3",
                  title: "Lakeview Residences",
                  price: 22500000,
                  city: "Sector 54",
                  state: property.city,
                  bedrooms: 4,
                  bathrooms: 4,
                  area: 3440,
                  propertyType: "VILLA",
                  listingType: "SALE",
                  furnished: true,
                  parking: 2,
                  imageUrl:
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                  has3D: true,
                },
                {
                  id: "sim-4",
                  title: "Aurora Villas",
                  price: 14000000,
                  city: "Sector 83",
                  state: property.city,
                  bedrooms: 3,
                  bathrooms: 3,
                  area: 1940,
                  propertyType: "VILLA",
                  listingType: "SALE",
                  furnished: false,
                  parking: 1,
                  imageUrl:
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                  has3D: true,
                },
              ].map((item) => (
                <PropertyCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  city={item.city}
                  state={item.state}
                  bedrooms={item.bedrooms}
                  bathrooms={item.bathrooms}
                  area={item.area}
                  propertyType={item.propertyType}
                  listingType={item.listingType}
                  furnished={item.furnished}
                  parking={item.parking}
                  imageUrl={item.imageUrl}
                  has3D={item.has3D}
                  isNew={item.isNew}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR (Mobile Only) ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5ddd0] bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2.5 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#6b583f] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#574732] active:scale-95 transition-all"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule a Visit</span>
          </button>

          <a
            href="tel:+919876543210"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#e5ddd0] bg-[#faf7f2] py-3 text-xs font-semibold text-[#1e1b17] hover:bg-white active:scale-95 transition-all"
          >
            <Phone className="h-3.5 w-3.5 text-[#b8924a]" />
            <span>Contact Agent</span>
          </a>
        </div>
      </div>

      {/* ── SCHEDULE VISIT MODAL ── */}
      <ScheduleVisitModal
        property={property}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </main>
  );
}
