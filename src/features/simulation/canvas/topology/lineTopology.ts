import { SimStation, SimCorridor, SimBlock, SimSubBlock } from '../../types';
import { REAL_SCHEDULE_ENTRIES } from '../../data/realSchedules';

const SUB_BLOCKS_PER_BLOCK = 4;

const STATION_ORDER = ['ST01', 'ST02', 'ST03', 'ST04', 'ST05'];
const CORRIDOR_ORDER = ['C01', 'C02', 'C03', 'C04'];
const BLOCKS_PER_CORRIDOR = ['S01', 'S02', 'S03', 'S04'];

/**
 * Builds the real railway line topology from the schedule dataset:
 * 5 stations (ST01..ST05) chained by 4 corridors (C01..C04), each
 * corridor containing 4 real blocks (subsection_id, e.g. 'C01-S02').
 * Each block is further divided into invisible sub-blocks (track
 * circuits) for the micro-zoom detail level.
 *
 * This is derived structurally (station/corridor/block IDs are fixed
 * and known from the real data), not read directly off
 * REAL_SCHEDULE_ENTRIES per-call, since not every block necessarily
 * has a schedule entry in the current 7-day window.
 */
export function buildLineTopology(): { stations: SimStation[]; corridors: SimCorridor[] } {
  const stations: SimStation[] = STATION_ORDER.map((id, i) => ({
    id,
    label: `Station ${id.replace('ST', '')}`,
    order: i,
  }));

  const corridors: SimCorridor[] = CORRIDOR_ORDER.map((corridorId, i) => {
    const fromStationId = STATION_ORDER[i];
    const toStationId = STATION_ORDER[i + 1];

    const blocks: SimBlock[] = BLOCKS_PER_CORRIDOR.map((suffix, blockOrder) => {
      const blockId = `${corridorId}-${suffix}`;
      const subBlocks: SimSubBlock[] = Array.from({ length: SUB_BLOCKS_PER_BLOCK }).map((_, sbi) => ({
        id: `${blockId}-TC${sbi + 1}`,
        blockId,
        order: sbi,
      }));

      return {
        id: blockId,
        corridorId,
        order: blockOrder,
        label: blockId,
        subBlocks,
      };
    });

    return { id: corridorId, fromStationId, toStationId, order: i, blocks };
  });

  return { stations, corridors };
}

export function findBlockById(blockId: string, corridors: SimCorridor[]): SimBlock | undefined {
  for (const c of corridors) {
    const b = c.blocks.find((b) => b.id === blockId);
    if (b) return b;
  }
  return undefined;
}

/** Every unique subsection_id actually referenced by real schedule data, for sanity/debugging. */
export function scheduledBlockIds(): string[] {
  return Array.from(new Set(REAL_SCHEDULE_ENTRIES.map((s) => s.subsection_id)));
}
