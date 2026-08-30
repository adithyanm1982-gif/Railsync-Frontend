import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-900/60 p-1 border border-slate-800 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            activeId === tab.id
              ? 'bg-dept-engineering text-slate-950'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
