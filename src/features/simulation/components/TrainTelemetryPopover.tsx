import { SimTrain } from '../types';

interface TrainTelemetryPopoverProps {
  train: SimTrain;
  speedKmh: number;
  left: number;
  top: number;
}

export function TrainTelemetryPopover({ train, speedKmh, left, top }: TrainTelemetryPopoverProps) {
  return (
    <div className="absolute z-40 w-56 panel-surface rounded-lg p-3 text-xs pointer-events-none" style={{ left, top }}>
      <p className="font-semibold text-train-moving">{train.id}</p>
      <p className="mt-1 text-slate-400">{train.type}</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div>
          <p className="text-slate-500">Speed</p>
          <p className="text-slate-200 font-medium">{Math.round(speedKmh)} km/h</p>
        </div>
        <div>
          <p className="text-slate-500">Status</p>
          <p className="text-slate-200 font-medium">{train.status}</p>
        </div>
        <div>
          <p className="text-slate-500">Delay</p>
          <p className={train.delayMin > 0 ? 'text-signal-amber font-medium' : 'text-signal-green font-medium'}>
            {train.delayMin > 0 ? '+' : ''}
            {train.delayMin} min
          </p>
        </div>
        <div>
          <p className="text-slate-500">Direction</p>
          <p className="text-slate-200 font-medium">{train.direction === 1 ? 'Up' : 'Down'}</p>
        </div>
      </div>
    </div>
  );
}
