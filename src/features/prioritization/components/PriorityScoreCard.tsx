import { PriorityBadge } from './PriorityBadge';
import { PriorityBreakdownChart } from './PriorityBreakdownChart';
import { computeRealPriorityScore, classifyRealPriority, RealPriorityInputs } from '../utils/scoreFormatting';

interface PriorityScoreCardProps {
  input: RealPriorityInputs;
  title?: string;
}

export function PriorityScoreCard({ input, title = 'Priority Score (live, matches backend engine)' }: PriorityScoreCardProps) {
  const score = computeRealPriorityScore(input);
  const priorityClass = classifyRealPriority(score);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <PriorityBadge priorityClass={priorityClass} score={score} />
      </div>
      <PriorityBreakdownChart input={input} />
    </div>
  );
}
