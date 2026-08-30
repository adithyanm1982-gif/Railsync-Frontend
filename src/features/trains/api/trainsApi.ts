import { apiClient } from '@/shared/api/apiClient';
import { TrainsResponse } from '@/shared/types/railsyncReal';

interface TrainListParams {
  day?: string;
  corridor_id?: string;
  train_no?: string;
}

/**
 * GET /api/trains/ -- NOT YET LIVE as of this writing. Matches the
 * route drafted in backend_trains_endpoint_for_your_friend.py exactly
 * (query params: day, corridor_id, train_no; response: {count, trains[]}).
 * Once the backend team adds that route and redeploys, this starts
 * working with zero frontend changes.
 */
export const trainsApi = {
  list: async (params: TrainListParams = {}): Promise<TrainsResponse> => {
    const res = await apiClient.get('/api/trains/', { params });
    return res.data;
  },
};
