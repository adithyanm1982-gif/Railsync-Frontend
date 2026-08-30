/**
 * Exact response/record shapes confirmed against the real backend
 * source (backend.zip: app/api/*.py, app/schemas/*.py,
 * app/services/intelligence/priority_engine.py) and real sample
 * payloads. These supersede the loose RawApiRecord types used
 * before the backend zip was available -- every field here is
 * confirmed, not guessed.
 */

export type RealDepartment = 'Engineering' | 'S&T' | 'Traction';

export type Urgency = 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW';
export type PlanningType = 'EMERGENCY' | 'URGENT' | 'NORMAL';
export type PriorityClass = 'Critical' | 'High' | 'Medium' | 'Low';

/**
 * One record from GET /api/tasks/ (`tasks[]`) or GET /api/tasks/{id}.
 * Confirmed from backend/app/api/tasks.py (raw passthrough of
 * PlanningService().load_tasks(), which is the ingested
 * department_requests dataset) and real sample payload (420 records).
 */
export interface RealTask {
  request_id: string;
  department: RealDepartment;
  planning_type: PlanningType;
  preferred_day: string; // 'Monday'..'Sunday'
  corridor_id: string; // 'C01'..'C04'
  subsection_id: string; // e.g. 'C01-S02' -- this is the BLOCK id
  work_area_id: string;
  from_station: string; // 'ST01'..'ST05'
  to_station: string;
  asset_id: string;
  asset_type: string; // 'Track' | 'Signal' | 'OHE' | 'Bridge' | 'Sleeper' | ... (15 known values)
  maintenance_type: string;
  issue: string;
  severity: number; // 1-5, confirmed range from priority_engine.py normalization
  criticality: number; // 1-100
  urgency: Urgency;
  overdue_days: number;
  estimated_duration_hours: number;
  safety_risk: number; // 1-100
  operational_impact: number; // 1-100
  request_status: 'PENDING' | string;
  planning_cycle: string; // e.g. 'NEXT_7_DAYS'
  request_source: string;
  deadline_day: string;
  controller_status: 'PENDING_REVIEW' | string;
  approval_required: boolean;
}

/** A RealTask after GET /api/priorities/ adds the computed score + class. */
export interface RealPrioritizedTask extends RealTask {
  priority_score: number; // 0-100, see computeRealPriorityScore -- NOT the 0.5/0.3/0.2 formula in the original brief
  priority_class: PriorityClass;
}

export interface TasksResponse {
  count: number;
  tasks: RealTask[];
}

export interface TaskDetailResponse extends RealTask {}

export interface PrioritiesResponse {
  planning_date: string;
  corridor_id: string; // 'ALL' if unfiltered
  count: number;
  requests: RealPrioritizedTask[];
}

/**
 * One record from GET /api/schedules/ (`schedules[]`). Confirmed from
 * backend/app/api/schedules.py (raw passthrough of
 * PlanningService().run().selected_tasks -- i.e. the CP-SAT optimizer's
 * chosen task->block assignments) and real sample payload (108 records
 * for the full 7-day window, unfiltered).
 */
export interface RealScheduleEntry {
  request_id: string;
  task_id: string;
  department: RealDepartment;
  asset_type: string;
  maintenance_type: string;
  corridor_id: string;
  subsection_id: string; // BLOCK id
  work_area_id: string;
  from_station: string;
  to_station: string;
  block_id: string;
  block_type: 'ROUTINE_BLOCK' | 'EXTENDED_PLANNED_BLOCK' | string;
  availability_source: string;
  day: string;
  date: string; // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  end_time: string; // 'HH:MM', may be < start_time (crosses midnight)
  derived_safe_window: boolean;
  safety_buffer_minutes: number;
  priority_score: number;
  match_score: number;
  traffic_level: string;
  expected_train_count: number;
}

export interface SchedulesResponse {
  planning_date: string;
  corridor_id: string;
  count: number;
  safety_valid: boolean;
  schedules: RealScheduleEntry[];
}

/** GET /api/dashboard/summary -- confirmed from backend/app/api/dashboard.py. */
export interface DashboardSummary {
  planning_date: string;
  corridor_id: string;
  total_requests: number;
  prioritized_requests: number;
  requests_with_candidates: number;
  total_candidates: number;
  coordination_opportunities: number;
  scheduled_requests: number;
  unscheduled_requests: number;
  optimizer_status: string;
  safety_valid: boolean;
  safety_penalty: number;
}

/** POST /api/optimization/run -- confirmed from backend/app/api/optimization.py. */
export interface OptimizationRunResult {
  planning_date: string;
  corridor_id: string;
  status: string;
  selected_tasks: RealScheduleEntry[];
  selected_count: number;
  safety_valid: boolean;
  safety_penalty: number;
}

/** GET /api/conflicts/ -- confirmed from backend/app/api/conflicts.py. */
export interface ConflictsResult {
  planning_date: string;
  corridor_id: string;
  safety_valid: boolean;
  safety_penalty: number;
  message: string;
}

/** GET /api/data/stats -- confirmed from backend/app/api/data.py. */
export interface DataStats {
  total_requests: number;
  departments: string[];
  department_count: number;
  corridors: string[];
  corridor_count: number;
}

/**
 * One record from the real railsync_train_movements_7day.csv dataset
 * (1,600 rows, real 7-day window), loadable server-side via
 * CSVLoader.DATASETS["train_movements"] but NOT YET exposed through
 * any API route as of this backend zip. This type matches the CSV's
 * real column names exactly, ready for the moment a GET /api/trains/
 * endpoint exists (see backend_trains_endpoint_for_your_friend.py).
 */
export interface RealTrainMovement {
  movement_id: string;
  day: string; // 'Monday'..'Sunday'
  corridor_id: string; // 'C01'..'C04'
  subsection_id: string; // BLOCK id, e.g. 'C01-S01'
  from_station: string;
  to_station: string;
  train_no: string | number;
  train_type: string; // 'Passenger' | 'MEMU' | 'Goods' | ... (real values vary)
  entry_time: string; // 'HH:MM'
  exit_time: string; // 'HH:MM'
  minimum_maintenance_buffer_minutes: number;
  line_id: string;
  movement_status: string; // 'SCHEDULED' | ...
  direction: 'UP' | 'DOWN' | string;
  movement_source: string;
}

export interface TrainsResponse {
  count: number;
  trains: RealTrainMovement[];
}

/** POST /api/approvals/ response -- confirmed from backend/app/api/approvals.py. */
export interface ApprovalResult {
  request_id: string;
  approved: boolean;
  approved_by: string | null;
  comments: string | null;
  status: 'APPROVED' | 'REJECTED';
}

/** POST /api/emergency/evaluate response -- confirmed from backend/app/api/emergency.py. */
export interface EmergencyEvaluationResult {
  request_id: string;
  emergency: true;
  severity: string;
  reason: string;
  message: string;
  request: RealTask;
}
