import { useMutation } from '@tanstack/react-query';
import { approvalsApi, ApprovalRequestPayload } from '../api/approvalsApi';

export function useSubmitApproval() {
  return useMutation({
    mutationFn: (payload: ApprovalRequestPayload) => approvalsApi.submit(payload),
  });
}
