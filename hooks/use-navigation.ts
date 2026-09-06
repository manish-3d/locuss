"use client";

import { useCallback, useRef, useState } from "react";
import type { RoomNode, PropertyRoomGraph } from "@/lib/spatial/room-graph";

export interface NavigationState {
  /** Currently active room */
  currentRoom: RoomNode | null;
  /** Target room during transition, null when idle */
  targetRoom: RoomNode | null;
  /** Whether camera is currently animating */
  isTransitioning: boolean;
  /** Tour state */
  tour: TourState | null;
}

export interface TourState {
  route: string[];
  currentIndex: number;
  isPaused: boolean;
  isComplete: boolean;
}

export interface NavigationActions {
  goToRoom: (roomId: string) => void;
  resetView: () => void;
  startTour: (route?: string[]) => void;
  pauseTour: () => void;
  resumeTour: () => void;
  stopTour: () => void;
  skipTourStep: () => void;
  handleTransitionComplete: () => void;
}

interface UseNavigationOptions {
  graph: PropertyRoomGraph;
  /** Callback when active room changes */
  onRoomChange?: (room: RoomNode | null) => void;
  /** Default transition duration in ms */
  transitionDuration?: number;
  /** Delay between tour steps in ms */
  tourStepDelay?: number;
}

export function useNavigation({
  graph,
  onRoomChange,
  transitionDuration = 1400,
  tourStepDelay = 2800,
}: UseNavigationOptions): [NavigationState, NavigationActions] {
  const [currentRoom, setCurrentRoom] = useState<RoomNode | null>(
    graph.rooms[graph.defaultRoom] ?? null
  );
  const [targetRoom, setTargetRoom] = useState<RoomNode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tour, setTour] = useState<TourState | null>(null);

  // Transition synchronization and cancellation refs
  const transitionResolverRef = useRef<(() => void) | null>(null);
  const cancelRef = useRef<() => void>(() => {});
  const tourAbortRef = useRef<AbortController | null>(null);

  const handleTransitionComplete = useCallback(() => {
    if (transitionResolverRef.current) {
      transitionResolverRef.current();
      transitionResolverRef.current = null;
    }
  }, []);

  const navigateToRoom = useCallback(
    async (room: RoomNode, duration?: number) => {
      // Cancel any in-progress transition
      cancelRef.current();

      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
        if (transitionResolverRef.current) {
          transitionResolverRef.current();
          transitionResolverRef.current = null;
        }
      };

      setTargetRoom(room);
      setIsTransitioning(true);

      try {
        const timeoutMs = (duration ?? transitionDuration) + 600;
        await new Promise<void>((resolve) => {
          transitionResolverRef.current = resolve;
          const timer = setTimeout(() => {
            if (transitionResolverRef.current === resolve) {
              resolve();
              transitionResolverRef.current = null;
            }
          }, timeoutMs);

          // If cancelled before resolution
          const prevCancel = cancelRef.current;
          cancelRef.current = () => {
            clearTimeout(timer);
            prevCancel();
          };
        });

        if (!cancelled) {
          setCurrentRoom(room);
          setTargetRoom(null);
          onRoomChange?.(room);
        }
      } catch {
        // Animation was interrupted
      } finally {
        if (!cancelled) {
          setIsTransitioning(false);
        }
      }
    },
    [transitionDuration, onRoomChange]
  );

  const goToRoom = useCallback(
    (roomId: string) => {
      const room = graph.rooms[roomId];
      if (!room) return;
      // Stop any active tour
      tourAbortRef.current?.abort();
      setTour(null);
      navigateToRoom(room);
    },
    [graph, navigateToRoom]
  );

  const resetView = useCallback(() => {
    tourAbortRef.current?.abort();
    setTour(null);
    const defaultRoom = graph.rooms[graph.defaultRoom];
    if (defaultRoom) {
      navigateToRoom(defaultRoom);
    }
  }, [graph, navigateToRoom]);

  const runTour = useCallback(
    async (route: string[], startIndex: number, abort: AbortController) => {
      for (let i = startIndex; i < route.length; i++) {
        if (abort.signal.aborted) return;

        const room = graph.rooms[route[i]];
        if (!room) continue;

        setTour((prev) =>
          prev ? { ...prev, currentIndex: i, isPaused: false } : null
        );

        await navigateToRoom(room, transitionDuration);

        if (abort.signal.aborted) return;

        // Wait between rooms
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, tourStepDelay);
          const onAbort = () => {
            clearTimeout(timer);
            reject(new Error("aborted"));
          };
          abort.signal.addEventListener("abort", onAbort, { once: true });
        }).catch(() => {});

        if (abort.signal.aborted) return;
      }

      // Tour complete
      setTour((prev) =>
        prev ? { ...prev, isComplete: true, isPaused: false } : null
      );
    },
    [graph, navigateToRoom, transitionDuration, tourStepDelay]
  );

  const startTour = useCallback(
    (route?: string[]) => {
      tourAbortRef.current?.abort();

      const tourRoute = route ?? graph.defaultTourRoute;
      const abort = new AbortController();
      tourAbortRef.current = abort;

      setTour({
        route: tourRoute,
        currentIndex: 0,
        isPaused: false,
        isComplete: false,
      });

      runTour(tourRoute, 0, abort);
    },
    [graph, runTour]
  );

  const pauseTour = useCallback(() => {
    tourAbortRef.current?.abort();
    setTour((prev) => (prev ? { ...prev, isPaused: true } : null));
  }, []);

  const resumeTour = useCallback(() => {
    if (!tour || tour.isComplete) return;

    const abort = new AbortController();
    tourAbortRef.current = abort;

    setTour((prev) => (prev ? { ...prev, isPaused: false } : null));
    runTour(tour.route, tour.currentIndex, abort);
  }, [tour, runTour]);

  const stopTour = useCallback(() => {
    tourAbortRef.current?.abort();
    setTour(null);
  }, []);

  const skipTourStep = useCallback(() => {
    if (!tour || tour.isComplete) return;

    const nextIndex = tour.currentIndex + 1;
    if (nextIndex >= tour.route.length) {
      stopTour();
      return;
    }

    tourAbortRef.current?.abort();
    const abort = new AbortController();
    tourAbortRef.current = abort;

    setTour((prev) =>
      prev ? { ...prev, currentIndex: nextIndex, isPaused: false } : null
    );
    runTour(tour.route, nextIndex, abort);
  }, [tour, runTour, stopTour]);

  return [
    { currentRoom, targetRoom, isTransitioning, tour },
    {
      goToRoom,
      resetView,
      startTour,
      pauseTour,
      resumeTour,
      stopTour,
      skipTourStep,
      handleTransitionComplete,
    },
  ];
}
