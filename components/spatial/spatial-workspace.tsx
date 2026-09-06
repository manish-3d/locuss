"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  DEMO_PROPERTY_GRAPH,
  getAllRooms,
} from "@/lib/spatial";
import { useNavigation } from "@/hooks/use-navigation";
import { SpatialTourControls } from "./spatial-tour-controls";
import { SpatialRoomSelector } from "./spatial-room-selector";
import { SpatialAiPanel } from "./spatial-ai-panel";
import {
  RotateCcw,
  Box,
  Compass,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  TreeDeciduous,
  TreePine,
} from "lucide-react";
import type { RoofMode } from "./property-model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsInstance = any;

const PropertySceneCanvas = dynamic(
  () =>
    import("./property-scene-canvas").then((mod) => mod.PropertySceneCanvas),
  {
    ssr: false,
    loading: () => <SpatialCanvasLoadingFallback />,
  }
);

function SpatialCanvasLoadingFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#faf7f2] p-6 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white shadow-xs">
        <Box className="h-6 w-6 animate-pulse text-[#b8924a]" />
      </div>
      <div>
        <p className="font-serif text-base font-semibold text-[#1e1b17]">
          Initializing 3D Digital Twin
        </p>
        <p className="mt-0.5 text-xs text-[#7a7268]">
          Loading React Three Fiber &amp; GLB scene…
        </p>
      </div>
    </div>
  );
}

interface SpatialWorkspaceProps {
  /** Optional initial expanded state */
  initiallyExpanded?: boolean;
  /** Callback when full view expanded state changes */
  onToggleExpand?: (isExpanded: boolean) => void;
  /** ClassName override for the outer wrapper */
  className?: string;
}

