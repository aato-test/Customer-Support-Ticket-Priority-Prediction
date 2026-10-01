import React from 'react';
import { AlertOctagon, Flame, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function SLABadge({ riskLevel, remainingMinutes, size = 'sm' }) {
  const level = (riskLevel || 'LOW').toUpperCase();

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.5'
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-xs px-2 py-0.5';

  if (level === 'BREACHED') {
    return (
      <span className={`inline-flex items-center gap-1 font-bold rounded-md border tracking-wider bg-red-100 text-red-800 border-red-300 shadow-xs animate-pulse ${sizeClasses}`}>
        <Flame className="w-3 h-3 text-red-600 shrink-0" />
        SLA BREACHED
      </span>
    );
  }

  if (level === 'HIGH') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-orange-50 text-orange-700 border-orange-200 ${sizeClasses}`}>
        <ShieldAlert className="w-3 h-3 text-orange-500 shrink-0" />
        HIGH RISK
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-amber-50 text-amber-700 border-amber-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
        MEDIUM RISK
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 ${sizeClasses}`}>
      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
      WITHIN SLA
    </span>
  );
}
