"use client";

import { motion } from "framer-motion";
import HeroIllustration from "./hero-illustration";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

/**
 * HeroSection — illustration on the left, editorial headline on the right.
 * This component contains NO search bar and NO stats.
 * Search lives above this (in page.tsx), stats live below (TrustBar).
 */
export default function HeroSection() {
  return (
    <section className="px-6 pt-2 pb-8 md:px-10 md:pt-3 md:pb-10 lg:px-14">
      {/*
       * Two-column grid on desktop.
       * On mobile: illustration first (order-1), then text (order-2).
       */}
      <div className="grid items-center gap-6 md:grid-cols-[1fr_1fr] md:gap-8 lg:gap-10">

        {/* LEFT — Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-[480px]">
            <HeroIllustration />
          </div>
        </motion.div>

        {/* RIGHT — Editorial text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ddd5c5] bg-white/70 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a8f7e]">
              <span className="text-[#b8924a]">✦</span>
              AI Powered Real Estate
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-5 font-serif text-[2.6rem] font-bold leading-[1.07] tracking-[-0.01em] text-[#1e1b17] sm:text-5xl md:text-[3.2rem] lg:text-[3.8rem] xl:text-[4.2rem]"
          >
            Find Your
            <br />
            Perfect Home
            <br />
            <span className="text-[#b8924a]">with AI</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-sm text-[0.95rem] leading-[1.75] text-[#7a7268] md:text-base"
          >
            Buy, rent, and sell properties smarter with an AI assistant that
            understands every listing and helps you find your dream home faster.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
