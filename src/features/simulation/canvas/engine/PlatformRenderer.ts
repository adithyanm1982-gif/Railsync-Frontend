import { RenderedStationNode } from '../topology/lineGeometry';
import { Viewport } from '../interaction/PanZoomController';
import { LODFlags } from './ZoomLODController';

const SENSOR_LABELS = ['WHEEL ACCEL', 'BRAKE PIPE PRESSURE', 'AXLE LOAD DIST'];

function pseudoValue(seed: string, offset: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i) + offset) % 997;
  return (hash / 100).toFixed(1);
}

/**
 * Draws each station junction: a platform box with platform numbers
 * (mid zoom+), a point-motor/throat label, and -- at micro zoom, past
 * the sub-block reveal threshold -- small sensor-readout HUD chips
 * (wheel accel / brake pressure / axle load) styled after the
 * reference concept art's Station A close-up.
 */
export function renderPlatforms(
  ctx: CanvasRenderingContext2D,
  stationNodes: RenderedStationNode[],
  viewport: Viewport,
  lod: LODFlags,
  absoluteSeconds: number
) {
  ctx.save();

  for (const node of stationNodes) {
    const sx = node.x * viewport.zoom + viewport.offsetX;
    const sy = viewport.offsetY;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.station.label.toUpperCase(), sx, sy - 50);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - 24, sy - 12, 48, 24);

    if (lod.showPlatformNumbers && lod.midOpacity > 0) {
      ctx.globalAlpha = lod.midOpacity;
      ctx.fillStyle = '#93C5FD';
      ctx.font = '8px monospace';
      node.platformIds.forEach((pid, i) => {
        const px = sx - 16 + i * 32;
        ctx.fillText(pid, px, sy);
      });
      ctx.globalAlpha = 1;
    }

    if (lod.showPointSwitchBlades && lod.midOpacity > 0) {
      ctx.globalAlpha = lod.midOpacity;
      ctx.fillStyle = '#64748B';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('PT MOTOR // SECURED [N]', sx + 28, sy - 14);
      ctx.globalAlpha = 1;
    }

    // micro-zoom sensor readout chips
    if (lod.showSensorReadouts && lod.microOpacity > 0.5) {
      ctx.globalAlpha = lod.microOpacity;
      SENSOR_LABELS.forEach((label, i) => {
        const chipX = sx - 70;
        const chipY = sy - 60 + i * 16;
        ctx.strokeStyle = '#F59E0B55';
        ctx.fillStyle = '#0B0F19CC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(chipX, chipY, 78, 13, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FBBF24';
        ctx.font = '6px monospace';
        ctx.textAlign = 'left';
        const value = pseudoValue(node.station.id, Math.floor(absoluteSeconds / 5) + i);
        ctx.fillText(`${label}: ${value}`, chipX + 3, chipY + 9);
      });
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
}
