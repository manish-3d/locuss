"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Search, MapPin, X, Loader2, AlertTriangle } from "lucide-react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { PropertySchema } from "@/lib/validations/property";

type LocationPickerProps = {
  setValue: UseFormSetValue<PropertySchema>;
  watch: UseFormWatch<PropertySchema>;
};

type GeocodingResult = {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{
    id: string;
    text: string;
  }>;
  text: string;
};

export default function LocationPicker({ setValue, watch }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const address = watch("address");
  const city = watch("city");

  const hasLocation =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  // Initialize confirmed state if coordinates exist on mount (e.g., editing)
  useEffect(() => {
    if (hasLocation && !isConfirmed && !query) {
      setIsConfirmed(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Geocoding search with debounce
  const searchAddress = useCallback(
    (searchQuery: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (!searchQuery.trim() || searchQuery.trim().length < 3) {
        setResults([]);
        setShowResults(false);
        return;
      }

      if (!apiKey) {
        setSearchError("Map API key is not configured.");
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        setIsSearching(true);
        setSearchError(null);

        try {
          const response = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery.trim())}.json?key=${apiKey}&limit=5`
          );

          if (!response.ok) {
            throw new Error("Geocoding request failed");
          }

          const data = await response.json();
          const features = (data.features || []) as GeocodingResult[];
          setResults(features);
          setShowResults(features.length > 0);
        } catch {
          setSearchError("Failed to search locations. Please try again.");
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 400);
    },
    [apiKey]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchAddress(value);
    if (isConfirmed) setIsConfirmed(false);
  };

  const selectLocation = (result: GeocodingResult) => {
    const [lng, lat] = result.center;

    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lng, { shouldValidate: true });
    setIsConfirmed(false);

    // Parse location components from the place name
    const parts = result.place_name.split(", ");
    if (parts.length >= 1) {
      // Use the first part as address (or full place_name for short results)
      setValue("address", parts.slice(0, Math.max(1, parts.length - 2)).join(", "), {
        shouldValidate: true,
      });
    }

    // Try to extract city, state, country from context or place_name parts
    if (result.context) {
      const parsedCity = result.context.find((c) => c.id.startsWith("place"));
      const parsedState = result.context.find(
        (c) => c.id.startsWith("region") || c.id.startsWith("province")
      );
      const parsedCountry = result.context.find((c) => c.id.startsWith("country"));

      if (parsedCity) setValue("city", parsedCity.text, { shouldValidate: true });
      if (parsedState) setValue("state", parsedState.text, { shouldValidate: true });
      if (parsedCountry) setValue("country", parsedCountry.text, { shouldValidate: true });
    } else if (parts.length >= 3) {
      // Fallback: use last parts of place_name
      setValue("country", parts[parts.length - 1], { shouldValidate: true });
      setValue("state", parts[parts.length - 2], { shouldValidate: true });
      if (parts.length >= 4) {
        setValue("city", parts[parts.length - 3], { shouldValidate: true });
      }
    }

    setQuery(result.place_name);
    setShowResults(false);
    setResults([]);
  };

  const clearLocation = () => {
    setValue("latitude", undefined, { shouldValidate: true });
    setValue("longitude", undefined, { shouldValidate: true });
    setValue("address", "", { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });
    setValue("state", "", { shouldValidate: true });
    setValue("country", "", { shouldValidate: true });
    setQuery("");
    setResults([]);
    setShowResults(false);
    setIsConfirmed(false);

    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
  };

  // Initialize / update the mini-map
  useEffect(() => {
    if (!hasLocation || !mapContainer.current || isConfirmed) return;

    if (!apiKey) return;

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`, // Cleaner light style
        center: [longitude!, latitude!],
        zoom: 15,
        interactive: true,
      });

      map.current.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right"
      );
    } else {
      map.current.flyTo({ center: [longitude!, latitude!], zoom: 15 });
    }

    if (marker.current) {
      marker.current.setLngLat([longitude!, latitude!]);
    } else {
      marker.current = new maplibregl.Marker({ color: "#2563eb", draggable: true })
        .setLngLat([longitude!, latitude!])
        .addTo(map.current);

      // Allow dragging the marker to fine-tune position
      marker.current.on("dragend", () => {
        const lngLat = marker.current!.getLngLat();
        setValue("latitude", lngLat.lat, { shouldValidate: true });
        setValue("longitude", lngLat.lng, { shouldValidate: true });
      });
    }

    return () => {
      // We don't destroy the map on re-render to keep it smooth
    };
  }, [hasLocation, latitude, longitude, apiKey, setValue, isConfirmed]);

  // Cleanup on unmount or when confirmed
  useEffect(() => {
    if (isConfirmed) {
      map.current?.remove();
      map.current = null;
      marker.current = null;
    }
    return () => {
      if (!isConfirmed) {
        map.current?.remove();
        map.current = null;
        marker.current = null;
      }
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [isConfirmed]);

  if (!apiKey) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50">
        <div className="flex flex-col items-center gap-2 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
          <p className="text-sm font-medium">Map API key is not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {!isConfirmed && (
        <div className="relative" ref={dropdownRef}>
          <label className="mb-2 block text-sm font-medium">
            Search Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (results.length > 0) setShowResults(true);
              }}
              placeholder="Search for an address, city, or landmark..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-10 outline-none transition focus:border-black"
              aria-label="Search location"
            />
            {(query || hasLocation) && (
              <button
                type="button"
                onClick={clearLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Clear location"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute right-12 top-[46px] -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}

          {/* Search Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => selectLocation(result)}
                  className="flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition last:border-0 hover:bg-blue-50 hover:text-blue-700"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm font-medium">{result.place_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && !isSearching && results.length === 0 && query.trim().length >= 3 && (
            <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
              <p className="text-sm text-gray-500">No locations found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      {/* Confirmed State */}
      {isConfirmed && hasLocation && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Location Confirmed</p>
              <p className="text-xs text-green-600">
                {address ? `${address}, ${city}` : `${latitude!.toFixed(4)}, ${longitude!.toFixed(4)}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsConfirmed(false)}
            className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
          >
            Edit Location
          </button>
        </div>
      )}

      {/* Selected Location Mini Map (Unconfirmed) */}
      {hasLocation && !isConfirmed && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Coordinates:</span>{" "}
              {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
            </p>
            <p className="text-xs font-medium text-blue-600">
              Drag marker to fine-tune
            </p>
          </div>
          
          <div
            ref={mapContainer}
            className="h-[300px] w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
          />

          <button
            type="button"
            onClick={() => setIsConfirmed(true)}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Confirm Location
          </button>
        </div>
      )}

      {/* Empty State */}
      {!hasLocation && !isConfirmed && (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <MapPin className="h-6 w-6" />
            <p className="text-sm">Search above to set the property location</p>
          </div>
        </div>
      )}
    </div>
  );
}
