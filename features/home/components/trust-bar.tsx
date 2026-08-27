import { Sparkles } from "lucide-react";

/**
 * TrustBar — sits BELOW the hero, visible only after scrolling.
 * Preserved and reusable for future homepage sections.
 */
export default function TrustBar() {
  return (
    <div className="w-full rounded-2xl border border-[#e5ddd0] bg-white/70 px-8 py-6 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-6">

        {/* Trusted by Thousands */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#b8924a]/20 text-[0.58rem] font-bold text-[#b8924a]">
              5K+
            </div>
            <div className="h-9 w-9 rounded-full border-2 border-white bg-[#dfc99a]" />
            <div className="h-9 w-9 rounded-full border-2 border-white bg-[#d4c9b8]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1e1b17]">Trusted by Thousands</p>
            <p className="text-xs text-[#7a7268]">Happy customers finding their dream homes</p>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-[#e5ddd0] md:block" />

        <div className="text-center">
          <p className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17]">50K+</p>
          <p className="text-xs text-[#7a7268]">Properties</p>
        </div>

        <div className="hidden h-10 w-px bg-[#e5ddd0] md:block" />

        <div className="text-center">
          <p className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17]">120+</p>
          <p className="text-xs text-[#7a7268]">Cities</p>
        </div>

        <div className="hidden h-10 w-px bg-[#e5ddd0] md:block" />

        <div className="text-center">
          <p className="font-serif text-2xl font-bold tracking-tight text-[#1e1b17]">95%</p>
          <p className="text-xs text-[#7a7268]">Match Accuracy</p>
        </div>

        <div className="hidden h-10 w-px bg-[#e5ddd0] md:block" />

        {/* AI Broker */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1e1b17]">AI Broker Assistant</p>
            <p className="text-xs text-[#7a7268]">24/7 intelligent support for all your queries</p>
          </div>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#e5ddd0] bg-[#b8924a]/10">
            <Sparkles className="h-4 w-4 text-[#b8924a]" />
          </div>
        </div>

      </div>
    </div>
  );
}
