import { RealScheduleEntry } from '../../types';
import { RenderedBlockSpan } from '../topology/lineGeometry';
import { Viewport } from '../interaction/PanZoomController';
import { HitTarget } from '../interaction/HoverDetection';
import { SIM_DAYS, hhmmToSeconds, dayIndexAndTimeToAbsolute, SECONDS_PER_DAY } from '../physics/simCalendar';

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#38BDF8',
  'S&T': '#F43F5E',
  Traction: '#F59E0B',
};

function colorForDepartment(dept: string): string {
  return DEPARTMENT_COLORS[dept] ?? '#A78BFA';
}

/**
 * A real schedule entry's [start_time, end_time) window on its date,
 * converted to absolute timeline seconds. Handles the (fairly common
 * in this dataset) case where end_time < start_time, meaning the
 * block runs past midnight into the next day.
 */
export function scheduleEntryAbsoluteWindow(entry: RealScheduleEntry): { start: number; end: number } {
  const dayIndex = SIM_DAYS.findIndex((d) => d.date === entry.date);
  const safeDayIndex = dayIndex === -1 ? 0 : dayIndex;
  const startSecIntoDay = hhmmToSeconds(entry.start_time);
  let endSecIntoDay = hhmmToSeconds(entry.end_time);
  const crossesMidnight = endSecIntoDay <= startSecIntoDay;
  if (crossesMidnight) endSecIntoDay += SECONDS_PER_DAY;

  const start = dayIndexAndTimeToAbsolute(safeDayIndex, startSecIntoDay);
  const end = dayIndexAndTimeToAbsolute(safeDayIndex, endSecIntoDay);
  return { start, end };
}

export function isEntryActive(entry: RealScheduleEntry, absoluteSeconds: number): boolean {
  const { start, end } = scheduleEntryAbsoluteWindow(entry);
  return absoluteSeconds >= start && absoluteSeconds <= end;
}

/**
 * Draws a glowing bounding box over any block whose real schedule
 * window is active at the current sim time. Color follows the owning
 * department (Engineering/S&T/Traction), matching colorTokens
 * conventions used elsewhere in the app. Returns hit targets for
 * hover so MaintenanceHoverPopover can show the full real record.
 */
export function renderMaintenanceBlocks(
  ctx: CanvasRenderingContext2D,
  entries: RealScheduleEntry[],
  blockSpans: RenderedBlockSpan[],
  viewport: Viewport,
  absoluteSeconds: number,
  laneYRange: { min: number; max: number }
): HitTarget[] {
  const hitTargets: HitTarget[] = [];
  ctx.save();

  for (const entry of entries) {
    if (!isEntryActive(entry, absoluteSeconds)) continue;

    const span = blockSpans.find((b) => b.blockId === entry.subsection_id);
    if (!span) continue;

    const color = colorForDepartment(entry.department);
    const x1 = span.xStart * viewport.zoom + viewport.offsetX;
    const x2 = span.xEnd * viewport.zoom + viewport.offsetX;
    const yTop = laneYRange.min * viewport.zoom + viewport.offsetY - 16;
    const yBottom = laneYRange.max * viewport.zoom + viewport.offsetY + 16;

    ctx.strokeStyle = color;
    ctx.fillStyle = `${color}22`;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(x1, yTop, x2 - x1, yBottom - yTop, 5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = color;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${entry.department.toUpperCase()} // ${entry.maintenance_type}`, (x1 + x2) / 2, yTop - 5);

    hitTargets.push({
      id: entry.request_id,
      type: 'maintenance-block',
      screenX: (x1 + x2) / 2,
      screenY: (yTop + yBottom) / 2,
      radius: Math.max((x2 - x1) / 2, (yBottom - yTop) / 2),
    });
  }

  ctx.restore();
  return hitTargets;
}
