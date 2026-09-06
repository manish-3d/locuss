"use client";

import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Path to the luxury coastal hillside villa GLB asset served from /public */
const MODEL_PATH = "/models/modern_coastal_hillside_villa.glb";

export type RoofMode = "cutaway" | "ground" | "exterior";

interface PropertyModelProps {
  /** Override position – defaults to aligned origin offset */
  position?: [number, number, number];
  /** Override uniform scale – defaults to 0.1 for normalized Three.js units */
  scale?: number;
  /** Override Y rotation in radians */
  rotation?: number;
  /** Cutaway / roof visibility mode: 'cutaway' (roof removed), 'ground' (cut to floor 0), 'exterior' (full roof) */
  roofMode?: RoofMode;
  /** Whether to hide large obstructing trees that block the interior view (default true in cutaway) */
  hideTrees?: boolean;
}

/**
 * Loads and renders the Modern Coastal Hillside Villa GLB model.
 *
 * Supports dollhouse / cutaway viewing by removing the roof, ceiling slabs,
 * and obstructing tree foliage, plus applying a horizontal clipping plane so
 * users can see inside all rooms and get a full unobstructed view of the property.
 */
export function PropertyModel({
  position = [1.294, -1.134, 4.742],
  scale = 0.1,
  rotation = 0,
  roofMode = "cutaway",
  hideTrees = true,
}: PropertyModelProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const { gl } = useThree();

  // Enable Three.js local clipping on renderer
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // Define clipping plane based on roofMode
  // Normal (0, -1, 0) clips away geometry with Y > cutHeight
  const clippingPlanes = useMemo(() => {
    if (roofMode === "exterior") return [];
    const cutHeight = roofMode === "ground" ? 4.2 : 6.35;
    return [new THREE.Plane(new THREE.Vector3(0, -1, 0), cutHeight)];
  }, [roofMode]);

  // Apply shadows, clipping planes, and visibility rules
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const nameLower = mesh.name.toLowerCase();

        // 1. Roof & ceiling slabs
        const isRoofMesh =
          mesh.name.includes("Cube003") ||
          mesh.name.includes("Cube029") ||
          (roofMode === "ground" && mesh.name.includes("Cube026"));

        // 2. Obstructing trees (Oak tree and Dogwood trees)
        // These are tall exterior trees that block camera sightlines into the house
        const isTreeMesh =
          nameLower.includes("tree") ||
          nameLower.includes("oak") ||
          nameLower.includes("dogwood");

        if (isRoofMesh) {
          mesh.visible = roofMode === "exterior";
        } else if (isTreeMesh && hideTrees && roofMode !== "exterior") {
          // Hide obstructing trees in cutaway modes so rooms are clearly visible
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }

        // Apply clipping planes to materials
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.clippingPlanes = clippingPlanes;
              mat.clipShadows = true;
              mat.needsUpdate = true;
            });
          } else {
            mesh.material.clippingPlanes = clippingPlanes;
            mesh.material.clipShadows = true;
            mesh.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, clippingPlanes, roofMode, hideTrees]);

  return (
    <primitive
      object={scene}
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    />
  );
}

// Preload the model for faster initial render
useGLTF.preload(MODEL_PATH);
