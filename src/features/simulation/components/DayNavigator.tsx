import clsx from 'clsx';
import { SIM_DAYS } from '../canvas/physics/simCalendar';

interface DayNavigatorProps {
  currentDayIndex: number;
  onJumpToDay: (dayIndex: number) => void;
}

/**
 * The "free-will day change" control: 7 tabs, one per real date in the
 * dataset (Thu 8/27 .. Wed 9/2). Clicking any tab jumps the master
 * clock straight to 00:00 of that day, independent of play/pause or
 * speed state.
 */
export function DayNavigator({ currentDayIndex, onJumpToDay }: DayNavigatorProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-800">
      {SIM_DAYS.map((day) => (
        <button
          key={day.date}
          onClick={() => onJumpToDay(day.index)}
          className={clsx(
            'rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors flex flex-col items-center leading-tight',
            currentDayIndex === day.index
              ? 'bg-dept-engineering text-slate-950'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          )}
          title={day.date}
        >
          <span>{day.dayName.slice(0, 3)}</span>
          <span className="text-[9px] opacity-70">{day.date.slice(5)}</span>
        </button>
      ))}
    </div>
  );
}
