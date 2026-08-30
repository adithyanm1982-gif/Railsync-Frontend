import { SimStation } from '../../types';
import { buildLineTopology } from './lineTopology';

export interface LanePoint {
  x: number;
  y: number;
}

export type LaneKind = 'MAINLINE' | 'LOOP' | 'SIDING';

export interface RenderedLane {
  id: string;
  corridorId: string | null; // null for a station-local loop/siding stub
  kind: LaneKind;
  laneIndex: number;
  points: LanePoint[];
}

export interface RenderedBlockSpan {
  blockId: string;
  corridorId: string;
  xStart: number;
  xEnd: number;
}

export interface RenderedSubBlockSpan {
  subBlockId: string;
  blockId: string;
  xStart: number;
  xEnd: number;
}

export interface RenderedStationNode {
  station: SimStation;
  x: number;
  platformIds: string[];
}

const LANE_SPACING = 7;
const CENTER_Y = 0;
const JUNCTION_FAN = 22; // world-width of the fan zone on each side of a station
const BODY_LENGTH = 60; // world-width of the straight 4-lane corridor body
export const STATION_SPACING = BODY_LENGTH + JUNCTION_FAN * 2;

function laneY(laneIndex: number, totalLanes: number): number {
  return CENTER_Y + (laneIndex - (totalLanes - 1) / 2) * LANE_SPACING;
}

export function stationX(order: number): number {
  return order * STATION_SPACING;
}

/**
 * Builds the full renderable geometry for the real line topology:
 * one polyline per through-mainline-lane per corridor (4 lanes,
 * constant across the whole line), plus short local loop/siding stubs
 * fanning off each station junction (representing platform loops and
 * stabling sidings, matching the reference concept art). Also returns
 * block/sub-block x-ranges for overlay highlighting, and station node
 * positions for platform boxes.
 */
export function buildLineGeometry() {
  const { stations, corridors } = buildLineTopology();

  const lanes: RenderedLane[] = [];
  const blockSpans: RenderedBlockSpan[] = [];
  const subBlockSpans: RenderedSubBlockSpan[] = [];
  const stationNodes: RenderedStationNode[] = [];

  for (const corridor of corridors) {
    const xA = stationX(corridor.order) + JUNCTION_FAN;
    const xB = stationX(corridor.order + 1) - JUNCTION_FAN;

    for (let lane = 0; lane < 4; lane++) {
      const y = laneY(lane, 4);
      lanes.push({
        id: `${corridor.id}-mainline-${lane}`,
        corridorId: corridor.id,
        kind: 'MAINLINE',
        laneIndex: lane,
        points: [
          { x: xA, y },
          { x: xB, y },
        ],
      });
    }

    const blockWidth = (xB - xA) / corridor.blocks.length;
    corridor.blocks.forEach((block, i) => {
      const bStart = xA + i * blockWidth;
      const bEnd = bStart + blockWidth;
      blockSpans.push({ blockId: block.id, corridorId: corridor.id, xStart: bStart, xEnd: bEnd });

      const subWidth = blockWidth / block.subBlocks.length;
      block.subBlocks.forEach((sb, j) => {
        subBlockSpans.push({
          subBlockId: sb.id,
          blockId: block.id,
          xStart: bStart + j * subWidth,
          xEnd: bStart + (j + 1) * subWidth,
        });
      });
    });
  }

  for (const station of stations) {
    const cx = stationX(station.order);
    const hasLeftCorridor = station.order > 0;
    const hasRightCorridor = station.order < corridors.length;

    if (hasLeftCorridor) {
      for (let lane = 0; lane < 4; lane++) {
        const yBody = laneY(lane, 4);
        lanes.push({
          id: `${station.id}-approach-L-${lane}`,
          corridorId: null,
          kind: 'MAINLINE',
          laneIndex: lane,
          points: [
            { x: cx - JUNCTION_FAN, y: yBody },
            { x: cx, y: yBody },
          ],
        });
      }
    }
    if (hasRightCorridor) {
      for (let lane = 0; lane < 4; lane++) {
        const yBody = laneY(lane, 4);
        lanes.push({
          id: `${station.id}-approach-R-${lane}`,
          corridorId: null,
          kind: 'MAINLINE',
          laneIndex: lane,
          points: [
            { x: cx, y: yBody },
            { x: cx + JUNCTION_FAN, y: yBody },
          ],
        });
      }
    }

    const stubs: Array<{ kind: LaneKind; laneOffset: number }> = [
      { kind: 'LOOP', laneOffset: -3 },
      { kind: 'LOOP', laneOffset: 3 },
      { kind: 'SIDING', laneOffset: -4.6 },
      { kind: 'SIDING', laneOffset: 4.6 },
    ];
    stubs.forEach((stub, i) => {
      const yEnd = CENTER_Y + stub.laneOffset * LANE_SPACING;
      const yStart = laneY(stub.laneOffset < 0 ? 0 : 3, 4);
      lanes.push({
        id: `${station.id}-stub-${stub.kind}-${i}`,
        corridorId: null,
        kind: stub.kind,
        laneIndex: i,
        points: [
          { x: cx - 10, y: yStart },
          { x: cx, y: yEnd },
          { x: cx + 10, y: yEnd },
        ],
      });
    });

    stationNodes.push({
      station,
      x: cx,
      platformIds: [`P${station.order * 2 + 1}`, `P${station.order * 2 + 2}`],
    });
  }

  return { stations, corridors, lanes, blockSpans, subBlockSpans, stationNodes };
}

export function pointAlongPolyline(points: LanePoint[], t: number): LanePoint {
  if (points.length < 2) return points[0] ?? { x: 0, y: 0 };
  const clamped = Math.max(0, Math.min(1, t));
  const totalSegments = points.length - 1;
  const segFloat = clamped * totalSegments;
  const segIndex = Math.min(Math.floor(segFloat), totalSegments - 1);
  const localT = segFloat - segIndex;
  const a = points[segIndex];
  const b = points[segIndex + 1];
  return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
}

export function xToFraction(x: number, points: LanePoint[]): number {
  const start = points[0].x;
  const end = points[points.length - 1].x;
  if (end === start) return 0;
  return Math.max(0, Math.min(1, (x - start) / (end - start)));
}

export const TOTAL_LINE_LENGTH = STATION_SPACING * 4;
