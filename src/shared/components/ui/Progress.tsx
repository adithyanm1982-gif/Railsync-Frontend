interface ProgressProps {
  value: number; // 0-100
  color?: string;
}

export function Progress({ value, color = '#38BDF8' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
