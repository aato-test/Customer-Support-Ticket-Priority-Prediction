import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  'Reading ticket description',
  'Detecting urgency signals',
  'Classifying issue',
  'Calculating SLA risk',
  'Generating confidence score'
];

export default function LoadingAI({ onComplete, message = 'SupportIQ AI is analyzing...' }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="bg-gradient-to-b from-sky-50/70 to-teal-50/40 border border-sky-200/80 rounded-2xl p-8 max-w-lg mx-auto shadow-sm text-center">
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-500/20 mb-4 animate-pulse">
        <Sparkles className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span>
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
        <span>SupportIQ AI is analyzing...</span>
      </h3>
      <p className="text-xs text-sky-700/80 mt-1 font-medium">
        Running semantic classification and SLA risk projection models
      </p>

      {/* Progress steps */}
      <div className="mt-6 text-left space-y-3 bg-white/80 rounded-xl p-4 border border-sky-100/90 shadow-2xs">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-xs transition-colors duration-300 ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-sky-700 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
