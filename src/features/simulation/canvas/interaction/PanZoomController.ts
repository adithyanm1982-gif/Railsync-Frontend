export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number; // computed fit-to-window at mount .. 6x (micro sub-block detail)
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 6;

/**
 * Owns pan/zoom state for the simulation canvas and the world<->screen
 * coordinate transforms every renderer needs. The viewport starts at
 * a "home" position -- computed once at mount to fit the whole line
 * to the actual window size (see setHomeView) -- rather than a fixed
 * zoom=1, which left most of the canvas empty on real screens. It
 * only ever changes in response to explicit user action (wheel,
 * +/- buttons, or drag-to-pan); "Reset View" returns to that same
 * fitted home position, not to an arbitrary zoom=1.
 */
export class PanZoomController {
  viewport: Viewport = { offsetX: 0, offsetY: 0, zoom: 1 };
  private homeViewport: Viewport = { offsetX: 0, offsetY: 0, zoom: 1 };

  private isDragging = false;
  private lastPointer = { x: 0, y: 0 };
  private canvas: HTMLCanvasElement | null = null;
  private listeners: Array<() => void> = [];

  attachTo(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
  }

  detach() {
    if (!this.canvas) return;
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
  }

  onChange(cb: () => void) {
    this.listeners.push(cb);
  }

  private emit() {
    this.listeners.forEach((cb) => cb());
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.lastPointer = { x: e.clientX, y: e.clientY };
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastPointer.x;
    const dy = e.clientY - this.lastPointer.y;
    this.viewport.offsetX += dx;
    this.viewport.offsetY += dy;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this.emit();
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.2 : 0.2;
    this.zoomBy(zoomDelta, e.offsetX, e.offsetY);
  };

  zoomBy(delta: number, centerX: number, centerY: number) {
    const prevZoom = this.viewport.zoom;
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
    if (nextZoom === prevZoom) return;

    const worldX = (centerX - this.viewport.offsetX) / prevZoom;
    const worldY = (centerY - this.viewport.offsetY) / prevZoom;
    this.viewport.zoom = nextZoom;
    this.viewport.offsetX = centerX - worldX * nextZoom;
    this.viewport.offsetY = centerY - worldY * nextZoom;
    this.emit();
  }

  zoomIn(canvasWidth: number, canvasHeight: number) {
    this.zoomBy(0.6, canvasWidth / 2, canvasHeight / 2);
  }

  zoomOut(canvasWidth: number, canvasHeight: number) {
    this.zoomBy(-0.6, canvasWidth / 2, canvasHeight / 2);
  }

  resetView() {
    this.viewport = { ...this.homeViewport };
    this.emit();
  }

  /**
   * Computes and applies a "fit the whole line to this window" zoom
   * level, centered horizontally and vertically, and remembers it as
   * the home position for Reset View. Call once, right after
   * attachTo(), using the canvas's actual measured size -- this is
   * what makes the simulation open already sized to the window
   * instead of a small default zoom=1 view.
   */
  setHomeView(canvasWidth: number, canvasHeight: number, worldContentWidth: number, paddingFactor = 0.88) {
    const fitZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (canvasWidth / worldContentWidth) * paddingFactor));
    const home: Viewport = {
      zoom: fitZoom,
      offsetX: -(worldContentWidth / 2) * fitZoom,
      offsetY: 0,
    };
    this.homeViewport = home;
    this.viewport = { ...home };
    this.emit();
  }

  /** Centers the viewport on a given world-x (used by "jump to station/block"). */
  centerOnWorldX(worldX: number, canvasWidth: number) {
    this.viewport.offsetX = canvasWidth / 2 - worldX * this.viewport.zoom;
    this.emit();
  }

  worldToScreen(x: number, y: number): { x: number; y: number } {
    return { x: x * this.viewport.zoom + this.viewport.offsetX, y: y * this.viewport.zoom + this.viewport.offsetY };
  }

  screenToWorld(x: number, y: number): { x: number; y: number } {
    return { x: (x - this.viewport.offsetX) / this.viewport.zoom, y: (y - this.viewport.offsetY) / this.viewport.zoom };
  }
}
