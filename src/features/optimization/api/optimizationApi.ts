import { apiClient } from '@/shared/api/apiClient';
import { OptimizationRunResult } from '@/shared/types/railsyncReal';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

/** POST /api/optimization/run -- confirmed against backend/app/api/optimization.py. */
export const optimizationApi = {
  run: async (params: PlanningQueryParams = {}): Promise<OptimizationRunResult> => {
    const res = await apiClient.post('/api/optimization/run', null, { params });
    return res.data;
  },
};
