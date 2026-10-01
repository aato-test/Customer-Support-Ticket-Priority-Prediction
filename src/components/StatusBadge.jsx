import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const s = (status || 'OPEN').toUpperCase();

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5'
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-xs px-2 py-0.5';

  if (s === 'ESCALATED') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-rose-50 text-rose-700 border-rose-300 ${sizeClasses}`}>
        <ArrowUpRight className="w-3 h-3 text-rose-600" />
        ESCALATED
      </span>
    );
  }

  if (s === 'IN_PROGRESS') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-teal-50 text-teal-700 border-teal-200 ${sizeClasses}`}>
        <Clock className="w-3 h-3 text-teal-500 animate-spin" style={{ animationDuration: '6s' }} />
        IN PROGRESS
      </span>
    );
  }

  if (s === 'RESOLVED') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        RESOLVED
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-blue-50 text-blue-700 border-blue-200 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
      OPEN
    </span>
  );
}
