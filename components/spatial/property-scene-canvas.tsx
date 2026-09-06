"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { PropertyModel, type RoofMode } from "./property-model";
import { ModelErrorBoundary } from "./model-error-boundary";
import { CameraController } from "./camera-controller";
import { RoomMarkers } from "./room-markers";
import type { RoomNode } from "@/lib/spatial";
import { Box } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsInstance = any;

export interface PropertySceneCanvasProps {
  rooms?: RoomNode[];
  currentRoomId?: string | null;
  targetRoom?: RoomNode | null;
  onSelectRoom?: (roomId: string) => void;
  onTransitionComplete?: () => void;
  onControlsReady?: (controls: OrbitControlsInstance | null) => void;
  showMarkers?: boolean;
  roofMode?: RoofMode;
  hideTrees?: boolean;
}

/** In-canvas loading indicator shown while the GLB is fetched */
function ModelLoadingFallback() {
  return (
    <mesh position={[0, 1.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#e5ddd0"
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
}

/** HTML overlay shown while Suspense is pending (rendered outside Canvas) */
function CanvasLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#faf7f2]/80 backdrop-blur-xs">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white shadow-xs">
        <Box className="h-6 w-6 animate-pulse text-[#b8924a]" />
      </div>
      <div className="text-center">
        <p className="font-serif text-sm font-semibold text-[#1e1b17]">
          Loading Property Model
        </p>
        <p className="mt-0.5 text-xs text-[#7a7268]">
          Fetching 3D digital twin…
        </p>
      </div>
    </div>
  );
}

export function PropertySceneCanvas({
  rooms = [],
  currentRoomId = null,
  targetRoom = null,
  onSelectRoom = () => {},
  onTransitionComplete = () => {},
  onControlsReady,
  showMarkers = true,
  roofMode = "cutaway",
  hideTrees = true,
}: PropertySceneCanvasProps) {
  const controlsRef = useRef<OrbitControlsInstance>(null);

  return (
    <ModelErrorBoundary>
      <div className="relative h-full w-full">
        <Suspense fallback={<CanvasLoadingOverlay />}>
          <Canvas
            shadows
            className="h-full w-full outline-none"
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
              localClippingEnabled: true,
            }}
            dpr={[1, 2]}
          >
            {/* ── Background color matching Locus warm ivory ── */}
            <color attach="background" args={["#faf7f2"]} />

            {/* ── Scene Fog for warm depth blending ── */}
            <fog attach="fog" args={["#faf7f2", 40, 110]} />

            {/* ── Perspective Camera (Elevated dollhouse overview) ── */}
            <PerspectiveCamera
              makeDefault
              position={[18, 16, 22]}
              fov={45}
              near={0.1}
              far={180}
            />

            {/* ── Camera Transition Controller ── */}
            <CameraController
              targetRoom={targetRoom}
              controlsRef={controlsRef}
              onTransitionComplete={onTransitionComplete}
              durationMs={1500}
            />

            {/* ── Lighting Rig ── */}
            <ambientLight intensity={0.85} color="#faf6ee" />

            <directionalLight
              position={[25, 35, 20]}
              intensity={1.8}
              color="#fffaf0"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={80}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
              shadow-bias={-0.0001}
            />

            <hemisphereLight
              args={["#ffffff", "#ded5c4", 0.6]}
              position={[0, 30, 0]}
            />

            <directionalLight
              position={[-20, 18, -20]}
              intensity={0.5}
              color="#dfc99a"
            />

            {/* ── Ground Plane (Shadow Receiver) ── */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.05, 0]}
              receiveShadow
            >
              <planeGeometry args={[140, 140]} />
              <meshStandardMaterial
                color="#f2ece0"
                roughness={0.95}
                metalness={0.0}
              />
            </mesh>

            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.04, 0]}
              receiveShadow
            >
              <ringGeometry args={[18, 18.25, 96]} />
              <meshBasicMaterial color="#e5ddd0" />
            </mesh>

            {/* ── GLB Property Model ── */}
            <Suspense fallback={<ModelLoadingFallback />}>
              <PropertyModel roofMode={roofMode} hideTrees={hideTrees} />
            </Suspense>

            {/* ── Interactive 3D Room Hotspots ── */}
            <RoomMarkers
              rooms={rooms}
              currentRoomId={currentRoomId}
              onSelectRoom={onSelectRoom}
              visible={showMarkers}
            />

            {/* ── Orbit Controls ── */}
            <OrbitControls
              ref={(node) => {
                controlsRef.current = node;
                if (onControlsReady) {
                  onControlsReady(node);
                }
              }}
              enableDamping
              dampingFactor={0.05}
              minDistance={3.0}
              maxDistance={65}
              maxPolarAngle={Math.PI / 2 - 0.02}
              target={[0, 2.5, 0]}
              autoRotate={false}
              touches={{
                ONE: 1, // TOUCH.ROTATE
                TWO: 2, // TOUCH.DOLLY_PAN
              }}
            />
          </Canvas>
        </Suspense>
      </div>
    </ModelErrorBoundary>
  );
}
