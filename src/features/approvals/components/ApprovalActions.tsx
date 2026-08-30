import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { useSubmitApproval } from '../hooks/useSubmitApproval';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Check, X, RefreshCw } from 'lucide-react';

interface ApprovalActionsProps {
  requestId: string;
  onDone?: (approved: boolean) => void;
}

export function ApprovalActions({ requestId, onDone }: ApprovalActionsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState('');
  const mutation = useSubmitApproval();

  function handleDecision(approved: boolean) {
    mutation.mutate(
      {
        request_id: requestId,
        approved,
        approved_by: user?.name,
        comments: comments || undefined,
      },
      { onSuccess: () => onDone?.(approved) }
    );
  }

  return (
    <div className="space-y-2">
      <input
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Optional comments"
        className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
      />
      <div className="flex gap-2">
        <Button
          variant="success"
          onClick={() => handleDecision(true)}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5"
        >
          {mutation.isPending ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
          Approve
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDecision(false)}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5"
        >
          <X size={13} />
          Reject
        </Button>
      </div>
      {mutation.isError && (
        <p className="text-xs text-dept-snt">{(mutation.error as Error)?.message ?? 'Approval submission failed.'}</p>
      )}
      {mutation.isSuccess && <p className="text-xs text-signal-green">Decision submitted.</p>}
    </div>
  );
}
