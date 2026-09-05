import { create } from 'zustand';
import { RealDepartment } from '@/shared/types/railsyncReal';

export type EmergencyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EmergencySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EmergencyRequest {
  id: string;
  department: RealDepartment;
  reason: string;
  severity: EmergencySeverity;
  raisedAt: string; // ISO timestamp
  status: EmergencyStatus;
  decidedBy?: string;
  decidedAt?: string;
  comments?: string;
}

interface EmergencyStoreState {
  emergencies: EmergencyRequest[];
  raiseEmergency: (department: RealDepartment, reason: string, severity: EmergencySeverity) => void;
  approveEmergency: (id: string, decidedBy: string, comments?: string) => void;
  rejectEmergency: (id: string, decidedBy: string, comments?: string) => void;
}

let nextId = 1;

/**
 * Local store bridging the Emergency window (Engineering/S&T/Traction
 * raise here) and the Controller's Notification Bell (approve/reject
 * here). The real backend's POST /api/emergency/evaluate expects an
 * existing task's request_id and doesn't recognize our local request
 * queue's IDs, so -- consistent with the Requests/Approvals rework --
 * this is a fully local, standalone record type instead of trying to
 * force it through that endpoint.
 */
export const useEmergencyStore = create<EmergencyStoreState>((set) => ({
  emergencies: [],

  raiseEmergency: (department, reason, severity) =>
    set((state) => ({
      emergencies: [
        {
          id: `EMG-${nextId++}`,
          department,
          reason,
          severity,
          raisedAt: new Date().toISOString(),
          status: 'PENDING',
        },
        ...state.emergencies,
      ],
    })),

  approveEmergency: (id, decidedBy, comments) =>
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, status: 'APPROVED', decidedBy, decidedAt: new Date().toISOString(), comments } : e
      ),
    })),

  rejectEmergency: (id, decidedBy, comments) =>
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, status: 'REJECTED', decidedBy, decidedAt: new Date().toISOString(), comments } : e
      ),
    })),
}));
