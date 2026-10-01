import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowUpRight, ChevronRight, AlertTriangle } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SLABadge from './SLABadge';
import StatusBadge from './StatusBadge';
import ConfidenceScore from './ConfidenceScore';

export default function TicketCard({ ticket, onEscalate, onReview }) {
  if (!ticket) return null;

  return (
    <div
      className={`bg-white rounded-xl border p-4.5 shadow-2xs hover:shadow-sm transition-all duration-200 relative ${
        ticket.priority === 'HIGH'
          ? 'border-rose-300 ring-1 ring-rose-200/50'
          : 'border-slate-200'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Link
            to={`/tickets/${ticket.id}`}
            className="font-mono text-xs font-bold text-teal-600 hover:underline"
          >
            {ticket.id}
          </Link>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            {ticket.issueCategory}
          </span>
        </div>
        <StatusBadge status={ticket.status} size="xs" />
      </div>

      {/* Subject & snippet */}
      <Link to={`/tickets/${ticket.id}`} className="block group">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
          {ticket.subject}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </Link>

      {/* Account info */}
      <div className="mt-3 py-2 border-y border-slate-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{ticket.account}</span>
        <span className="text-slate-400 text-[11px]">{ticket.contact}</span>
      </div>

      {/* Badges footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={ticket.priority} size="xs" />
          <SLABadge riskLevel={ticket.slaRiskLevel} size="xs" />
        </div>
        <ConfidenceScore score={ticket.aiConfidenceScore} size="xs" showLabel={false} />
      </div>

      {/* Assigned Agent & Quick Actions */}
      <div className="mt-3 pt-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-[11px]">{ticket.assignedAgent}</span>
        </div>

        <div className="flex items-center gap-1">
          {ticket.requiresManualReview && onReview && (
            <button
              onClick={() => onReview(ticket)}
              className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded cursor-pointer"
            >
              Review
            </button>
          )}
          <Link
            to={`/tickets/${ticket.id}`}
            className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
          >
            Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
