import React, { useState } from 'react';
import { AlertTriangle, X, Check, ArrowRight, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import ConfidenceScore from './ConfidenceScore';

export default function ManualReviewModal({
  ticket,
  isOpen,
  onClose,
  onAccept,
  onChangePriority,
  onRerunAnalysis
}) {
  const [selectedPriority, setSelectedPriority] = useState(ticket?.priority || 'MEDIUM');
  const [overrideReason, setOverrideReason] = useState('Manager audit after customer follow-up');
  const [isChangingPriority, setIsChangingPriority] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleRerun = async () => {
    setIsRerunning(true);
    await onRerunAnalysis(ticket.id);
    setIsRerunning(false);
  };

  const handleApplyOverride = () => {
    onChangePriority(ticket.id, selectedPriority, overrideReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                AI Review Required
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                {ticket.id} — {ticket.subject}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Classification details */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Provisional Prediction
              </span>
              <PriorityBadge priority={ticket.priority} size="md" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                AI Confidence Level
              </span>
              <ConfidenceScore score={ticket.aiConfidenceScore} size="sm" showLabel={false} />
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Classification Flag Reason
              </span>
              <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 italic font-serif">
                &ldquo;{ticket.aiRationale || 'Ticket description is too short and does not clearly indicate severity.'}&rdquo;
              </p>
            </div>
          </div>

          {/* Description snippet */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Customer Description
            </span>
            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {ticket.description}
            </div>
          </div>

          {/* Override Form */}
          {isChangingPriority ? (
            <div className="p-4 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-3">
              <span className="text-xs font-bold text-teal-950 block">
                Select New Operational Priority:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedPriority === p
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Audit Rationale for Override:
                </label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  placeholder="Explain reason for priority adjustment..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPriority(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyOverride}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Override
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onAccept(ticket.id);
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Accept Prediction
              </button>

              <button
                type="button"
                onClick={() => setIsChangingPriority(true)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Change Priority
              </button>

              <button
                type="button"
                disabled={isRerunning}
                onClick={handleRerun}
                className="py-2.5 px-3 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRerunning ? 'animate-spin' : ''}`} />
                Re-run AI
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
