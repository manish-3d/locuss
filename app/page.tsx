import { Suspense } from "react";
import HomepageNavbar from "@/features/home/components/homepage-navbar";
import SearchBar from "@/features/home/components/search-bar";
import HeroSection from "@/features/home/components/hero-section";
import TrustBar from "@/features/home/components/trust-bar";
import FeaturedProperties from "@/features/home/components/featured-properties";

export default function HomePage() {
  return (
    /*
     * Single scroll — the BROWSER is the only scrolling context.
     * No overflow-y-auto, no h-screen, no nested scroll containers anywhere.
     */
    <main className="min-h-screen bg-[#f5f0e8]">

      {/* ── PREMIUM ROUNDED CARD (minimum full screen to push stats strictly below fold) ── */}
      <div className="mx-auto max-w-[1400px] px-3 pt-3 pb-0 md:px-5 md:pt-5">
        <div className="flex flex-col min-h-[calc(100vh-12px)] md:min-h-[calc(100vh-20px)] rounded-[1.75rem] border border-[#e5ddd0] bg-[#faf7f2] shadow-[0_2px_32px_rgba(0,0,0,0.05)] md:rounded-[2.25rem]">
          
          <div>
            {/* 1. NAVBAR — always the topmost element */}
            <HomepageNavbar />

            {/* 2. SEARCH BAR — centered and scaled down */}
            <div className="flex justify-center px-6 pt-4 pb-2 md:px-10 md:pt-5 lg:px-14">
              <div className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
                <Suspense
                  fallback={
                    <div className="h-[48px] w-full animate-pulse rounded-2xl bg-[#ede8df]" />
                  }
                >
                  <SearchBar />
                </Suspense>
              </div>
            </div>
          </div>

          {/* 3. HERO — illustration + headline, vertically centers if screen is very tall */}
          <div className="flex-1 flex flex-col justify-center">
            <HeroSection />
          </div>

        </div>
      </div>

      {/* ── BELOW THE FOLD — visible only after scrolling ── */}

      {/* Trust / Stats */}
      <div className="mx-auto max-w-[1400px] px-3 pt-6 md:px-5 md:pt-8 lg:px-14 lg:pt-10">
        <TrustBar />
      </div>

      {/* Featured Properties */}
      <div className="mx-auto max-w-[1400px] px-3 pt-6 pb-12 md:px-5 md:pt-10 lg:px-14">
        <FeaturedProperties />
      </div>

    </main>
  );
}
