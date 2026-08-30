import { realPriorityBreakdown, RealPriorityInputs } from '../utils/scoreFormatting';

const COMPONENT_COLORS: Record<string, string> = {
  safety_risk: '#F43F5E',
  criticality: '#F59E0B',
  operational_impact: '#38BDF8',
  severity: '#A78BFA',
  urgency: '#22D3EE',
  overdue: '#22C55E',
};

const COMPONENT_LABELS: Record<string, string> = {
  safety_risk: 'Safety Risk (25%)',
  criticality: 'Criticality (20%)',
  operational_impact: 'Operational Impact (20%)',
  severity: 'Severity (15%)',
  urgency: 'Urgency (10%)',
  overdue: 'Overdue Days (10%)',
};

/**
 * Six-factor weighted breakdown matching the real backend priority
 * engine exactly (see features/prioritization/utils/scoreFormatting.ts).
 */
export function PriorityBreakdownChart({ input }: { input: RealPriorityInputs }) {
  const breakdown = realPriorityBreakdown(input);
  const entries = Object.entries(breakdown);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="space-y-1.5">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-0.5">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{COMPONENT_LABELS[key]}</span>
            <span>{value.toFixed(1)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(value / max) * 100}%`, backgroundColor: COMPONENT_COLORS[key] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
