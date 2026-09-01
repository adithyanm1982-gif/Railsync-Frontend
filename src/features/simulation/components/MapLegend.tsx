const OCCUPANCY_ITEMS = [
  { label: 'Clear', color: '#64748B' },
  { label: 'Occupied (moving train)', color: '#22D3EE' },
  { label: 'Reserved / hold / wait', color: '#FBBF24' },
];

const DEPARTMENT_ITEMS = [
  { label: 'Engineering block', color: '#38BDF8' },
  { label: 'S&T block', color: '#F43F5E' },
  { label: 'Traction block', color: '#F59E0B' },
];

export function MapLegend() {
  return (
    <div className="panel-surface rounded-lg p-3 text-xs space-y-2.5 w-56">
      <div>
        <p className="text-slate-300 font-semibold mb-1.5">Track Occupancy</p>
        {OCCUPANCY_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 mb-1">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-slate-300 font-semibold mb-1.5">Maintenance Block</p>
        {DEPARTMENT_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 mb-1">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
        Dashed lines = Blocks. Zoom in past ~3.6x to reveal Sub-Blocks.
      </p>
    </div>
  );
}
