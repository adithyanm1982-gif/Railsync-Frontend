import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../api/requestsApi';

interface TaskListParams {
  corridor_id?: string;
  department?: string;
}

export function useTasksLive(params: TaskListParams = {}) {
  return useQuery({
    queryKey: ['tasks-live', params],
    queryFn: () => requestsApi.list(params),
    retry: 1,
  });
}
