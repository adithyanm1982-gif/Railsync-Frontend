import { useQuery } from '@tanstack/react-query';
import { conflictsApi } from '../api/conflictsApi';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

export function useConflicts(params: PlanningQueryParams = {}) {
  return useQuery({
    queryKey: ['conflicts', params],
    queryFn: () => conflictsApi.list(params),
    retry: 1,
  });
}
