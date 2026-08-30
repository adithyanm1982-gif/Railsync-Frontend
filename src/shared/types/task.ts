export type Department = 'ENGINEERING' | 'TRD' | 'SNT';

export type PriorityTier = 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PRIORITIZED'
  | 'OPTIMIZED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

/**
 * Mirrors backend/app/schemas/task.py + the priority scoring inputs
 * consumed by services/intelligence/priority_engine.py
 *
 * Priority Score = (defectSeverity * 0.5) + (overdueDays * 0.3) + (assetCriticality * 0.2)
 */
export interface MaintenanceTask {
  id: string;
  department: Department;
  title: string;
  description: string;
  corridorId: string;
  blockZoneId: string; // e.g. 'B1'..'B6'
  assetId: string;
  defectSeverity: number; // 0-10
  overdueDays: number;
  assetCriticality: number; // 0-10
  priorityScore: number; // computed
  priorityTier: PriorityTier;
  requestedWindowStart: string; // ISO datetime
  requestedWindowEnd: string; // ISO datetime
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PriorityBreakdown {
  taskId: string;
  defectSeverityContribution: number;
  overdueDaysContribution: number;
  assetCriticalityContribution: number;
  totalScore: number;
  tier: PriorityTier;
}
