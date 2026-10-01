import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  UserCheck,
  AlertOctagon,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { tickets } = useTickets();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Compute live badges
  const escalationsCount = tickets.filter(t => t.status === 'ESCALATED').length;
  const reviewCount = tickets.filter(t => t.requiresManualReview).length;
  const myTicketsCount = tickets.filter(t => t.assignedAgent === 'Kathirvel' && t.status !== 'RESOLVED').length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tickets', path: '/tickets', icon: Ticket, badge: tickets.length },
    { name: 'Create Ticket', path: '/create-ticket', icon: PlusCircle, isAction: true },
    { name: 'My Tickets', path: '/my-tickets', icon: UserCheck, badge: myTicketsCount > 0 ? myTicketsCount : null },
    { name: 'Escalations', path: '/escalations', icon: AlertOctagon, badge: escalationsCount > 0 ? escalationsCount : null, badgeColor: 'bg-rose-500 text-white' },
    { name: 'SLA Monitor', path: '/sla-monitor', icon: ShieldCheck },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Insights', path: '/ai-insights', icon: Sparkles, badge: reviewCount > 0 ? `${reviewCount} review` : null, badgeColor: 'bg-sky-500 text-white' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0b1f2a] text-slate-300 border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Logo Header */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold tracking-tight text-white font-sans">
                    SupportIQ
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  AI Support Intelligence
                </p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-teal-500/15 text-white ring-1 ring-inset ring-teal-400/40'
                      : item.isAction
                      ? 'text-teal-300 hover:bg-teal-950/60 hover:text-white border border-teal-500/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : item.isAction
                          ? 'text-teal-400 group-hover:text-teal-300'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-teal-500 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Menu at Bottom */}
        <div className="p-3 border-t border-white/10 bg-[#0b1f2a] relative">
          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div className="absolute bottom-16 left-3 right-3 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-700/60">
                <span className="font-bold text-white block">Kathirvel</span>
                <span className="text-[11px] text-slate-400">kathirvel@supportiq.io</span>
              </div>
              <NavLink
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 mt-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </NavLink>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Session logged out (Demo)');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 flex items-center gap-2 mt-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 flex items-center justify-center text-xs font-bold">KV</div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0b1f2a] rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-xs text-white">Kathirvel</div>
                <div className="text-[11px] text-slate-400">Support Manager</div>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? '-rotate-90' : ''}`} />
          </div>
        </div>
      </aside>
    </>
  );
}
