interface RawDataTableProps {
  data: unknown;
}

/**
 * The deployed backend returns untyped dicts on every endpoint (see
 * shared/types/backendRaw.ts). Rather than block the UI on knowing
 * exact field names up front, this renders whatever shape comes back:
 * an array of flat objects becomes a table (columns = union of keys
 * seen), a flat object becomes a key/value grid, anything else falls
 * back to pretty-printed JSON. Swap call sites to purpose-built
 * components once field names are confirmed from real payloads.
 */
export function RawDataTable({ data }: RawDataTableProps) {
  if (data === null || data === undefined) {
    return <p className="text-sm text-slate-500 py-4">No data returned.</p>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <p className="text-sm text-slate-500 py-4">Empty list.</p>;

    const isFlatObjectArray = data.every((row) => typeof row === 'object' && row !== null && !Array.isArray(row));

    if (isFlatObjectArray) {
      const columns = Array.from(new Set(data.flatMap((row) => Object.keys(row as object))));
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-800">
                {columns.map((col) => (
                  <th key={col} className="py-1.5 pr-3 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                  {columns.map((col) => (
                    <td key={col} className="py-1.5 pr-3 text-slate-300">
                      {formatCell((row as Record<string, unknown>)[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{key}</p>
            <p className="text-sm text-slate-200 mt-0.5">{formatCell(value)}</p>
          </div>
        ))}
      </div>
    );
  }

  return <pre className="text-xs text-slate-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
