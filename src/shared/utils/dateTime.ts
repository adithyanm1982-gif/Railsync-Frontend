export const SECONDS_PER_DAY = 86_400;
export const SIMULATION_LOOP_SECONDS = SECONDS_PER_DAY * 7; // 604,800

/** Formats seconds-since-loop-start as "Day N, HH:MM:SS" */
export function formatLoopTimestamp(seconds: number): string {
  const wrapped = ((seconds % SIMULATION_LOOP_SECONDS) + SIMULATION_LOOP_SECONDS) % SIMULATION_LOOP_SECONDS;
  const day = Math.floor(wrapped / SECONDS_PER_DAY) + 1;
  const remainder = wrapped % SECONDS_PER_DAY;
  const hh = Math.floor(remainder / 3600).toString().padStart(2, '0');
  const mm = Math.floor((remainder % 3600) / 60).toString().padStart(2, '0');
  const ss = Math.floor(remainder % 60).toString().padStart(2, '0');
  return `Day ${day}, ${hh}:${mm}:${ss}`;
}

/** Converts an ISO datetime (relative to a known week-start) into loop seconds */
export function isoToLoopSeconds(iso: string, weekStartIso: string): number {
  const t = new Date(iso).getTime();
  const start = new Date(weekStartIso).getTime();
  return Math.max(0, Math.floor((t - start) / 1000)) % SIMULATION_LOOP_SECONDS;
}

export function clampLoopSeconds(seconds: number): number {
  return ((seconds % SIMULATION_LOOP_SECONDS) + SIMULATION_LOOP_SECONDS) % SIMULATION_LOOP_SECONDS;
}

/** Human-readable duration for stats panels, e.g. "2h 15m" */
export function formatDurationMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}
