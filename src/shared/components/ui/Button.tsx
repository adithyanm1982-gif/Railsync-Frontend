import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'danger' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-dept-engineering text-slate-950 hover:bg-dept-engineering/90',
  ghost: 'bg-transparent border border-slate-700 text-slate-200 hover:bg-slate-800/50',
  danger: 'bg-dept-snt text-slate-950 hover:bg-dept-snt/90',
  success: 'bg-signal-green text-slate-950 hover:bg-signal-green/90',
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}
