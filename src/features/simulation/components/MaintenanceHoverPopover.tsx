import { RealScheduleEntry } from '../types';

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#38BDF8',
  'S&T': '#F43F5E',
  Traction: '#F59E0B',
};

interface MaintenanceHoverPopoverProps {
  entry: RealScheduleEntry;
  left: number;
  top: number;
}

export function MaintenanceHoverPopover({ entry, left, top }: MaintenanceHoverPopoverProps) {
  const color = DEPARTMENT_COLORS[entry.department] ?? '#A78BFA';

  return (
    <div
      className="absolute z-40 w-72 panel-surface rounded-lg p-3 text-xs pointer-events-none"
      style={{ left, top, borderColor: `${color}66` }}
    >
      <p className="font-semibold" style={{ color }}>
        {entry.department} · {entry.maintenance_type}
      </p>
      <p className="mt-1 text-slate-400">
        {entry.request_id} · {entry.asset_type} · Block {entry.subsection_id}
      </p>
      <p className="mt-1 text-slate-300">
        {entry.day}, {entry.date} · {entry.start_time} → {entry.end_time}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div>
          <p className="text-slate-500">Priority score</p>
          <p className="text-signal-amber font-medium">{entry.priority_score.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-slate-500">Match score</p>
          <p className="text-signal-green font-medium">{entry.match_score}</p>
        </div>
        <div>
          <p className="text-slate-500">Block type</p>
          <p className="text-slate-200 font-medium">{entry.block_type.replace(/_/g, ' ')}</p>
        </div>
        <div>
          <p className="text-slate-500">Safety buffer</p>
          <p className="text-slate-200 font-medium">{entry.safety_buffer_minutes} min</p>
        </div>
      </div>
      <p className="mt-2 text-slate-500">
        {entry.from_station} → {entry.to_station} · Work area {entry.work_area_id}
      </p>
    </div>
  );
}
