import { useRef, useState } from 'react';
import { SimulationCanvas } from '@/features/simulation/canvas/SimulationCanvas';
import { FloatingMapControls } from '@/features/simulation/components/FloatingMapControls';
import { MapLegend } from '@/features/simulation/components/MapLegend';
import { TimelineScrubber } from '@/features/simulation/components/TimelineScrubber';
import { FleetMonitorPanel } from '@/features/simulation/components/FleetMonitorPanel';
import { MaintenanceHoverPopover } from '@/features/simulation/components/MaintenanceHoverPopover';
import { TrainTelemetryPopover } from '@/features/simulation/components/TrainTelemetryPopover';
import { useSimulationStore } from '@/features/simulation/store/simulationStore';
import { useSimulationData } from '@/features/simulation/hooks/useSimulationData';
import { positionPopover } from '@/features/simulation/canvas/interaction/PopoverPositioner';
import { computeAllTrainPositions } from '@/features/simulation/canvas/physics/TrainMotionCalculator';
import { Info, TrainFront } from 'lucide-react';

interface EngineControls {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  seekTo: (seconds: number) => void;
  jumpToDay: (dayIndex: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

/**
 * Standalone, full-screen /simulation route: dark canvas, floating
 * overlays (map controls, legend, fleet monitor, hover HUD popovers),
 * and the bottom timeline dock spanning the real 7-day dataset.
 *
 * The Legend and Fleet Monitor panels are collapsed by default,
 * toggled via two small semi-transparent icon buttons on the left --
 * previously both panels were always open and large enough to block
 * a meaningful chunk of the track view.
 */
export function SimulationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engineControls, setEngineControls] = useState<EngineControls | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showFleet, setShowFleet] = useState(false);

  const absoluteSeconds = useSimulationStore((s) => s.absoluteSeconds);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const speed = useSimulationStore((s) => s.speed);
  const hoverPopover = useSimulationStore((s) => s.hoverPopover);
  const setIsPlaying = useSimulationStore((s) => s.setIsPlaying);
  const setSpeed = useSimulationStore((s) => s.setSpeed);

  const data = useSimulationData();
  const positions = computeAllTrainPositions(data.trains, absoluteSeconds);

  const containerSize = {
    width: containerRef.current?.clientWidth ?? 1200,
    height: containerRef.current?.clientHeight ?? 800,
  };

  const popoverPos = hoverPopover
    ? positionPopover({ x: hoverPopover.screenX, y: hoverPopover.screenY }, { width: 288, height: 150 }, containerSize)
    : null;

  return (
    <div ref={containerRef} className="relative h-full w-full bg-canvas overflow-hidden">
      <SimulationCanvas onEngineReady={setEngineControls} />

      {/* Small semi-transparent toggle buttons -- panels only open on click */}
      <div className="absolute left-4 top-4 flex flex-col gap-1.5 z-30">
        <button
          onClick={() => setShowLegend((v) => !v)}
          className={`rounded-lg p-2 backdrop-blur-sm border transition-colors ${
            showLegend
              ? 'bg-dept-engineering/90 border-dept-engineering text-slate-950'
              : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:bg-slate-900/70 hover:text-slate-200'
          }`}
          title="Toggle legend"
        >
          <Info size={16} />
        </button>
        <button
          onClick={() => setShowFleet((v) => !v)}
          className={`rounded-lg p-2 backdrop-blur-sm border transition-colors ${
            showFleet
              ? 'bg-dept-engineering/90 border-dept-engineering text-slate-950'
              : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:bg-slate-900/70 hover:text-slate-200'
          }`}
          title="Toggle active fleet monitor"
        >
          <TrainFront size={16} />
        </button>
      </div>

      {(showLegend || showFleet) && (
        <div className="absolute left-16 top-4 z-20 flex flex-col gap-3">
          {showLegend && <MapLegend />}
          {showFleet && <FleetMonitorPanel trains={data.trains} positions={positions} />}
        </div>
      )}

      <FloatingMapControls
        onZoomIn={() => engineControls?.zoomIn()}
        onZoomOut={() => engineControls?.zoomOut()}
        onReset={() => engineControls?.reset()}
      />

      {hoverPopover?.entity?.type === 'maintenance-block' && popoverPos && (
        <MaintenanceHoverPopover entry={hoverPopover.entity.entry} left={popoverPos.left} top={popoverPos.top} />
      )}
      {hoverPopover?.entity?.type === 'train' && popoverPos && (
        <TrainTelemetryPopover
          train={hoverPopover.entity.train}
          speedKmh={hoverPopover.entity.speedKmh}
          left={popoverPos.left}
          top={popoverPos.top}
        />
      )}

      <TimelineScrubber
        absoluteSeconds={absoluteSeconds}
        isPlaying={isPlaying}
        speed={speed}
        onSeek={(s) => engineControls?.seekTo(s)}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStepBack={() => engineControls?.stepBackward()}
        onStepForward={() => engineControls?.stepForward()}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
