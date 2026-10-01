import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertOctagon, Flame, Sparkles, CheckCircle2, X } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, markAllNotificationsRead } = useTickets();

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type) => {
    switch (type) {
      case 'escalation':
        return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'breach':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'review':
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 text-xs ${
                  notif.unread ? 'bg-teal-50/25' : ''
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{notif.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
          <Link
            to="/escalations"
            onClick={onClose}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            Go to Escalation Center →
          </Link>
        </div>
      </div>
    </>
  );
}
