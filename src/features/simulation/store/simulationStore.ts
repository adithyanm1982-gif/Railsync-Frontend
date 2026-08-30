import { create } from 'zustand';
import { SpeedMultiplier } from '../canvas/physics/TimelineClock';
import { HoverPopoverState } from '../types';

interface SimulationState {
  absoluteSeconds: number;
  isPlaying: boolean;
  speed: SpeedMultiplier;
  zoom: number;
  hoverPopover: HoverPopoverState | null;

  setAbsoluteSeconds: (s: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (s: SpeedMultiplier) => void;
  setZoom: (z: number) => void;
  setHoverPopover: (p: HoverPopoverState | null) => void;
}

/**
 * React-facing mirror of the imperative canvas engine's state
 * (TimelineClock, PanZoomController) so PlaybackControls/
 * DayNavigator/TimelineScrubber/popovers can re-render declaratively.
 * SimulationCanvas.tsx keeps this in sync with the underlying
 * imperative controllers.
 */
export const useSimulationStore = create<SimulationState>((set) => ({
  absoluteSeconds: 0,
  isPlaying: true,
  speed: 10,
  zoom: 1,
  hoverPopover: null,

  setAbsoluteSeconds: (s) => set({ absoluteSeconds: s }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (s) => set({ speed: s }),
  setZoom: (z) => set({ zoom: z }),
  setHoverPopover: (p) => set({ hoverPopover: p }),
}));
