"use client";

import React from "react";
import type { TourState } from "@/hooks/use-navigation";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  Sparkles,
  Compass,
} from "lucide-react";

interface SpatialTourControlsProps {
  tour: TourState | null;
  onStartTour: () => void;
  onPauseTour: () => void;
  onResumeTour: () => void;
  onStopTour: () => void;
  onSkipTourStep: () => void;
  currentRoomName?: string;
  totalRooms?: number;
  className?: string;
}

export function SpatialTourControls({
  tour,
  onStartTour,
  onPauseTour,
  onResumeTour,
  onStopTour,
  onSkipTourStep,
  currentRoomName = "",
  totalRooms = 7,
  className = "",
}: SpatialTourControlsProps) {
  if (!tour) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={onStartTour}
          className="group inline-flex items-center gap-2 rounded-xl border border-[#b8924a]/30 bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#1e1b17] shadow-sm backdrop-blur-xs transition-all duration-200 hover:border-[#b8924a] hover:bg-[#faf7f2] hover:shadow-md active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#b8924a] transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-serif">Start Guided Tour</span>
          <span className="rounded-md bg-[#faf7f2] px-1.5 py-0.5 text-[10px] font-mono text-[#7a7268] border border-[#e5ddd0]">
            {totalRooms} stops
          </span>
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(
    ((tour.currentIndex + 1) / tour.route.length) * 100
  );

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-2xl border border-[#b8924a]/40 bg-white/95 p-2.5 sm:px-4 sm:py-2.5 shadow-md backdrop-blur-md transition-all ${className}`}
    >
      {/* ── Status & Progress ── */}
      <div className="flex items-center justify-between sm:justify-start gap-3 min-w-[170px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {!tour.isPaused && !tour.isComplete && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8924a] opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                tour.isComplete
                  ? "bg-emerald-600"
                  : tour.isPaused
                  ? "bg-amber-500"
                  : "bg-[#b8924a]"
              }`}
            />
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1e1b17]">
              <Compass className="h-3 w-3 text-[#b8924a]" />
              <span className="font-serif">
                {tour.isComplete
                  ? "Tour Completed"
                  : tour.isPaused
                  ? "Tour Paused"
                  : `Tour: ${currentRoomName || "Exploring"}`}
              </span>
            </div>
            <p className="text-[10px] text-[#7a7268]">
              Stop {tour.currentIndex + 1} of {tour.route.length} ({progressPercent}%)
            </p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="hidden md:block w-24 h-1.5 rounded-full bg-[#f2ece0] overflow-hidden">
        <div
          className="h-full bg-[#b8924a] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Controls Buttons ── */}
      <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 border-[#f2ece0] pt-2 sm:pt-0">
        {tour.isComplete ? (
          <button
            type="button"
            onClick={onStartTour}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#b8924a] bg-[#faf7f2] px-2.5 py-1 text-xs font-medium text-[#1e1b17] hover:bg-white"
          >
            <Sparkles className="h-3 w-3 text-[#b8924a]" />
            <span>Restart</span>
          </button>
        ) : tour.isPaused ? (
          <button
            type="button"
            onClick={onResumeTour}
            className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-2 py-1 text-xs font-medium text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#faf7f2]"
            title="Resume Tour"
          >
            <Play className="h-3 w-3 text-[#b8924a] fill-[#b8924a]" />
            <span className="hidden sm:inline">Resume</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPauseTour}
            className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-2 py-1 text-xs font-medium text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#faf7f2]"
            title="Pause Tour"
          >
            <Pause className="h-3 w-3 text-[#7a7268]" />
            <span className="hidden sm:inline">Pause</span>
          </button>
        )}

        {!tour.isComplete && (
          <button
            type="button"
            onClick={onSkipTourStep}
            className="inline-flex items-center gap-1 rounded-lg border border-[#e5ddd0] bg-white px-2 py-1 text-xs font-medium text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#faf7f2]"
            title="Skip to Next Room"
          >
            <SkipForward className="h-3 w-3 text-[#7a7268]" />
            <span className="hidden sm:inline">Skip</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStopTour}
          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/70 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
          title="End Tour"
        >
          <Square className="h-3 w-3 fill-rose-600 text-rose-600" />
          <span className="hidden sm:inline">End</span>
        </button>
      </div>
    </div>
  );
}
