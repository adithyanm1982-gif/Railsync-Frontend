import { RenderedLane, RenderedBlockSpan, RenderedSubBlockSpan } from '../topology/lineGeometry';
import { Viewport } from '../interaction/PanZoomController';
import { LODFlags } from './ZoomLODController';

const LANE_COLORS: Record<string, string> = {
  MAINLINE: '#64748B',
  LOOP: '#3F4E68',
  SIDING: '#33415A',
};

/**
 * Draws every track polyline, plus the invisible BLOCK divider lines
 * (dashed, always visible per the reference concept art's "B1 | B2 |
 * B3" tick marks) and, once zoomed in past the micro threshold, the
 * finer invisible SUB-BLOCK divider lines within each block.
 */
export function renderTrackTopology(
  ctx: CanvasRenderingContext2D,
  lanes: RenderedLane[],
  blockSpans: RenderedBlockSpan[],
  subBlockSpans: RenderedSubBlockSpan[],
  viewport: Viewport,
  lod: LODFlags,
  laneYRange: { min: number; max: number }
) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const lane of lanes) {
    const color = LANE_COLORS[lane.kind] ?? '#64748B';
    ctx.strokeStyle = color;
    ctx.lineWidth = lane.kind === 'MAINLINE' ? 2.4 : 1.3;
    ctx.globalAlpha = lane.kind === 'MAINLINE' ? 1 : 0.7;

    ctx.beginPath();
    lane.points.forEach((pt, i) => {
      const s = { x: pt.x * viewport.zoom + viewport.offsetX, y: pt.y * viewport.zoom + viewport.offsetY };
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
  }

  // BLOCK divider lines -- always visible, dashed vertical ticks + label
  ctx.globalAlpha = 1;
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  const yTop = laneYRange.min * viewport.zoom + viewport.offsetY - 20;
  const yBottom = laneYRange.max * viewport.zoom + viewport.offsetY + 20;

  for (const block of blockSpans) {
    const sx = block.xStart * viewport.zoom + viewport.offsetX;
    ctx.beginPath();
    ctx.moveTo(sx, yTop);
    ctx.lineTo(sx, yBottom);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#64748B';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(block.blockId, sx + 3, yTop - 4);
    ctx.setLineDash([3, 4]);
  }
  ctx.setLineDash([]);

  // SUB-BLOCK divider lines -- micro zoom only, finer + fainter
  if (lod.showSubBlockBoundaries) {
    ctx.globalAlpha = lod.microOpacity * 0.7;
    ctx.setLineDash([1, 3]);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.75;
    for (const sub of subBlockSpans) {
      const sx = sub.xStart * viewport.zoom + viewport.offsetX;
      ctx.beginPath();
      ctx.moveTo(sx, yTop + 6);
      ctx.lineTo(sx, yBottom - 6);
      ctx.stroke();

      if (lod.microOpacity > 0.6) {
        ctx.fillStyle = '#64748B';
        ctx.font = '7px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(sub.subBlockId.split('-').pop() ?? '', sx + 2, yBottom - 8);
      }
    }
    ctx.setLineDash([]);
  }

  ctx.restore();
}
