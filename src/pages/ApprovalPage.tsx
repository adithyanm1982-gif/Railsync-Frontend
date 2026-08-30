import { useState } from 'react';
import { useTasksLive } from '@/features/requests/hooks/useTasksLive';
import { ApprovalQueue } from '@/features/approvals/components/ApprovalQueue';
import { LiveDataPanel } from '@/shared/components/ui/LiveDataPanel';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

/**
 * "Approvals" tab: the controller's action desk. Every request from
 * GET /api/tasks/ is awaiting review (request_status is 'PENDING' /
 * controller_status is 'PENDING_REVIEW' on all of them in the current
 * dataset) -- this tab is where that gets resolved via
 * POST /api/approvals/. There is deliberately no separate "pending"
 * concept anywhere else in the app; Requests (browse) and Approvals
 * (decide) are the only two views of this data, and they show
 * different things (all requests vs. one clear approve/reject action
 * per request), not overlapping ones.
 */
export function ApprovalPage() {
  const [department, setDepartment] = useState('');
  const query = useTasksLive({ department: department || undefined });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Desk {query.data ? `(${query.data.count})` : ''}</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wide">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
            >
              <option value="">All</option>
              <option value="Engineering">Engineering</option>
              <option value="S&T">S&T</option>
              <option value="Traction">Traction</option>
            </select>
          </div>
        </div>

        {query.isLoading || query.isError ? <LiveDataPanel query={query} /> : <ApprovalQueue tasks={query.data?.tasks ?? []} />}
      </div>
    </Card>
  );
}
