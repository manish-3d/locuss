"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { RotateCcw, Box, Compass, MousePointerClick, Layers } from "lucide-react";
import type { RoofMode } from "./property-model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsInstance = any;

// Client-only dynamic import of the Three.js Canvas to avoid SSR hydration mismatch
const PropertySceneCanvas = dynamic(
  () =>
    import("./property-scene-canvas").then((mod) => mod.PropertySceneCanvas),
  {
    ssr: false,
    loading: () => <PropertySceneLoadingFallback />,
  }
);

function PropertySceneLoadingFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#faf7f2] p-6 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white shadow-xs">
        <Box className="h-6 w-6 animate-pulse text-[#b8924a]" />
      </div>
      <div>
        <p className="font-serif text-base font-semibold text-[#1e1b17]">
          Initializing 3D Viewport
        </p>
        <p className="mt-0.5 text-xs text-[#7a7268]">
          Loading React Three Fiber runtime…
        </p>
      </div>
    </div>
  );
}

interface PropertySceneViewportProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showControlsBar?: boolean;
}

export function PropertySceneViewport({
  className = "",
  title = "3D Property Viewport",
  subtitle = "Modern Coastal Hillside Villa",
  showControlsBar = true,
}: PropertySceneViewportProps) {
  const [controls, setControls] = useState<OrbitControlsInstance | null>(null);
  const [roofMode, setRoofMode] = useState<RoofMode>("cutaway");
  const [hideTrees, setHideTrees] = useState(true);

  const handleFullPropertyView = useCallback(() => {
    if (controls) {
      controls.reset();
      controls.object.position.set(20, 18, 24);
      controls.target.set(0, 2.5, 0);
      controls.update();
    }
  }, [controls]);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd0] bg-[#faf7f2] shadow-sm transition-all duration-300 ${className}`}
    >
      {/* ── Top Viewport Bar ── */}
      {showControlsBar && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5ddd0]/80 bg-white/80 px-2.5 py-2.5 backdrop-blur-xs sm:px-4 sm:py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-[#b8924a] animate-pulse" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1e1b17]">
                {title}
              </h3>
              <p className="text-[11px] text-[#7a7268]">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Full View of Property */}
            <button
              type="button"
              onClick={handleFullPropertyView}
              className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-2.5 py-1 text-xs font-semibold text-[#1e1b17] shadow-2xs hover:border-[#b8924a] hover:bg-[#faf7f2]"
              title="Full View of Property: Zoom out to see the entire estate"
            >
              <Compass className="h-3.5 w-3.5 text-[#b8924a]" />
              <span>Full View</span>
            </button>

            {/* Cutaway / Roof Mode Segmented Selector */}
            <div className="inline-flex items-center rounded-lg border border-[#e5ddd0] bg-[#f5efe6] p-0.5 text-xs font-medium shadow-2xs">
              <button
                type="button"
                onClick={() => setRoofMode("cutaway")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-all ${
                  roofMode === "cutaway"
                    ? "bg-white font-semibold text-[#1e1b17] shadow-xs"
                    : "text-[#7a7268] hover:text-[#1e1b17]"
                }`}
                title="Dollhouse cutaway: roof removed to see inside rooms"
              >
                <Layers className="h-3 w-3 text-[#b8924a]" />
                <span>No Roof</span>
              </button>
              <button
                type="button"
                onClick={() => setRoofMode("ground")}
                className={`rounded-md px-2.5 py-1 text-xs transition-all ${
                  roofMode === "ground"
                    ? "bg-white font-semibold text-[#1e1b17] shadow-xs"
                    : "text-[#7a7268] hover:text-[#1e1b17]"
                }`}
                title="Cut to ground floor only"
              >
                Ground
              </button>
              <button
                type="button"
                onClick={() => setRoofMode("exterior")}
                className={`rounded-md px-2.5 py-1 text-xs transition-all ${
                  roofMode === "exterior"
                    ? "bg-white font-semibold text-[#1e1b17] shadow-xs"
                    : "text-[#7a7268] hover:text-[#1e1b17]"
                }`}
                title="Full exterior with roof"
              >
                Roof On
              </button>
            </div>

            <button
              type="button"
              onClick={handleFullPropertyView}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5ddd0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1e1b17] shadow-2xs transition-colors hover:border-[#b8924a] hover:bg-[#faf7f2] focus:outline-hidden focus:ring-1 focus:ring-[#b8924a]"
              title="Reset Viewpoint"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#b8924a]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 3D Viewport Canvas Container ── */}
      <div className="relative h-[300px] w-full touch-none select-none sm:h-[480px] md:h-[540px] lg:h-[600px]">
        <PropertySceneCanvas
          onControlsReady={setControls}
          roofMode={roofMode}
          hideTrees={hideTrees}
        />

        {/* Floating Hint Overlay */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd0]/90 bg-white/90 px-3 py-1.5 text-[11px] text-[#524b42] shadow-2xs backdrop-blur-xs">
            <MousePointerClick className="h-3.5 w-3.5 text-[#b8924a] shrink-0" />
            <span>
              <strong className="font-semibold text-[#1e1b17]">Rotate:</strong> Left click &amp; drag
              <span className="hidden sm:inline"> • <strong className="font-semibold text-[#1e1b17]">Pan:</strong> Right click &amp; drag • <strong className="font-semibold text-[#1e1b17]">Zoom:</strong> Scroll</span>
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0]/90 bg-white/90 px-3 py-1.5 text-[11px] text-[#7a7268] shadow-2xs backdrop-blur-xs">
            <Compass className="h-3.5 w-3.5 text-[#b8924a]" />
            <span>R3F v9 • Three.js</span>
          </div>
        </div>
      </div>
    </div>
  );
}
