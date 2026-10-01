import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Filter,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import StatCard from '../components/StatCard';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // 1. Ticket Volume Over Time
  const volumeData = [
    { date: 'Sep 01', volume: 62, resolved: 58 },
    { date: 'Sep 05', volume: 74, resolved: 71 },
    { date: 'Sep 10', volume: 88, resolved: 82 },
    { date: 'Sep 15', volume: 95, resolved: 90 },
    { date: 'Sep 20', volume: 110, resolved: 104 },
    { date: 'Sep 25', volume: 125, resolved: 119 },
    { date: 'Oct 01', volume: 140, resolved: 132 },
  ];

  // 2. Resolution Time by Priority (hours)
  const resolutionTimeData = [
    { priority: 'High Priority', avgHours: 1.8, targetHours: 2.0 },
    { priority: 'Medium Priority', avgHours: 5.2, targetHours: 8.0 },
    { priority: 'Low Priority', avgHours: 14.6, targetHours: 24.0 },
  ];

  // 3. Tickets by Category
  const categoryData = [
    { name: 'System Outage', value: 28, color: '#f43f5e' },
    { name: 'Performance', value: 45, color: '#f59e0b' },
    { name: 'Account Access', value: 52, color: '#0d9488' },
    { name: 'Billing & Checkout', value: 34, color: '#0ea5e9' },
    { name: 'General Inquiry', value: 89, color: '#10b981' }
  ];

  // 4. AI Confidence Distribution
  const confidenceDistData = [
    { range: '90-100%', count: 182, fill: '#0284c7' },
    { range: '80-89%', count: 48, fill: '#0d9488' },
    { range: '70-79%', count: 18, fill: '#3b82f6' },
    { range: '<70% (Review)', count: 8, fill: '#f43f5e' },
  ];

  // 5. Agent Workload Comparison
  const agentWorkloadData = [
    { agent: 'Priya S.', tickets: 18, workload: 72 },
    { agent: 'Rahul K.', tickets: 11, workload: 48 },
    { agent: 'Anita J.', tickets: 22, workload: 88 },
    { agent: 'Arun K.', tickets: 14, workload: 56 },
    { agent: 'Meena D.', tickets: 9, workload: 36 },
  ];

  // 6. SLA Compliance & AI Override Rate Trend
  const complianceData = [
    { month: 'May', compliance: 91.2, overrideRate: 8.8 },
    { month: 'Jun', compliance: 92.4, overrideRate: 8.1 },
    { month: 'Jul', compliance: 93.8, overrideRate: 7.9 },
    { month: 'Aug', compliance: 94.6, overrideRate: 7.5 },
    { month: 'Sep', compliance: 96.2, overrideRate: 7.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Operations & AI Intelligence Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end performance benchmarks, SupportIQ accuracy distributions, and workload metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Intake (30d)"
          value="1,420"
          change="+14.2%"
          isPositive={false}
          iconColor="text-teal-600"
          iconBg="bg-teal-50 border-teal-200"
        />

        <StatCard
          icon={Clock}
          label="Mean Time To Resolve"
          value="4.8 hrs"
          change="-12.3%"
          isPositive={true}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-200"
        />

        <StatCard
          icon={ShieldCheck}
          label="SLA Compliance"
          value="96.2%"
          change="+1.8%"
          isPositive={true}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-200"
        />

        <StatCard
          icon={Sparkles}
          label="AI Override Rate"
          value="7.2%"
          change="-0.9%"
          isPositive={true}
          iconColor="text-sky-600"
          iconBg="bg-sky-50 border-sky-200"
        />
      </div>

      {/* 2x2 Grid of In-depth Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Ticket Volume Over Time (Area Chart) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Ticket Volume & Resolution Throughput
              </h3>
              <p className="text-[11px] text-slate-500">Intake vs closed cases over 30 days</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              High Velocity
            </span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="volume" name="New Cases" stroke="#0d9488" fillOpacity={1} fill="url(#volumeGrad)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10b981" fillOpacity={1} fill="url(#resolvedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Resolution Time by Priority (Bar Chart) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Resolution Time vs SLA Target (Hours)
              </h3>
              <p className="text-[11px] text-slate-500">Actual resolution benchmark by severity</p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              All Met
            </span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="avgHours" name="Actual Avg (hrs)" fill="#0f766e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="targetHours" name="SLA Target (hrs)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Tickets by Category (Donut Chart) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tickets by Category
              </h3>
              <p className="text-[11px] text-slate-500">Classification volume by domain</p>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. AI Confidence Distribution (Histogram) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Confidence Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Model certainty on ticket classification</p>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              88.7% Mean
            </span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Tickets" radius={[6, 6, 0, 0]}>
                  {confidenceDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
