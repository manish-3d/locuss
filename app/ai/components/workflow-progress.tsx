"use client";

import {
  Search,
  Sparkles,
  Scale,
  FileText,
  Heart,
  MessageSquare,
  Calendar,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export type WorkflowStage =
  | "Searching"
  | "Analyzing"
  | "Comparing"
  | "Ranking"
  | "Inspecting"
  | "Saving"
  | "Contacting"
  | "Scheduling"
  | "Completed"
  | "Failed";

export type WorkflowStep = {
  stage: WorkflowStage;
  label: string;
  status: "completed" | "failed" | "active";
  summary?: string;
};

type WorkflowProgressProps = {
  steps?: WorkflowStep[];
  workflowState?: "Completed" | "Failed";
};

function getStageIcon(stage: WorkflowStage) {
  switch (stage) {
    case "Searching":
      return <Search size={11} className="text-[#b8924a]" />;
    case "Ranking":
    case "Analyzing":
      return <Sparkles size={11} className="text-[#b8924a]" />;
    case "Comparing":
      return <Scale size={11} className="text-[#b8924a]" />;
    case "Inspecting":
      return <FileText size={11} className="text-[#b8924a]" />;
    case "Saving":
      return <Heart size={11} className="text-rose-500 fill-rose-500/20" />;
    case "Contacting":
      return <MessageSquare size={11} className="text-blue-500" />;
    case "Scheduling":
      return <Calendar size={11} className="text-amber-600" />;
    default:
      return <Sliders size={11} className="text-[#7a7268]" />;
  }
}

export default function WorkflowProgress({ steps, workflowState }: WorkflowProgressProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-lg border border-[#e5ddd0] bg-white/95 p-2 sm:p-2.5 shadow-xs">
      <div className="mb-1.5 flex items-center justify-between border-b border-[#f2ece0] pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#7a7268]">
        <span className="flex items-center gap-1">
          <Sparkles size={10} className="text-[#b8924a]" />
          Agent Workflow Execution
        </span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
            workflowState === "Failed"
              ? "bg-rose-50 text-rose-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {workflowState === "Failed" ? "Partial" : "Completed"}
        </span>
      </div>

      <div className="space-y-1">
        {steps.map((step, idx) => (
          <div
            key={`${step.stage}-${idx}`}
            className="flex items-center justify-between gap-1.5 text-[11px] py-0.5"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-[#faf7f2] border border-[#e5ddd0]">
                {getStageIcon(step.stage)}
              </div>
              <span className="font-medium text-[#1e1b17] truncate">{step.label}</span>
              {step.summary && (
                <span className="hidden sm:inline text-[10px] text-[#7a7268] truncate">
                  ({step.summary})
                </span>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[10px]">
              {step.status === "completed" ? (
                <span className="flex items-center gap-0.5 text-emerald-700 font-medium bg-emerald-50/80 px-1.5 py-0.5 rounded">
                  <CheckCircle2 size={10} className="text-emerald-600" />
                  <span className="hidden xs:inline">Done</span>
                </span>
              ) : step.status === "failed" ? (
                <span className="flex items-center gap-0.5 text-rose-700 font-medium bg-rose-50/80 px-1.5 py-0.5 rounded">
                  <XCircle size={10} className="text-rose-600" />
                  <span className="hidden xs:inline">Failed</span>
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-amber-700 font-medium bg-amber-50/80 px-1.5 py-0.5 rounded">
                  <AlertCircle size={10} className="text-amber-600" />
                  <span>Active</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
