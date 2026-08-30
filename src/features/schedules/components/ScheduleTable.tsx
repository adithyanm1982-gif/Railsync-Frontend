import { RealScheduleEntry } from '@/shared/types/railsyncReal';
import { Badge } from '@/shared/components/ui/Badge';

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#38BDF8',
  'S&T': '#F43F5E',
  Traction: '#F59E0B',
};

/** Table for the real GET /api/schedules/ feed -- final CP-SAT-selected block assignments. */
export function ScheduleTable({ schedules = [] }: { schedules?: RealScheduleEntry[] }) {
  if (schedules.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No schedules for this filter.</p>;
  }

  const sorted = [...schedules].sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
            <th className="py-2 pr-3">Date / Time</th>
            <th className="py-2 pr-3">Dept</th>
            <th className="py-2 pr-3">Corridor / Block</th>
            <th className="py-2 pr-3">Work</th>
            <th className="py-2 pr-3">Block Type</th>
            <th className="py-2 pr-3">Safety Buffer</th>
            <th className="py-2 pr-3">Match Score</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.request_id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
              <td className="py-2 pr-3">
                <p className="text-slate-200">
                  {s.day}, {s.date}
                </p>
                <p className="text-xs text-slate-500">
                  {s.start_time} → {s.end_time}
                </p>
              </td>
              <td className="py-2 pr-3">
                <Badge color={DEPARTMENT_COLORS[s.department]}>{s.department}</Badge>
              </td>
              <td className="py-2 pr-3 text-slate-300">
                {s.corridor_id} / {s.subsection_id}
                <p className="text-[10px] text-slate-500">
                  {s.from_station}→{s.to_station}
                </p>
              </td>
              <td className="py-2 pr-3 text-slate-400 text-xs">
                {s.maintenance_type}
                <p className="text-[10px] text-slate-500">{s.asset_type}</p>
              </td>
              <td className="py-2 pr-3 text-slate-500 text-xs">{s.block_type.replace(/_/g, ' ')}</td>
              <td className="py-2 pr-3 text-slate-400">{s.safety_buffer_minutes}m</td>
              <td className="py-2 pr-3 text-slate-400">{s.match_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
