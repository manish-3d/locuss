"use client";

import React from "react";
import type { RoomNode } from "@/lib/spatial";
import { Compass, Sparkles } from "lucide-react";

interface SpatialRoomSelectorProps {
  rooms: RoomNode[];
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  isTransitioning?: boolean;
  className?: string;
}

export function SpatialRoomSelector({
  rooms,
  currentRoomId,
  onSelectRoom,
  isTransitioning = false,
  className = "",
}: SpatialRoomSelectorProps) {
  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto p-1.5 scrollbar-none select-none ${className}`}
    >
      {rooms.map((room) => {
        const isActive = room.id === currentRoomId;

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelectRoom(room.id)}
            disabled={isTransitioning && isActive}
            className={`group inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              isActive
                ? "bg-[#1e1b17] text-[#faf7f2] shadow-xs ring-1 ring-[#b8924a]"
                : "border border-[#e5ddd0] bg-white/90 text-[#524b42] hover:border-[#b8924a] hover:bg-[#faf7f2] hover:text-[#1e1b17]"
            }`}
          >
            {isActive ? (
              <Sparkles className="h-3 w-3 text-[#b8924a] shrink-0" />
            ) : (
              <Compass className="h-3 w-3 text-[#7a7268] group-hover:text-[#b8924a] shrink-0" />
            )}
            <span className="font-serif tracking-tight">{room.name}</span>
            {room.connectedRooms && room.connectedRooms.length > 0 && (
              <span
                className={`ml-0.5 rounded-full px-1 py-0.2 text-[9px] font-mono ${
                  isActive
                    ? "bg-[#35312b] text-[#dfc99a]"
                    : "bg-[#f2ece0] text-[#7a7268]"
                }`}
                title={`${room.connectedRooms.length} connected rooms`}
              >
                {room.connectedRooms.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
