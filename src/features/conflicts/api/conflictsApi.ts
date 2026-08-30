import { apiClient } from '@/shared/api/apiClient';
import { ConflictsResult } from '@/shared/types/railsyncReal';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

/** GET /api/conflicts/ -- confirmed against backend/app/api/conflicts.py. */
export const conflictsApi = {
  list: async (params: PlanningQueryParams = {}): Promise<ConflictsResult> => {
    const res = await apiClient.get('/api/conflicts/', { params });
    return res.data;
  },
};
