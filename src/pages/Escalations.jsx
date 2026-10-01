import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  Flame,
  UserX,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Eye,
  RefreshCw,
  ArrowUpRight,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';
import SLABadge from '../components/SLABadge';
import EmptyState from '../components/EmptyState';

export default function Escalations() {
  const { tickets, agents, assignTicket, escalateTicket, resolveTicket } = useTickets();
  const [reassignModalTicket, setReassignModalTicket] = useState(null);

  // Filter escalations
  const escalatedTickets = tickets.filter(t => t.status === 'ESCALATED' || t.priority === 'HIGH');
  const activeEscalations = escalatedTickets.length;
  const highPriorityCount = tickets.filter(t => t.priority === 'HIGH' && t.status !== 'RESOLVED').length;
  const slaBreachedCount = tickets.filter(t => t.slaRiskLevel === 'BREACHED' && t.status !== 'RESOLVED').length;
  const unassignedCount = tickets.filter(t => (!t.assignedAgent || t.assignedAgent === 'Unassigned') && t.status !== 'RESOLVED').length;

  const handleResolve = (ticketId) => {
    resolveTicket(ticketId);
  };

  const handleReassign = (ticketId, agentName) => {
    assignTicket(ticketId, agentName);
    setReassignModalTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            Escalation Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management of high-severity incidents, outage bridges, and SLA breach interventions
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          Emergency Protocol Active
        </span>
      </div>

      {/* Statistics Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={AlertOctagon}
          label="Active Escalations"
          value={activeEscalations}
          change="+2 cases"
          isPositive={false}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 border-rose-200"
        />

        <StatCard
          icon={ShieldAlert}
          label="High Priority"
          value={highPriorityCount}
          change="Urgent"
          isPositive={false}
          iconColor="text-orange-600"
          iconBg="bg-orange-50 border-orange-200"
        />

        <StatCard
          icon={Flame}
          label="SLA Breached"
          value={slaBreachedCount}
          change="Immediate action"
          isPositive={false}
          iconColor="text-red-600"
          iconBg="bg-red-50 border-red-200"
        />

        <StatCard
          icon={UserX}
          label="Unassigned"
          value={unassignedCount}
          change="Triage needed"
          neutral={unassignedCount === 0}
          isPositive={true}
          iconColor="text-sky-600"
          iconBg="bg-sky-50 border-sky-200"
        />
      </div>

      {/* Escalation Management Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Active Outage & Escalated Incidents ({escalatedTickets.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated manager notifications & SRE bridge tracking
            </p>
          </div>
        </div>

        {escalatedTickets.length === 0 ? (
          <EmptyState
            type="escalations"
            title="All caught up — no active escalations."
            description="Every high-priority case has been stabilized and responded to within agreed SLA guidelines."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-5">Ticket</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-3">SLA Risk</th>
                  <th className="py-3 px-4">Escalated At</th>
                  <th className="py-3 px-4">Task Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {escalatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/70 transition-colors bg-rose-50/15"
                  >
                    {/* Ticket info */}
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-teal-700">
                        <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                          {ticket.id}
                        </Link>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5 line-clamp-1">
                        {ticket.subject}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {ticket.account}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-700">
                      {ticket.issueCategory}
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-[10px] font-bold flex items-center justify-center text-slate-700">
                          {ticket.assignedAgent ? ticket.assignedAgent[0] : '?'}
                        </span>
                        {ticket.assignedAgent}
                      </div>
                    </td>

                    {/* SLA Risk */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <SLABadge riskLevel={ticket.slaRiskLevel} />
                    </td>

                    {/* Escalated At */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-normal">
                      {ticket.escalatedDate
                        ? new Date(ticket.escalatedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Earlier today'}
                    </td>

                    {/* Task Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                        Response In Progress
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setReassignModalTicket(ticket)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Reassign
                        </button>
                        <button
                          onClick={() => handleResolve(ticket.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reassign Modal */}
      {reassignModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">Reassign Escalation</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Transfer ticket <strong>{reassignModalTicket.id}</strong> to an available engineer:
            </p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {agents.map(ag => (
                <button
                  key={ag.name}
                  onClick={() => handleReassign(reassignModalTicket.id, ag.name)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{ag.name}</span>
                    <span className="text-[10px] text-slate-400">{ag.role}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {ag.workload}% load
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setReassignModalTicket(null)}
              className="mt-4 w-full py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
