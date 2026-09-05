import Link from "next/link";
import { Sparkles, Building2, Users2, ShieldCheck, ArrowRight } from "lucide-react";

export default function SellPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c5] bg-white/70 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a8f7e] mb-4">
          <span className="text-[#b8924a]">✦</span> Exclusive Listing Network
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1e1b17] leading-tight">
          Sell or Lease Your Property <br />
          <span className="text-[#b8924a]">with Intelligent Reach</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[#7a7268] leading-relaxed">
          Showcase your property to thousands of high-intent buyers and renters actively searching through Locus AI Broker.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard/properties/new"
            className="group inline-flex items-center gap-2 rounded-full bg-[#1e1b17] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-black hover:shadow-lg"
          >
            Create New Listing
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#e5ddd0] bg-white px-6 py-3 text-sm font-medium text-[#1e1b17] transition-all hover:border-[#b8924a] hover:bg-[#b8924a]/5"
          >
            Go to Seller Dashboard
          </Link>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="mt-16 sm:mt-24 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-[#b8924a]/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ece0] text-[#b8924a] mb-4">
            <Sparkles size={20} />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1e1b17]">
            AI Broker Recommendation
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#7a7268] leading-relaxed">
            Your listing is immediately understood by Locus AI and matched to buyers asking for matching budgets, locations, and amenities.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-[#b8924a]/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ece0] text-[#b8924a] mb-4">
            <Building2 size={20} />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1e1b17]">
            Editorial Presentation
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#7a7268] leading-relaxed">
            Present your property with ultra-clean, high-resolution visual cards, comprehensive specs, and location map integration.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-[#b8924a]/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ece0] text-[#b8924a] mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1e1b17]">
            Verified Inquiries
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#7a7268] leading-relaxed">
            Receive messages and direct inquiries straight into your seller portal with full buyer context and contact details.
          </p>
        </div>
      </div>
    </main>
  );
}
