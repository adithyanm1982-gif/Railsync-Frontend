import { apiClient } from '@/shared/api/apiClient';
import { SchedulesResponse, RealScheduleEntry } from '@/shared/types/railsyncReal';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

interface ScheduleListParams extends PlanningQueryParams {
  department?: string;
}

/** GET /api/schedules/ and /api/schedules/{id} -- confirmed against backend/app/api/schedules.py. */
export const schedulesApi = {
  list: async (params: ScheduleListParams = {}): Promise<SchedulesResponse> => {
    const res = await apiClient.get('/api/schedules/', { params });
    return res.data;
  },

  getForRequest: async (requestId: string, params: PlanningQueryParams = {}): Promise<RealScheduleEntry> => {
    const res = await apiClient.get(`/api/schedules/${requestId}`, { params });
    return res.data;
  },
};
