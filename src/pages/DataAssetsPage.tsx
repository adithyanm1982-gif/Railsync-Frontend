import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dataAssetsApi } from '@/features/dataassets/api/dataAssetsApi';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * "Data / Assets" tab: the real GET /api/data/stats response (dataset
 * scope: total requests, departments, corridors), plus a link into
 * the interactive Simulation view for the actual topology.
 */
export function DataAssetsPage() {
  const query = useQuery({
    queryKey: ['data-stats'],
    queryFn: () => dataAssetsApi.getStats(),
    retry: 1,
  });
  const d = query.data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Stats</CardTitle>
        </CardHeader>

        {query.isLoading && (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
            <RefreshCw size={14} className="animate-spin" />
            Fetching live data — the backend may be cold-starting (can take up to ~30s)...
          </div>
        )}

        {query.isError && (
          <div className="flex items-start gap-2 rounded-lg border border-dept-snt/40 bg-dept-snt/10 p-3 text-sm text-dept-snt">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>{(query.error as Error)?.message ?? 'Could not reach the backend.'}</p>
          </div>
        )}

        {d && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <p className="text-[10px] text-slate-500 uppercase">Total Requests</p>
              <p className="text-xl font-semibold mt-1 text-slate-100">{d.total_requests}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <p className="text-[10px] text-slate-500 uppercase">Departments</p>
              <p className="text-sm text-slate-200 mt-1">{d.departments.join(', ')}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <p className="text-[10px] text-slate-500 uppercase">Corridors</p>
              <p className="text-sm text-slate-200 mt-1">{d.corridors.join(', ')}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <p className="text-[10px] text-slate-500 uppercase">Corridor Count</p>
              <p className="text-xl font-semibold mt-1 text-slate-100">{d.corridor_count}</p>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topology &amp; Live Simulation</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-400 mb-3">
          The interactive railway simulation shows the real line topology (5 stations, 4 corridors, 16 blocks) with
          live maintenance-block overlays sourced from the real schedule dataset.
        </p>
        <Link to="/simulation">
          <Button>Open Interactive Simulation →</Button>
        </Link>
      </Card>
    </div>
  );
}
