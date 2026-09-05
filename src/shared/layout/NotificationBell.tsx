import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useEmergencyStore } from '@/features/emergency/local/emergencyStore';
import { EmergencyNotificationPanel } from '@/features/emergency/local/EmergencyNotificationPanel';

/**
 * Section Controller-only notification bell. Shows a live badge count
 * of PENDING emergency requests raised by Engineering/S&T/Traction;
 * clicking opens EmergencyNotificationPanel (Pending/Approved/Rejected
 * tabs) in a dropdown. This is the ONLY place emergency requests are
 * visible to the Controller -- there's no separate Emergency nav tab
 * for them, since they never raise emergencies themselves.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingCount = useEmergencyStore((s) => s.emergencies.filter((e) => e.status === 'PENDING').length);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative rounded-md p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        title="Emergency notifications"
      >
        <Bell size={17} />
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-dept-snt px-1 text-[9px] font-bold text-white">
            {pendingCount}
          </span>
        )}
      </button>
      {isOpen && <EmergencyNotificationPanel />}
    </div>
  );
}
