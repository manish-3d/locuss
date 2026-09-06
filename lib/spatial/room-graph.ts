/**
 * Room Graph — Semantic spatial representation of a property.
 *
 * Each room has an ID, human-readable name, type, description,
 * connected rooms, and camera viewpoint data used by the navigation layer.
 *
 * The AI reasons purely in terms of room IDs and names.
 * Camera coordinates are an implementation detail of the navigation system.
 */

export interface RoomNode {
  /** Unique stable identifier, e.g. "kitchen" */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Semantic room type */
  type:
    | "entrance"
    | "living"
    | "kitchen"
    | "bedroom"
    | "bathroom"
    | "hallway"
    | "balcony"
    | "dining"
    | "study"
    | "utility"
    | "garage"
    | "other";
  /** Short natural-language description for AI narration */
  description: string;
  /** IDs of directly connected / adjacent rooms */
  connectedRooms: string[];
  /** Floor or level (0-indexed) */
  floor?: number;
  /** Approximate 3D center of the room for spatial markers */
  center?: [number, number, number];
  /** Camera viewpoint when visiting this room */
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface PropertyRoomGraph {
  /** Property identifier this graph belongs to */
  propertyId: string;
  /** Human-readable property name */
  propertyName: string;
  /** All rooms keyed by ID */
  rooms: Record<string, RoomNode>;
  /** Ordered list of room IDs for a suggested default tour */
  defaultTourRoute: string[];
  /** ID of the room the camera starts at */
  defaultRoom: string;
}

/**
 * Look up a room by ID, returning null if not found.
 */
export function getRoom(
  graph: PropertyRoomGraph,
  roomId: string
): RoomNode | null {
  return graph.rooms[roomId] ?? null;
}

/**
 * Get all rooms as a flat array.
 */
export function getAllRooms(graph: PropertyRoomGraph): RoomNode[] {
  return Object.values(graph.rooms);
}

/**
 * Get rooms connected to a given room.
 */
export function getConnectedRooms(
  graph: PropertyRoomGraph,
  roomId: string
): RoomNode[] {
  const room = getRoom(graph, roomId);
  if (!room) return [];
  return room.connectedRooms
    .map((id) => getRoom(graph, id))
    .filter(Boolean) as RoomNode[];
}

/**
 * Find a room by fuzzy name match (case-insensitive substring).
 * Returns the first match or null.
 */
export function findRoomByName(
  graph: PropertyRoomGraph,
  query: string
): RoomNode | null {
  const q = query.toLowerCase().trim();
  // Exact ID match first
  if (graph.rooms[q]) return graph.rooms[q];
  // Name match
  for (const room of Object.values(graph.rooms)) {
    if (room.name.toLowerCase() === q) return room;
  }
  // Substring match
  for (const room of Object.values(graph.rooms)) {
    if (room.name.toLowerCase().includes(q) || room.id.includes(q))
      return room;
  }
  return null;
}
