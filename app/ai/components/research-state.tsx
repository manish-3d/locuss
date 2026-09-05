"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, Search } from "lucide-react";

type ResearchStateProps = {
  userQuery?: string;
};

const RESEARCH_STEPS = [
  "Understanding your request",
  "Searching verified listings",
  "Filtering property parameters",
  "Analyzing best matches",
  "Preparing structured results",
];

export default function ResearchState({ userQuery }: ResearchStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const intervals = [500, 1100, 1800, 2600];
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach((delay, idx) => {
      const timer = setTimeout(() => {
        setCurrentStepIndex(idx + 1);
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="space-y-2 max-w-xl text-xs sm:text-sm">
      {/* Bot Identity Header */}
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#b8924a]">
        <Sparkles size={11} className="text-[#b8924a]" />
        <span>Locus AI Broker</span>
      </div>

      {/* Natural Summary */}
      <div className="text-xs text-[#1e1b17] leading-relaxed">
        {userQuery
          ? `Got it! Searching verified listings for "${userQuery}". This will take just a moment...`
          : "Got it! I'm analyzing marketplace listings for your request. This will take just a moment..."}
      </div>

      {/* Research Checklist Card (Panel 1) */}
      <div className="overflow-hidden rounded-xl border border-[#e5ddd0] bg-white p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            {RESEARCH_STEPS.map((step, index) => {
              const isDone = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step} className="flex items-center gap-2 text-xs">
                  {isDone ? (
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={9} strokeWidth={3} />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      <span className="h-2 w-2 animate-ping rounded-full bg-[#b8924a] opacity-75" />
                    </div>
                  ) : (
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-[#e5ddd0]" />
                  )}

                  <span
                    className={`transition-colors text-xs ${
                      isDone
                        ? "text-[#1e1b17] font-medium"
                        : isCurrent
                        ? "text-[#b8924a] font-semibold"
                        : "text-[#a39a8c]"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Search Icon illustration */}
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faf7f2] border border-[#e5ddd0] text-[#b8924a]">
            <Search size={16} className="animate-pulse" />
          </div>
        </div>

        {/* Scanning status bar */}
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#f2ece0] pt-2 text-[10px] text-[#7a7268]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#b8924a]" />
          <span>Searching active real-estate database...</span>
        </div>
      </div>
    </div>
  );
}
