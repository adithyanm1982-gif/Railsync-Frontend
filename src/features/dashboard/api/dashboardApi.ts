import { apiClient } from '@/shared/api/apiClient';
import { DashboardSummary } from '@/shared/types/railsyncReal';

export interface PlanningQueryParams {
  planning_date?: string;
  corridor_id?: string;
}

/** GET /api/dashboard/summary -- confirmed against backend/app/api/dashboard.py. */
export const dashboardApi = {
  getSummary: async (params: PlanningQueryParams = {}): Promise<DashboardSummary> => {
    const res = await apiClient.get('/api/dashboard/summary', { params });
    return res.data;
  },
};
