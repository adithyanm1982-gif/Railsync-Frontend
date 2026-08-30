export type SignalAspect = 'RED' | 'AMBER' | 'GREEN';
export type PointState = 'NORMAL' | 'REVERSE';
export type TrackKind = 'MAINLINE' | 'LOOP' | 'SIDING' | 'STABLING';

export interface Station {
  id: string;
  name: string;
  corridorId: string;
  positionKm: number;
  platformIds: string[]; // e.g. ['P1','P2']
}

export interface Signal {
  id: string;
  trackId: string;
  positionKm: number;
  aspect: SignalAspect;
}

export interface PointSwitch {
  id: string;
  junctionId: string;
  state: PointState;
}

export interface TrackSegment {
  id: string;
  corridorId: string;
  kind: TrackKind;
  // topology hint used by trackLayout.ts to render fan-out/merge geometry
  laneIndex: number;
}

export interface BlockZone {
  id: string; // 'B1'..'B6'
  corridorId: string;
  label: string;
  startKm: number;
  endKm: number;
  trackCircuitIds: string[];
}

export interface Corridor {
  id: string;
  name: string;
  lengthKm: number;
  junction1Id: string;
  junction2Id: string;
  blockZones: BlockZone[];
  stations: Station[];
}
