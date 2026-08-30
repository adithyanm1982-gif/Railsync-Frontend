import { useState } from 'react';
import { RealTrainMovement } from '@/shared/types/railsyncReal';
import { Badge } from '@/shared/components/ui/Badge';

const DIRECTION_COLORS: Record<string, string> = {
  UP: '#22D3EE',
  DOWN: '#FBBF24',
};

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: '#38BDF8',
  RUNNING: '#22C55E',
  DELAYED: '#F59E0B',
  CANCELLED: '#F43F5E',
};

const PAGE_SIZE = 20;

/** Table for the real train_movements dataset -- train no/type, real entry/exit times, corridor, direction, status. */
export function TrainScheduleTable({ trains }: { trains: RealTrainMovement[] }) {
  const [page, setPage] = useState(0);

  if (trains.length === 0) {
    return <p className="text-sm text-slate-500 py-6 text-center">No train movements for this filter.</p>;
  }

  const sorted = [...trains].sort((a, b) => a.entry_time.localeCompare(b.entry_time));
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
              <th className="py-2 pr-3">Train</th>
              <th className="py-2 pr-3">Day</th>
              <th className="py-2 pr-3">Route</th>
              <th className="py-2 pr-3">Entry → Exit</th>
              <th className="py-2 pr-3">Direction</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Line</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t) => (
              <tr key={t.movement_id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                <td className="py-2 pr-3">
                  <p className="text-slate-200 font-mono">#{t.train_no}</p>
                  <p className="text-xs text-slate-500">{t.train_type}</p>
                </td>
                <td className="py-2 pr-3 text-slate-400">{t.day}</td>
                <td className="py-2 pr-3 text-slate-300">
                  {t.from_station} → {t.to_station}
                  <p className="text-[10px] text-slate-500">
                    {t.corridor_id} / {t.subsection_id}
                  </p>
                </td>
                <td className="py-2 pr-3 text-slate-300 font-mono text-xs">
                  {t.entry_time} → {t.exit_time}
                </td>
                <td className="py-2 pr-3">
                  <Badge color={DIRECTION_COLORS[t.direction] ?? '#94A3B8'}>{t.direction}</Badge>
                </td>
                <td className="py-2 pr-3">
                  <Badge color={STATUS_COLORS[t.movement_status] ?? '#94A3B8'}>{t.movement_status}</Badge>
                </td>
                <td className="py-2 pr-3 text-slate-500 text-xs">{t.line_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span>
            {trains.length} movements · Page {page + 1} of {totalPages}
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
