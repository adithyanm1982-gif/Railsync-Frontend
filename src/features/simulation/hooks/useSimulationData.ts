import { useMemo } from 'react';
import { generateFleet } from '../canvas/physics/TrainMotionCalculator';
import { REAL_SCHEDULE_ENTRIES } from '../data/realSchedules';

/**
 * Central data source for the simulation engine. scheduleEntries is
 * the real 108-entry backend dataset (data/realSchedules.ts); trains
 * are synthetic since no live train-position feed exists yet (see
 * TrainMotionCalculator's generateFleet doc comment). Swap trains for
 * a live feed later without touching the renderer.
 */
export function useSimulationData() {
  return useMemo(
    () => ({
      trains: generateFleet(),
      scheduleEntries: REAL_SCHEDULE_ENTRIES,
    }),
    []
  );
}
