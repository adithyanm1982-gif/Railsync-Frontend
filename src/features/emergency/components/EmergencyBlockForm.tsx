import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEmergencyStore, EmergencySeverity } from '../local/emergencyStore';
import { Button } from '@/shared/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const SEVERITIES: EmergencySeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/**
 * Raise-emergency form for Engineering/S&T/Traction. Submits into the
 * local emergency store (emergencyStore.ts), NOT the real backend's
 * POST /api/emergency/evaluate -- that endpoint expects an existing
 * task's real request_id from the live /api/tasks/ feed, which no
 * longer applies now that Requests/Emergency both run on local,
 * self-contained data (the real backend has no create endpoint at
 * all). Raising here immediately surfaces the request in the Section
 * Controller's Notification Bell.
 */
export function EmergencyBlockForm() {
  const { user } = useAuth();
  const department = user?.department;
  const raiseEmergency = useEmergencyStore((s) => s.raiseEmergency);

  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState<EmergencySeverity>('HIGH');
  const [submitted, setSubmitted] = useState(false);

  if (!department) {
    return <p className="text-sm text-slate-500">Only department logins can raise an emergency.</p>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    raiseEmergency(department!, reason, severity);
    setSubmitted(true);
    setReason('');
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-signal-amber/40 bg-signal-amber/10 p-3 text-xs text-signal-amber">
        <AlertTriangle size={15} className="shrink-0 mt-0.5" />
        <p>This sends an immediate emergency alert to the Section Controller's Notification Bell for approval.</p>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Reason</label>
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Rail fracture detected on C01-S02 — immediate isolation required"
          className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as EmergencySeverity)}
          className="w-full rounded-md bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm"
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" variant="danger">
        Send Emergency Alert
      </Button>

      {submitted && (
        <p className="text-xs text-signal-green">Emergency alert sent to the Section Controller.</p>
      )}
    </form>
  );
}
