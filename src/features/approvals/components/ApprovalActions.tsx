import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLocalRequestStore } from '@/features/requests/local/localRequestStore';
import { Check, X } from 'lucide-react';

interface ApprovalActionsProps {
  requestId: string;
  onDone?: (approved: boolean) => void;
}

/**
 * Acts directly on the local request queue (useLocalRequestStore),
 * not the live backend -- these are the 50 locally-raised requests
 * from Engineering/S&T/Traction, which don't exist in the real
 * backend's database (it has no create endpoint), so there's nothing
 * for a real POST /api/approvals/ call to meaningfully act on here.
 */
export function ApprovalActions({ requestId, onDone }: ApprovalActionsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState('');
  const approveRequest = useLocalRequestStore((s) => s.approveRequest);
  const rejectRequest = useLocalRequestStore((s) => s.rejectRequest);

  function handleDecision(approved: boolean) {
    const approvedBy = user?.name ?? 'Controller';
    if (approved) approveRequest(requestId, approvedBy, comments || undefined);
    else rejectRequest(requestId, approvedBy, comments || undefined);
    onDone?.(approved);
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
        <Button variant="success" onClick={() => handleDecision(true)} className="flex items-center gap-1.5">
          <Check size={13} />
          Approve
        </Button>
        <Button variant="danger" onClick={() => handleDecision(false)} className="flex items-center gap-1.5">
          <X size={13} />
          Reject
        </Button>
      </div>
    </div>
  );
}
