/**
 * Curated spatial metadata for the Modern Coastal Hillside Villa GLB
 * (public/models/modern_coastal_hillside_villa.glb).
 *
 * Camera positions and targets are calibrated to the architectural structure
 * including the infinity pool, poolside sun deck, outdoor dining terrace,
 * living lounge, landscaped bonsai garden, carport with Porsche, and upper master suite.
 */

import type { PropertyRoomGraph } from "./room-graph";

export const DEMO_PROPERTY_GRAPH: PropertyRoomGraph = {
  propertyId: "demo-property-001",
  propertyName: "Modern Coastal Hillside Villa",
  defaultRoom: "entrance",
  defaultTourRoute: [
    "carport",
    "garden",
    "entrance",
    "living-room",
    "terrace",
    "pool",
    "sun-deck",
    "master-bedroom",
  ],
  rooms: {
    entrance: {
      id: "entrance",
      name: "Villa Foyer & Entrance",
      type: "entrance",
      description:
        "Architectural entrance foyer featuring double-height ceiling, glass paneling, and warm wood accents with direct sightlines into the central atrium and pool terrace beyond.",
      connectedRooms: ["living-room", "garden", "carport", "master-bedroom"],
      floor: 0,
      center: [2.74, 3.53, 1.82],
      camera: {
        position: [6.0, 5.2, 5.5],
        target: [2.74, 3.53, 1.82],
      },
    },
    "living-room": {
      id: "living-room",
      name: "Living & Dining Lounge",
      type: "living",
      description:
        "Expansive open-plan living and formal dining lounge with designer seating, plush rug surfaces, and floor-to-ceiling sliding glass doors opening onto the pool terrace.",
      connectedRooms: ["entrance", "terrace", "pool", "master-bedroom"],
      floor: 0,
      center: [-2.89, 3.07, -0.13],
      camera: {
        position: [-0.2, 4.8, 3.5],
        target: [-2.89, 3.07, -0.13],
      },
    },
    terrace: {
      id: "terrace",
      name: "Outdoor Dining Terrace",
      type: "balcony",
      description:
        "Al fresco dining terrace overlooking the infinity swimming pool and coastal hillside landscape, equipped with modern glass outdoor dining furniture.",
      connectedRooms: ["living-room", "pool", "sun-deck"],
      floor: 0,
      center: [-1.55, 3.06, -2.92],
      camera: {
        position: [-4.5, 4.8, -0.2],
        target: [-1.55, 3.06, -2.92],
      },
    },
    pool: {
      id: "pool",
      name: "Infinity Swimming Pool",
      type: "living",
      description:
        "Stunning private infinity swimming pool with crystalline water reflections, seamless stone coping, and hillside ocean views.",
      connectedRooms: ["terrace", "sun-deck", "living-room"],
      floor: 0,
      center: [2.93, 2.63, -6.98],
      camera: {
        position: [7.2, 5.2, -3.8],
        target: [2.93, 2.63, -6.98],
      },
    },
    "sun-deck": {
      id: "sun-deck",
      name: "Poolside Sun Deck",
      type: "balcony",
      description:
        "Private sunbathing deck furnished with luxury loungers and sunbeds, basking in all-day coastal sunlight right alongside the pool.",
      connectedRooms: ["pool", "terrace"],
      floor: 0,
      center: [4.64, 3.12, -4.95],
      camera: {
        position: [8.2, 4.8, -2.0],
        target: [4.64, 3.12, -4.95],
      },
    },
    "master-bedroom": {
      id: "master-bedroom",
      name: "Upper Master Suite",
      type: "bedroom",
      description:
        "Elevated upper-level master sanctuary featuring private balcony access, panoramic coastal vistas, and premium architectural finishes.",
      connectedRooms: ["entrance", "living-room", "balcony"],
      floor: 1,
      center: [0.29, 5.61, 1.27],
      camera: {
        position: [3.2, 7.5, 4.8],
        target: [0.29, 5.61, 1.27],
      },
    },
    garden: {
      id: "garden",
      name: "Landscaped Bonsai Garden",
      type: "entrance",
      description:
        "Curated front garden featuring specimen bonsai trees, mature dogwoods, stone pathways, and lush coastal hillside landscaping.",
      connectedRooms: ["entrance", "carport"],
      floor: 0,
      center: [4.82, 3.19, 7.27],
      camera: {
        position: [8.0, 5.0, 10.5],
        target: [4.82, 3.19, 7.27],
      },
    },
    carport: {
      id: "carport",
      name: "Carport & Driveway",
      type: "entrance",
      description:
        "Designer hillside driveway and covered car porch featuring a parked luxury Porsche sports car and architectural exterior lighting.",
      connectedRooms: ["garden", "entrance"],
      floor: 0,
      center: [-2.02, 1.29, 7.85],
      camera: {
        position: [-5.8, 3.2, 11.2],
        target: [-2.02, 1.29, 7.85],
      },
    },
    dining: {
      id: "dining",
      name: "Outdoor Dining Terrace",
      type: "dining",
      description:
        "Al fresco dining terrace overlooking the infinity swimming pool and coastal hillside landscape.",
      connectedRooms: ["living-room", "pool"],
      floor: 0,
      center: [-1.55, 3.06, -2.92],
      camera: {
        position: [-4.5, 4.8, -0.2],
        target: [-1.55, 3.06, -2.92],
      },
    },
    kitchen: {
      id: "kitchen",
      name: "Kitchen & Dining",
      type: "kitchen",
      description:
        "Gourmet open-concept kitchen seamlessly integrated into the main living lounge.",
      connectedRooms: ["living-room", "terrace"],
      floor: 0,
      center: [-4.0, 3.07, -1.5],
      camera: {
        position: [-1.5, 4.5, 1.0],
        target: [-4.0, 3.07, -1.5],
      },
    },
    balcony: {
      id: "balcony",
      name: "Upper Suite Balcony",
      type: "balcony",
      description:
        "Private second-story open-air balcony extending from the master suite with panoramic views.",
      connectedRooms: ["master-bedroom"],
      floor: 1,
      center: [0.29, 5.61, -1.0],
      camera: {
        position: [2.5, 7.0, 1.5],
        target: [0.29, 5.61, -1.0],
      },
    },
  },
};

/**
 * Resolve a property graph by ID.
 * For now returns the curated coastal villa graph.
 */
export function getPropertyGraph(
  _propertyId?: string
): PropertyRoomGraph | null {
  return DEMO_PROPERTY_GRAPH;
}
