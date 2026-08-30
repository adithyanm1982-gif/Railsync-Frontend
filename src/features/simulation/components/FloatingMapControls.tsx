import { ZoomIn, ZoomOut, Locate } from 'lucide-react';

interface FloatingMapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function FloatingMapControls({ onZoomIn, onZoomOut, onReset }: FloatingMapControlsProps) {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-1.5 panel-surface rounded-lg p-1.5">
      <button onClick={onZoomIn} className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-dept-engineering" title="Zoom In">
        <ZoomIn size={16} />
      </button>
      <button onClick={onZoomOut} className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-dept-engineering" title="Zoom Out">
        <ZoomOut size={16} />
      </button>
      <button onClick={onReset} className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-dept-engineering" title="Reset View">
        <Locate size={16} />
      </button>
    </div>
  );
}
