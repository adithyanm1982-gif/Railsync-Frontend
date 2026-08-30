import { BlockZone, Corridor, PointSwitch, Signal, Station, TrackSegment } from '@/shared/types/corridor';

/**
 * Static topology definition consumed by
 * features/simulation/canvas/topology/trackLayout.ts + blockZones.ts.
 *
 * Layout (left -> right, in corridor-km):
 *   Junction 1 (km 0-8):    4 mainlines fan out to 8 (mainlines/loop/sidings)
 *   Central Corridor (8-40): 8 merge back to 4, split into blocks B1-B6, stations along the way
 *   Junction 2 (40-48):     4 mainlines fan out to 8, merge back to 4 exiting right
 */

export const CORRIDOR_ID = 'CORR-CENTRAL-01';
export const JUNCTION_1_ID = 'JN-01';
export const JUNCTION_2_ID = 'JN-02';

export const mockTrackSegments: TrackSegment[] = [
  // Junction 1 approach (4 mainlines)
  ...[0, 1, 2, 3].map((i) => ({
    id: `J1-approach-${i}`,
    corridorId: CORRIDOR_ID,
    kind: 'MAINLINE' as const,
    laneIndex: i,
  })),
  // Junction 1 fan-out (8 lanes: mainline x4, loop x2, siding x2)
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `J1-fanout-${i}`,
    corridorId: CORRIDOR_ID,
    kind: (i < 4 ? 'MAINLINE' : i < 6 ? 'LOOP' : 'SIDING') as TrackSegment['kind'],
    laneIndex: i,
  })),
  // Central corridor (4 mainlines through B1-B6)
  ...[0, 1, 2, 3].map((i) => ({
    id: `corridor-${i}`,
    corridorId: CORRIDOR_ID,
    kind: 'MAINLINE' as const,
    laneIndex: i,
  })),
  // Junction 2 fan-out (8 lanes)
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `J2-fanout-${i}`,
    corridorId: CORRIDOR_ID,
    kind: (i < 4 ? 'MAINLINE' : i < 6 ? 'LOOP' : 'SIDING') as TrackSegment['kind'],
    laneIndex: i,
  })),
  // Junction 2 exit (4 mainlines)
  ...[0, 1, 2, 3].map((i) => ({
    id: `J2-exit-${i}`,
    corridorId: CORRIDOR_ID,
    kind: 'MAINLINE' as const,
    laneIndex: i,
  })),
];

export const mockBlockZones: BlockZone[] = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map((label, i) => ({
  id: label,
  corridorId: CORRIDOR_ID,
  label: `${label} · Automatic Track Circuit`,
  startKm: 12 + i * 6,
  endKm: 12 + (i + 1) * 6,
  trackCircuitIds: [0, 1, 2, 3].map((lane) => `${label}-tc-${lane}`),
}));

export const mockStations: Station[] = [
  {
    id: 'STN-A',
    name: 'Station A',
    corridorId: CORRIDOR_ID,
    positionKm: 20,
    platformIds: ['P1', 'P2'],
  },
  {
    id: 'STN-BETA',
    name: 'Stn. Beta',
    corridorId: CORRIDOR_ID,
    positionKm: 32,
    platformIds: ['P3', 'P4'],
  },
];

export const mockSignals: Signal[] = [
  { id: 'SIG-J1', trackId: 'J1-fanout-0', positionKm: 8, aspect: 'GREEN' },
  { id: 'SIG-J1A', trackId: 'J1-fanout-1', positionKm: 8, aspect: 'RED' },
  { id: 'SIG-B1', trackId: 'corridor-0', positionKm: 18, aspect: 'GREEN' },
  { id: 'SIG-B3', trackId: 'corridor-1', positionKm: 30, aspect: 'AMBER' },
  { id: 'SIG-B5', trackId: 'corridor-2', positionKm: 42, aspect: 'GREEN' },
  { id: 'SIG-J2', trackId: 'J2-fanout-0', positionKm: 40, aspect: 'RED' },
];

export const mockPointSwitches: PointSwitch[] = [
  { id: 'PT-J1-1', junctionId: JUNCTION_1_ID, state: 'NORMAL' },
  { id: 'PT-J1-2', junctionId: JUNCTION_1_ID, state: 'REVERSE' },
  { id: 'PT-J2-1', junctionId: JUNCTION_2_ID, state: 'NORMAL' },
  { id: 'PT-J2-2', junctionId: JUNCTION_2_ID, state: 'REVERSE' },
];

export const mockCorridor: Corridor = {
  id: CORRIDOR_ID,
  name: 'Central Corridor',
  lengthKm: 48,
  junction1Id: JUNCTION_1_ID,
  junction2Id: JUNCTION_2_ID,
  blockZones: mockBlockZones,
  stations: mockStations,
};
