"use client";

import { motion } from "framer-motion";
import { Globe, CircleDot, ArrowUpRight } from "./collabsphere-shared";

export function CollabsphereAbout() {
  const statementWords = "We work with companies that have something worth building and aren't interested in blending in. From emerging startups to established brands entering a new chapter, we help turn ideas into experiences people connect with.".split(" ");

  return (
    <section id="about" className="bg-[var(--collabsphere-bg)] text-[var(--collabsphere-fg)]">
      <div className="collabsphere-shell grid grid-cols-1 lg:grid-cols-2 items-center gap-[3rem] px-[1.25rem] py-[5rem] sm:px-[2rem] lg:py-[7rem]">
        
        {/* Left - Globe block */}
        <div className="relative min-h-[14rem] lg:min-h-[20rem]">
          <Globe className="absolute left-[-1rem] lg:left-[-1.5rem] top-1/2 -translate-y-1/2 text-[var(--collabsphere-fg)]/5 w-[12rem] h-[12rem] sm:w-[16rem] sm:h-[16rem] lg:w-[20rem] lg:h-[20rem] pointer-events-none" />
          
          <div className="relative text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/70 inline-flex items-center gap-[0.5rem] mb-[4rem]">
            <span className="w-[0.375rem] h-[0.375rem] bg-[var(--collabsphere-fg)]/50 rounded-full" />
            The Studio
          </div>

          <motion.div 
            className="absolute bottom-0 left-0 flex items-center gap-[0.75rem] text-[0.875rem] text-[var(--collabsphere-fg)]/70"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            <Globe className="w-[1.5rem] h-[1.5rem] text-[var(--collabsphere-fg)]" />
            <span className="max-w-[14rem]">
              A distributed team building across every time zone.
            </span>
          </motion.div>
        </div>

        {/* Right - Statement */}
        <div className="flex flex-col gap-[2.5rem]">
          <h2 className="text-[1.5rem] sm:text-[1.875rem] font-medium leading-[1.35] tracking-[-0.01em] flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]">
            {statementWords.map((word, i) => (
              <span key={i} className="overflow-hidden">
                <motion.span
                  className={`block ${i > 15 ? 'text-[var(--collabsphere-muted)]' : ''}`}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.165, 0.84, 0.44, 1],
                    delay: i * 0.035
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.div 
            className="flex flex-wrap items-end justify-between gap-[1.5rem] border-t border-[var(--collabsphere-line)] pt-[1.5rem]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.2 }}
          >
            <div>
              <div className="text-[0.875rem] text-[var(--collabsphere-fg)]/45 mb-[0.5rem]">Find us online</div>
              <div className="flex gap-[0.5rem]">
                <motion.a href="#" className="w-[2.25rem] h-[2.25rem] grid place-items-center rounded-full text-[0.875rem] bg-[var(--collabsphere-accent)] text-white" whileHover={{ scale: 1.18 }} transition={{ type: "spring", stiffness: 320, damping: 16 }}>
                  X
                </motion.a>
                <motion.a href="#" className="w-[2.25rem] h-[2.25rem] grid place-items-center rounded-full text-[0.875rem] bg-[var(--collabsphere-surface)] text-[var(--collabsphere-fg)]/70" whileHover={{ scale: 1.18 }} transition={{ type: "spring", stiffness: 320, damping: 16 }}>
                  <CircleDot className="w-[1rem] h-[1rem]" />
                </motion.a>
                <motion.a href="#" className="w-[2.25rem] h-[2.25rem] grid place-items-center rounded-full text-[0.875rem] bg-[var(--collabsphere-surface)] text-[var(--collabsphere-fg)]/70" whileHover={{ scale: 1.18 }} transition={{ type: "spring", stiffness: 320, damping: 16 }}>
                  <CircleDot className="w-[1rem] h-[1rem]" />
                </motion.a>
              </div>
            </div>
            
            <motion.a 
              href="#about"
              className="flex items-center gap-[0.5rem] border border-[var(--collabsphere-line)] rounded-full px-[1.5rem] py-[0.75rem] text-[0.875rem] font-medium hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              About Us
              <ArrowUpRight className="w-[1rem] h-[1rem]" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
