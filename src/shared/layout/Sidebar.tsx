import { PropsWithChildren } from 'react';

/**
 * Generic contextual sidebar shell. Individual pages (RequestWindowPage,
 * ApprovalPage) pass in their own filter controls as children rather than
 * this component knowing about every feature's filter set.
 */
export function Sidebar({ children }: PropsWithChildren) {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-800 bg-canvas-panel/60 p-3 space-y-3">
      {children}
    </aside>
  );
}
