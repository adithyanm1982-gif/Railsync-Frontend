import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="panel-surface w-full max-w-lg rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-sm font-semibold text-slate-100">{title}</h2>}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
