import React from 'react';
import { User, Users, ShieldAlert, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AgentWorkload({ agents = [], compact = false, onSelectAgent }) {
  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Available
          </span>
        );
      case 'Busy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Busy
          </span>
        );
      case 'Offline':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Offline
          </span>
        );
    }
  };

  const getWorkloadBarColor = (pct) => {
    if (pct >= 80) return 'bg-rose-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-teal-600';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            Agent Workload & Capacity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time queue depth and automated assignment balancing
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
          {agents.length} Support Engineers
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-5">Agent</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4 text-center">Open Tickets</th>
              <th className="py-3 px-4 text-center">High Priority</th>
              <th className="py-3 px-4">Workload Capacity</th>
              <th className="py-3 px-5">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {agents.map((agent) => {
              const workload = agent.workload || 0;
              const barColor = getWorkloadBarColor(workload);

              return (
                <tr
                  key={agent.id || agent.name}
                  onClick={() => onSelectAgent && onSelectAgent(agent)}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    onSelectAgent ? 'cursor-pointer' : ''
                  }`}
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-[11px] font-bold shrink-0">{agent.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="font-bold text-slate-900">{agent.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{agent.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getAvailabilityBadge(agent.availability)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-slate-800 text-sm">
                      {agent.openTickets}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {agent.highPriority > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        {agent.highPriority}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{workload}%</span>
                        <span className="text-slate-400">Target &lt;80%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${workload}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-slate-600 text-xs font-normal truncate block max-w-[200px]">
                      {agent.statusText || 'Active on support queue'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
