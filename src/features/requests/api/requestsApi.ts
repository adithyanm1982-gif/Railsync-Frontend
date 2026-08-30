import { apiClient } from '@/shared/api/apiClient';
import { RealTask, TasksResponse } from '@/shared/types/railsyncReal';

interface TaskListParams {
  corridor_id?: string;
  department?: string;
}

/**
 * GET /api/tasks/ and GET /api/tasks/{id} -- read-only, confirmed
 * against backend/app/api/tasks.py. No create/POST route exists.
 */
export const requestsApi = {
  list: async (params: TaskListParams = {}): Promise<TasksResponse> => {
    const res = await apiClient.get('/api/tasks/', { params });
    return res.data;
  },

  getById: async (requestId: string): Promise<RealTask> => {
    const res = await apiClient.get(`/api/tasks/${requestId}`);
    return res.data;
  },
};
