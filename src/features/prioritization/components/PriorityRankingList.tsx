import { RealPrioritizedTask } from '@/shared/types/railsyncReal';
import { PriorityBadge } from './PriorityBadge';
import { PriorityBreakdownChart } from './PriorityBreakdownChart';
import { priorityInputsFromTask } from '../utils/scoreFormatting';
import { Badge } from '@/shared/components/ui/Badge';

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#38BDF8',
  'S&T': '#F43F5E',
  Traction: '#F59E0B',
};

interface PriorityRankingListProps {
  requests: RealPrioritizedTask[];
  limit?: number;
}

/**
 * Ranked view for the Priorities tab, sourced directly from the real
 * GET /api/priorities/ response (already sorted high->low by the
 * backend, but we re-sort defensively). Each row expands the six-factor
 * breakdown behind the ranking, matching backend/priority_engine.py.
 */
export function PriorityRankingList({ requests, limit = 50 }: PriorityRankingListProps) {
  const ranked = [...requests].sort((a, b) => b.priority_score - a.priority_score).slice(0, limit);

  if (ranked.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No prioritized requests for this filter.</p>;
  }

  return (
    <div className="space-y-2">
      {ranked.map((req, i) => (
        <div key={req.request_id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono text-xs w-8">#{i + 1}</span>
              <div>
                <p className="text-sm text-slate-200">
                  {req.maintenance_type} — {req.asset_type} ({req.asset_id})
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge color={DEPARTMENT_COLORS[req.department]}>{req.department}</Badge>
                  <span className="text-xs text-slate-500">
                    {req.corridor_id} · Block {req.subsection_id} · {req.overdue_days}d overdue · {req.urgency}
                  </span>
                </div>
              </div>
            </div>
            <PriorityBadge priorityClass={req.priority_class} score={req.priority_score} />
          </div>
          <div className="mt-2 pl-11">
            <PriorityBreakdownChart input={priorityInputsFromTask(req)} />
          </div>
        </div>
      ))}
    </div>
  );
}
