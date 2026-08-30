import { MaintenanceBlock } from './block';

/** T-day (rolling) schedule preview shown at Step 4: Preview + Approval */
export interface ScheduleSummary {
  scheduleId: string;
  generatedAt: string;
  horizonDays: number;
  totalTasksScheduled: number;
  totalTasksPending: number;
  estimatedTimeSavedMinutes: number;
  estimatedAssetDowntimeMinutes: number;
  estimatedTrainDelayPreventedMinutes: number;
  blocks: MaintenanceBlock[];
}

/** Traditional-vs-AI comparison stats for the Dashboard page */
export interface ComparisonStats {
  metric: string;
  traditionalValue: number;
  aiOptimizedValue: number;
  unit: string;
}

export interface DashboardStats {
  tasksCompleted: number;
  tasksPending: number;
  totalTimeSavedMinutes: number;
  totalAssetDowntimeMinutes: number;
  totalTrainDelayMinutes: number;
  comparisons: ComparisonStats[];
}
