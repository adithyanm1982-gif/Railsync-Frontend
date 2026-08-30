import { apiClient } from '@/shared/api/apiClient';
import { ApprovalResult } from '@/shared/types/railsyncReal';

export interface ApprovalRequestPayload {
  request_id: string;
  approved: boolean;
  approved_by?: string | null;
  comments?: string | null;
}

/** POST /api/approvals/ -- confirmed against backend/app/api/approvals.py. */
export const approvalsApi = {
  submit: async (payload: ApprovalRequestPayload): Promise<ApprovalResult> => {
    const res = await apiClient.post('/api/approvals/', payload);
    return res.data;
  },
};
