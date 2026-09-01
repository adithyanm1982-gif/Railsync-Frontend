import { useState } from 'react';
import { SIM_DAYS } from '../canvas/physics/simCalendar';
import { Clock } from 'lucide-react';

export type TimeFormat = '24H' | '12H';

interface DayTimeDropdownProps {
  dayIndex: number;
  secondsIntoDay: number;
  onChange: (dayIndex: number, secondsIntoDay: number) => void;
}

const TIME_STEP_MIN = 30; // dropdown granularity -- the drag scrubber above still allows any exact second

function buildTimeOptions(): number[] {
  const options: number[] = [];
  for (let m = 0; m < 24 * 60; m += TIME_STEP_MIN) options.push(m * 60);
  return options;
}
const TIME_OPTIONS_SECONDS = buildTimeOptions();

function formatTime(secondsIntoDay: number, format: TimeFormat): string {
  const totalMinutes = Math.floor(secondsIntoDay / 60);
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const mm = m.toString().padStart(2, '0');

  if (format === '24H') {
    return `${h24.toString().padStart(2, '0')}:${mm}`;
  }
  const period = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${period}`;
}

/**
 * Compact replacement for the old 7-button day-tab row: a Day
 * dropdown (all 7 real dates, e.g. "Thursday · 2026-08-27"), a Time
 * dropdown (00:00-23:30 in 30-min steps, respecting the Railway/
 * Normal format toggle), and the format toggle itself. Frees up the
 * horizontal/vertical space the old always-expanded button row took,
 * for other controls to live alongside it.
 */
export function DayTimeDropdown({ dayIndex, secondsIntoDay, onChange }: DayTimeDropdownProps) {
  const [format, setFormat] = useState<TimeFormat>('24H');

  // snap the free-scrubbed seconds-into-day down to the nearest dropdown step for display
  const snappedTime = TIME_OPTIONS_SECONDS.reduce((closest, opt) =>
    Math.abs(opt - secondsIntoDay) < Math.abs(closest - secondsIntoDay) ? opt : closest
  );

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={dayIndex}
        onChange={(e) => onChange(Number(e.target.value), secondsIntoDay)}
        className="rounded-md bg-slate-900/60 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-dept-engineering"
      >
        {SIM_DAYS.map((day) => (
          <option key={day.date} value={day.index}>
            {day.dayName} · {day.date}
          </option>
        ))}
      </select>

      <select
        value={snappedTime}
        onChange={(e) => onChange(dayIndex, Number(e.target.value))}
        className="rounded-md bg-slate-900/60 border border-slate-700 px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-dept-engineering"
      >
        {TIME_OPTIONS_SECONDS.map((secs) => (
          <option key={secs} value={secs}>
            {formatTime(secs, format)}
          </option>
        ))}
      </select>

      <button
        onClick={() => setFormat((f) => (f === '24H' ? '12H' : '24H'))}
        className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-[10px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Toggle time format"
      >
        <Clock size={11} />
        {format === '24H' ? 'Railway (24H)' : 'Normal (AM/PM)'}
      </button>
    </div>
  );
}
