import { Department } from './task';

export type BlockApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';

/**
 * A maintenance block window — possibly shared across departments
 * (a "Joint Block") when services/intelligence/coordination_engine.py
 * + services/optimization/optimizer.py determine tasks can overlap safely.
 */
export interface MaintenanceBlock {
  id: string;
  corridorId: string;
  blockZoneId: string; // B1..B6
  departments: Department[]; // >1 => joint block
  taskIds: string[];
  windowStart: string; // ISO datetime
  windowEnd: string; // ISO datetime
  isJoint: boolean;
  approvalStatus: BlockApprovalStatus;
  timeSavedMinutes: number; // vs. traditional sequential blocks
  trainDelayPreventedMinutes: number;
  assetDowntimeMinutes: number;
  explanation?: string; // from explanation_engine.py
}

export interface BlockConflict {
  id: string;
  blockAId: string;
  blockBId: string;
  reason: string;
  corridorId: string;
  blockZoneId: string;
}
