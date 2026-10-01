import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  X,
  ExternalLink
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import NotificationPanel from './NotificationPanel';

export default function Navbar({ onOpenMobileSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, isAiOnline, notifications } = useTickets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Compute Page Title & Breadcrumb based on path
  const getPageTitle = (path) => {
    if (path === '/') return { title: 'Dashboard', sub: 'Support Operations Overview' };
    if (path.startsWith('/tickets/')) return { title: 'Ticket Details', sub: 'Investigation & AI Analysis' };
    if (path === '/tickets') return { title: 'All Tickets', sub: 'Queue Management & Triage' };
    if (path === '/create-ticket') return { title: 'Create Support Ticket', sub: 'Intake and classification' };
    if (path === '/my-tickets') return { title: 'My Open Tickets', sub: 'Assigned Workload & Action Items' };
    if (path === '/escalations') return { title: 'Escalation Center', sub: 'Critical Incidents & Safeguards' };
    if (path === '/sla-monitor') return { title: 'SLA Monitor', sub: 'Breach Projections & Response Times' };
    if (path === '/analytics') return { title: 'Analytics & Insights', sub: 'Operational Metrics & AI Performance' };
    if (path === '/ai-insights') return { title: 'AI Insights & Audits', sub: 'Model Accuracy & Override Queue' };
    if (path === '/settings') return { title: 'Settings', sub: 'AI Thresholds & Operations Config' };
    return { title: 'SupportIQ', sub: 'Enterprise Support Operations' };
  };

  const { title, sub } = getPageTitle(location.pathname);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/tickets');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu + Page Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <span>SupportIQ</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-700 font-semibold">{title}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* Right Section: Search, AI Status, Notifications, Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets, accounts, IDs..."
              className="text-xs pl-9 pr-3 py-2 w-52 lg:w-72 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-teal-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-400 text-slate-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* AI Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50/80 border border-sky-200/70 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <div className="text-left leading-none hidden sm:block">
              <span className="text-[11px] font-bold text-sky-950 block">SupportIQ AI</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="sm:hidden flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold" title="Kathirvel">KV</div>
          </div>
        </div>
      </div>
    </header>
  );
}
