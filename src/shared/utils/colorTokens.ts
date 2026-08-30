import { Department } from '@/shared/types/task';
import { SignalAspect } from '@/shared/types/corridor';
import { TrainMotionState } from '@/shared/types/train';

/**
 * Single source of truth for the simulation's "block color logic" —
 * referenced by MapLegend.tsx, MaintenanceBlockRenderer.ts, and any
 * badge/chip in the Requests/Approvals UI so colors never drift.
 */
export const DEPARTMENT_COLORS: Record<Department, string> = {
  ENGINEERING: '#38BDF8', // cyan-blue
  TRD: '#F59E0B', // amber
  SNT: '#F43F5E', // rose
};

export const JOINT_BLOCK_COLOR = '#A78BFA'; // violet — used when >1 department shares a block

export const SIGNAL_COLORS: Record<SignalAspect, string> = {
  RED: '#EF4444',
  AMBER: '#F59E0B',
  GREEN: '#22C55E',
};

export const TRAIN_MOTION_COLORS: Record<TrainMotionState, string> = {
  MOVING: '#22D3EE',
  PARKED: '#FBBF24',
  STABLED: '#94A3B8',
  WAITING: '#F97316',
};

export const CANVAS_BG = '#090D16';
export const PANEL_BG = '#0B0F19';

export function departmentLabel(dept: Department): string {
  switch (dept) {
    case 'ENGINEERING':
      return 'Engineering';
    case 'TRD':
      return 'TRD';
    case 'SNT':
      return 'S&T';
  }
}

export function colorForDepartments(departments: Department[]): string {
  if (departments.length > 1) return JOINT_BLOCK_COLOR;
  return DEPARTMENT_COLORS[departments[0]] ?? '#94A3B8';
}
