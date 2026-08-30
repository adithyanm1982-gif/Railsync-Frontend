import { apiClient } from '@/shared/api/apiClient';
import { EmergencyEvaluationResult } from '@/shared/types/railsyncReal';

export interface EmergencyRequestPayload {
  request_id: string;
  reason: string;
  severity?: string;
}

/** POST /api/emergency/evaluate -- confirmed against backend/app/api/emergency.py. */
export const emergencyApi = {
  evaluate: async (payload: EmergencyRequestPayload): Promise<EmergencyEvaluationResult> => {
    const res = await apiClient.post('/api/emergency/evaluate', payload);
    return res.data;
  },
};
