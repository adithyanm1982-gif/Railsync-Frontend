import { EmergencyBlockForm } from '@/features/emergency/components/EmergencyBlockForm';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';

/**
 * "Emergency" tab per backend spec: dedicated interface for immediate/
 * emergency maintenance requests and their priority handling
 * (POST /api/emergency/evaluate).
 */
export function EmergencyBlockPage() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Emergency Escalation</CardTitle>
      </CardHeader>
      <EmergencyBlockForm />
    </Card>
  );
}
