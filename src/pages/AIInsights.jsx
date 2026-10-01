import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Edit3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';
import ConfidenceScore from '../components/ConfidenceScore';
import ManualReviewModal from '../components/ManualReviewModal';

export default function AIInsights() {
  const { tickets, overridePriority } = useTickets();
  const [selectedReviewTicket, setSelectedReviewTicket] = useState(null);

  // Tickets requiring review (confidence < 70% or flagged)
  const lowConfidenceTickets = tickets.filter(t => t.requiresManualReview || t.aiConfidenceScore < 70);

  // Confidence distribution chart data
  const distData = [
    { range: '90-100%', count: 182, label: 'High Certainty' },
    { range: '80-89%', count: 48, label: 'Reliable' },
    { range: '70-79%', count: 18, label: 'Acceptable' },
    { range: '<70%', count: lowConfidenceTickets.length, label: 'Review Flagged' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-sky-600" />
            AI insights and classification audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Classification accuracy metrics, confidence distribution, and low-confidence manual review queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
            Model: SupportIQ rule engine
          </span>
        </div>
      </div>

      {/* AI Performance Statistics (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="AI Accuracy"
          value="92.4%"
          change="+3.1%"
          isPositive={true}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-200"
        />

        <StatCard
          icon={Sparkles}
          label="Avg Confidence"
          value="88.7%"
          change="+1.4%"
          isPositive={true}
          iconColor="text-sky-600"
          iconBg="bg-sky-50 border-sky-200"
        />

        <StatCard
          icon={AlertTriangle}
          label="Manual Review Rate"
          value="6.8%"
          change="-0.8%"
          isPositive={true}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-200"
        />

        <StatCard
          icon={Sliders}
          label="Override Rate"
          value="7.2%"
          change="-1.2%"
          isPositive={true}
          iconColor="text-teal-600"
          iconBg="bg-teal-50 border-teal-200"
        />

        <StatCard
          icon={Cpu}
          label="Automation Coverage"
          value="96.2%"
          change="+5.4%"
          isPositive={true}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-200"
        />
      </div>

      {/* Confidence Distribution Chart */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Classification Confidence Distribution
            </h3>
            <p className="text-[11px] text-slate-500">
              Confidence scores across 248 analyzed tickets
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Threshold: 70%
          </span>
        </div>

        <div className="h-60 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]}>
                {distData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.range === '<70%' ? '#f43f5e' : entry.range === '70-79%' ? '#f59e0b' : '#0284c7'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 19: Low Confidence Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Low Confidence Tickets Requiring Manager Review
              </h3>
              <p className="text-xs text-amber-800">
                Cases with AI confidence &lt; 70% flagged for human supervision and priority audit
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
            {lowConfidenceTickets.length} cases flagged
          </span>
        </div>

        {lowConfidenceTickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            All tickets currently satisfy the 70% AI confidence threshold.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-5">Ticket ID</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-3">Provisional Prediction</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-5 min-w-[280px]">Reason for Low Confidence</th>
                  <th className="py-3 px-3">Review Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {lowConfidenceTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket ID */}
                    <td className="py-3.5 px-5 font-mono font-bold text-teal-700 whitespace-nowrap">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.id}
                      </Link>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="line-clamp-1">{ticket.subject}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{ticket.account}</div>
                    </td>

                    {/* Provisional Prediction */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <ConfidenceScore score={ticket.aiConfidenceScore} size="sm" showLabel={false} />
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-5 text-slate-700 italic font-serif text-xs">
                      &ldquo;{ticket.aiRationale || 'Ticket description is too short and does not clearly indicate severity.'}&rdquo;
                    </td>

                    {/* Review Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {ticket.priorityOverridden ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          <Edit3 className="w-3 h-3 text-sky-500" />
                          Overridden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pending Review
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedReviewTicket(ticket)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Review Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Review Modal */}
      {selectedReviewTicket && (
        <ManualReviewModal
          ticket={selectedReviewTicket}
          isOpen={!!selectedReviewTicket}
          onClose={() => setSelectedReviewTicket(null)}
          onAccept={(id) => {
            setSelectedReviewTicket(null);
          }}
          onChangePriority={(id, p, r) => {
            overridePriority(id, p, r);
            setSelectedReviewTicket(null);
          }}
          onRerunAnalysis={async () => {}}
        />
      )}
    </div>
  );
}
