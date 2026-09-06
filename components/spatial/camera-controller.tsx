"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RoomNode } from "@/lib/spatial";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsInstance = any;

interface CameraControllerProps {
  /** The target room to animate towards */
  targetRoom: RoomNode | null;
  /** Controls instance ref */
  controlsRef: React.RefObject<OrbitControlsInstance | null>;
  /** Callback fired when transition completes */
  onTransitionComplete?: () => void;
  /** Duration in milliseconds */
  durationMs?: number;
}

/** Cubic ease-in-out curve for natural architectural camera movement */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CameraController({
  targetRoom,
  controlsRef,
  onTransitionComplete,
  durationMs = 1500,
}: CameraControllerProps) {
  const { camera } = useThree();

  const animationState = useRef<{
    isAnimating: boolean;
    startTime: number;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
  }>({
    isAnimating: false,
    startTime: 0,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  });

  const lastTargetId = useRef<string | null>(null);

  useEffect(() => {
    if (!targetRoom) {
      lastTargetId.current = null;
      return;
    }

    // Only start a transition if the room changed
    if (targetRoom.id === lastTargetId.current && !animationState.current.isAnimating) {
      return;
    }

    lastTargetId.current = targetRoom.id;

    const controls = controlsRef.current;
    const currentTarget = controls?.target
      ? (controls.target as THREE.Vector3).clone()
      : new THREE.Vector3(0, 1.2, 0);

    animationState.current = {
      isAnimating: true,
      startTime: performance.now(),
      startPos: camera.position.clone(),
      endPos: new THREE.Vector3(...targetRoom.camera.position),
      startTarget: currentTarget,
      endTarget: new THREE.Vector3(...targetRoom.camera.target),
    };
  }, [targetRoom, camera, controlsRef]);

  useFrame(() => {
    const state = animationState.current;
    if (!state.isAnimating) return;

    const elapsed = performance.now() - state.startTime;
    const t = Math.min(1, Math.max(0, elapsed / durationMs));
    const ease = easeInOutCubic(t);

    camera.position.lerpVectors(state.startPos, state.endPos, ease);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerpVectors(state.startTarget, state.endTarget, ease);
      controls.update();
    } else {
      camera.lookAt(
        new THREE.Vector3().lerpVectors(state.startTarget, state.endTarget, ease)
      );
    }

    if (t >= 1) {
      state.isAnimating = false;
      onTransitionComplete?.();
    }
  });

  return null;
}
