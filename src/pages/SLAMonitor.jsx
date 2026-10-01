import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';
import SLABadge from '../components/SLABadge';

export default function SLAMonitor() {
  const { tickets } = useTickets();

  // Calculate SLA breakdown
  const withinSlaCount = tickets.filter(t => t.slaRiskLevel === 'LOW' && t.status !== 'RESOLVED').length;
  const atRiskCount = tickets.filter(t => t.slaRiskLevel === 'MEDIUM' && t.status !== 'RESOLVED').length;
  const highRiskCount = tickets.filter(t => t.slaRiskLevel === 'HIGH' && t.status !== 'RESOLVED').length;
  const breachedCount = tickets.filter(t => t.slaRiskLevel === 'BREACHED' && t.status !== 'RESOLVED').length;

  const formatRemainingTime = (minutes) => {
    if (minutes < 0) {
      const positiveMins = Math.abs(minutes);
      const hours = Math.floor(positiveMins / 60);
      const mins = positiveMins % 60;
      return (
        <span className="font-bold text-red-600 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          -{hours > 0 ? `${hours}h ` : ''}{mins}m BREACHED
        </span>
      );
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0 && mins <= 30) {
      return (
        <span className="font-bold text-orange-600 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {mins}m remaining
        </span>
      );
    }
    return (
      <span className="font-semibold text-slate-700">
        {hours > 0 ? `${hours}h ` : ''}{mins}m remaining
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            SLA Operations Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time contractual response and resolution time guarantee tracking
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Auto-refreshes every 30 seconds</span>
        </div>
      </div>

      {/* 4 SLA KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Within SLA"
          value={withinSlaCount}
          change="92.4% rate"
          isPositive={true}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-200"
        />

        <StatCard
          icon={AlertTriangle}
          label="At Risk"
          value={atRiskCount}
          change="Approaching 75%"
          isPositive={false}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-200"
        />

        <StatCard
          icon={ShieldAlert}
          label="High Risk"
          value={highRiskCount}
          change="<1h remaining"
          isPositive={false}
          iconColor="text-orange-600"
          iconBg="bg-orange-50 border-orange-200"
        />

        <StatCard
          icon={Flame}
          label="Breached"
          value={breachedCount}
          change="Immediate penalty"
          isPositive={false}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 border-rose-200"
        />
      </div>

      {/* SLA Monitor Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              SLA Compliance Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active open cases ranked by urgent SLA expiration deadlines
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Ticket</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-4">Ticket Age</th>
                <th className="py-3 px-4">SLA Target</th>
                <th className="py-3 px-4">Remaining Time</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tickets.map((t) => {
                const isBreached = t.slaRiskLevel === 'BREACHED';

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isBreached ? 'bg-red-50/25' : ''
                    }`}
                  >
                    {/* Ticket */}
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-teal-700">
                        <Link to={`/tickets/${t.id}`} className="hover:underline">
                          {t.id}
                        </Link>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5 line-clamp-1">
                        {t.subject}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {t.account}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <PriorityBadge priority={t.priority} />
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      1h 45m
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                      {t.slaTargetHours} hours
                    </td>

                    {/* Remaining Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {formatRemainingTime(t.slaRemainingMinutes)}
                    </td>

                    {/* Risk */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <SLABadge riskLevel={t.slaRiskLevel} />
                    </td>

                    {/* Agent */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-900">
                      {t.assignedAgent}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-teal-600 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-1"
                      >
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
