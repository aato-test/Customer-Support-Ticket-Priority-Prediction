import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  AlertOctagon,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import AgentWorkload from '../components/AgentWorkload';
import TicketTable from '../components/TicketTable';
import ManualReviewModal from '../components/ManualReviewModal';

export default function Dashboard() {
  const { tickets, agents, escalateTicket, overridePriority } = useTickets();
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');
  const [reviewTicket, setReviewTicket] = useState(null);

  // Timeframe filter choices
  const timeframes = ['Today', 'This Week', 'This Month', 'Custom Range'];

  // Priority chart data
  const priorityData = [
    { name: 'High', value: 32, color: '#f43f5e' }, // rose-500
    { name: 'Medium', value: 96, color: '#f59e0b' }, // amber-500
    { name: 'Low', value: 120, color: '#64748b' } // slate-500
  ];

  // SLA Risk chart data
  const slaRiskData = [
    { category: 'Low Risk', count: 184, fill: '#10b981' }, // emerald-500
    { category: 'Medium Risk', count: 46, fill: '#f59e0b' }, // amber-500
    { category: 'High Risk', count: 14, fill: '#f97316' }, // orange-500
    { category: 'Breached', count: 4, fill: '#ef4444' } // red-500
  ];

  // 7-day trend chart data
  const trendData = [
    { day: 'Mon', newTickets: 42, resolvedTickets: 38 },
    { day: 'Tue', newTickets: 48, resolvedTickets: 44 },
    { day: 'Wed', newTickets: 55, resolvedTickets: 49 },
    { day: 'Thu', newTickets: 51, resolvedTickets: 53 },
    { day: 'Fri', newTickets: 62, resolvedTickets: 58 },
    { day: 'Sat', newTickets: 24, resolvedTickets: 29 },
    { day: 'Sun', newTickets: 19, resolvedTickets: 21 }
  ];

  const handleQuickEscalate = (ticketId) => {
    escalateTicket(ticketId, 'Outage escalated directly from Dashboard overview');
  };

  return (
    <div className="space-y-6">
      {/* Header & Date/Filter controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Support Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor ticket volume, AI prioritization, workload, SLA risk and escalations in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe pill selector */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <Link
            to="/create-ticket"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </Link>
        </div>
      </div>

      {/* KPI Cards (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          icon={Ticket}
          label="Open Tickets"
          value="248"
          change="+12.5%"
          isPositive={false}
          iconColor="text-teal-600"
          iconBg="bg-teal-50 border-teal-200"
        />

        <StatCard
          icon={AlertOctagon}
          label="High Priority"
          value="32"
          change="+4.2%"
          isPositive={false}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 border-rose-200"
        />

        <StatCard
          icon={ShieldCheck}
          label="SLA At Risk"
          value="18"
          change="+2.1%"
          isPositive={false}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-200"
        />

        <StatCard
          icon={Sparkles}
          label="AI Accuracy"
          value="92.4%"
          change="+3.1%"
          isPositive={true}
          iconColor="text-sky-600"
          iconBg="bg-sky-50 border-sky-200"
        />

        <StatCard
          icon={Clock}
          label="Avg Resolution"
          value="4.8 hrs"
          change="-12.3%"
          isPositive={true}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-200"
        />

        <StatCard
          icon={Zap}
          label="Automation"
          value="96.2%"
          change="+5.4%"
          isPositive={true}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-200"
        />
      </div>

      {/* Charts Section: 3 Recharts Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Ticket Priority Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Tickets by Priority
                </h3>
                <p className="text-[11px] text-slate-500">Distribution across active queues</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="relative h-60 w-full mt-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">248</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Tickets</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-rose-50/60">
              <span className="text-[11px] text-rose-700 font-bold block">32</span>
              <span className="text-[10px] text-slate-500">High</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50/60">
              <span className="text-[11px] text-amber-700 font-bold block">96</span>
              <span className="text-[10px] text-slate-500">Medium</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-100">
              <span className="text-[11px] text-slate-700 font-bold block">120</span>
              <span className="text-[10px] text-slate-500">Low</span>
            </div>
          </div>
        </div>

        {/* 2. SLA Risk Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  SLA Risk Distribution
                </h3>
                <p className="text-[11px] text-slate-500">Commitment compliance projection</p>
              </div>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                4 Breached
              </span>
            </div>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaRiskData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {slaRiskData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>SLA Target Met: <strong className="text-slate-800">92.6%</strong></span>
            <Link to="/sla-monitor" className="text-teal-600 hover:underline">
              Inspect timers →
            </Link>
          </div>
        </div>

        {/* 3. Ticket Trend Line Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Ticket Volume & Resolution Trend
                </h3>
                <p className="text-[11px] text-slate-500">7-day intake vs throughput</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +8.2% Velocity
              </span>
            </div>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="plainline"
                    formatter={(val) => <span className="text-xs text-slate-600 font-medium">{val}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="newTickets"
                    name="New Tickets"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolvedTickets"
                    name="Resolved Tickets"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Peak Day: <strong className="text-slate-800">Friday (62 tickets)</strong></span>
            <Link to="/analytics" className="text-teal-600 hover:underline">
              Full Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Agent Workload Table */}
      <AgentWorkload agents={agents} />

      {/* Recent Support Tickets Table */}
      <TicketTable
        tickets={tickets.slice(0, 6)}
        title="Recent Support Tickets"
        subtitle="Live queue triage showing AI confidence, priority classification, and assignment"
        showViewAllLink={true}
        onQuickEscalate={handleQuickEscalate}
        onOpenReviewModal={(ticket) => setReviewTicket(ticket)}
      />

      {/* Low Confidence Review Modal */}
      {reviewTicket && (
        <ManualReviewModal
          ticket={reviewTicket}
          isOpen={!!reviewTicket}
          onClose={() => setReviewTicket(null)}
          onAccept={() => {
            setReviewTicket(null);
          }}
          onChangePriority={(id, p, r) => {
            overridePriority(id, p, r);
            setReviewTicket(null);
          }}
          onRerunAnalysis={async () => {
            // Re-run
          }}
        />
      )}
    </div>
  );
}
