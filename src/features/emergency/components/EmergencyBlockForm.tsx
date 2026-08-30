import { useState } from 'react';
import { useEvaluateEmergency } from '../hooks/useEvaluateEmergency';
import { Button } from '@/shared/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/**
 * Matches the backend's EmergencyRequest schema exactly:
 * { request_id: string, reason: string, severity?: string = 'HIGH' }
 * This escalates an EXISTING task/request — it isn't a free-form new
 * request. The user supplies the request_id of an already-raised task
 * (visible on the Requests tab) plus the emergency reason.
 */
export function EmergencyBlockForm() {
  const [requestId, setRequestId] = useState('');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const mutation = useEvaluateEmergency();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ request_id: requestId, reason, severity });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-signal-amber/40 bg-signal-amber/10 p-3 text-xs text-signal-amber">
        <AlertTriangle size={15} className="shrink-0 mt-0.5" />
        <p>
          This escalates an existing request — find its Request ID on the Requests tab first, then submit here for
          immediate re-evaluation.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Request ID</label>
        <input
          required
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          placeholder="e.g. REQ-118"
          className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Reason</label>
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="e.g. Rail fracture detected on B1 — immediate isolation required"
          className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" variant="danger" disabled={mutation.isPending}>
        {mutation.isPending ? 'Evaluating...' : 'Submit Emergency Evaluation'}
      </Button>

      {mutation.isError && (
        <p className="text-xs text-dept-snt">{(mutation.error as Error)?.message ?? 'Evaluation failed.'}</p>
      )}
      {mutation.isSuccess && mutation.data && (
        <div className="rounded-lg border border-signal-amber/40 bg-signal-amber/10 p-3 space-y-1.5 text-xs">
          <p className="text-sm font-semibold text-signal-amber">{mutation.data.message}</p>
          <p className="text-slate-300">
            {mutation.data.request.maintenance_type} — {mutation.data.request.asset_type} (
            {mutation.data.request.asset_id})
          </p>
          <p className="text-slate-400">
            {mutation.data.request.department} · Block {mutation.data.request.subsection_id} · Severity:{' '}
            {mutation.data.severity}
          </p>
          <p className="text-slate-500">Reason: {mutation.data.reason}</p>
        </div>
      )}
    </form>
  );
}
