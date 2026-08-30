export type TrainCategory = 'PASSENGER' | 'EXPRESS' | 'GOODS' | 'SUBURBAN';

export type TrainMotionState = 'MOVING' | 'PARKED' | 'STABLED' | 'WAITING';

/**
 * A single scheduled movement entry for a train, used to drive the
 * simulation engine's TrainMotionCalculator across the 7-day loop.
 */
export interface TrainScheduleEntry {
  timestampSec: number; // seconds since 7-day loop start (0..604800)
  trackId: string;
  positionKm: number; // position along corridor
  speedKmh: number;
}

export interface Train {
  id: string;
  locoId: string;
  category: TrainCategory;
  route: string; // e.g. "Station A -> Station Beta"
  currentMotionState: TrainMotionState;
  delayVarianceMin: number;
  schedule: TrainScheduleEntry[];
}
