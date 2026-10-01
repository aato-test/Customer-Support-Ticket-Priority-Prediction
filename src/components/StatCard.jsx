import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  isPositive = true,
  neutral = false,
  badgeText,
  iconColor = 'text-teal-600',
  iconBg = 'bg-teal-50 border-teal-100',
  subtext
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <div className="mt-2 text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${iconBg} shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {change ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                neutral
                  ? 'bg-slate-100 text-slate-700'
                  : isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {neutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              {change}
            </span>
            <span className="text-slate-400">vs last period</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium">{subtext || 'Active monitoring'}</span>
        )}

        {badgeText && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
