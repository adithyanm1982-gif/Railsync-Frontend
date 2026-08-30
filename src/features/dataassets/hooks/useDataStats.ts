import { useQuery } from '@tanstack/react-query';
import { dataAssetsApi } from '../api/dataAssetsApi';

export function useDataStats() {
  return useQuery({
    queryKey: ['data-stats'],
    queryFn: () => dataAssetsApi.getStats(),
    retry: 1,
  });
}
