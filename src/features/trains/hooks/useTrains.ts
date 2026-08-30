import { useQuery } from '@tanstack/react-query';
import { trainsApi } from '../api/trainsApi';

interface TrainListParams {
  day?: string;
  corridor_id?: string;
  train_no?: string;
}

export function useTrains(params: TrainListParams = {}) {
  return useQuery({
    queryKey: ['trains', params],
    queryFn: () => trainsApi.list(params),
    retry: 1,
  });
}
