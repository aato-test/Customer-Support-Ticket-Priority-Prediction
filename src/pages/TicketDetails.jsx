import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  Inbox,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Users,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import PriorityBadge from '../components/PriorityBadge';
import SLABadge from '../components/SLABadge';
import StatusBadge from '../components/StatusBadge';
import AIAnalysisCard from '../components/AIAnalysisCard';
import EscalationPanel from '../components/EscalationPanel';
import ManualReviewModal from '../components/ManualReviewModal';
import EmptyState from '../components/EmptyState';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    tickets,
    agents,
    assignTicket,
    escalateTicket,
    overridePriority,
    resolveTicket
  } = useTickets();

  const [ticket, setTicket] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  useEffect(() => {
    const found = tickets.find(t => t.id === id);
    if (found) {
      setTicket(found);
    }
  }, [id, tickets]);

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Link to="/tickets" className="inline-flex items-center gap-1 text-xs text-teal-600 font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
        </Link>
        <EmptyState
          type="error"
          title={`Ticket ${id} not found`}
          description="The requested ticket ID could not be loaded from active operations storage."
          actionText="Return to Ticket List"
          onAction={() => navigate('/tickets')}
        />
      </div>
    );
  }

  // Find assigned agent's detailed workload
  const assignedAgentDetails = agents.find(a => a.name === ticket.assignedAgent) || {
    name: ticket.assignedAgent,
    availability: 'Available',
    openTickets: 18,
    workload: 72,
    role: 'Support Specialist'
  };

  const handleAgentReassign = (newAgentName) => {
    assignTicket(ticket.id, newAgentName);
    setShowAssignDropdown(false);
  };

  const handleEscalate = () => {
    escalateTicket(ticket.id, 'High-priority outage escalated from Ticket Details');
  };

  const handleResolve = () => {
    resolveTicket(ticket.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets Queue
        </Link>

        <div className="flex items-center gap-2">
          {ticket.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Mark Resolved
            </button>
          )}

          {ticket.status !== 'ESCALATED' && (
            <button
              onClick={handleEscalate}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Escalate to Manager
            </button>
          )}
        </div>
      </div>

      {/* Ticket Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-extrabold text-teal-700">
                {ticket.id}
              </span>
              <span className="text-slate-300">•</span>
              <StatusBadge status={ticket.status} size="md" />
              <PriorityBadge priority={ticket.priority} size="md" />
              <SLABadge riskLevel={ticket.slaRiskLevel} size="md" />
              {ticket.priorityOverridden && (
                <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-sky-500" />
                  Priority manually overridden by Manager
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              {ticket.subject}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Created {new Date(ticket.createdDate).toLocaleDateString()} at {new Date(ticket.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Description box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Customer Issue Description
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {ticket.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Customer Account
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {ticket.account}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Contact Person
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {ticket.contact}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Ticket Source
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5 text-slate-400" />
              {ticket.ticketSource}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              SLA Target / Time Left
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {ticket.slaRemainingMinutes < 0
                ? `Breached by ${Math.abs(ticket.slaRemainingMinutes)}m`
                : `${ticket.slaRemainingMinutes} mins remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 12: AI Intelligence Panel */}
      <AIAnalysisCard
        analysis={ticket}
        title="SupportIQ AI Analysis"
        onManualReviewClick={() => setShowReviewModal(true)}
      />

      {/* SECTION 13: Automatic Assignment Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Automatic Assignment
                </h3>
                <p className="text-xs text-slate-500">
                  Least-loaded eligible agent routing engine
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              className="px-3.5 py-1.5 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
            >
              Reassign Engineer
            </button>

            {showAssignDropdown && (
              <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 text-xs">
                <span className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase block">
                  Select Engineer:
                </span>
                {agents.map(ag => (
                  <button
                    key={ag.name}
                    onClick={() => handleAgentReassign(ag.name)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{ag.name}</div>
                      <div className="text-[10px] text-slate-400">{ag.role}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {ag.workload}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Assigned Agent
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {ticket.assignedAgent}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Agent Availability
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {assignedAgentDetails.availability || 'Available'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Open Tickets
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {assignedAgentDetails.openTickets || 18} Active
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Workload Level
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                {assignedAgentDetails.workload || 72}%
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${assignedAgentDetails.workload || 72}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
          &ldquo;Agent selected based on availability, support eligibility and current workload.&rdquo;
        </p>
      </div>

      {/* SECTION 14: Escalation Panel (Always visible for High Priority or Escalated) */}
      {(ticket.priority === 'HIGH' || ticket.status === 'ESCALATED') && (
        <EscalationPanel
          escalation={ticket.escalationDetails}
          ticketId={ticket.id}
          onReassign={() => setShowAssignDropdown(true)}
          onResolve={handleResolve}
        />
      )}

      {/* Manual Review Modal */}
      {showReviewModal && (
        <ManualReviewModal
          ticket={ticket}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onAccept={() => setShowReviewModal(false)}
          onChangePriority={(id, p, r) => {
            overridePriority(id, p, r);
            setShowReviewModal(false);
          }}
          onRerunAnalysis={async () => {}}
        />
      )}
    </div>
  );
}
