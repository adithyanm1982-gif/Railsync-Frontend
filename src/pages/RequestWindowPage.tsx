import { useMemo, useState } from 'react';
import { useTasksLive } from '@/features/requests/hooks/useTasksLive';
import { RealTaskList } from '@/features/requests/components/RealTaskList';
import { RealRequestFilterBar, RealFilters } from '@/features/requests/components/RealRequestFilterBar';
import { LiveDataPanel } from '@/shared/components/ui/LiveDataPanel';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

const DEFAULT_FILTERS: RealFilters = {
  department: 'ALL',
  urgency: 'ALL',
  corridorId: 'ALL',
  minOverdueDays: 0,
};

/**
 * "Requests" tab: the real GET /api/tasks/ feed (420 department
 * requests), filterable by department/corridor/urgency/overdue-days.
 * No POST/create route exists on the backend yet -- Engineering/TRD/
 * S&T departments raise requests through their own systems that feed
 * this dataset; this tab is a live read/browse view of it.
 */
export function RequestWindowPage() {
  const [filters, setFilters] = useState<RealFilters>(DEFAULT_FILTERS);
  const query = useTasksLive({
    department: filters.department !== 'ALL' ? filters.department : undefined,
    corridor_id: filters.corridorId !== 'ALL' ? filters.corridorId : undefined,
  });

  const tasks = query.data?.tasks ?? [];
  const corridorOptions = useMemo(() => Array.from(new Set(tasks.map((t) => t.corridor_id))).sort(), [tasks]);

  const filtered = tasks.filter((t) => {
    if (filters.urgency !== 'ALL' && t.urgency !== filters.urgency) return false;
    if (t.overdue_days < filters.minOverdueDays) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Requests {query.data ? `(${query.data.count})` : ''}</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <RealRequestFilterBar filters={filters} onChange={setFilters} corridorOptions={corridorOptions} />
        {query.isLoading || query.isError ? <LiveDataPanel query={query} /> : <RealTaskList tasks={filtered} />}
      </div>
    </Card>
  );
}
