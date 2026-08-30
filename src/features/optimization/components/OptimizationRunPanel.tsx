import { PlanningQueryParams } from '@/features/dashboard/api/dashboardApi';
import { useRunOptimization } from '../hooks/useRunOptimization';
import { Button } from '@/shared/components/ui/Button';
import { ScheduleTable } from '@/features/schedules/components/ScheduleTable';
import { Play, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OptimizationRunPanelProps {
  params: PlanningQueryParams;
}

/**
 * "Planning / Optimization" tab centerpiece: manually trigger the
 * CP-SAT solver run for the selected planning_date/corridor_id via
 * POST /api/optimization/run, then render the real
 * OptimizationRunResult -- selected_tasks (same shape as a schedule
 * entry, so it reuses ScheduleTable), status, and safety verdict.
 */
export function OptimizationRunPanel({ params }: OptimizationRunPanelProps) {
  const mutation = useRunOptimization();

  return (
    <div className="space-y-3">
      <Button onClick={() => mutation.mutate(params)} disabled={mutation.isPending} className="flex items-center gap-2">
        {mutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
        {mutation.isPending ? 'Running optimizer...' : 'Run Optimization'}
      </Button>

      {mutation.isError && (
        <div className="flex items-start gap-2 rounded-lg border border-dept-snt/40 bg-dept-snt/10 p-3 text-sm text-dept-snt">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>{(mutation.error as Error)?.message ?? 'Optimization run failed.'}</p>
        </div>
      )}

      {mutation.isSuccess && mutation.data && (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
              mutation.data.safety_valid
                ? 'border-signal-green/40 bg-signal-green/10 text-signal-green'
                : 'border-dept-snt/40 bg-dept-snt/10 text-dept-snt'
            }`}
          >
            {mutation.data.safety_valid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>
              Status: <span className="font-medium">{mutation.data.status}</span> · {mutation.data.selected_count}{' '}
              tasks selected · {mutation.data.safety_valid ? 'Safety valid' : `Safety penalty: ${mutation.data.safety_penalty}`}
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <p className="text-xs text-slate-500 mb-2">Selected tasks</p>
            <ScheduleTable schedules={mutation.data.selected_tasks} />
          </div>
        </div>
      )}
    </div>
  );
}