export function SpatialWorkspace({
  initiallyExpanded = false,
  onToggleExpand,
  className = "",
}: SpatialWorkspaceProps) {
  const graph = DEMO_PROPERTY_GRAPH;
  const allRooms = useMemo(() => getAllRooms(graph), [graph]);

  const [controls, setControls] = useState<OrbitControlsInstance | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [roofMode, setRoofMode] = useState<RoofMode>("cutaway");
  const [hideTrees, setHideTrees] = useState(true);
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const [navigationState, navigationActions] = useNavigation({
    graph,
    transitionDuration: 1400,
    tourStepDelay: 3200,
  });

  const { currentRoom, targetRoom, isTransitioning, tour } = navigationState;
  const {
    goToRoom,
    resetView,
    startTour,
    pauseTour,
    resumeTour,
    stopTour,
    skipTourStep,
    handleTransitionComplete,
  } = navigationActions;

  /**
   * Reset camera to Full Property View (high-angle overview of entire estate:
   * main villa, infinity pool, sun deck, garden, carport)
   */
  const handleFullPropertyView = useCallback(() => {
    resetView();
    if (controls) {
      controls.reset();
      controls.object.position.set(20, 18, 24);
      controls.target.set(0, 2.5, 0);
      controls.update();
    }
  }, [resetView, controls]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      onToggleExpand?.(next);
      return next;
    });
  }, [onToggleExpand]);

  return (
    <div
      className={`${
        isExpanded
          ? "fixed inset-0 z-50 flex flex-col bg-[#faf7f2] p-3 sm:p-6 overflow-hidden"
          : "relative"
      } ${className}`}
    >
      <div
        className={`${
          isExpanded
            ? "flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-0"
            : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        }`}
      >
        {/* ── Left Column: 3D Viewport & Navigation Bar (7-8 Cols on desktop) ── */}
        <div
          className={`lg:col-span-7 xl:col-span-8 flex flex-col space-y-3 ${
            isExpanded ? "h-full flex-1 min-h-0" : ""
          }`}
        >
          {/* ── 3D Viewport Card ── */}
          <div
            className={`group relative flex flex-col overflow-hidden rounded-xl border border-[#e5ddd0] bg-[#faf7f2] shadow-sm sm:rounded-2xl ${
              isExpanded ? "h-full flex-1" : ""
            }`}
          >
            {/* Viewport Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5ddd0]/80 bg-white/95 px-2.5 py-2.5 backdrop-blur-xs sm:px-4 sm:py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#b8924a] animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-sm font-bold text-[#1e1b17]">
                      {graph.propertyName}
                    </h2>
                    <span className="hidden rounded-full bg-[#f2ece0] px-2 py-0.5 text-[10px] font-mono text-[#7a7268] sm:inline">
                      3D Twin
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7a7268]">
                    {currentRoom ? `Viewpoint: ${currentRoom.name}` : "Full Property Overview"}
                  </p>
                </div>
              </div>

              {/* Quick Actions, Roof Mode & Full View Toggle */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* 1. Full Property View Camera Button */}
                <button
                  type="button"
                  onClick={handleFullPropertyView}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5ddd0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1e1b17] shadow-2xs transition-colors hover:border-[#b8924a] hover:bg-[#faf7f2]"
                  title="Full View of Property: Zoom out to see the entire villa and grounds"
                >
                  <Compass className="h-3.5 w-3.5 text-[#b8924a]" />
                  <span>Full View</span>
                </button>

                {/* 2. Roof Cutaway Mode Segmented Control */}
                <div className="inline-flex items-center rounded-lg border border-[#e5ddd0] bg-[#f5efe6] p-0.5 text-xs font-medium shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setRoofMode("cutaway")}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-all ${
                      roofMode === "cutaway"
                        ? "bg-white font-semibold text-[#1e1b17] shadow-xs"
                        : "text-[#7a7268] hover:text-[#1e1b17]"
                    }`}
                    title="Dollhouse cutaway: roof removed to inspect interior rooms"
                  >
                    <Layers className="h-3 w-3 text-[#b8924a]" />
                    <span>No Roof</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoofMode("ground")}
                    className={`rounded-md px-2 py-1 text-xs transition-all ${
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
                    className={`rounded-md px-2 py-1 text-xs transition-all ${
                      roofMode === "exterior"
                        ? "bg-white font-semibold text-[#1e1b17] shadow-xs"
                        : "text-[#7a7268] hover:text-[#1e1b17]"
                    }`}
                    title="Full exterior with roof"
                  >
                    Roof On
                  </button>
                </div>

                {/* 3. Trees/Foliage Toggle */}
                <button
                  type="button"
                  onClick={() => setHideTrees(!hideTrees)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
                    !hideTrees
                      ? "border-[#b8924a]/40 bg-[#faf7f2] text-[#b8924a]"
                      : "border-[#e5ddd0] bg-white text-[#7a7268] hover:bg-[#faf7f2]"
                  }`}
                  title={hideTrees ? "Show Trees" : "Hide Trees (Clear View)"}
                >
                  <TreeDeciduous className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{hideTrees ? "Trees Off" : "Trees On"}</span>
                </button>

                {/* 4. Hotspot Markers Toggle */}
                <button
                  type="button"
                  onClick={() => setShowMarkers(!showMarkers)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
                    showMarkers
                      ? "border-[#b8924a]/40 bg-[#faf7f2] text-[#b8924a]"
                      : "border-[#e5ddd0] bg-white text-[#7a7268] hover:bg-[#faf7f2]"
                  }`}
                  title={showMarkers ? "Hide 3D Hotspots" : "Show 3D Hotspots"}
                >
                  {showMarkers ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* 5. Fullscreen / Expand 3D Tour Button */}
                <button
                  type="button"
                  onClick={toggleExpand}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all ${
                    isExpanded
                      ? "border-[#1e1b17] bg-[#1e1b17] text-white"
                      : "border-[#b8924a] bg-[#faf7f2] text-[#b8924a] hover:bg-[#f2ece0]"
                  }`}
                  title={isExpanded ? "Exit Full View" : "Full View of 3D Tour (Fullscreen)"}
                >
                  {isExpanded ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Close Full View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Full View</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3D Canvas Area */}
            <div
              className={`relative w-full touch-none select-none ${
                isExpanded
                  ? "flex-1 min-h-0"
                  : "h-[440px] sm:h-[520px] md:h-[580px] lg:h-[640px]"
              }`}
            >
              <PropertySceneCanvas
                rooms={allRooms}
                currentRoomId={currentRoom?.id ?? null}
                targetRoom={targetRoom}
                onSelectRoom={goToRoom}
                onTransitionComplete={handleTransitionComplete}
                onControlsReady={setControls}
                showMarkers={showMarkers}
                roofMode={roofMode}
                hideTrees={hideTrees}
              />

              {/* Floating Top Tour Overlay */}
              <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                <div className="pointer-events-auto">
                  <SpatialTourControls
                    tour={tour}
                    onStartTour={() => startTour()}
                    onPauseTour={pauseTour}
                    onResumeTour={resumeTour}
                    onStopTour={stopTour}
                    onSkipTourStep={skipTourStep}
                    currentRoomName={currentRoom?.name}
                    totalRooms={graph.defaultTourRoute.length}
                  />
                </div>

                {isTransitioning && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b8924a]/50 bg-white/95 px-3 py-1 text-[11px] font-medium text-[#b8924a] shadow-xs backdrop-blur-xs animate-pulse">
                    <Compass className="h-3.5 w-3.5 animate-spin" />
                    <span>Navigating to {targetRoom?.name || "Room"}…</span>
                  </div>
                )}
              </div>

              {/* Floating Bottom Room Selector Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 pointer-events-none">
                <div className="pointer-events-auto rounded-xl border border-[#e5ddd0]/90 bg-white/90 p-1 shadow-md backdrop-blur-md">
                  <SpatialRoomSelector
                    rooms={allRooms}
                    currentRoomId={currentRoom?.id ?? null}
                    onSelectRoom={goToRoom}
                    isTransitioning={isTransitioning}
                  />
                </div>

                {/* Viewport Interaction Legend */}
                <div className="flex items-center justify-between text-[10px] text-[#7a7268] px-1 select-none">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e5ddd0]/80 bg-white/80 px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                    <span>
                      <strong className="text-[#1e1b17]">Left click:</strong> Orbit •{" "}
                      <strong className="text-[#1e1b17]">Right click:</strong> Pan •{" "}
                      <strong className="text-[#1e1b17]">Scroll:</strong> Zoom
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFullPropertyView}
                    className="pointer-events-auto hidden sm:inline-flex items-center gap-1 rounded-full border border-[#e5ddd0]/80 bg-white/80 px-2.5 py-0.5 text-[#b8924a] shadow-2xs backdrop-blur-xs hover:bg-white"
                  >
                    <Compass className="h-2.5 w-2.5" />
                    <span className="font-medium">Reset Full Property View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: AI Spatial Copilot & Narration (4-5 Cols on desktop) ── */}
        <div
          className={`lg:col-span-5 xl:col-span-4 space-y-4 ${
            isExpanded ? "h-full overflow-y-auto" : ""
          }`}
        >
          <SpatialAiPanel
            graph={graph}
            currentRoom={currentRoom}
            onNavigateToRoom={goToRoom}
            onStartTour={(route) => startTour(route)}
            isTourActive={tour !== null && !tour.isComplete}
          />
        </div>
      </div>
    </div>
  );
}
