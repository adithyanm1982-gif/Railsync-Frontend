import { TimelineClock } from '../physics/TimelineClock';
import { PanZoomController } from '../interaction/PanZoomController';
import { HoverDetection, HitTarget } from '../interaction/HoverDetection';
import { computeLOD } from './ZoomLODController';
import { renderTrackTopology } from './TrackTopologyRenderer';
import { renderSignals } from './SignalRenderer';
import { renderPlatforms } from './PlatformRenderer';
import { renderCatenary } from './CatenaryRenderer';
import { renderTrains } from './TrainRenderer';
import { renderMaintenanceBlocks } from './MaintenanceBlockRenderer';
import { buildLineGeometry } from '../topology/lineGeometry';
import { computeAllTrainPositions } from '../physics/TrainMotionCalculator';
import { SimTrain, RealScheduleEntry } from '../../types';
import { CANVAS_BG } from '@/shared/utils/colorTokens';

export interface RenderEngineDataSources {
  trains: SimTrain[];
  scheduleEntries: RealScheduleEntry[];
}

/**
 * Owns the requestAnimationFrame loop and composites every visual
 * layer in draw order: track topology (incl. block/sub-block invisible
 * dividers) -> maintenance-block highlights -> catenary -> platforms ->
 * signals -> trains. Feeds HoverDetection each frame.
 */
export class RenderEngine {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private clock: TimelineClock;
  private panZoom: PanZoomController;
  private hover: HoverDetection;
  private data: RenderEngineDataSources;
  private rafId: number | null = null;
  private lastFrameTime = performance.now();

  private geometry = buildLineGeometry();

  constructor(
    canvas: HTMLCanvasElement,
    clock: TimelineClock,
    panZoom: PanZoomController,
    hover: HoverDetection,
    data: RenderEngineDataSources
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.clock = clock;
    this.panZoom = panZoom;
    this.hover = hover;
    this.data = data;
  }

  updateData(data: Partial<RenderEngineDataSources>) {
    this.data = { ...this.data, ...data };
  }

  start() {
    this.lastFrameTime = performance.now();
    const loop = (now: number) => {
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      this.clock.tick(delta);
      this.renderFrame();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  private renderFrame() {
    const { ctx, canvas } = this;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, width, height);

    const viewport = {
      ...this.panZoom.viewport,
      offsetX: this.panZoom.viewport.offsetX + width / 2,
      offsetY: this.panZoom.viewport.offsetY + height / 2,
    };

    const lod = computeLOD(viewport.zoom);
    const absoluteSeconds = this.clock.absoluteSeconds;
    const laneYRange = { min: -13, max: 13 };

    renderTrackTopology(ctx, this.geometry.lanes, this.geometry.blockSpans, this.geometry.subBlockSpans, viewport, lod, laneYRange);

    const blockHits = renderMaintenanceBlocks(
      ctx,
      this.data.scheduleEntries,
      this.geometry.blockSpans,
      viewport,
      absoluteSeconds,
      laneYRange
    );

    renderCatenary(ctx, this.geometry.lanes, viewport, lod);
    renderPlatforms(ctx, this.geometry.stationNodes, viewport, lod, absoluteSeconds);

    const mainlines = this.geometry.lanes.filter((l) => l.kind === 'MAINLINE' && l.corridorId);
    renderSignals(ctx, this.geometry.blockSpans, mainlines, viewport, lod, absoluteSeconds);

    const positions = computeAllTrainPositions(this.data.trains, absoluteSeconds);
    const trainHits = renderTrains(ctx, this.data.trains, positions, viewport);

    const allHits: HitTarget[] = [...blockHits, ...trainHits];
    this.hover.setFrameTargets(allHits);
  }
}
