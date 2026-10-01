import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Search,
  Filter,
  Download,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import TicketTable from '../components/TicketTable';
import TicketCard from '../components/TicketCard';
import ManualReviewModal from '../components/ManualReviewModal';

export default function Tickets() {
  const { tickets, searchQuery, setSearchQuery, escalateTicket, overridePriority, resetAllData } = useTickets();
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [slaFilter, setSlaFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [reviewTicket, setReviewTicket] = useState(null);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        !searchQuery ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedAgent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchCategory = categoryFilter === 'ALL' || t.issueCategory === categoryFilter;
      const matchSla = slaFilter === 'ALL' || t.slaRiskLevel === slaFilter;

      return matchSearch && matchPriority && matchStatus && matchCategory && matchSla;
    });
  }, [tickets, searchQuery, priorityFilter, statusFilter, categoryFilter, slaFilter]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Subject', 'Account', 'Priority', 'Status', 'Category', 'SLA Risk', 'Agent', 'AI Confidence'];
    const rows = filteredTickets.map(t => [
      t.id,
      `"${t.subject.replace(/"/g, '""')}"`,
      `"${t.account}"`,
      t.priority,
      t.status,
      t.issueCategory,
      t.slaRiskLevel,
      t.assignedAgent,
      `${t.aiConfidenceScore}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supportiq_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setSlaFilter('ALL');
  };

  const hasActiveFilters = searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || slaFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Support Tickets Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise case triage with automated AI prioritization and routing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <Link
            to="/create-ticket"
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </Link>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, subject, customer, or agent..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* View Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Filters:
          </span>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="System Outage">System Outage</option>
            <option value="Performance">Performance</option>
            <option value="Account Access">Account Access</option>
            <option value="Billing">Billing</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>

          {/* SLA Risk */}
          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="ALL">All SLA States</option>
            <option value="BREACHED">Breached</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Within SLA</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main View: Table or Grid */}
      {viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          title={`All Support Tickets (${filteredTickets.length})`}
          subtitle="Showing live queue status, SupportIQ classification and assignment"
          onQuickEscalate={(id) => escalateTicket(id, 'Escalated by manager from Tickets table')}
          onOpenReviewModal={(ticket) => setReviewTicket(ticket)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEscalate={(id) => escalateTicket(id, 'Escalated from tickets grid')}
              onReview={(t) => setReviewTicket(t)}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewTicket && (
        <ManualReviewModal
          ticket={reviewTicket}
          isOpen={!!reviewTicket}
          onClose={() => setReviewTicket(null)}
          onAccept={() => setReviewTicket(null)}
          onChangePriority={(id, p, r) => {
            overridePriority(id, p, r);
            setReviewTicket(null);
          }}
          onRerunAnalysis={async () => {}}
        />
      )}
    </div>
  );
}
