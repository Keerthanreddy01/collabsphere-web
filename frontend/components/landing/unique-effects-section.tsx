"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface UniqueEffectsSectionProps {
  panelImage?: string; // Image URL provided by user to fill the left panel
}

export function UniqueEffectsSection({
  panelImage
}: UniqueEffectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="mobile-app"
      className="relative pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-36 bg-[#0A0A0A] text-white overflow-hidden font-sans"
    >
      <div className="relative z-10 max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3-PANEL ASYMMETRIC GRID */}
        <div className="grid lg:grid-cols-12 gap-3.5 items-stretch">

          {/* ======================================================== */}
          {/* PANEL 1: LEFT (ORANGE-RED BACKGROUND #E84738) */}
          {/* ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-[#E84738] rounded-3xl lg:rounded-r-none overflow-hidden relative min-h-[520px] lg:min-h-[640px] shadow-2xl flex items-center justify-center"
          >
            {panelImage ? (
              <img
                src={panelImage}
                alt="Squibl Showcase"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white/80 font-mono text-sm border-2 border-dashed border-white/30 rounded-2xl m-4 bg-black/10 backdrop-blur-sm select-none">
                <span className="font-extrabold text-white text-base tracking-wider uppercase mb-1">
                  [YOUR FULL IMAGE HERE]
                </span>
                <span className="text-xs text-white/70 max-w-xs leading-relaxed">
                  The phone mockup has been removed. Pass your image URL to fill this entire left panel.
                </span>
              </div>
            )}
          </motion.div>


          {/* ======================================================== */}
          {/* RIGHT SIDE CONTAINER (STACKED PANELS 2 & 3) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">

            {/* ------------------------------------------------------ */}
            {/* PANEL 2: TOP RIGHT (LIGHT BLUE BACKGROUND #9BC3E6) */}
            {/* ------------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-[#9BC3E6] rounded-3xl lg:rounded-l-none p-8 sm:p-14 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[380px] sm:min-h-[420px] shadow-xl"
            >
              {/* Top Logo Lockup */}
              <div className="flex items-center gap-2 text-white z-10 mb-auto">
                <img src="/newlogo.png" alt="Squibl Official Logo" className="w-7 h-7 rounded-full object-cover shadow-sm border border-white/30" />
                <span className="font-extrabold tracking-tight text-lg text-white uppercase font-sans">SQUIBL</span>
              </div>

              {/* CENTERED EDITORIAL HEADLINE */}
              <div className="relative my-auto w-full max-w-xl flex flex-col items-center justify-center z-10">
                <h3 className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-[-0.035em] text-white uppercase leading-[0.91] relative z-10">
                  YOUR WORK.<br />
                  EVERYWHERE.
                </h3>
              </div>

              <div className="mt-auto" />
            </motion.div>


            {/* ------------------------------------------------------ */}
            {/* PANEL 3: BOTTOM RIGHT (NEAR-BLACK BACKGROUND #181818) */}
            {/* ------------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-[#181818] rounded-3xl lg:rounded-l-none p-7 sm:p-11 flex flex-col justify-between text-white relative overflow-hidden min-h-[270px] shadow-xl border border-white/5"
            >
              {/* Top Row: URL / Social Handle Left & Tagline Right */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-xl sm:text-2xl tracking-[-0.02em] uppercase text-white">
                    SQUIBL.COM
                  </h4>
                  <p className="text-[10px] text-white/50 font-mono tracking-[0.1em] uppercase mt-0.5">
                    @SQUIBL
                  </p>
                </div>

                {/* Right Tagline */}
                <div className="text-right font-mono text-[10px] tracking-[0.08em] text-white/60 uppercase leading-tight">
                  <span className="block font-bold text-[#E84738]">IOS & ANDROID</span>
                  <span className="text-white/40 block mt-0.5">
                    REALTIME SYNC<br />VERSION 2.4.0
                  </span>
                </div>
              </div>

              {/* Bottom CTA Row: Headline + Arrow Line + Official Logo Button */}
              <div className="flex items-end justify-between gap-4 pt-8">
                <h3 className="font-extrabold text-2xl sm:text-4xl uppercase leading-[0.96] tracking-[-0.03em] text-white">
                  DOWNLOAD APP FOR<br />
                  THE BEST EXPERIENCE
                </h3>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Arrow Line */}
                  <div className="hidden sm:flex items-center gap-2 text-white/40">
                    <span className="w-12 sm:w-16 h-px bg-white/40" />
                    <ArrowRight className="w-4 h-4 text-white/60" />
                  </div>

                  {/* OFFICIAL LOGO BUTTON */}
                  <a
                    href="#download"
                    className="w-14 h-14 p-2 rounded-2xl bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border border-white/20"
                    title="Squibl Official Logo"
                  >
                    <img src="/newlogo.png" alt="Squibl Logo" className="w-full h-full rounded-xl object-cover" />
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
