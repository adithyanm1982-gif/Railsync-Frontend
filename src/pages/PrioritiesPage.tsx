import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { prioritiesApi } from '@/features/prioritization/api/prioritiesApi';
import { PriorityRankingList } from '@/features/prioritization/components/PriorityRankingList';
import { PlanningDateSelector } from '@/shared/components/ui/PlanningDateSelector';
import { LiveDataPanel } from '@/shared/components/ui/LiveDataPanel';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

/**
 * "Priorities" tab: the real GET /api/priorities/ feed, already
 * sorted by the backend's PriorityEngine (0-100 scale, six weighted
 * factors -- see features/prioritization/utils/scoreFormatting.ts for
 * the exact replica of backend/priority_engine.py).
 */
export function PrioritiesPage() {
  const [planningDate, setPlanningDate] = useState('2026-08-25');
  const [corridorId, setCorridorId] = useState('');

  const query = useQuery({
    queryKey: ['priorities', planningDate, corridorId],
    queryFn: () => prioritiesApi.list({ planning_date: planningDate, corridor_id: corridorId || undefined }),
    retry: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Priority Ranking {query.data ? `(${query.data.count})` : ''}</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <p className="text-xs text-slate-500">
          Score = Safety Risk×0.25 + Criticality×0.20 + Operational Impact×0.20 + Severity×0.15 + Urgency×0.10 +
          Overdue×0.10, each normalized to 0–100. Critical ≥75, High ≥55, Medium ≥35, else Low.
        </p>
        <PlanningDateSelector
          planningDate={planningDate}
          corridorId={corridorId}
          onPlanningDateChange={setPlanningDate}
          onCorridorIdChange={setCorridorId}
          onRefresh={() => query.refetch()}
          isFetching={query.isFetching}
        />
        {query.isLoading || query.isError ? (
          <LiveDataPanel query={query} />
        ) : (
          <PriorityRankingList requests={query.data?.requests ?? []} />
        )}
      </div>
    </Card>
  );
}
