export type LODLevel = 'MACRO' | 'MID' | 'MICRO';

const MID_THRESHOLD = 2.2;
const MICRO_THRESHOLD = 3.6;

export interface LODFlags {
  level: LODLevel;
  showBlockBoundaries: boolean; // always on -- blocks are the top-level invisible division
  showSubBlockBoundaries: boolean; // micro only -- finer invisible division inside a block
  showPlatformNumbers: boolean;
  showPointSwitchBlades: boolean;
  showSignalAspects: boolean;
  showCatenaryMarkers: boolean;
  showSensorReadouts: boolean; // micro only -- brake pressure / wheel accel style HUD text, like the reference art
  midOpacity: number; // 0..1 fade for mid-tier detail (signals, platform labels)
  microOpacity: number; // 0..1 fade for micro-tier detail (sub-blocks, sensors)
}

/**
 * Three-tier semantic zoom, matching the reference concept art:
 * - MACRO (1x): line overview, block boundaries, stations, trains.
 * - MID (~2.2x+): signal aspects, platform numbers, point switches fade in.
 * - MICRO (~3.6x+): invisible sub-block divisions become visible/labeled,
 *   plus sensor-readout HUD text (brake pressure, wheel accel, axle load)
 *   like image 3 in the brief.
 */
export function computeLOD(zoom: number): LODFlags {
  const level: LODLevel = zoom >= MICRO_THRESHOLD ? 'MICRO' : zoom >= MID_THRESHOLD ? 'MID' : 'MACRO';

  const midFadeStart = MID_THRESHOLD - 0.5;
  const midFadeEnd = MID_THRESHOLD + 0.5;
  const midOpacity = Math.max(0, Math.min(1, (zoom - midFadeStart) / (midFadeEnd - midFadeStart)));

  const microFadeStart = MICRO_THRESHOLD - 0.5;
  const microFadeEnd = MICRO_THRESHOLD + 0.5;
  const microOpacity = Math.max(0, Math.min(1, (zoom - microFadeStart) / (microFadeEnd - microFadeStart)));

  return {
    level,
    showBlockBoundaries: true,
    showSubBlockBoundaries: microOpacity > 0,
    showPlatformNumbers: midOpacity > 0,
    showPointSwitchBlades: midOpacity > 0,
    showSignalAspects: midOpacity > 0,
    showCatenaryMarkers: midOpacity > 0,
    showSensorReadouts: microOpacity > 0,
    midOpacity,
    microOpacity,
  };
}
