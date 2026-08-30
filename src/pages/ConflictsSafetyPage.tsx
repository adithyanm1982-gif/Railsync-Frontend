import { useState } from 'react';
import { useConflicts } from '@/features/conflicts/hooks/useConflicts';
import { PlanningDateSelector } from '@/shared/components/ui/PlanningDateSelector';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * "Conflicts & Safety" tab: the real GET /api/conflicts/ response --
 * a safety validation verdict for the selected planning date/corridor
 * (safety_valid + safety_penalty + a human-readable message), not a
 * list of individual conflicts -- that's the shape the backend
 * actually returns (backend/app/api/conflicts.py).
 */
export function ConflictsSafetyPage() {
  const [planningDate, setPlanningDate] = useState('2026-08-25');
  const [corridorId, setCorridorId] = useState('');

  const query = useConflicts({ planning_date: planningDate, corridor_id: corridorId || undefined });
  const d = query.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conflicts &amp; Safety Validation</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <PlanningDateSelector
          planningDate={planningDate}
          corridorId={corridorId}
          onPlanningDateChange={setPlanningDate}
          onCorridorIdChange={setCorridorId}
          onRefresh={() => query.refetch()}
          isFetching={query.isFetching}
        />

        {query.isLoading && (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
            <RefreshCw size={14} className="animate-spin" />
            Fetching live data — the backend may be cold-starting (can take up to ~30s)...
          </div>
        )}

        {query.isError && (
          <div className="flex items-start gap-2 rounded-lg border border-dept-snt/40 bg-dept-snt/10 p-3 text-sm text-dept-snt">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>{(query.error as Error)?.message ?? 'Could not reach the backend.'}</p>
          </div>
        )}

        {d && (
          <div
            className={`rounded-lg border p-4 ${
              d.safety_valid ? 'border-signal-green/40 bg-signal-green/10' : 'border-dept-snt/40 bg-dept-snt/10'
            }`}
          >
            <div className="flex items-center gap-2">
              {d.safety_valid ? (
                <ShieldCheck size={20} className="text-signal-green" />
              ) : (
                <AlertTriangle size={20} className="text-dept-snt" />
              )}
              <p className={`text-sm font-semibold ${d.safety_valid ? 'text-signal-green' : 'text-dept-snt'}`}>
                {d.safety_valid ? 'Safety Valid' : 'Safety Issues Detected'}
              </p>
            </div>
            <p className="text-sm text-slate-300 mt-2">{d.message}</p>
            <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
              <div>
                <p className="text-slate-500">Planning Date</p>
                <p className="text-slate-200">{d.planning_date}</p>
              </div>
              <div>
                <p className="text-slate-500">Corridor</p>
                <p className="text-slate-200">{d.corridor_id}</p>
              </div>
              <div>
                <p className="text-slate-500">Safety Penalty</p>
                <p className="text-slate-200">{d.safety_penalty}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
