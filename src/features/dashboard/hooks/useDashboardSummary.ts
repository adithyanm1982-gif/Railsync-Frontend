import { useQuery } from '@tanstack/react-query';
import { dashboardApi, PlanningQueryParams } from '../api/dashboardApi';

export function useDashboardSummary(params: PlanningQueryParams = {}) {
  return useQuery({
    queryKey: ['dashboard-summary', params],
    queryFn: () => dashboardApi.getSummary(params),
    retry: 1,
  });
}
