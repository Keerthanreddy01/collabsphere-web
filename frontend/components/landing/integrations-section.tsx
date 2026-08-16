"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax for the background
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="integrations" ref={sectionRef} className="relative overflow-hidden bg-black text-white border-b-0">
      
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
      
      {/* Bottom Seamless Fade into #0A0A0A (the 3-panel section background) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#0A0A0A]/90 to-[#0A0A0A] z-20 pointer-events-none" />

      {/* Header Content Container — Controlled Spacing */}
      <div className="relative z-30 min-h-[70vh] lg:min-h-[75vh] flex flex-col items-center justify-center py-20 sm:py-24 lg:py-28 text-center px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center max-w-3xl mx-auto relative z-20"
        >
          {/* Eyebrow Label */}
          <span className="inline-flex items-center gap-4 text-xs sm:text-sm font-mono text-white/60 mb-6 justify-center uppercase tracking-widest font-semibold">
            <span className="w-10 h-px bg-white/20" />
            Integrations
            <span className="w-10 h-px bg-white/20" />
          </span>

          {/* Primary Headline with Text Backdrop Glow for Maximum Legibility */}
          <div className="relative my-2">
            <div className="absolute -inset-8 bg-black/60 blur-3xl rounded-full pointer-events-none -z-10" />
            <h2 className="text-5xl sm:text-7xl lg:text-[110px] font-display font-extrabold tracking-[-0.03em] leading-[0.9] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
              Connect<br />
              <span className="text-white/70">everything.</span>
            </h2>
          </div>

          {/* Description Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-white/80 leading-relaxed max-w-xl mx-auto font-normal drop-shadow-md">
            Connect with elite builders across every stack.
            From Rust protocols to React frontends, your team is here.
          </p>
        </motion.div>
      </div>

      {/* Full-screen background image with controlled opacity to avoid competing with text */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center overflow-hidden"
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, margin: "-20%" }}
        style={{ y }}
      >
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover mix-blend-luminosity opacity-35 filter brightness-75 contrast-110"
        />
        {/* Dark Scrim Overlay & Text Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#0A0A0A_95%)] pointer-events-none opacity-85" />
      </motion.div>

    </section>
  );
}
