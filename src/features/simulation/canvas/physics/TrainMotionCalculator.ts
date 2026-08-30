import { SimTrain, TrackOccupancyState } from '../../types';
import { TOTAL_LINE_LENGTH, STATION_SPACING } from '../topology/lineGeometry';

/**
 * No live train-position feed exists in the real backend data (the
 * 108 schedule entries are maintenance blocks, not train telemetry --
 * expected_train_count is 0/UNKNOWN on every entry). Trains are
 * therefore synthetic, generated once and animated continuously
 * across the full real 7-day timeline so the simulation still reads
 * as a live railway. Swap generateFleet() for a real feed later
 * without touching the renderer.
 */
export function generateFleet(): SimTrain[] {
  return [
    { id: 'EXP-201', type: 'Express', speedKmh: 115, delayMin: 0, status: 'MOVING', laneIndex: 0, direction: 1, startOffsetSec: 0 },
    { id: 'EXP-203', type: 'Express', speedKmh: 135, delayMin: 191, status: 'MOVING', laneIndex: 0, direction: -1, startOffsetSec: 4000 },
    { id: 'VB-303', type: 'Vande Bharat', speedKmh: 130, delayMin: 0, status: 'MOVING', laneIndex: 3, direction: 1, startOffsetSec: 9000 },
    { id: 'VB-305', type: 'Vande Bharat', speedKmh: 130, delayMin: 0, status: 'MOVING', laneIndex: 3, direction: -1, startOffsetSec: 15000 },
    { id: 'GDS-88A', type: 'Goods', speedKmh: 60, delayMin: 0, status: 'WAIT', laneIndex: 1, direction: 1, startOffsetSec: 2000 },
    { id: 'GDS-90B', type: 'Goods', speedKmh: 55, delayMin: 0, status: 'HOLD', laneIndex: 2, direction: -1, startOffsetSec: 21000 },
    { id: 'STB-410', type: 'Suburban', speedKmh: 0, delayMin: 0, status: 'STABLED', laneIndex: 0, direction: 1, startOffsetSec: 0 },
    { id: 'STB-412', type: 'Suburban', speedKmh: 0, delayMin: 0, status: 'STABLED', laneIndex: 0, direction: -1, startOffsetSec: 0 },
  ];
}

export interface TrainWorldPosition {
  trainId: string;
  worldX: number;
  laneIndex: number;
  speedKmh: number;
  isMoving: boolean;
  occupancy: TrackOccupancyState;
}

const END_TO_END_TRAVEL_SECONDS = 5400; // ~90min to traverse the whole line at typical speed
const TURNAROUND_DWELL_SECONDS = 900;

/**
 * Interpolates a train's world-x position at a given absolute
 * timeline second using a simple back-and-forth traversal of the full
 * line, phase-offset by startOffsetSec so trains are spread out
 * rather than moving in lockstep.
 */
export function computeTrainPosition(train: SimTrain, absoluteSeconds: number): TrainWorldPosition {
  if (train.status === 'STABLED') {
    const worldX = train.direction === 1 ? 4 : TOTAL_LINE_LENGTH - 4;
    return {
      trainId: train.id,
      worldX,
      laneIndex: train.laneIndex,
      speedKmh: 0,
      isMoving: false,
      occupancy: 'CLEAR',
    };
  }

  const cycleLength = END_TO_END_TRAVEL_SECONDS + TURNAROUND_DWELL_SECONDS;
  const phase = (((absoluteSeconds + train.startOffsetSec) % cycleLength) + cycleLength) % cycleLength;

  const isDwelling = phase >= END_TO_END_TRAVEL_SECONDS;
  const travelT = isDwelling ? 1 : phase / END_TO_END_TRAVEL_SECONDS;

  const forwardX = travelT * TOTAL_LINE_LENGTH;
  const worldX = train.direction === 1 ? forwardX : TOTAL_LINE_LENGTH - forwardX;

  const status = train.status === 'HOLD' || train.status === 'WAIT' ? train.status : isDwelling ? 'WAIT' : 'MOVING';

  return {
    trainId: train.id,
    worldX,
    laneIndex: train.laneIndex,
    speedKmh: status === 'MOVING' ? train.speedKmh : 0,
    isMoving: status === 'MOVING',
    occupancy: status === 'MOVING' ? 'OCCUPIED' : status === 'WAIT' || status === 'HOLD' ? 'RESERVED' : 'CLEAR',
  };
}

export function computeAllTrainPositions(trains: SimTrain[], absoluteSeconds: number): TrainWorldPosition[] {
  return trains.map((t) => computeTrainPosition(t, absoluteSeconds));
}

/** Which corridor (station-pair, order 0-3) a world-x position currently falls within. */
export function corridorOrderForWorldX(worldX: number): number {
  return Math.min(3, Math.max(0, Math.floor(worldX / STATION_SPACING)));
}
