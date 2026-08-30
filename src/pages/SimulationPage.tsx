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
 */
export function SimulationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engineControls, setEngineControls] = useState<EngineControls | null>(null);

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

      <MapLegend />
      <FloatingMapControls
        onZoomIn={() => engineControls?.zoomIn()}
        onZoomOut={() => engineControls?.zoomOut()}
        onReset={() => engineControls?.reset()}
      />
      <FleetMonitorPanel trains={data.trains} positions={positions} />

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
        onJumpToDay={(d) => engineControls?.jumpToDay(d)}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
