import React from 'react';
import { Inbox, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export default function EmptyState({
  type = 'empty', // empty, escalations, error, ai_unavailable
  title,
  description,
  actionText,
  onAction
}) {
  let Icon = Inbox;
  let defaultTitle = 'No tickets found';
  let defaultDesc = 'There are currently no tickets matching your active filters or search criteria.';
  let iconColor = 'text-slate-400';
  let iconBg = 'bg-slate-100 border-slate-200';

  if (type === 'escalations') {
    Icon = ShieldCheck;
    defaultTitle = 'All caught up — no active escalations.';
    defaultDesc = 'Every high-priority case has been stabilized and responded to within agreed SLA guidelines.';
    iconColor = 'text-emerald-600';
    iconBg = 'bg-emerald-50 border-emerald-200';
  } else if (type === 'ai_unavailable') {
    Icon = AlertTriangle;
    defaultTitle = 'AI analysis temporarily unavailable';
    defaultDesc = 'AI classification services encountered an intermittent timeout. Ticket has been assigned for manual review.';
    iconColor = 'text-amber-500';
    iconBg = 'bg-amber-50 border-amber-200';
  } else if (type === 'error') {
    Icon = AlertTriangle;
    defaultTitle = 'Unable to load ticket information';
    defaultDesc = 'Failed to synchronize with Support Operations datastore. Please verify connection and retry.';
    iconColor = 'text-rose-500';
    iconBg = 'bg-rose-50 border-rose-200';
  }

  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 ${iconBg}`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">
        {title || defaultTitle}
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
        {description || defaultDesc}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}
