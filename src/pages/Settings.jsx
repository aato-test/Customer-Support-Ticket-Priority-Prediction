import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Bell,
  UserCheck,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Shield,
  Cpu
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Settings() {
  const { settings, updateSettings, resetAllData } = useTickets();

  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-teal-600" />
            Operations & AI Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure SupportIQ AI confidence parameters, routing limits, alerts, and availability
          </p>
        </div>

        <button
          type="button"
          onClick={resetAllData}
          className="text-xs px-3.5 py-1.5 font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          Reset Factory Mock Data
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. AI Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Configuration</h3>
              <p className="text-xs text-slate-500">
                SupportIQ classification and triage operational parameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confidence Threshold */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Confidence Threshold
                </label>
                <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {formData.confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={formData.confidenceThreshold}
                onChange={(e) => handleChange('confidenceThreshold', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Tickets with AI confidence below {formData.confidenceThreshold}% are automatically flagged for manager review.
              </p>
            </div>

            {/* Maximum Open Tickets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Open Tickets per Agent
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={formData.maxOpenTickets}
                onChange={(e) => handleChange('maxOpenTickets', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 font-semibold text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Prevents ticket routing overload. If an agent exceeds {formData.maxOpenTickets} tickets, they are marked busy.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Notification Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Settings</h3>
              <p className="text-xs text-slate-500">
                Control alert broadcasts across channels and pager duty
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Assignment Notifications */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Assignment Notifications</span>
                <span className="text-[11px] text-slate-500">Alert engineers when new tickets are assigned</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyAssignment}
                onChange={(e) => handleChange('notifyAssignment', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>

            {/* Escalation Notifications */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Escalation Notifications</span>
                <span className="text-[11px] text-slate-500">Broadcast immediate Slack & SMS alert on outages</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyEscalation}
                onChange={(e) => handleChange('notifyEscalation', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>

            {/* SLA Breach Notifications */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">SLA Breach Warnings</span>
                <span className="text-[11px] text-slate-500">Alert 30 mins before SLA target expires</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifySlaBreach}
                onChange={(e) => handleChange('notifySlaBreach', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>

            {/* Manager Alerts */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Manager Summary Alerts</span>
                <span className="text-[11px] text-slate-500">Hourly queue summary and capacity alerts</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyManagerAlerts}
                onChange={(e) => handleChange('notifyManagerAlerts', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>
          </div>
        </div>

        {/* 3. User Availability */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Availability & Role Tiers</h3>
              <p className="text-xs text-slate-500">
                Kathirvel (Support Manager) operational routing status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Available for Tickets</span>
                <span className="text-[11px] text-slate-500">Receive automated inbound ticket assignment</span>
              </div>
              <input
                type="checkbox"
                checked={formData.userAvailable}
                onChange={(e) => handleChange('userAvailable', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Escalation Tier Agent</span>
                <span className="text-[11px] text-slate-500">Designated responder for tier-3 outages & security</span>
              </div>
              <input
                type="checkbox"
                checked={formData.escalationTierAgent}
                onChange={(e) => handleChange('escalationTierAgent', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Settings Saved!' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
