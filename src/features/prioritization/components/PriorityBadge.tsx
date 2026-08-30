import { Badge } from '@/shared/components/ui/Badge';
import { PriorityClass } from '@/shared/types/railsyncReal';
import { PRIORITY_CLASS_COLORS } from '../utils/scoreFormatting';

export function PriorityBadge({ priorityClass, score }: { priorityClass: PriorityClass; score?: number }) {
  return (
    <Badge color={PRIORITY_CLASS_COLORS[priorityClass]}>
      {priorityClass}
      {score !== undefined ? ` · ${score.toFixed(1)}` : ''}
    </Badge>
  );
}
