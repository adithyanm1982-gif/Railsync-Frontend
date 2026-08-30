import { RenderedBlockSpan, RenderedLane } from '../topology/lineGeometry';
import { Viewport } from '../interaction/PanZoomController';
import { LODFlags } from './ZoomLODController';
import { SIGNAL_COLORS } from '@/shared/utils/colorTokens';

type SignalAspect = 'RED' | 'AMBER' | 'GREEN';

/**
 * Deterministically derives a signal aspect per block boundary from
 * the block id + current time bucket, so aspects change occasionally
 * as the clock advances rather than being static -- there's no live
 * signal-state feed in the real data, so this is illustrative.
 */
function aspectFor(blockId: string, absoluteSeconds: number): SignalAspect {
  const bucket = Math.floor(absoluteSeconds / 240);
  let hash = 0;
  for (let i = 0; i < blockId.length; i++) hash = (hash * 31 + blockId.charCodeAt(i)) % 997;
  const v = (hash + bucket) % 5;
  if (v === 0) return 'RED';
  if (v === 1) return 'AMBER';
  return 'GREEN';
}

export function renderSignals(
  ctx: CanvasRenderingContext2D,
  blockSpans: RenderedBlockSpan[],
  mainlines: RenderedLane[],
  viewport: Viewport,
  lod: LODFlags,
  absoluteSeconds: number
) {
  if (lod.midOpacity <= 0 && lod.level === 'MACRO') return;
  ctx.save();

  const topLaneY = Math.min(...mainlines.map((l) => l.points[0].y));

  for (const block of blockSpans) {
    const aspect = aspectFor(block.blockId, absoluteSeconds);
    const color = SIGNAL_COLORS[aspect];
    const screenX = block.xStart * viewport.zoom + viewport.offsetX;
    const screenY = topLaneY * viewport.zoom + viewport.offsetY - 14;

    // macro dot, always visible
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // full 3-aspect head, mid zoom+
    if (lod.showSignalAspects && lod.midOpacity > 0) {
      ctx.globalAlpha = lod.midOpacity;
      const w = 9;
      const h = 22;
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(screenX - w / 2, screenY - h - 8, w, h, 3);
      ctx.fill();
      ctx.stroke();

      (['RED', 'AMBER', 'GREEN'] as SignalAspect[]).forEach((a, i) => {
        const active = a === aspect;
        ctx.fillStyle = active ? SIGNAL_COLORS[a] : '#1E293B';
        if (active) {
          ctx.shadowColor = SIGNAL_COLORS[a];
          ctx.shadowBlur = 7;
        }
        ctx.beginPath();
        ctx.arc(screenX, screenY - h - 8 + 5 + i * 6.5, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.fillStyle = '#94A3B8';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`SIG.${block.blockId.split('-')[1]}`, screenX, screenY - h - 12);
    }
  }

  ctx.restore();
}
