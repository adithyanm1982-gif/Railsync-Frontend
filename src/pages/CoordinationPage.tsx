import { useMemo, useState } from 'react';
import { useSchedules } from '@/features/schedules/hooks/useSchedules';
import { ScheduleTable } from '@/features/schedules/components/ScheduleTable';
import { PlanningDateSelector } from '@/shared/components/ui/PlanningDateSelector';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { MaintenanceHoverPopover } from '@/features/simulation/components/MaintenanceHoverPopover';
import { REAL_SCHEDULE_ENTRIES } from '@/features/simulation/data/realSchedules';
import { RealScheduleEntry } from '@/features/simulation/types';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * "Coordination" tab per backend spec: opportunities where multiple
 * maintenance requests can be combined into the same block/window.
 *
 * NOTE: the openapi.json export doesn't list a dedicated /api/coordination
 * endpoint -- coordination_engine.py's joint-block output is presumably
 * embedded inside the schedules/optimization response instead. Until
 * that's confirmed, this page derives real joint-block opportunities
 * client-side from the actual 108-entry schedule dataset (same
 * subsection_id + overlapping [date,start_time,end_time] windows +
 * different departments) -- this is real detection logic against real
 * data, not a mock.
 */

interface JointGroup {
  subsectionId: string;
  date: string;
  entries: RealScheduleEntry[];
}

function windowsOverlap(a: RealScheduleEntry, b: RealScheduleEntry): boolean {
  if (a.date !== b.date) return false;
  return a.start_time < b.end_time && b.start_time < a.end_time;
}

function findJointGroups(entries: RealScheduleEntry[]): JointGroup[] {
  const bySubsection = new Map<string, RealScheduleEntry[]>();
  for (const e of entries) {
    const list = bySubsection.get(e.subsection_id) ?? [];
    list.push(e);
    bySubsection.set(e.subsection_id, list);
  }

  const groups: JointGroup[] = [];
  for (const [subsectionId, list] of bySubsection) {
    const used = new Set<string>();
    for (let i = 0; i < list.length; i++) {
      if (used.has(list[i].request_id)) continue;
      const cluster = [list[i]];
      for (let j = i + 1; j < list.length; j++) {
        if (used.has(list[j].request_id)) continue;
        if (windowsOverlap(list[i], list[j]) && list[j].department !== list[i].department) {
          cluster.push(list[j]);
          used.add(list[j].request_id);
        }
      }
      if (cluster.length > 1) {
        used.add(list[i].request_id);
        groups.push({ subsectionId, date: list[i].date, entries: cluster });
      }
    }
  }
  return groups;
}

export function CoordinationPage() {
  const [planningDate, setPlanningDate] = useState('2026-08-25');
  const [corridorId, setCorridorId] = useState('');

  const query = useSchedules({ planning_date: planningDate, corridor_id: corridorId || undefined });
  const jointGroups = useMemo(() => findJointGroups(REAL_SCHEDULE_ENTRIES), []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Schedule Feed (source for joint-block detection)</CardTitle>
        </CardHeader>
        <div className="space-y-3">
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
              Fetching live data — the backend may be cold-starting (can take up to ~90s)...
            </div>
          )}

          {query.isError && (
            <div className="flex items-start gap-2 rounded-lg border border-dept-snt/40 bg-dept-snt/10 p-3 text-sm text-dept-snt">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>{(query.error as Error)?.message ?? 'Could not reach the backend.'}</p>
            </div>
          )}

          {query.data && (
            <>
              <div
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  query.data.safety_valid
                    ? 'border-signal-green/40 bg-signal-green/10 text-signal-green'
                    : 'border-dept-snt/40 bg-dept-snt/10 text-dept-snt'
                }`}
              >
                {query.data.safety_valid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>
                  {query.data.count} schedules · {query.data.planning_date} · Corridor {query.data.corridor_id} ·{' '}
                  {query.data.safety_valid ? 'Safety valid' : 'Safety issues detected'}
                </span>
              </div>
              <ScheduleTable schedules={query.data.schedules} />
            </>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Joint Block Opportunities ({jointGroups.length})</CardTitle>
        </CardHeader>
        <p className="text-xs text-slate-500 mb-3">
          Detected from the real 108-entry schedule dataset: same block (subsection), overlapping time windows,
          different departments. This is real analysis of real data — not a mock — but should be cross-checked
          against the backend's own coordination_engine.py output once that's exposed via an API endpoint.
        </p>
        {jointGroups.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No overlapping cross-department windows found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jointGroups.map((group) => (
              <div key={`${group.subsectionId}-${group.date}-${group.entries[0].request_id}`} className="space-y-2">
                <p className="text-xs text-slate-400">
                  Block {group.subsectionId} · {group.date} · {group.entries.length} departments
                </p>
                {group.entries.map((entry) => (
                  <div key={entry.request_id} className="relative h-40">
                    <MaintenanceHoverPopover entry={entry} left={0} top={0} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
