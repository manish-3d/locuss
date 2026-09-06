/**
 * generate-demo-model.ts
 *
 * Generates a minimal glTF Binary (.glb) file containing a modern architectural
 * pavilion structure for Stage 12.2 development & testing.
 *
 * Run with:  npx tsx scripts/generate-demo-model.ts
 *
 * Output:    public/models/property-demo.glb
 *
 * No WebGL, no external tools — pure Node.js Buffer construction following the
 * glTF 2.0 / GLB binary container spec.
 */

import * as fs from "fs";
import * as path from "path";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** sRGB hex (#rrggbb) → linear RGB [0‑1, 0‑1, 0‑1] */
function hexToLinear(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [lin(r), lin(g), lin(b)];
}

/**
 * Create an axis-aligned box with per-face normals.
 * Returns 24 vertices (4 per face × 6 faces) and 36 indices.
 * Position is baked into vertex data (no separate transform needed).
 */
function createBox(
  w: number,
  h: number,
  d: number,
  tx: number,
  ty: number,
  tz: number
) {
  const hw = w / 2,
    hh = h / 2,
    hd = d / 2;

  const faces: { corners: number[][]; normal: number[] }[] = [
    {
      corners: [
        [-hw, -hh, hd],
        [hw, -hh, hd],
        [hw, hh, hd],
        [-hw, hh, hd],
      ],
      normal: [0, 0, 1],
    }, // front (+Z)
    {
      corners: [
        [hw, -hh, -hd],
        [-hw, -hh, -hd],
        [-hw, hh, -hd],
        [hw, hh, -hd],
      ],
      normal: [0, 0, -1],
    }, // back  (-Z)
    {
      corners: [
        [-hw, hh, hd],
        [hw, hh, hd],
        [hw, hh, -hd],
        [-hw, hh, -hd],
      ],
      normal: [0, 1, 0],
    }, // top   (+Y)
    {
      corners: [
        [-hw, -hh, -hd],
        [hw, -hh, -hd],
        [hw, -hh, hd],
        [-hw, -hh, hd],
      ],
      normal: [0, -1, 0],
    }, // bottom(-Y)
    {
      corners: [
        [hw, -hh, hd],
        [hw, -hh, -hd],
        [hw, hh, -hd],
        [hw, hh, hd],
      ],
      normal: [1, 0, 0],
    }, // right (+X)
    {
      corners: [
        [-hw, -hh, -hd],
        [-hw, -hh, hd],
        [-hw, hh, hd],
        [-hw, hh, -hd],
      ],
      normal: [-1, 0, 0],
    }, // left  (-X)
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  let vi = 0;

  for (const f of faces) {
    for (const c of f.corners) {
      positions.push(c[0] + tx, c[1] + ty, c[2] + tz);
      normals.push(f.normal[0], f.normal[1], f.normal[2]);
    }
    indices.push(vi, vi + 1, vi + 2, vi, vi + 2, vi + 3);
    vi += 4;
  }

  return { positions, normals, indices };
}

// ─── Architectural Elements ──────────────────────────────────────────────────

interface Element {
  name: string;
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z: number;
  color: string;
  roughness: number;
  metalness: number;
}

const elements: Element[] = [
  // Terrace platform
  {
    name: "Terrace",
    w: 10,
    h: 0.1,
    d: 8,
    x: 0,
    y: 0.05,
    z: 0.5,
    color: "#dcd3c3",
    roughness: 0.85,
    metalness: 0,
  },
  // Floor slab
  {
    name: "Floor",
    w: 7,
    h: 0.2,
    d: 6,
    x: 0,
    y: 0.1,
    z: 0,
    color: "#e5ddd0",
    roughness: 0.75,
    metalness: 0.05,
  },
  // Back wall
  {
    name: "BackWall",
    w: 6.6,
    h: 2.6,
    d: 0.2,
    x: 0,
    y: 1.5,
    z: -2.8,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Left wall
  {
    name: "LeftWall",
    w: 0.2,
    h: 2.6,
    d: 5.4,
    x: -3.3,
    y: 1.5,
    z: 0,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Right wall – lower solid
  {
    name: "RightWallLower",
    w: 0.2,
    h: 1.0,
    d: 5.4,
    x: 3.3,
    y: 0.7,
    z: 0,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Right wall – upper beam
  {
    name: "RightWallUpper",
    w: 0.2,
    h: 0.4,
    d: 5.4,
    x: 3.3,
    y: 2.6,
    z: 0,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Right wall – front pillar
  {
    name: "RightPillarFront",
    w: 0.2,
    h: 2.6,
    d: 0.6,
    x: 3.3,
    y: 1.5,
    z: 2.4,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Right wall – back pillar
  {
    name: "RightPillarBack",
    w: 0.2,
    h: 2.6,
    d: 0.6,
    x: 3.3,
    y: 1.5,
    z: -2.4,
    color: "#f7f3ec",
    roughness: 0.85,
    metalness: 0,
  },
  // Flat roof slab (cantilevered)
  {
    name: "Roof",
    w: 7.4,
    h: 0.18,
    d: 6.4,
    x: 0,
    y: 2.89,
    z: 0,
    color: "#2d2925",
    roughness: 0.5,
    metalness: 0.2,
  },
  // Interior gold accent pillar
  {
    name: "GoldPillar",
    w: 0.3,
    h: 2.4,
    d: 0.3,
    x: 1.5,
    y: 1.4,
    z: -1.0,
    color: "#b8924a",
    roughness: 0.35,
    metalness: 0.65,
  },
  // Interior dark hearth slab
  {
    name: "Hearth",
    w: 2.4,
    h: 0.25,
    d: 1.2,
    x: -1.0,
    y: 0.325,
    z: -1.4,
    color: "#3e3933",
    roughness: 0.6,
    metalness: 0,
  },
  // Seating block
  {
    name: "Seating",
    w: 2.0,
    h: 0.4,
    d: 1.4,
    x: -0.8,
    y: 0.4,
    z: 0.8,
    color: "#ece5d8",
    roughness: 0.9,
    metalness: 0,
  },
  // Seating backrest
  {
    name: "SeatBack",
    w: 2.0,
    h: 0.3,
    d: 0.25,
    x: -0.8,
    y: 0.65,
    z: 1.4,
    color: "#ded5c4",
    roughness: 0.9,
    metalness: 0,
  },
  // Table / podium
  {
    name: "Table",
    w: 0.9,
    h: 0.35,
    d: 0.9,
    x: 1.4,
    y: 0.375,
    z: 0.8,
    color: "#b8924a",
    roughness: 0.4,
    metalness: 0.4,
  },
  // Entry step
  {
    name: "EntryStep",
    w: 2.8,
    h: 0.08,
    d: 1.0,
    x: 0,
    y: 0.04,
    z: 3.5,
    color: "#ded7cb",
    roughness: 0.7,
    metalness: 0,
  },
];

// ─── Build GLB ───────────────────────────────────────────────────────────────

function buildGLB(): Buffer {
  // Per-element vertex data
  const meshData = elements.map((el) =>
    createBox(el.w, el.h, el.d, el.x, el.y, el.z)
  );

  const VERTS_PER_BOX = 24;
  const IDXS_PER_BOX = 36;
  const POS_BYTES = VERTS_PER_BOX * 3 * 4; // 288
  const NORM_BYTES = VERTS_PER_BOX * 3 * 4; // 288
  const IDX_BYTES = IDXS_PER_BOX * 2; // 72 → 648 total, already 4-byte aligned

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bufferViews: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessors: any[] = [];

  let byteOffset = 0;

  for (let i = 0; i < elements.length; i++) {
    const posArr = new Float32Array(meshData[i].positions);

    // Compute AABB for position accessor (required by spec)
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;
    for (let v = 0; v < posArr.length; v += 3) {
      if (posArr[v] < minX) minX = posArr[v];
      if (posArr[v + 1] < minY) minY = posArr[v + 1];
      if (posArr[v + 2] < minZ) minZ = posArr[v + 2];
      if (posArr[v] > maxX) maxX = posArr[v];
      if (posArr[v + 1] > maxY) maxY = posArr[v + 1];
      if (posArr[v + 2] > maxZ) maxZ = posArr[v + 2];
    }

    // POSITION bufferView + accessor
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: POS_BYTES,
      target: 34962,
    });
    accessors.push({
      bufferView: bufferViews.length - 1,
      componentType: 5126,
      count: VERTS_PER_BOX,
      type: "VEC3",
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    });
    byteOffset += POS_BYTES;

    // NORMAL bufferView + accessor
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: NORM_BYTES,
      target: 34962,
    });
    accessors.push({
      bufferView: bufferViews.length - 1,
      componentType: 5126,
      count: VERTS_PER_BOX,
      type: "VEC3",
    });
    byteOffset += NORM_BYTES;

    // INDEX bufferView + accessor
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: IDX_BYTES,
      target: 34963,
    });
    accessors.push({
      bufferView: bufferViews.length - 1,
      componentType: 5123,
      count: IDXS_PER_BOX,
      type: "SCALAR",
    });
    byteOffset += IDX_BYTES;

    // Pad to 4-byte boundary
    const pad = (4 - (byteOffset % 4)) % 4;
    byteOffset += pad;
  }

  const totalBinSize = byteOffset;

  // Materials
  const materials = elements.map((el) => {
    const [r, g, b] = hexToLinear(el.color);
    return {
      name: el.name + "Mat",
      pbrMetallicRoughness: {
        baseColorFactor: [
          parseFloat(r.toFixed(6)),
          parseFloat(g.toFixed(6)),
          parseFloat(b.toFixed(6)),
          1.0,
        ],
        metallicFactor: el.metalness,
        roughnessFactor: el.roughness,
      },
    };
  });

  // Meshes
  const meshes = elements.map((_, i) => ({
    name: elements[i].name,
    primitives: [
      {
        attributes: { POSITION: i * 3, NORMAL: i * 3 + 1 },
        indices: i * 3 + 2,
        material: i,
      },
    ],
  }));

  // Nodes: root + one child per mesh
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    {
      name: "PropertyModel",
      children: elements.map((_, i) => i + 1),
    },
    ...elements.map((el, i) => ({
      name: el.name,
      mesh: i,
    })),
  ];

  // Scene
  const gltf = {
    asset: { version: "2.0", generator: "Locus Stage 12.2" },
    scene: 0,
    scenes: [{ name: "PropertyScene", nodes: [0] }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: totalBinSize }],
  };

  // ── Write binary vertex data ──
  const binBuf = Buffer.alloc(totalBinSize);
  let off = 0;

  for (let i = 0; i < elements.length; i++) {
    const pos = new Float32Array(meshData[i].positions);
    const nrm = new Float32Array(meshData[i].normals);
    const idx = new Uint16Array(meshData[i].indices);

    Buffer.from(pos.buffer, pos.byteOffset, pos.byteLength).copy(binBuf, off);
    off += POS_BYTES;

    Buffer.from(nrm.buffer, nrm.byteOffset, nrm.byteLength).copy(binBuf, off);
    off += NORM_BYTES;

    Buffer.from(idx.buffer, idx.byteOffset, idx.byteLength).copy(binBuf, off);
    off += IDX_BYTES;

    // Pad to 4-byte
    const pad = (4 - (off % 4)) % 4;
    off += pad;
  }

  // ── Assemble GLB container ──
  const jsonStr = JSON.stringify(gltf);
  const jsonPadLen = (4 - (jsonStr.length % 4)) % 4;
  const jsonBuf = Buffer.from(jsonStr + " ".repeat(jsonPadLen), "utf8");

  const binPadLen = (4 - (binBuf.length % 4)) % 4;
  const binPadded = Buffer.alloc(binBuf.length + binPadLen);
  binBuf.copy(binPadded);

  const totalLen = 12 + 8 + jsonBuf.length + 8 + binPadded.length;
  const glb = Buffer.alloc(totalLen);
  let p = 0;

  // Header
  glb.writeUInt32LE(0x46546c67, p);
  p += 4; // magic  "glTF"
  glb.writeUInt32LE(2, p);
  p += 4; // version
  glb.writeUInt32LE(totalLen, p);
  p += 4; // total length

  // JSON chunk
  glb.writeUInt32LE(jsonBuf.length, p);
  p += 4; // chunk length
  glb.writeUInt32LE(0x4e4f534a, p);
  p += 4; // chunk type "JSON"
  jsonBuf.copy(glb, p);
  p += jsonBuf.length;

  // BIN chunk
  glb.writeUInt32LE(binPadded.length, p);
  p += 4; // chunk length
  glb.writeUInt32LE(0x004e4942, p);
  p += 4; // chunk type "BIN\0"
  binPadded.copy(glb, p);

  return glb;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const outDir = path.resolve(process.cwd(), "public", "models");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "property-demo.glb");
const glb = buildGLB();
fs.writeFileSync(outPath, glb);

console.log(`✓ Generated GLB: ${outPath}  (${glb.length} bytes)`);
