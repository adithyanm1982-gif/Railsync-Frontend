import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '../api/schedulesApi';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

interface ScheduleListParams extends PlanningQueryParams {
  department?: string;
}

export function useSchedules(params: ScheduleListParams = {}) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: () => schedulesApi.list(params),
    retry: 1,
  });
}
