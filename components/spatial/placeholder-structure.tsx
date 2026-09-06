import React from "react";

/**
 * Minimalist placeholder architectural structure for Stage 12.1.1.
 * Represents a minimalist modern pavilion / room volume.
 */
export function PlaceholderStructure() {
  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor Foundation Slab ── */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.4, 0.2, 5.4]} />
        <meshStandardMaterial color="#e5ddd0" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* ── Outer Terrace Platform ── */}
      <mesh position={[0.6, 0.05, 0.4]} receiveShadow>
        <boxGeometry args={[8.0, 0.1, 6.8]} />
        <meshStandardMaterial color="#dcd3c3" roughness={0.8} />
      </mesh>

      {/* ── Rear Wall ── */}
      <mesh position={[0, 1.4, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 2.4, 0.2]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>

      {/* ── Left Wall with Window Cutout Effect ── */}
      <mesh position={[-3.0, 1.4, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.4, 3.0]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>
      {/* Left Wall Front Pillar */}
      <mesh position={[-3.0, 1.4, 1.9]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.4, 1.0]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>
      {/* Left Window Header Beam */}
      <mesh position={[-3.0, 2.4, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.4, 1.8]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>

      {/* ── Right Wall Segment ── */}
      <mesh position={[3.0, 1.4, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.4, 2.8]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>
      {/* Right Wall Corner Pillar */}
      <mesh position={[3.0, 1.4, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.4, 0.8]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.85} />
      </mesh>

      {/* ── Modern Flat Roof Slab (Cantilevered) ── */}
      <mesh position={[0, 2.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 0.18, 5.8]} />
        <meshStandardMaterial color="#2d2925" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* ── Interior Minimalist Architectural Elements ── */}
      {/* Central Architectural Feature Pillar (Muted Gold / Bronze) */}
      <mesh position={[1.4, 1.3, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 2.2, 1.2]} />
        <meshStandardMaterial color="#b8924a" roughness={0.35} metalness={0.65} />
      </mesh>

      {/* Low Hearth / Platform Slab */}
      <mesh position={[-0.8, 0.3, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.25, 1.0]} />
        <meshStandardMaterial color="#3e3933" roughness={0.6} />
      </mesh>

      {/* Lounge Block / Placeholder Furniture */}
      <mesh position={[-0.6, 0.45, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.35, 1.2]} />
        <meshStandardMaterial color="#ece5d8" roughness={0.9} />
      </mesh>
      <mesh position={[-0.6, 0.65, 1.1]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.25, 0.25]} />
        <meshStandardMaterial color="#ded5c4" roughness={0.9} />
      </mesh>

      {/* Minimal Table / Accent Podium */}
      <mesh position={[1.2, 0.35, 0.6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 32]} />
        <meshStandardMaterial color="#b8924a" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Step Entry */}
      <mesh position={[0.2, 0.04, 3.2]} receiveShadow>
        <boxGeometry args={[2.4, 0.08, 0.8]} />
        <meshStandardMaterial color="#ded7cb" roughness={0.7} />
      </mesh>
    </group>
  );
}
