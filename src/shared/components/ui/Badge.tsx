import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string; // hex, drives inline style so it can match colorTokens.ts dynamically
}

export function Badge({ color, style, className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border',
        className
      )}
      style={{
        color: color ?? '#CBD5E1',
        borderColor: color ? `${color}55` : '#334155',
        backgroundColor: color ? `${color}1A` : 'transparent',
        ...style,
      }}
      {...props}
    />
  );
}
