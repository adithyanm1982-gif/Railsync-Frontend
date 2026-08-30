import { useState } from 'react';
import { PlanningDateSelector } from '@/shared/components/ui/PlanningDateSelector';
import { OptimizationRunPanel } from '@/features/optimization/components/OptimizationRunPanel';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

/**
 * "Planning / Optimization" tab per backend spec: run/view the
 * automatic block-planning results, candidates, scheduled vs
 * unscheduled work, and optimizer status.
 */
export function PlanningPage() {
  const [planningDate, setPlanningDate] = useState('2026-08-25');
  const [corridorId, setCorridorId] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planning &amp; Optimization</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <PlanningDateSelector
          planningDate={planningDate}
          corridorId={corridorId}
          onPlanningDateChange={setPlanningDate}
          onCorridorIdChange={setCorridorId}
          onRefresh={() => {}}
        />
        <OptimizationRunPanel
          params={{ planning_date: planningDate, corridor_id: corridorId || undefined }}
        />
      </div>
    </Card>
  );
}
