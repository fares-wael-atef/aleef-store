import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border transition-all transform translate-y-0 animate-bounce-short ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : toast.type === 'info'
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : 'bg-amber-400 text-slate-900 border-amber-300 font-medium'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
            )}
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
