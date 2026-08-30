import { apiClient } from '@/shared/api/apiClient';
import { DataStats } from '@/shared/types/railsyncReal';

/** GET /api/data/stats -- confirmed against backend/app/api/data.py. */
export const dataAssetsApi = {
  getStats: async (): Promise<DataStats> => {
    const res = await apiClient.get('/api/data/stats');
    return res.data;
  },
};
