import React from 'react';
import { Sparkles, Check, AlertTriangle, ShieldAlert, Tag, Cpu, Info } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SLABadge from './SLABadge';
import ConfidenceScore from './ConfidenceScore';

export default function AIAnalysisCard({
  analysis,
  title = 'SupportIQ AI Analysis',
  onManualReviewClick,
  className = ''
}) {
  if (!analysis) return null;

  const isLowConfidence = (analysis.aiConfidenceScore || analysis.confidence || 0) < 70;
  const confidence = analysis.aiConfidenceScore || analysis.confidence || 90;
  const priority = analysis.predictedPriority || analysis.priority || 'MEDIUM';
  const category = analysis.issueCategory || analysis.category || 'General Inquiry';
  const slaRisk = analysis.slaRiskLevel || analysis.slaRisk || 'MEDIUM';
  const rationale = analysis.aiRationale || analysis.rationale || 'Analysis conducted via multi-modal NLP models.';
  const keywords = analysis.keywordSignals || ['system', 'triage'];

  return (
    <div className={`relative bg-gradient-to-br from-white via-sky-50/20 to-teal-50/20 border-2 border-sky-200/90 rounded-2xl p-6 shadow-sm overflow-hidden ${className}`}>
      {/* Decorative subtle background pattern */}
      <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 text-emerald-600" />
                AI Processed
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Rule-based classification engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ConfidenceScore score={confidence} size="md" showLabel={true} />
        </div>
      </div>

      {/* Low Confidence Warning Banner */}
      {isLowConfidence && (
        <div className="mt-4 p-3.5 bg-amber-50/90 border border-amber-300/80 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-900 block">Manual Review Required</span>
            <span className="text-amber-800">
              Confidence score ({confidence}%) is below the operational threshold (70%). The priority is provisional.
            </span>
            {onManualReviewClick && (
              <button
                onClick={onManualReviewClick}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Review & Override Priority
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid of Key AI Classifications */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Predicted Priority */}
        <div className="bg-white/90 border border-sky-100/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Predicted Priority
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={priority} size="md" />
          </div>
        </div>

        {/* Issue Category */}
        <div className="bg-white/90 border border-sky-100/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Issue Category
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-950 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
            {category}
          </span>
        </div>

        {/* SLA Risk */}
        <div className="bg-white/90 border border-sky-100/90 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Projected SLA Risk
          </span>
          <div className="flex items-center gap-2">
            <SLABadge riskLevel={slaRisk} size="md" />
          </div>
        </div>
      </div>

      {/* AI Rationale */}
      <div className="mt-4 bg-white/95 border border-sky-100 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-950 mb-1.5">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          <span>AI Rationale</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          &ldquo;{rationale}&rdquo;
        </p>
      </div>

      {/* Keyword Signals Detected */}
      {keywords && keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-sky-100/80">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-sky-500" />
            Signals Detected:
          </span>
          {keywords.map(kw => (
            <span
              key={kw}
              className="inline-flex items-center text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-md"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
