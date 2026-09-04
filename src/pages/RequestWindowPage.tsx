import { useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLocalRequestStore } from '@/features/requests/local/localRequestStore';
import { RaiseRequestForm } from '@/features/requests/local/RaiseRequestForm';
import { RealTaskList } from '@/features/requests/components/RealTaskList';
import { RealRequestFilterBar, RealFilters } from '@/features/requests/components/RealRequestFilterBar';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

const DEFAULT_FILTERS: RealFilters = {
  department: 'ALL',
  urgency: 'ALL',
  corridorId: 'ALL',
  minOverdueDays: 0,
};

/**
 * "Requests" tab, role-gated:
 * - Engineering / S&T / Traction: ONLY a raise-request form. They
 *   cannot see other departments' requests, or even their own past
 *   ones, in this tab -- raising is their whole job here.
 * - Section Controller: ONLY the list of all 50 requests raised by
 *   the three departments (read-only browse -- decisions happen in
 *   the Approvals tab). No raise-request form for the Controller;
 *   they don't request anything themselves.
 *
 * Both views read/write the same local request queue
 * (useLocalRequestStore), so a request raised by a department shows
 * up in the Controller's list immediately.
 */
export function RequestWindowPage() {
  const { user } = useAuth();
  const allRequests = useLocalRequestStore((s) => s.requests);

  const [filters, setFilters] = useState<RealFilters>(DEFAULT_FILTERS);
  const corridorOptions = useMemo(() => Array.from(new Set(allRequests.map((t) => t.corridor_id))).sort(), [allRequests]);

  if (user?.role !== 'CONTROLLER') {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Raise Service Request</CardTitle>
        </CardHeader>
        <RaiseRequestForm />
      </Card>
    );
  }

  const filtered = allRequests.filter((t) => {
    if (filters.department !== 'ALL' && t.department !== filters.department) return false;
    if (filters.urgency !== 'ALL' && t.urgency !== filters.urgency) return false;
    if (filters.corridorId !== 'ALL' && t.corridor_id !== filters.corridorId) return false;
    if (t.overdue_days < filters.minOverdueDays) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests from Departments ({allRequests.length})</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <RealRequestFilterBar filters={filters} onChange={setFilters} corridorOptions={corridorOptions} />
        <RealTaskList tasks={filtered} />
      </div>
    </Card>
  );
}
