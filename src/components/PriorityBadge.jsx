import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority, size = 'sm' }) {
  const p = (priority || 'LOW').toUpperCase();

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5'
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-xs px-2 py-0.5';

  if (p === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-rose-50 text-rose-700 border-rose-200/80 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>
        HIGH
      </span>
    );
  }

  if (p === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-amber-50 text-amber-700 border-amber-200/80 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
        MEDIUM
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-slate-100 text-slate-700 border-slate-200 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
      LOW
    </span>
  );
}
