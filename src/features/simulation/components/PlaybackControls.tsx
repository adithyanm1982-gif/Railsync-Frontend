import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
}

export function PlaybackControls({ isPlaying, onPlayPause, onStepBack, onStepForward }: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onStepBack}
        className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-dept-engineering"
        title="Step back 5 min"
      >
        <SkipBack size={16} />
      </button>
      <button
        onClick={onPlayPause}
        className="rounded-md bg-dept-engineering p-2 text-slate-950 hover:bg-dept-engineering/90"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button
        onClick={onStepForward}
        className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-dept-engineering"
        title="Step forward 5 min"
      >
        <SkipForward size={16} />
      </button>
    </div>
  );
}
