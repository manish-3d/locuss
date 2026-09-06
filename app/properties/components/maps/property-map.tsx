"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, AlertTriangle } from "lucide-react";

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
};

export default function PropertyMap({
  latitude,
  longitude,
  title,
  className,
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate coordinates
  const isValidCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!isValidCoords) {
      setError("Invalid coordinates provided.");
      return;
    }

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap Contributors",
              maxzoom: 19,
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [longitude, latitude],
        zoom: 14,
      });

      map.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );

      const marker = new maplibregl.Marker({ color: "#2563eb" })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      if (title) {
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(
          `<div style="padding:4px 8px;font-size:13px;font-weight:600;max-width:200px">${title}</div>`
        );
        marker.setPopup(popup);
      }

      map.current.on("error", (e) => {
        console.error("MapLibre error:", e);
        setError("An error occurred while loading the map. Please check the console.");
      });

    } catch (err) {
      console.error("MapLibre initialization error:", err);
      setError("Failed to initialize the map. Please try again later.");
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude, title, isValidCoords]);

  if (!isValidCoords) {
    return (
      <div className={`flex h-[300px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center sm:h-[400px] ${className || ""}`}>
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <MapPin className="h-8 w-8" />
          <p className="text-sm font-medium">Location coordinates not available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex h-[300px] w-full items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 px-4 text-center sm:h-[400px] ${className || ""}`}>
        <div className="flex flex-col items-center gap-2 text-red-400">
          <AlertTriangle className="h-8 w-8" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ""}`}>
      <div
        ref={mapContainer}
        className="h-[300px] w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-[400px]"
      />
    </div>
  );
}
