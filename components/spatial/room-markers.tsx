"use client";

import React from "react";
import { Html } from "@react-three/drei";
import type { RoomNode } from "@/lib/spatial";
import { Compass, Sparkles } from "lucide-react";

interface RoomMarkersProps {
  rooms: RoomNode[];
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  visible?: boolean;
}

export function RoomMarkers({
  rooms,
  currentRoomId,
  onSelectRoom,
  visible = true,
}: RoomMarkersProps) {
  if (!visible) return null;

  return (
    <group name="room-markers">
      {rooms.map((room) => {
        if (!room.center) return null;

        const isActive = room.id === currentRoomId;
        const [x, y, z] = room.center;

        return (
          <group key={room.id} position={[x, y + 0.35, z]}>
            {/* ── Optional 3D Active Ring on Floor ── */}
            {isActive && (
              <mesh
                position={[0, -y - 0.3 + 0.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.9, 1.05, 32]} />
                <meshBasicMaterial
                  color="#b8924a"
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}

            {/* ── Floating HTML Badge ── */}
            <Html
              center
              distanceFactor={14}
              zIndexRange={[10, 0]}
              style={{
                transition: "all 0.25s ease-out",
                pointerEvents: "auto",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoom(room.id);
                }}
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium shadow-md transition-all duration-200 select-none ${
                  isActive
                    ? "bg-[#1e1b17] text-[#faf7f2] ring-2 ring-[#b8924a] ring-offset-1 scale-105"
                    : "bg-white/95 text-[#1e1b17] border border-[#e5ddd0] hover:border-[#b8924a] hover:bg-[#faf7f2] hover:scale-105"
                }`}
                title={`Navigate to ${room.name}`}
              >
                {isActive ? (
                  <Sparkles className="h-3 w-3 text-[#b8924a] animate-pulse shrink-0" />
                ) : (
                  <Compass className="h-3 w-3 text-[#7a7268] group-hover:text-[#b8924a] shrink-0" />
                )}
                <span className="font-serif tracking-tight text-[11px]">
                  {room.name}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
