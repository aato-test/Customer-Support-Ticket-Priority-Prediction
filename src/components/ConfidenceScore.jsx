import React from 'react';

export default function ConfidenceScore({ score = 0, size = 'md', showLabel = true, showCircle = true }) {
  const num = Math.round(score);
  
  // Theme coloring
  let strokeColor = '#0284c7'; // purple
  let bgColor = 'text-sky-50 bg-sky-50/60 border-sky-200 text-sky-700';
  let badgeColor = 'bg-sky-100 text-sky-800';

  if (num < 70) {
    strokeColor = '#f43f5e'; // rose
    bgColor = 'text-rose-50 bg-rose-50/60 border-rose-200 text-rose-700';
    badgeColor = 'bg-rose-100 text-rose-700';
  } else if (num < 85) {
    strokeColor = '#f59e0b'; // amber
    bgColor = 'text-amber-50 bg-amber-50/60 border-amber-200 text-amber-700';
    badgeColor = 'bg-amber-100 text-amber-800';
  }

  // Dimension sizing
  const dimensions = {
    xs: { r: 10, stroke: 2.5, width: 26, text: 'text-[9px]' },
    sm: { r: 14, stroke: 3, width: 34, text: 'text-[11px]' },
    md: { r: 18, stroke: 3.5, width: 44, text: 'text-xs' },
    lg: { r: 30, stroke: 5, width: 72, text: 'text-base font-bold' },
    xl: { r: 42, stroke: 7, width: 100, text: 'text-2xl font-bold' }
  }[size] || { r: 18, stroke: 3.5, width: 44, text: 'text-xs' };

  const circumference = 2 * Math.PI * dimensions.r;
  const strokeDashoffset = circumference - (num / 100) * circumference;

  if (!showCircle) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded px-2 py-0.5 text-xs ${badgeColor}`}>
        {num}% AI Conf
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90"
        >
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.r}
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.r}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={`absolute font-semibold text-slate-800 ${dimensions.text}`}>
          {num}%
        </span>
      </div>
      {showLabel && (
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">AI Conf</span>
          <span className="text-xs font-semibold text-slate-800">{num}%</span>
        </div>
      )}
    </div>
  );
}
