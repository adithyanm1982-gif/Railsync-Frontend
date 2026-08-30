import { RealDepartment, Urgency } from '@/shared/types/railsyncReal';

export interface RealFilters {
  department: RealDepartment | 'ALL';
  urgency: Urgency | 'ALL';
  corridorId: string | 'ALL';
  minOverdueDays: number;
}

interface RealRequestFilterBarProps {
  filters: RealFilters;
  onChange: (filters: RealFilters) => void;
  corridorOptions: string[];
}

const DEPARTMENTS: Array<RealDepartment | 'ALL'> = ['ALL', 'Engineering', 'S&T', 'Traction'];
const URGENCIES: Array<Urgency | 'ALL'> = ['ALL', 'IMMEDIATE', 'HIGH', 'MEDIUM', 'NORMAL', 'LOW'];

export function RealRequestFilterBar({ filters, onChange, corridorOptions }: RealRequestFilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-3">
      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">Department</label>
        <select
          value={filters.department}
          onChange={(e) => onChange({ ...filters, department: e.target.value as RealDepartment | 'ALL' })}
          className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'All Departments' : d}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">Corridor</label>
        <select
          value={filters.corridorId}
          onChange={(e) => onChange({ ...filters, corridorId: e.target.value })}
          className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
        >
          <option value="ALL">All Corridors</option>
          {corridorOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">Urgency</label>
        <select
          value={filters.urgency}
          onChange={(e) => onChange({ ...filters, urgency: e.target.value as Urgency | 'ALL' })}
          className="rounded-md bg-slate-900/60 border border-slate-700 px-2.5 py-1.5 text-xs"
        >
          {URGENCIES.map((u) => (
            <option key={u} value={u}>
              {u === 'ALL' ? 'All Urgencies' : u}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1 w-40">
        <label className="text-[10px] text-slate-500 uppercase tracking-wide">
          Min. Overdue Days ({filters.minOverdueDays})
        </label>
        <input
          type="range"
          min={0}
          max={30}
          value={filters.minOverdueDays}
          onChange={(e) => onChange({ ...filters, minOverdueDays: Number(e.target.value) })}
          className="w-full accent-cyan-400"
        />
      </div>
    </div>
  );
}
