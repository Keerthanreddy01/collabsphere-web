"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollabsphere } from "./collabsphere-context";
import { LiquidReveal } from "./liquid-reveal";
import { Star, CircleDot, ArrowRight, scrollToId } from "./collabsphere-shared";

export function CollabsphereHero() {
  const { ready } = useCollabsphere();
  const [activeItem, setActiveItem] = useState(0);
  
  const items = [
    { caption: "Conversion design", title: "Crafted to convert." },
    { caption: "Engineering", title: "Built to scale." },
    { caption: "Brand systems", title: "Designed to last." },
  ];

  const handleNext = () => setActiveItem((p) => (p + 1) % items.length);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveItem((p) => (p - 1 + items.length) % items.length);
  };

  const lines = [
    "Helping builders",
    "find their team",
    "and ship products."
  ];

  const partners = ["Kaido", "Northpeak", "Vellum", "Orbit", "Brightline", "Cobalt", "Mesa"];

  return (
    <section id="home" className="relative isolate overflow-hidden rounded-b-[2rem] bg-[var(--collabsphere-hero-to)] min-h-[100lvh] flex flex-col pt-[7rem] md:pt-[9rem]">
      
      {/* Background Liquid Reveal */}
      <LiquidReveal 
        beforeSrc="https://api.getlayers.ai/storage/v1/object/public/public/assets/collabsphere-e8b711fc68/hero/after.jpg" 
        afterSrc="https://api.getlayers.ai/storage/v1/object/public/public/assets/collabsphere-e8b711fc68/hero/before.jpg" 
      />

      {/* Legibility Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[var(--collabsphere-bg)]/60 via-transparent to-[var(--collabsphere-bg)]/80" />

      {/* Watermark */}
      <motion.div 
        className="pointer-events-none absolute left-0 right-0 bottom-[7rem] z-[1] text-center font-bold leading-none text-[13rem] text-[var(--collabsphere-fg)]/10 select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 120, damping: 30, delay: 0.3 }}
      >
        COLLABSPHERE
      </motion.div>

      {/* Content Grid */}
      <div className="collabsphere-shell relative z-20 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-[2.5rem] px-[1.25rem] sm:px-[2rem] pb-[7rem]">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-[1.75rem]">
          
          <motion.div 
            className="text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/70 inline-flex items-center gap-[0.5rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-[0.375rem] h-[0.375rem] bg-[var(--collabsphere-fg)]/50 rounded-full" />
            Creative Platform
          </motion.div>

          <h1 className="max-w-[18ch] text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-semibold leading-[0.98] tracking-[-0.02em] text-[var(--collabsphere-fg)]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={ready ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.215, 0.61, 0.355, 1],
                    delay: 0.25 + (i * 0.12)
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div 
            className="flex items-center gap-[0.75rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.65 }}
          >
            <span className="text-[var(--collabsphere-accent)] flex gap-[0.125rem]">
              {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-[1rem] h-[1rem]" />)}
            </span>
            <span className="text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/70">
              Trusted by 10,000+ builders
            </span>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-[0.75rem] mt-[0.5rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.75 }}
          >
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-collabsphere-modal'))}
              className="group flex items-center gap-[0.75rem] bg-[var(--collabsphere-fg)] text-[var(--collabsphere-bg)] rounded-full py-[0.375rem] pl-[1.5rem] pr-[0.375rem] text-[0.875rem] font-medium"
            >
              Let's Talk
              <div className="w-[2.25rem] h-[2.25rem] bg-[var(--collabsphere-bg)] text-[var(--collabsphere-fg)] rounded-full flex items-center justify-center group-hover:bg-[var(--collabsphere-accent)] transition-colors">
                <ArrowRight className="w-[1rem] h-[1rem] transition-transform group-hover:translate-x-[3px]" />
              </div>
            </button>
            <button 
              onClick={() => scrollToId('works')}
              className="flex items-center px-[1.75rem] py-[0.875rem] border border-[var(--collabsphere-line)] rounded-full text-[0.875rem] font-medium text-[var(--collabsphere-fg)] hover:bg-white/5 transition-colors"
            >
              View Work
            </button>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-[2rem]">
          
          <motion.div 
            className="w-full max-w-[24rem] lg:max-w-[19rem] rounded-[1.25rem] bg-white/5 p-[0.5rem] shadow-sm ring-1 ring-[var(--collabsphere-line)] backdrop-blur-[12px]"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.4 }}
          >
            <div onClick={handleNext} className="flex gap-[0.5rem] cursor-pointer rounded-[0.875rem]">
              <div className="aspect-square w-[6rem] grid place-items-center rounded-[0.875rem] bg-[#0a0a0a] text-white">
                <span className="text-[var(--collabsphere-accent)] text-[1.875rem] font-serif italic">C</span>
              </div>
              <div className="flex-1 rounded-[0.875rem] bg-[var(--collabsphere-surface)] p-[0.75rem] flex flex-col justify-between">
                <div className="relative min-h-[3.25rem] overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeItem}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="absolute inset-0"
                    >
                      <div className="text-[0.65rem] font-medium uppercase tracking-[0.05em] text-[var(--collabsphere-fg)]/45">
                        {items[activeItem].caption}
                      </div>
                      <div className="max-w-[8rem] text-[0.875rem] font-medium leading-[1.35] text-[var(--collabsphere-fg)] mt-1">
                        {items[activeItem].title}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-[0.25rem]">
                    {items.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-[0.25rem] rounded-full transition-all duration-300 ${i === activeItem ? 'w-[1rem] bg-[var(--collabsphere-fg)]' : 'w-[0.375rem] bg-[var(--collabsphere-fg)]/20'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handlePrev} className="w-[1.75rem] h-[1.75rem] rounded-full bg-[var(--collabsphere-fg)] text-[var(--collabsphere-bg)] grid place-items-center hover:scale-105 transition-transform">
                      <ArrowRight className="w-3 h-3 rotate-180" />
                    </button>
                    <button className="w-[1.75rem] h-[1.75rem] rounded-full bg-[var(--collabsphere-fg)] text-[var(--collabsphere-bg)] grid place-items-center hover:scale-105 transition-transform">
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="w-full max-w-[24rem] lg:max-w-[19rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.55 }}
          >
            <div className="mb-[0.75rem] text-[0.75rem] font-medium text-[var(--collabsphere-fg)]/45 text-left lg:text-right">
              Trusted by
            </div>
            <div className="grid grid-cols-4 gap-x-[1rem] gap-y-[0.75rem]">
              {partners.map(p => (
                <motion.div 
                  key={p} 
                  className="flex items-center gap-[0.375rem] text-[0.75rem] text-[var(--collabsphere-fg)]/70 opacity-70 cursor-default"
                  whileHover={{ y: -2, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                >
                  <CircleDot className="w-[0.875rem] h-[0.875rem] text-[var(--collabsphere-fg)]/40" />
                  {p}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 collabsphere-shell flex items-center justify-between gap-[0.75rem] border-t border-[var(--collabsphere-line)] p-[1.25rem] sm:px-[2rem] text-[0.75rem] font-medium uppercase tracking-[0.025em] text-[var(--collabsphere-fg)]/60 z-20"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div>Working since 2024</div>
        <div className="hidden sm:block">Remote-first, worldwide</div>
        <div className="inline-flex items-center gap-[0.5rem]">
          Scroll to explore <span className="text-[var(--collabsphere-fg)]">↓</span>
        </div>
      </motion.div>

    </section>
  );
}
