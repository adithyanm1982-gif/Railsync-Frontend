import { formatAbsoluteTimestamp, splitAbsoluteSeconds, TOTAL_TIMELINE_SECONDS, dayIndexAndTimeToAbsolute } from '../canvas/physics/simCalendar';
import { PlaybackControls } from './PlaybackControls';
import { SpeedMultiplierSelector } from './SpeedMultiplierSelector';
import { DayTimeDropdown } from './DayTimeDropdown';
import { SpeedMultiplier } from '../canvas/physics/TimelineClock';

interface TimelineScrubberProps {
  absoluteSeconds: number;
  isPlaying: boolean;
  speed: SpeedMultiplier;
  onSeek: (seconds: number) => void;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (speed: SpeedMultiplier) => void;
}

/**
 * Bottom timeline dock spanning the full real 7-day dataset. Combines
 * three ways to navigate time, all independent of each other:
 * - continuous scrubber across all 7*86400 seconds (drag to any instant)
 * - compact Day + Time dropdowns for an instant jump to any exact
 *   day/time combination (replaces the old always-expanded 7-button
 *   day row, which took up much more space for the same job)
 * - play/pause + speed (1x-180x) for continuous fast-forward/rewind-by-stepping
 */
export function TimelineScrubber({
  absoluteSeconds,
  isPlaying,
  speed,
  onSeek,
  onPlayPause,
  onStepBack,
  onStepForward,
  onSpeedChange,
}: TimelineScrubberProps) {
  const { dayIndex, secIntoDay } = splitAbsoluteSeconds(absoluteSeconds);

  function handleDayTimeChange(newDayIndex: number, newSecondsIntoDay: number) {
    onSeek(dayIndexAndTimeToAbsolute(newDayIndex, newSecondsIntoDay));
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 panel-surface border-t border-slate-800 px-4 py-2.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-dept-engineering">{formatAbsoluteTimestamp(absoluteSeconds)}</span>
        <span className="text-slate-500">Real 7-day schedule window · 2026-08-27 → 2026-09-02</span>
      </div>

      <input
        type="range"
        min={0}
        max={TOTAL_TIMELINE_SECONDS}
        step={60}
        value={absoluteSeconds}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <DayTimeDropdown dayIndex={dayIndex} secondsIntoDay={secIntoDay} onChange={handleDayTimeChange} />
        <div className="flex items-center gap-3">
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onStepBack={onStepBack}
            onStepForward={onStepForward}
          />
          <SpeedMultiplierSelector speed={speed} onChange={onSpeedChange} />
        </div>
      </div>
    </div>
  );
}
