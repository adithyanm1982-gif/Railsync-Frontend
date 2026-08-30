import { SimTrain } from '../../types';
import { TrainWorldPosition } from '../physics/TrainMotionCalculator';
import { Viewport } from '../interaction/PanZoomController';
import { HitTarget } from '../interaction/HoverDetection';

const OCCUPANCY_COLORS = {
  CLEAR: '#64748B',
  OCCUPIED: '#22D3EE',
  RESERVED: '#FBBF24',
};

const LANE_SPACING = 7;

function laneY(laneIndex: number): number {
  return (laneIndex - 1.5) * LANE_SPACING;
}

/**
 * Draws each train as a glowing rectangle at its interpolated world
 * position. Color follows track-occupancy state (cyan = moving/
 * occupied, amber = reserved/waiting-hold, gray = clear/stabled) to
 * match the reference concept art's legend exactly.
 */
export function renderTrains(
  ctx: CanvasRenderingContext2D,
  trains: SimTrain[],
  positions: TrainWorldPosition[],
  viewport: Viewport
): HitTarget[] {
  const hitTargets: HitTarget[] = [];
  ctx.save();

  positions.forEach((pos) => {
    const train = trains.find((t) => t.id === pos.trainId);
    if (!train) return;

    const worldY = laneY(pos.laneIndex);
    const screen = { x: pos.worldX * viewport.zoom + viewport.offsetX, y: worldY * viewport.zoom + viewport.offsetY };

    const color = OCCUPANCY_COLORS[pos.occupancy];
    const w = 7 * viewport.zoom;
    const h = 3.4 * viewport.zoom;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = pos.isMoving ? 10 : 5;
    ctx.beginPath();
    ctx.roundRect(screen.x - w / 2, screen.y - h / 2, w, h, 1.5);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (viewport.zoom >= 1.6) {
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      const speedLabel = pos.isMoving ? ` ${Math.round(pos.speedKmh)}km/h` : ` ${train.status}`;
      ctx.fillText(`[${train.id} //${speedLabel}]`, screen.x, screen.y - h / 2 - 4);
    }

    hitTargets.push({
      id: train.id,
      type: 'train',
      screenX: screen.x,
      screenY: screen.y,
      radius: Math.max(10, w / 2),
    });
  });

  ctx.restore();
  return hitTargets;
}
