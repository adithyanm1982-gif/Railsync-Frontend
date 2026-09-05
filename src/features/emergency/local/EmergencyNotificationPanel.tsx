import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEmergencyStore, EmergencyStatus, EmergencyRequest } from './emergencyStore';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: '#38BDF8',
  'S&T': '#F43F5E',
  Traction: '#F59E0B',
};

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22C55E',
  MEDIUM: '#38BDF8',
  HIGH: '#F59E0B',
  CRITICAL: '#F43F5E',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function EmergencyCard({ emergency }: { emergency: EmergencyRequest }) {
  const { user } = useAuth();
  const approveEmergency = useEmergencyStore((s) => s.approveEmergency);
  const rejectEmergency = useEmergencyStore((s) => s.rejectEmergency);
  const [comments, setComments] = useState('');

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Badge color={DEPARTMENT_COLORS[emergency.department] ?? '#94A3B8'}>{emergency.department}</Badge>
        <div className="flex items-center gap-2">
          <Badge color={SEVERITY_COLORS[emergency.severity]}>{emergency.severity}</Badge>
          <span className="text-[10px] text-slate-500">{formatTime(emergency.raisedAt)}</span>
        </div>
      </div>
      <p className="text-xs text-slate-300">{emergency.reason}</p>

      {emergency.status === 'PENDING' ? (
        <div className="space-y-1.5 pt-1">
          <input
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Optional comments"
            className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-2 py-1 text-[11px]"
          />
          <div className="flex gap-1.5">
            <Button
              variant="success"
              onClick={() => approveEmergency(emergency.id, user?.name ?? 'Controller', comments || undefined)}
              className="flex items-center gap-1 !py-1 !px-2 text-[11px]"
            >
              <CheckCircle2 size={12} />
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => rejectEmergency(emergency.id, user?.name ?? 'Controller', comments || undefined)}
              className="flex items-center gap-1 !py-1 !px-2 text-[11px]"
            >
              <XCircle size={12} />
              Reject
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
          {emergency.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {emergency.decidedBy} at{' '}
          {emergency.decidedAt ? formatTime(emergency.decidedAt) : ''}
          {emergency.comments && <p className="mt-0.5 text-slate-400">"{emergency.comments}"</p>}
        </div>
      )}
    </div>
  );
}

const TABS: { value: EmergencyStatus; label: string; icon: typeof Clock }[] = [
  { value: 'PENDING', label: 'Pending', icon: Clock },
  { value: 'APPROVED', label: 'Approved', icon: CheckCircle2 },
  { value: 'REJECTED', label: 'Rejected', icon: XCircle },
];

/**
 * The Notification Bell's dropdown content: three column-buttons
 * (Pending / Approved / Rejected) -- clicking one displays that
 * list. Approve/Reject actions live inline on each Pending card; once
 * decided, a request moves into the Approved or Rejected column.
 */
export function EmergencyNotificationPanel() {
  const [activeTab, setActiveTab] = useState<EmergencyStatus>('PENDING');
  const emergencies = useEmergencyStore((s) => s.emergencies);

  const counts: Record<EmergencyStatus, number> = {
    PENDING: emergencies.filter((e) => e.status === 'PENDING').length,
    APPROVED: emergencies.filter((e) => e.status === 'APPROVED').length,
    REJECTED: emergencies.filter((e) => e.status === 'REJECTED').length,
  };
  const filtered = emergencies.filter((e) => e.status === activeTab);

  return (
    <div className="absolute right-0 top-full mt-2 w-96 panel-surface rounded-lg shadow-xl z-50 max-h-[70vh] flex flex-col">
      <div className="p-3 border-b border-slate-800">
        <p className="text-sm font-semibold text-slate-100 mb-2">Emergency Alerts</p>
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  activeTab === tab.value ? 'bg-dept-engineering text-slate-950' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                )}
              >
                <Icon size={12} />
                {tab.label} ({counts[tab.value]})
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 space-y-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No {activeTab.toLowerCase()} emergency requests.</p>
        ) : (
          filtered.map((e) => <EmergencyCard key={e.id} emergency={e} />)
        )}
      </div>
    </div>
  );
}
