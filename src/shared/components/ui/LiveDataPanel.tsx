import { UseQueryResult } from '@tanstack/react-query';
import { RawDataTable } from './RawDataTable';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface LiveDataPanelProps {
  query: UseQueryResult<unknown, unknown>;
  emptyLabel?: string;
}

/**
 * Standard loading/error/success chrome for any live backend query,
 * used across Dashboard/Planning/Schedules/Conflicts/Coordination/
 * Data-Assets tabs. Render's free tier cold-starts after inactivity,
 * so the first request can take 20-30s — the loading state calls that
 * out explicitly instead of looking stuck.
 */
export function LiveDataPanel({ query }: LiveDataPanelProps) {
  if (query.isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
        <RefreshCw size={14} className="animate-spin" />
        Fetching live data — the backend may be cold-starting (can take up to ~30s on first request)...
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-dept-snt/40 bg-dept-snt/10 p-3 text-sm text-dept-snt">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Could not reach the backend.</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {(query.error as Error)?.message ?? 'Unknown error'} — showing nothing until the API responds. Retry with
            the button above, or check that the Render service is awake.
          </p>
        </div>
      </div>
    );
  }

  return <RawDataTable data={query.data} />;
}
