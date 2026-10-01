import React from 'react';
import { AlertOctagon, CheckCircle2, Clock, Bell, UserCheck, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export default function EscalationPanel({
  escalation,
  ticketId,
  onReassign,
  onResolve,
  className = ''
}) {
  const details = escalation || {
    status: 'Escalated',
    tasksCreated: ['Review and respond to ticket', 'Manager outage escalation'],
    agentNotified: true,
    managerNotified: true,
    dueTime: 'Today — 2 hours'
  };

  return (
    <div className={`bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30 border-2 border-rose-200/90 rounded-2xl p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Escalation Actions & SLA Safeguard
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {details.status || 'Escalated'}
              </span>
            </div>
            <p className="text-xs text-rose-800/80 font-medium">
              High-priority workflow activated by Support Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-2xs">
          <Clock className="w-4 h-4 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Resolution Due</span>
            <span className="font-bold text-rose-700">{details.dueTime || 'Today — 2 hours'}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tasks Created */}
        <div className="bg-white/90 border border-rose-100/90 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            Automated Tasks Created
          </span>
          <div className="space-y-2">
            {(details.tasksCreated || ['Review and respond to ticket', 'Manager outage escalation']).map((task, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Notifications */}
        <div className="bg-white/90 border border-rose-100/90 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-rose-500" />
            Notification Broadcasts
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/60 border border-emerald-200/60 p-2 rounded-lg">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Assigned Engineer notified via Slack + Pager</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/60 border border-emerald-200/60 p-2 rounded-lg">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Support Manager (Kathirvel) alert dispatched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action triggers */}
      <div className="mt-5 pt-4 border-t border-rose-100/90 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Target Response SLA: <span className="font-bold text-slate-800">15 mins</span> | Target Resolution: <span className="font-bold text-slate-800">2 hours</span>
        </span>
        <div className="flex items-center gap-2">
          {onReassign && (
            <button
              onClick={onReassign}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Reassign Engineer
            </button>
          )}
          {onResolve && (
            <button
              onClick={onResolve}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve Escalation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
