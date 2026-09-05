"use client";

import { Lightbulb } from "lucide-react";
import SafeMarkdown from "./safe-markdown";

type LocusTakeProps = {
  insight: string;
  title?: string;
  className?: string;
};

export default function LocusTake({
  insight,
  title = "Locus Take",
  className = "",
}: LocusTakeProps) {
  if (!insight || !insight.trim()) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-[#e5ddd0] bg-[#faf7f2] p-2 sm:p-2.5 text-xs transition-all ${className}`}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#f2ece0] text-[#b8924a] shadow-xs mt-0.5">
          <Lightbulb size={12} className="fill-[#b8924a]/20" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold uppercase tracking-wider text-[#b8924a]">
            {title}
          </div>
          <div className="mt-0.5 text-[#3b352e] leading-snug text-xs">
            <SafeMarkdown content={insight} />
          </div>
        </div>
      </div>
    </div>
  );
}
