import type { Metadata } from "next";
import { SpatialWorkspace } from "@/components/spatial";
import { Compass, Bot, Navigation, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "3D Property Intelligence | Locus",
  description:
    "Explore the Modern Coastal Hillside Villa through an interactive 3D digital twin with semantic room graph navigation, autonomous property tours, and AI spatial reasoning.",
};

export default function SpatialPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf7f2] py-4 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-5 px-3 sm:space-y-10 sm:px-6 lg:px-8">
        {/* ── Editorial Header ── */}
        <div className="space-y-3 border-b border-[#e5ddd0] pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c5] bg-white/80 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#9a8f7e] sm:px-3 sm:text-[0.68rem] sm:tracking-[0.16em]">
            <span className="text-[#b8924a]">✦</span> Stage 12 • 3D Property Intelligence
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-[#1e1b17] sm:text-4xl lg:text-5xl">
              Modern Coastal Hillside Villa
            </h1>
            <div className="text-sm font-medium text-[#7a7268]">
              5 BHK Luxury Villa • 5,200 sq.ft • Infinity Pool &amp; Carport
            </div>
          </div>

          <p className="max-w-3xl text-xs leading-relaxed text-[#7a7268] sm:text-base">
            Experience spatial intelligence through an interactive 3D digital twin. Orbit and inspect rooms in real-time,
            command the AI Broker to navigate to specific spaces (e.g. <em>&ldquo;Take me to the infinity pool&rdquo;</em> or <em>&ldquo;Show me the Porsche in the carport&rdquo;</em>),
            request an autonomous guided property tour, and ask spatial questions about layouts and connectivity.
          </p>
        </div>

        {/* ── Main Interactive 3D Workspace ── */}
        <section>
          <SpatialWorkspace />
        </section>

        {/* ── Architecture & Capability Highlights ── */}
        <section className="grid grid-cols-2 gap-2.5 border-t border-[#e5ddd0] pt-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-[#e5ddd0] bg-white p-4.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#b8924a]">
              <Compass className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Semantic Room Graph
              </h3>
            </div>
            <p className="text-xs text-[#7a7268] leading-relaxed">
              8 curated spatial nodes with verified camera viewpoints, room descriptions, and bidirectional adjacency connections.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ddd0] bg-white p-4.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#b8924a]">
              <Navigation className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Navigation Engine
              </h3>
            </div>
            <p className="text-xs text-[#7a7268] leading-relaxed">
              Smooth cubic ease-in-out camera transitions between semantic room targets with in-flight cancellation safety.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ddd0] bg-white p-4.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#b8924a]">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Autonomous Tours
              </h3>
            </div>
            <p className="text-xs text-[#7a7268] leading-relaxed">
              7-stop guided walkthrough route with automated camera motion, progress tracking, pause/resume, and skip capabilities.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ddd0] bg-white p-4.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#b8924a]">
              <Bot className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Spatial AI Copilot
              </h3>
            </div>
            <p className="text-xs text-[#7a7268] leading-relaxed">
              AI Broker equipped with 5 spatial tools to reason about layout, answer adjacency questions, and drive camera navigation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
