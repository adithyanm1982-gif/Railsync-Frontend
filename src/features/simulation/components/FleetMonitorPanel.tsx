import { SimTrain } from '../types';
import { TrainWorldPosition } from '../canvas/physics/TrainMotionCalculator';

interface FleetMonitorPanelProps {
  trains: SimTrain[];
  positions: TrainWorldPosition[];
}

const STATUS_COLORS: Record<string, string> = {
  MOVING: '#22D3EE',
  WAIT: '#FBBF24',
  HOLD: '#FBBF24',
  STABLED: '#64748B',
};

/**
 * Bottom-left "ACTIVE FLEET MONITOR" readout, styled after the
 * reference concept art -- live speed/delay/status per train, updated
 * every frame from the same position data the canvas renders.
 */
export function FleetMonitorPanel({ trains, positions }: FleetMonitorPanelProps) {
  return (
    <div className="absolute left-4 bottom-24 panel-surface rounded-lg p-3 text-xs w-72">
      <p className="text-slate-300 font-semibold mb-2">Active Fleet Monitor</p>
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-slate-500 text-left">
            <th className="pb-1 font-normal">Train</th>
            <th className="pb-1 font-normal">Speed</th>
            <th className="pb-1 font-normal">Delay</th>
            <th className="pb-1 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => {
            const pos = positions.find((p) => p.trainId === train.id);
            const status = pos?.isMoving ? 'MOVING' : train.status;
            return (
              <tr key={train.id} className="border-t border-slate-800/60">
                <td className="py-1 text-slate-300 font-mono">{train.id}</td>
                <td className="py-1 text-slate-400">{Math.round(pos?.speedKmh ?? 0)} km/h</td>
                <td className="py-1 text-slate-400">{train.delayMin > 0 ? `+${train.delayMin}m` : '0'}</td>
                <td className="py-1 font-medium" style={{ color: STATUS_COLORS[status] ?? '#94A3B8' }}>
                  {status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
