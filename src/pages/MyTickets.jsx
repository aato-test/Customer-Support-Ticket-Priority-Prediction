import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Filter,
  ArrowUpDown,
  AlertOctagon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import PriorityBadge from '../components/PriorityBadge';
import SLABadge from '../components/SLABadge';
import StatusBadge from '../components/StatusBadge';
import ConfidenceScore from '../components/ConfidenceScore';
import TicketCard from '../components/TicketCard';
import EmptyState from '../components/EmptyState';

export default function MyTickets() {
  const { tickets, escalateTicket, overridePriority } = useTickets();
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW, SLA_RISK, ESCALATED
  const [sortBy, setSortBy] = useState('priority'); // priority, slaRisk, createdDate
  const [viewFormat, setViewFormat] = useState('grid'); // grid or list

  // Tickets assigned to Kathirvel (or user's queue)
  const myQueue = useMemo(() => {
    // Show tickets assigned to Kathirvel, or allow seeing tickets tagged for the manager
    return tickets.filter(t => t.assignedAgent === 'Kathirvel' || t.status === 'ESCALATED');
  }, [tickets]);

  // Tab filtering
  const filteredTickets = useMemo(() => {
    let result = myQueue.filter(t => {
      if (activeTab === 'HIGH') return t.priority === 'HIGH';
      if (activeTab === 'MEDIUM') return t.priority === 'MEDIUM';
      if (activeTab === 'LOW') return t.priority === 'LOW';
      if (activeTab === 'SLA_RISK') return t.slaRiskLevel === 'HIGH' || t.slaRiskLevel === 'BREACHED';
      if (activeTab === 'ESCALATED') return t.status === 'ESCALATED';
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'slaRisk') {
        const slaOrder = { BREACHED: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
        return slaOrder[a.slaRiskLevel] - slaOrder[b.slaRiskLevel];
      }
      if (sortBy === 'createdDate') {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });
  }, [myQueue, activeTab, sortBy]);

  const tabs = [
    { id: 'ALL', label: 'All Cases', count: myQueue.length },
    { id: 'HIGH', label: 'High Priority', count: myQueue.filter(t => t.priority === 'HIGH').length },
    { id: 'MEDIUM', label: 'Medium', count: myQueue.filter(t => t.priority === 'MEDIUM').length },
    { id: 'LOW', label: 'Low', count: myQueue.filter(t => t.priority === 'LOW').length },
    { id: 'SLA_RISK', label: 'SLA At Risk', count: myQueue.filter(t => t.slaRiskLevel === 'HIGH' || t.slaRiskLevel === 'BREACHED').length },
    { id: 'ESCALATED', label: 'Escalated', count: myQueue.filter(t => t.status === 'ESCALATED').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-teal-600" />
            My Open Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manager queue for Kathirvel • High-severity escalations & supervisory assignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="priority">Priority</option>
              <option value="slaRisk">SLA Risk</option>
              <option value="createdDate">Created Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tickets List / Grid */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          type="empty"
          title="No tickets in this view"
          description="You have cleared all pending tickets under this queue filter."
          actionText="View All Cases"
          onAction={() => setActiveTab('ALL')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEscalate={(id) => escalateTicket(id, 'Escalated from My Tickets')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
