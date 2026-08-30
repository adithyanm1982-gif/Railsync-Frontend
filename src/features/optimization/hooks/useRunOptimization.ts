import { useMutation } from '@tanstack/react-query';
import { optimizationApi } from '../api/optimizationApi';
import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';

export function useRunOptimization() {
  return useMutation({
    mutationFn: (params: PlanningQueryParams) => optimizationApi.run(params),
  });
}
