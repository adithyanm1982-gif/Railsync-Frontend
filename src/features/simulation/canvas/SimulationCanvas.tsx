import { useEffect, useRef } from 'react';
import { RenderEngine } from './engine/RenderEngine';
import { TimelineClock } from './physics/TimelineClock';
import { PanZoomController } from './interaction/PanZoomController';
import { HoverDetection } from './interaction/HoverDetection';
import { useSimulationStore } from '../store/simulationStore';
import { useSimulationData } from '../hooks/useSimulationData';
import { REAL_SCHEDULE_ENTRIES } from '../data/realSchedules';
import { TOTAL_LINE_LENGTH } from './topology/lineGeometry';
import { computeTrainPosition } from './physics/TrainMotionCalculator';

interface SimulationCanvasProps {
  onEngineReady?: (controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    seekTo: (seconds: number) => void;
    jumpToDay: (dayIndex: number) => void;
    stepForward: () => void;
    stepBackward: () => void;
  }) => void;
}

/**
 * Bridges the imperative canvas engine with React. The canvas itself
 * draws entirely outside React's render cycle for performance (up to
 * 180x speed playback across a 7-day dataset with many moving
 * trains); this component owns the engine's lifecycle and syncs a
 * thin slice of state into zustand so PlaybackControls/DayNavigator/
 * TimelineScrubber/popovers can react to it.
 */
export function SimulationCanvas({ onEngineReady }: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RenderEngine | null>(null);
  const clockRef = useRef(new TimelineClock());
  const panZoomRef = useRef(new PanZoomController());
  const hoverRef = useRef(new HoverDetection());
  const data = useSimulationData();

  const setAbsoluteSeconds = useSimulationStore((s) => s.setAbsoluteSeconds);
  const setZoom = useSimulationStore((s) => s.setZoom);
  const setHoverPopover = useSimulationStore((s) => s.setHoverPopover);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const speed = useSimulationStore((s) => s.speed);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clock = clockRef.current;
    const panZoom = panZoomRef.current;
    const hover = hoverRef.current;

    clock.play();
    panZoom.attachTo(canvas);
    // Fit the whole line to the actual window size right away, instead
    // of opening at a fixed zoom=1 that left most of the canvas empty.
    // Only explicit user action (wheel/buttons/drag) changes zoom/pan
    // after this -- nothing here auto-adjusts on its own again.
    panZoom.setHomeView(canvas.clientWidth, canvas.clientHeight, TOTAL_LINE_LENGTH);
    panZoom.onChange(() => setZoom(panZoom.viewport.zoom));

    const engine = new RenderEngine(canvas, clock, panZoom, hover, data);
    engineRef.current = engine;
    engine.start();

    onEngineReady?.({
      zoomIn: () => panZoom.zoomIn(canvas.clientWidth, canvas.clientHeight),
      zoomOut: () => panZoom.zoomOut(canvas.clientWidth, canvas.clientHeight),
      reset: () => panZoom.resetView(),
      seekTo: (seconds: number) => {
        clock.seekToAbsolute(seconds);
        setAbsoluteSeconds(clock.absoluteSeconds);
      },
      jumpToDay: (dayIndex: number) => {
        clock.jumpToDay(dayIndex);
        setAbsoluteSeconds(clock.absoluteSeconds);
      },
      stepForward: () => {
        clock.stepForward();
        setAbsoluteSeconds(clock.absoluteSeconds);
      },
      stepBackward: () => {
        clock.stepBackward();
        setAbsoluteSeconds(clock.absoluteSeconds);
      },
    });

    const syncInterval = window.setInterval(() => {
      setAbsoluteSeconds(clock.absoluteSeconds);
    }, 100);

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = hover.findHit(x, y);

      if (!hit) {
        setHoverPopover(null);
        return;
      }

      if (hit.type === 'train') {
        const train = data.trains.find((t) => t.id === hit.id);
        if (train) {
          const livePos = computeTrainPosition(train, clockRef.current.absoluteSeconds);
          setHoverPopover({
            entity: { type: 'train', train, speedKmh: livePos.speedKmh, corridorId: '' },
            screenX: hit.screenX,
            screenY: hit.screenY,
          });
        }
      } else {
        const entry = REAL_SCHEDULE_ENTRIES.find((e) => e.request_id === hit.id);
        if (entry) {
          setHoverPopover({
            entity: { type: 'maintenance-block', entry },
            screenX: hit.screenX,
            screenY: hit.screenY,
          });
        }
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => setHoverPopover(null));

    return () => {
      engine.stop();
      panZoom.detach();
      window.clearInterval(syncInterval);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.updateData(data);
  }, [data]);

  useEffect(() => {
    if (isPlaying) clockRef.current.play();
    else clockRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    clockRef.current.setSpeed(speed);
  }, [speed]);

  return <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing" style={{ display: 'block' }} />;
}
