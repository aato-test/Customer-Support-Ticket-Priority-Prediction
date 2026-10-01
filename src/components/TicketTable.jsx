import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowUpRight, ShieldAlert, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SLABadge from './SLABadge';
import StatusBadge from './StatusBadge';
import ConfidenceScore from './ConfidenceScore';

export default function TicketTable({
  tickets = [],
  title = 'Recent Support Tickets',
  subtitle = 'Real-time AI triage and workload distribution queue',
  showViewAllLink = false,
  onQuickEscalate,
  onOpenReviewModal
}) {
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showViewAllLink && (
            <Link
              to="/tickets"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              View all tickets
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-5">Ticket ID</th>
              <th className="py-3 px-4 min-w-[200px]">Subject</th>
              <th className="py-3 px-4">Account & Contact</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">SLA Risk</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-center">AI Confidence</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-10 text-center text-slate-400">
                  No tickets found matching current criteria.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    t.priority === 'HIGH' ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1"
                    >
                      {t.id}
                    </Link>
                    {t.priorityOverridden && (
                      <span className="block text-[10px] text-sky-600 font-sans font-semibold">
                        Overridden
                      </span>
                    )}
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="hover:text-teal-600 transition-colors line-clamp-1"
                      title={t.subject}
                    >
                      {t.subject}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-normal line-clamp-1">
                      {t.description}
                    </span>
                  </td>

                  {/* Account & Contact */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{t.account}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{t.contact}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {t.issueCategory}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <PriorityBadge priority={t.priority} />
                  </td>

                  {/* SLA Risk */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <SLABadge riskLevel={t.slaRiskLevel} />
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                        {t.assignedAgent ? t.assignedAgent[0] : '?'}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {t.assignedAgent || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={t.status} />
                  </td>

                  {/* AI Confidence */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-center">
                    <ConfidenceScore score={t.aiConfidenceScore} size="sm" showLabel={false} />
                  </td>

                  {/* Created */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-normal">
                    {formatTime(t.createdDate)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.requiresManualReview && onOpenReviewModal && (
                        <button
                          onClick={() => onOpenReviewModal(t)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded text-[11px] border border-amber-200 cursor-pointer"
                          title="Manager Review Required"
                        >
                          Review
                        </button>
                      )}

                      <Link
                        to={`/tickets/${t.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                        title="View Ticket Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {t.status !== 'ESCALATED' && onQuickEscalate && (
                        <button
                          onClick={() => onQuickEscalate(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Escalate Ticket"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
