import clsx from 'clsx';
import { SpeedMultiplier } from '../canvas/physics/TimelineClock';

const SPEEDS: SpeedMultiplier[] = [1, 2, 5, 10, 30, 60, 180];

interface SpeedMultiplierSelectorProps {
  speed: SpeedMultiplier;
  onChange: (speed: SpeedMultiplier) => void;
}

export function SpeedMultiplierSelector({ speed, onChange }: SpeedMultiplierSelectorProps) {
  return (
    <div className="flex gap-1 rounded-md bg-slate-900/60 p-1 border border-slate-800">
      {SPEEDS.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={clsx(
            'rounded px-1.5 py-1 text-[10px] font-mono transition-colors',
            speed === s ? 'bg-dept-engineering text-slate-950' : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {s}x
        </button>
      ))}
    </div>
  );
}
