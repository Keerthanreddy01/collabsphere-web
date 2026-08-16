"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function WiseEarthSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const textY = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const earthY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const coin1Y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const coin2Y = useTransform(scrollYProgress, [0, 1], [350, -350]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#ffffff] py-24 sm:py-32" 
      style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
    >
      {/* Inline styles for the Wise tokens to not pollute global CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .wise-section {
          --color-forest-ink: #163300;
          --color-lime-voltage: #9fe870;
          --color-charcoal: #454745;
          --color-obsidian: #0e0f0c;
          --color-pebble: #868685;
          --color-paper: #ffffff;
        }
        .font-wise-sans {
          font-family: 'Inter', sans-serif; /* fallback to Inter since Wise Sans isn't available */
          font-weight: 900;
          letter-spacing: -0.03em;
        }
      `}} />

      <div className="wise-section mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center">
        {/* Massive Headline with Parallax */}
        <motion.div style={{ y: textY }} className="z-10 flex flex-col items-center">
          <h1 className="font-wise-sans text-[clamp(48px,8vw,105px)] leading-[0.9] text-[#0e0f0c] uppercase tracking-tighter max-w-[900px] mx-auto">
            Collaborate here,<br className="hidden sm:block" />
            there and everywhere
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-[600px] text-[18px] leading-[1.5] text-[#454745] font-medium px-4">
            Connect with top builders, engineers, and designers worldwide. The platform built to scale your vision across the globe.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <button className="rounded-full bg-[#9fe870] px-8 py-[14px] text-[16px] font-bold text-[#163300] transition-transform hover:scale-105 active:scale-95 shadow-sm">
              Start Building
            </button>
            <button className="text-[16px] font-bold text-[#163300] underline underline-offset-4 transition-opacity hover:opacity-70">
              Explore the platform
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
