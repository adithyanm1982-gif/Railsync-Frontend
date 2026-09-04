import { useState } from 'react';
import clsx from 'clsx';
import { useLocalRequestStore } from '@/features/requests/local/localRequestStore';
import { ApprovalQueue, SortMode } from '@/features/approvals/components/ApprovalQueue';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'urgency', label: 'Urgency' },
  { value: 'overdue', label: 'Overdue Days' },
];

/**
 * "Approvals" tab: the Controller's action desk, sourced from the
 * same local request queue as the Requests tab (not the live
 * backend -- see localRequestStore.ts). Only requests still awaiting
 * a decision are shown; once approved/rejected, a request leaves this
 * queue (it's still visible, with its decision, in the Controller's
 * Requests tab).
 */
export function ApprovalPage() {
  const [department, setDepartment] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('priority');
  const allRequests = useLocalRequestStore((s) => s.requests);

  const pending = allRequests.filter((r) => r.request_status === 'PENDING');
  const filtered = department ? pending.filter((r) => r.department === department) : pending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Desk ({pending.length} awaiting decision)</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
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

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <ArrowUpDown size={10} />
              Sort by
            </label>
            <div className="flex gap-1 rounded-md bg-slate-900/60 p-1 border border-slate-700">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={clsx(
                    'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                    sortBy === opt.value ? 'bg-dept-engineering text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ApprovalQueue tasks={filtered} sortBy={sortBy} />
      </div>
    </Card>
  );
}
