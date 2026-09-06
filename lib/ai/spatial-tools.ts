/**
 * AI Spatial Tools — server-side tool implementations for the AI broker.
 *
 * These are pure data functions. Navigation/camera tools return action
 * descriptors that the client interprets and executes.
 */

import {
  getPropertyGraph,
  getAllRooms,
  getRoom,
  getConnectedRooms,
  findRoomByName,
} from "@/lib/spatial";
import type { RoomNode } from "@/lib/spatial";

/** Simplified room info returned to the AI (no camera coords) */
interface RoomInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  connectedRooms: string[];
  floor?: number;
}

function toRoomInfo(room: RoomNode): RoomInfo {
  return {
    id: room.id,
    name: room.name,
    type: room.type,
    description: room.description,
    connectedRooms: room.connectedRooms,
    floor: room.floor,
  };
}

/**
 * Get all rooms in the property with their metadata.
 */
export async function getPropertyRooms(propertyId?: string) {
  const graph = getPropertyGraph(propertyId);
  if (!graph) {
    return { error: "No spatial data available for this property." };
  }

  const rooms = getAllRooms(graph).map(toRoomInfo);
  return {
    propertyId: graph.propertyId,
    propertyName: graph.propertyName,
    roomCount: rooms.length,
    rooms,
    defaultTourRoute: graph.defaultTourRoute,
  };
}

/**
 * Get detailed info about a specific room.
 */
export async function getRoomDetails(roomId: string, propertyId?: string) {
  const graph = getPropertyGraph(propertyId);
  if (!graph) {
    return { error: "No spatial data available for this property." };
  }

  // Try exact ID first, then fuzzy name match
  let room = getRoom(graph, roomId);
  if (!room) {
    room = findRoomByName(graph, roomId);
  }
  if (!room) {
    const available = getAllRooms(graph)
      .map((r) => `${r.name} (${r.id})`)
      .join(", ");
    return {
      error: `Room "${roomId}" not found. Available rooms: ${available}`,
    };
  }

  const connected = getConnectedRooms(graph, room.id).map(toRoomInfo);

  return {
    room: toRoomInfo(room),
    connectedRooms: connected,
  };
}

/**
 * Request navigation to a room. Returns a client-side action descriptor.
 * The AI broker sends this to the client which executes the camera transition.
 */
export async function goToRoom(roomId: string, propertyId?: string) {
  const graph = getPropertyGraph(propertyId);
  if (!graph) {
    return { error: "No spatial data available for this property." };
  }

  let room = getRoom(graph, roomId);
  if (!room) {
    room = findRoomByName(graph, roomId);
  }
  if (!room) {
    const available = getAllRooms(graph)
      .map((r) => `${r.name} (${r.id})`)
      .join(", ");
    return {
      error: `Room "${roomId}" not found. Available rooms: ${available}`,
    };
  }

  return {
    action: "navigateToRoom" as const,
    roomId: room.id,
    roomName: room.name,
    description: room.description,
  };
}

/**
 * Start an autonomous tour. Returns the tour route for the client.
 */
export async function startPropertyTour(propertyId?: string) {
  const graph = getPropertyGraph(propertyId);
  if (!graph) {
    return { error: "No spatial data available for this property." };
  }

  const route = graph.defaultTourRoute.map((id) => {
    const room = getRoom(graph, id);
    return room ? toRoomInfo(room) : null;
  }).filter(Boolean);

  return {
    action: "startTour" as const,
    propertyName: graph.propertyName,
    route,
    roomCount: route.length,
  };
}

/**
 * Get the current spatial context for AI reasoning.
 */
export async function getCurrentSpatialContext(
  currentRoomId: string | null,
  propertyId?: string
) {
  const graph = getPropertyGraph(propertyId);
  if (!graph) {
    return { error: "No spatial data available." };
  }

  if (!currentRoomId) {
    return {
      propertyName: graph.propertyName,
      currentRoom: null,
      availableRooms: getAllRooms(graph).map(toRoomInfo),
    };
  }

  const current = getRoom(graph, currentRoomId);
  if (!current) {
    return {
      propertyName: graph.propertyName,
      currentRoom: null,
      availableRooms: getAllRooms(graph).map(toRoomInfo),
    };
  }

  const nearby = getConnectedRooms(graph, currentRoomId).map(toRoomInfo);
  const allRooms = getAllRooms(graph).map(toRoomInfo);

  return {
    propertyName: graph.propertyName,
    currentRoom: toRoomInfo(current),
    nearbyRooms: nearby,
    allRooms,
  };
}
