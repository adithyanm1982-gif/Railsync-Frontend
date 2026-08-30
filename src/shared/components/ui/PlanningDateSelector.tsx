import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface PlanningDateSelectorProps {
  planningDate: string;
  corridorId: string;
  onPlanningDateChange: (date: string) => void;
  onCorridorIdChange: (id: string) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

/**
 * Every planning-scoped endpoint (dashboard/summary, optimization/run,
 * schedules, priorities, conflicts) takes the same planning_date +
 * corridor_id query params per openapi.json. One shared control bar
 * avoids re-implementing this in every tab.
 */
export function PlanningDateSelector({
  planningDate,
  corridorId,
  onPlanningDateChange,
  onCorridorIdChange,
  onRefresh,
  isFetching,
}: PlanningDateSelectorProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-3">
      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">Planning Date</label>
        <input
          type="date"
          value={planningDate}
          onChange={(e) => onPlanningDateChange(e.target.value)}
          className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">Corridor ID (optional)</label>
        <input
          value={corridorId}
          onChange={(e) => onCorridorIdChange(e.target.value)}
          placeholder="e.g. CORR-CENTRAL-01"
          className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs w-48"
        />
      </div>
      <Button variant="ghost" onClick={onRefresh} className="flex items-center gap-1.5">
        <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
        Refresh
      </Button>
    </div>
  );
}
