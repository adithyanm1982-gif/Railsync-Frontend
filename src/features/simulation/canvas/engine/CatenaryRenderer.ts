import { RenderedLane } from '../topology/lineGeometry';
import { Viewport } from '../interaction/PanZoomController';
import { LODFlags } from './ZoomLODController';

export function renderCatenary(
  ctx: CanvasRenderingContext2D,
  lanes: RenderedLane[],
  viewport: Viewport,
  lod: LODFlags
) {
  if (!lod.showCatenaryMarkers || lod.midOpacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = lod.midOpacity * 0.8;

  for (const lane of lanes) {
    if (lane.kind === 'MAINLINE' && lane.corridorId) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 0.75;
      const [a, b] = [lane.points[0], lane.points[lane.points.length - 1]];
      const steps = 6;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const wx = a.x + (b.x - a.x) * t;
        const wy = a.y + (b.y - a.y) * t;
        const sx = wx * viewport.zoom + viewport.offsetX;
        const sy = wy * viewport.zoom + viewport.offsetY;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 16);
        ctx.lineTo(sx, sy - 5);
        ctx.stroke();
      }
    }

    if (lane.kind === 'SIDING') {
      const mid = lane.points[lane.points.length - 1];
      const sx = mid.x * viewport.zoom + viewport.offsetX;
      const sy = mid.y * viewport.zoom + viewport.offsetY;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SDG', sx + 3, sy + 2);
    }
  }

  ctx.restore();
}
