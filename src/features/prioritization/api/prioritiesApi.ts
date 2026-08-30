import { apiClient } from '@/shared/api/apiClient';
import { PrioritiesResponse, RealPrioritizedTask } from '@/shared/types/railsyncReal';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

/** GET /api/priorities/ and /api/priorities/{id} -- confirmed against backend/app/api/priorities.py. */
export const prioritiesApi = {
  list: async (params: PlanningQueryParams = {}): Promise<PrioritiesResponse> => {
    const res = await apiClient.get('/api/priorities/', { params });
    return res.data;
  },

  getForRequest: async (requestId: string): Promise<RealPrioritizedTask> => {
    const res = await apiClient.get(`/api/priorities/${requestId}`);
    return res.data;
  },
};
