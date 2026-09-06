"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AlertTriangle } from "lucide-react";

export type MapProperty = {
  id: string;
  title: string;
  price: bigint;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
};

type PropertyMapViewProps = {
  properties: MapProperty[];
};

export default function PropertyMapView({ properties }: PropertyMapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

    if (!apiKey) {
      setError("Map configuration is missing. Please contact support.");
      return;
    }

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
        center: [77.209, 28.6139], // Default to Delhi if no properties
        zoom: 10,
      });

      map.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );
    }

    // Filter properties with valid coordinates
    const validProperties = properties.filter(
      (p) =>
        p.latitude !== null &&
        p.longitude !== null &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude)
    );

    // Clear existing markers (a robust implementation would manage markers statefully)
    // For simplicity, we assume this component unmounts/remounts or we handle bounds
    
    // Create markers for each valid property
    const bounds = new maplibregl.LngLatBounds();
    let hasBounds = false;

    // Add new markers
    validProperties.forEach((property) => {
      const el = document.createElement("div");
      el.className = "marker-pin";
      el.style.backgroundColor = "#2563eb";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      const popupHtml = `
        <div style="padding: 0; min-width: 160px; max-width: 220px;">
          ${
            property.imageUrl
              ? `<img src="${property.imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-top-left-radius: 8px; border-top-right-radius: 8px;" alt="${property.title}" />`
              : `<div style="width: 100%; height: 120px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; border-top-left-radius: 8px; border-top-right-radius: 8px;">No image</div>`
          }
          <div style="padding: 12px;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${property.title}</h4>
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #2563eb;">₹${Number(property.price).toLocaleString("en-IN")}</p>
            <a href="/properties/${property.id}" style="display: block; width: 100%; padding: 8px 0; text-align: center; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">View Details</a>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 15,
        closeButton: true,
        closeOnClick: false,
        className: 'custom-popup',
      }).setHTML(popupHtml);

      new maplibregl.Marker({ element: el })
        .setLngLat([property.longitude!, property.latitude!])
        .setPopup(popup)
        .addTo(map.current!);

      bounds.extend([property.longitude!, property.latitude!]);
      hasBounds = true;
    });

    // Add some global CSS for the popup
    if (!document.getElementById('map-popup-style')) {
      const style = document.createElement('style');
      style.id = 'map-popup-style';
      style.innerHTML = `
        .custom-popup .maplibregl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .custom-popup .maplibregl-popup-close-button {
          color: white;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          right: 8px;
          top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .custom-popup .maplibregl-popup-close-button:hover {
          background: rgba(0,0,0,0.8);
        }
      `;
      document.head.appendChild(style);
    }

    if (hasBounds) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties]);

  if (error) {
    return (
      <div className="flex h-[360px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 px-4 text-center text-red-500 sm:h-[600px]">
        <AlertTriangle className="mb-2 h-8 w-8" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="h-[360px] w-full overflow-hidden rounded-2xl border bg-gray-100 shadow-inner sm:h-[600px]"
    />
  );
}
