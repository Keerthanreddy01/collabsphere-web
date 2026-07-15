"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax for the background
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="integrations" ref={sectionRef} className="relative overflow-hidden bg-black">
      
      {/* Top and Bottom Fades to prevent hard cutting */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* Header — centered vertically */}
      <div className="relative z-30 min-h-[100vh] flex flex-col items-center justify-center py-32 text-center px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-4 text-sm font-mono text-white/50 mb-8 justify-center">
            <span className="w-12 h-px bg-white/20" />
            Integrations
            <span className="w-12 h-px bg-white/20" />
          </span>

          <h2 className="text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] text-white">
            Connect
            <br />
            <span className="text-white/60">everything.</span>
          </h2>

          <p className="mt-8 text-xl text-white/60 leading-relaxed max-w-lg mx-auto">
            Connect with elite builders across every stack.
            From Rust protocols to React frontends, your team is here.
          </p>
        </motion.div>
      </div>

      {/* Full-screen background image with smooth Parallax and Fade */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        initial={{ opacity: 0, scale: 1.15 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-20%" }}
        style={{ y }}
      >
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover mix-blend-luminosity opacity-70"
        />
        {/* Dynamic Vignette & Text Contrast Gradients */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_#000_100%)] pointer-events-none opacity-80" />
      </motion.div>

    </section>
  );
}
