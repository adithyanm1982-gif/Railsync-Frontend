/**
 * Shape of one entry from the real GET /api/schedules/ response
 * (108 entries, planning window 2026-08-27 -> 2026-09-02). See
 * data/realSchedules.ts for the embedded dataset and README.md in
 * this folder for field provenance.
 */
export interface RealScheduleEntry {
  request_id: string;
  task_id: string;
  department: 'Engineering' | 'S&T' | 'Traction' | string;
  asset_type: string;
  maintenance_type: string;
  corridor_id: string; // 'C01'..'C04'
  subsection_id: string; // e.g. 'C01-S02' -- this is a BLOCK
  work_area_id: string;
  from_station: string; // 'ST01'..'ST05'
  to_station: string;
  block_id: string;
  block_type: 'ROUTINE_BLOCK' | 'EXTENDED_PLANNED_BLOCK' | string;
  availability_source: string;
  day: string; // 'Monday'..'Sunday'
  date: string; // 'YYYY-MM-DD', one of the real 7 dates
  start_time: string; // 'HH:MM'
  end_time: string; // 'HH:MM' (may be past midnight, i.e. < start_time)
  derived_safe_window: boolean;
  safety_buffer_minutes: number;
  priority_score: number;
  match_score: number;
  traffic_level: string;
  expected_train_count: number;
}

/** One real station node (junction) on the line. */
export interface SimStation {
  id: string; // 'ST01'..'ST05'
  label: string;
  order: number; // 0-based position along the line
}

/** One real corridor (inter-station segment), e.g. C01 links ST01-ST02. */
export interface SimCorridor {
  id: string; // 'C01'..'C04'
  fromStationId: string;
  toStationId: string;
  order: number;
  blocks: SimBlock[];
}

/** A BLOCK = one real subsection_id (e.g. 'C01-S02'). Divided further into sub-blocks when zoomed in. */
export interface SimBlock {
  id: string; // subsection_id, e.g. 'C01-S02'
  corridorId: string;
  order: number; // position within the corridor (0-3)
  label: string;
  subBlocks: SimSubBlock[];
}

/** A SUB-BLOCK = an invisible finer track-circuit division, only labeled at micro zoom. */
export interface SimSubBlock {
  id: string; // e.g. 'C01-S02-TC1'
  blockId: string;
  order: number;
}

export type TrackOccupancyState = 'CLEAR' | 'OCCUPIED' | 'RESERVED';

export type SimTrainStatus = 'MOVING' | 'HOLD' | 'WAIT' | 'STABLED';

export interface SimTrain {
  id: string; // e.g. 'EXP-201'
  type: string; // 'EXP' | 'VB' | 'GDS' etc
  speedKmh: number;
  delayMin: number;
  status: SimTrainStatus;
  laneIndex: number; // which of the 4 through-lanes it's running on
  direction: 1 | -1; // +1 = increasing station order, -1 = decreasing
  startOffsetSec: number; // phase offset so trains aren't all in lockstep
}

export type HoveredEntity =
  | { type: 'train'; train: SimTrain; speedKmh: number; corridorId: string }
  | { type: 'maintenance-block'; entry: RealScheduleEntry }
  | null;

export interface HoverPopoverState {
  entity: HoveredEntity;
  screenX: number;
  screenY: number;
}
