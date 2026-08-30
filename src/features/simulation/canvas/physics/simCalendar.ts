/**
 * The real 7-day planning window from the schedule dataset:
 * 2026-08-27 (Thu) through 2026-09-02 (Wed). Free day-jump, fast
 * forward/rewind, and the timeline scrubber are all built around this
 * fixed, real calendar rather than an abstract "Day N" loop.
 */
export interface SimDay {
  date: string; // 'YYYY-MM-DD'
  dayName: string; // 'Thursday'
  index: number; // 0-6
}

export const SIM_DAYS: SimDay[] = [
  { date: '2026-08-27', dayName: 'Thursday', index: 0 },
  { date: '2026-08-28', dayName: 'Friday', index: 1 },
  { date: '2026-08-29', dayName: 'Saturday', index: 2 },
  { date: '2026-08-30', dayName: 'Sunday', index: 3 },
  { date: '2026-08-31', dayName: 'Monday', index: 4 },
  { date: '2026-09-01', dayName: 'Tuesday', index: 5 },
  { date: '2026-09-02', dayName: 'Wednesday', index: 6 },
];

export const SECONDS_PER_DAY = 86_400;
export const TOTAL_TIMELINE_SECONDS = SECONDS_PER_DAY * SIM_DAYS.length;

/** Absolute timeline second (0 .. 7*86400) -> which day + seconds-into-day. */
export function splitAbsoluteSeconds(absSec: number): { dayIndex: number; secIntoDay: number } {
  const wrapped = ((absSec % TOTAL_TIMELINE_SECONDS) + TOTAL_TIMELINE_SECONDS) % TOTAL_TIMELINE_SECONDS;
  const dayIndex = Math.min(SIM_DAYS.length - 1, Math.floor(wrapped / SECONDS_PER_DAY));
  const secIntoDay = wrapped - dayIndex * SECONDS_PER_DAY;
  return { dayIndex, secIntoDay };
}

export function dayIndexAndTimeToAbsolute(dayIndex: number, secIntoDay: number): number {
  return dayIndex * SECONDS_PER_DAY + secIntoDay;
}

/** Parses 'HH:MM' into seconds-into-day. Handles end_time < start_time (crosses midnight) by the caller. */
export function hhmmToSeconds(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
}

export function formatAbsoluteTimestamp(absSec: number): string {
  const { dayIndex, secIntoDay } = splitAbsoluteSeconds(absSec);
  const day = SIM_DAYS[dayIndex];
  const hh = Math.floor(secIntoDay / 3600)
    .toString()
    .padStart(2, '0');
  const mm = Math.floor((secIntoDay % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(secIntoDay % 60)
    .toString()
    .padStart(2, '0');
  return `${day.dayName}, ${day.date} · ${hh}:${mm}:${ss}`;
}

export function dateToDayIndex(date: string): number {
  const idx = SIM_DAYS.findIndex((d) => d.date === date);
  return idx === -1 ? 0 : idx;
}
