import { useState } from 'react';
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

const PAGE_SIZE = 25;

interface PriorityRankingListProps {
  requests: RealPrioritizedTask[];
}

/**
 * Ranked view for the Priorities tab, sourced directly from the real
 * GET /api/priorities/ response (already sorted high->low by the
 * backend, but we re-sort defensively). Paginated at 25/page instead
 * of a hard top-50 cutoff -- previously that cutoff meant Medium/Low
 * priority items were never reachable at all when there were 50+
 * Critical/High items ahead of them. The class filter above this list
 * (see PrioritiesPage) narrows `requests` before it ever reaches here,
 * so pagination on top of that keeps any single class browsable too.
 */
export function PriorityRankingList({ requests }: PriorityRankingListProps) {
  const [page, setPage] = useState(0);
  const ranked = [...requests].sort((a, b) => b.priority_score - a.priority_score);

  if (ranked.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No prioritized requests for this filter.</p>;
  }

  const totalPages = Math.ceil(ranked.length / PAGE_SIZE);
  const pageItems = ranked.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rankOffset = page * PAGE_SIZE;

  return (
    <div className="space-y-2">
      {pageItems.map((req, i) => (
        <div key={req.request_id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono text-xs w-8">#{rankOffset + i + 1}</span>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
          <span>
            {ranked.length} requests · Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md border border-slate-700 px-2 py-1 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-md border border-slate-700 px-2 py-1 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
