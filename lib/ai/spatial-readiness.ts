/**
 * Stage 12 Preparation: Architectural Extension Point for 3D Property Intelligence.
 *
 * HARD STOP ENFORCEMENT:
 * Stage 12 is NOT implemented in this phase.
 * No 3D dependencies (Three.js, React Three Fiber), scenes, navigation tools, camera controls,
 * or room graphs are created here.
 *
 * This minimal abstraction defines the boundary contract so that Stage 12 can plug in
 * spatial navigation tools and room-graph models without refactoring the AI Broker orchestrator.
 */

export interface PropertySpatialMetadata {
  /**
   * Whether 3D digital twin / spatial tour is available for this property listing.
   */
  hasSpatialModel?: boolean;
  /**
   * Spatial asset URI or room graph identifier (for future Stage 12 loader).
   */
  spatialModelId?: string;
}

/**
 * Extension hook definition for registering spatial navigation tools in Stage 12.
 * The AI broker orchestrator in `app/api/ai/chat/route.ts` can accept spatial tools
 * through this interface when Stage 12 is activated.
 */
export interface SpatialIntelligenceExtension {
  isAvailable(propertyId: string): Promise<boolean>;
  getSpatialMetadata(propertyId: string): Promise<PropertySpatialMetadata | null>;
}

import { getPropertyGraph } from "@/lib/spatial";

/**
 * Spatial Extension implementation for Stage 12 3D Property Intelligence.
 * Checks whether a 3D digital twin exists for the requested property.
 */
export const defaultSpatialExtension: SpatialIntelligenceExtension = {
  async isAvailable(propertyId: string) {
    return Boolean(getPropertyGraph(propertyId));
  },
  async getSpatialMetadata(propertyId: string) {
    const graph = getPropertyGraph(propertyId);
    if (!graph) return null;
    return {
      hasSpatialModel: true,
      spatialModelId: graph.propertyId,
    };
  },
};

