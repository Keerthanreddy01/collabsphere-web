"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, LogoMark } from "./collabsphere-shared";

function CreateBand() {
  const pills = [
    { text: "Find", className: "bg-[var(--collabsphere-surface)] text-[var(--collabsphere-fg)]" },
    { text: "Builders", className: "bg-gradient-to-br from-[var(--collabsphere-accent-from)] to-[var(--collabsphere-accent-to)] text-white" },
    { icon: true, className: "bg-[var(--collabsphere-ink)] text-white" },
    { text: "Faster", className: "bg-white/5 text-[var(--collabsphere-fg)]/40" }
  ];

  return (
    <section className="bg-[var(--collabsphere-bg)]">
      <ul className="collabsphere-shell flex flex-col sm:flex-row gap-[0.75rem] sm:gap-[1rem] px-[1.25rem] sm:px-[2rem] py-[2.5rem]">
        {pills.map((pill, i) => (
          <motion.li 
            key={i} 
            className="flex-1"
            initial={{ y: 28, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.12 }}
          >
            <motion.div 
              className={`grid place-items-center h-[6rem] sm:h-[10rem] rounded-full text-[1.875rem] sm:text-[2.25rem] font-medium cursor-default ${pill.className}`}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {pill.icon ? <ArrowRight className="w-[2.25rem] h-[2.25rem] sm:w-[3rem] sm:h-[3rem]" /> : pill.text}
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function Portfolio() {
  const works = [
    { name: "Orbit", category: "Social Platform", year: "2024", desc: "A robust community platform that brings builders and dreamers together in real-time.", tags: ["Product Design", "Web App", "Engineering"] },
    { name: "DashQ", category: "Data Dashboard", year: "2023", desc: "Complex analytics turned into actionable, beautiful, and intuitive interfaces.", tags: ["UI/UX", "Data Viz"] },
    { name: "Elevate", category: "Identity", year: "2023", desc: "A fresh identity that drives momentum for emerging tech startups.", tags: ["Branding", "Art Direction"] },
    { name: "Aura", category: "Mobile App", year: "2022", desc: "A wellness app grounded in research, shipped end to end from concept to release.", tags: ["Mobile", "UX Research", "Development"] }
  ];

  return (
    <section id="works" className="bg-[var(--collabsphere-bg)] text-[var(--collabsphere-fg)]">
      <div className="collabsphere-shell px-[1.25rem] sm:px-[2rem] py-[2.5rem] pb-[5rem] lg:pb-[7rem]">
        
        <div className="flex justify-center">
          <motion.div 
            className="inline-flex items-center gap-[0.5rem] border border-[var(--collabsphere-line)] rounded-full px-[1rem] py-[0.375rem] text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/70"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="w-[0.375rem] h-[0.375rem] bg-[var(--collabsphere-fg)]/50 rounded-full" />
            Portfolio
          </motion.div>
        </div>

        <h2 className="mx-auto mt-[1.25rem] mb-[3rem] max-w-[16ch] text-center text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.02em]">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.12 }}
            >
              Selected Work
            </motion.span>
          </span>
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
          {works.map((work, i) => (
            <motion.li
              key={i}
              initial={{ y: 48, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 180, damping: 26, delay: i * 0.09 }}
            >
              <motion.article
                className="group relative flex flex-col min-h-[22rem] sm:min-h-[26rem] overflow-hidden rounded-[2rem] bg-[var(--collabsphere-ink)] p-[1.5rem] sm:p-[2rem] ring-1 ring-white/5 shadow-2xl cursor-pointer"
                whileHover={{ y: -8, scale: 1.012 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                
                {/* Meta row */}
                <div className="flex justify-between items-start text-[0.75rem] uppercase tracking-[0.025em] text-white/45 relative z-10">
                  <span>{work.category} — {work.year}</span>
                  <motion.div 
                    className="w-[2.75rem] h-[2.75rem] grid place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15"
                    variants={{
                      hover: { rotate: 45, scale: 1.08 }
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    <ArrowUpRight className="w-[1.25rem] h-[1.25rem]" />
                  </motion.div>
                </div>

                {/* Watermark Logo */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none text-white/5">
                  <div className="relative">
                    <LogoMark className="w-[12rem] h-[12rem]" />
                    <span className="absolute top-0 -right-[1rem] text-[0.75rem] text-white/20">®</span>
                  </div>
                </div>

                {/* Bottom block */}
                <div className="mt-auto relative z-10">
                  <h3 className="text-[1.5rem] sm:text-[1.875rem] font-medium tracking-[-0.01em] text-white">
                    {work.name}
                  </h3>
                  <p className="mt-[0.5rem] max-w-[28rem] text-[0.875rem] text-white/55">
                    {work.desc}
                  </p>
                  <div className="mt-[1.25rem] flex flex-wrap gap-[0.5rem]">
                    {work.tags.map(tag => (
                      <span key={tag} className="inline-flex border border-white/25 rounded-full px-[1rem] py-[0.5rem] text-[0.875rem] text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.article>
            </motion.li>
          ))}
        </ul>

      </div>
    </section>
  );
}

export function CollabsphereBandsAndPortfolio() {
  return (
    <>
      <CreateBand />
      <Portfolio />
    </>
  );
}
