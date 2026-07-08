"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "./collabsphere-shared";

function Services() {
  const rows = [
    { num: "01", title: "Software Development", desc: "Scalable web & mobile products built to last." },
    { num: "02", title: "Product Design", desc: "Interfaces that feel effortless and look sharp." },
    { num: "03", title: "Quality Assurance", desc: "Rigorous testing for flawless, confident releases." },
    { num: "04", title: "Consulting", desc: "Strategy and direction for ambitious teams." }
  ];

  return (
    <section id="services" className="bg-[var(--collabsphere-bg)] text-[var(--collabsphere-fg)]">
      <div className="collabsphere-shell px-[1.25rem] sm:px-[2rem] py-[5rem] lg:py-[7rem]">
        
        <motion.div 
          className="inline-flex items-center gap-[0.5rem] border border-[var(--collabsphere-line)] rounded-full px-[1rem] py-[0.375rem] text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/70"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="w-[0.375rem] h-[0.375rem] bg-[var(--collabsphere-fg)]/50 rounded-full" />
          Services
        </motion.div>

        <h2 className="my-[1.25rem] mb-[3rem] sm:mb-[3.5rem] max-w-[16ch] text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.02em]">
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.12 }}
            >
              What we do best
            </motion.span>
          </span>
        </h2>

        <ul>
          {rows.map((row, i) => (
            <motion.li
              key={i}
              className={`border-t border-[var(--collabsphere-line)] ${i === 0 ? 'border-t-0' : ''}`}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 200, damping: 24, delay: i * 0.08 }}
            >
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('open-collabsphere-modal'));
                }}
                className="group flex items-center gap-[1rem] sm:gap-[1.5rem] rounded-[1.25rem] py-[1.5rem] sm:py-[2rem] cursor-pointer"
                initial={{ backgroundColor: "rgba(255,255,255,0)", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                whileHover={{ backgroundColor: "var(--collabsphere-surface)", paddingLeft: "2rem", paddingRight: "1.25rem" }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
              >
                <span className="w-[1.75rem] sm:w-[2.5rem] text-[0.875rem] font-medium text-[var(--collabsphere-fg)]/40">
                  {row.num}
                </span>
                
                <h3 className="flex-1 text-[1.5rem] sm:text-[1.875rem] md:text-[2.25rem] font-medium tracking-[-0.01em]">
                  {row.title}
                </h3>
                
                <p className="hidden lg:block max-w-[20rem] text-[0.875rem] text-[var(--collabsphere-fg)]/55">
                  {row.desc}
                </p>

                <motion.div 
                  className="w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem] grid place-items-center rounded-full bg-[var(--collabsphere-ink)] text-white"
                  variants={{
                    hover: { x: 5 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <ArrowUpRight className="w-[1.25rem] h-[1.25rem]" />
                </motion.div>
              </motion.a>
            </motion.li>
          ))}
        </ul>

      </div>
    </section>
  );
}

function StatItem({ value, suffix, label, delay }: { value: number, suffix: string, label: string, delay: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["top bottom", "center center"]
  });

  // raw progress 0 to 1
  const animatedProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    return animatedProgress.onChange((v) => {
      setDisplayValue(Math.round(v * value));
    });
  }, [animatedProgress, value]);

  return (
    <motion.li
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 200, damping: 24, delay }}
    >
      <div className="text-[3rem] sm:text-[3.75rem] md:text-[4.5rem] font-semibold tracking-[-0.02em] text-white">
        {displayValue}{suffix}
      </div>
      <div className="mt-[0.75rem] text-[0.875rem] text-white/55">
        {label}
      </div>
    </motion.li>
  );
}

function Stats() {
  const statsList = [
    { value: 150, suffix: "+", label: "Projects delivered" },
    { value: 98, suffix: "%", label: "Client retention" },
    { value: 12, suffix: "", label: "Years of craft" },
    { value: 40, suffix: "+", label: "Team members" },
  ];

  return (
    <section className="bg-[var(--collabsphere-bg)]">
      <div className="collabsphere-shell px-[1.25rem] sm:px-[2rem] pb-[5rem] lg:pb-[7rem]">
        
        <motion.div 
          className="rounded-[2rem] bg-[var(--collabsphere-ink)] p-[3rem] px-[1.5rem] sm:p-[4rem] sm:px-[2rem] md:px-[4rem] text-white"
          initial={{ y: 40, scale: 0.99, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
        >
          <div className="inline-flex items-center gap-[0.5rem] border border-white/20 rounded-full px-[1rem] py-[0.375rem] text-[0.875rem] font-medium text-white/70">
            <span className="w-[0.375rem] h-[0.375rem] bg-white/60 rounded-full" />
            By the numbers
          </div>

          <h2 className="mt-[1rem] max-w-[20ch] text-[1.875rem] md:text-[2.25rem] font-medium tracking-[-0.01em]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.12 }}
              >
                Proof in the work, not the words.
              </motion.span>
            </span>
          </h2>

          <ul className="mt-[3.5rem] grid grid-cols-2 lg:grid-cols-4 gap-x-[2rem] gap-y-[3rem]">
            {statsList.map((st, i) => (
              <StatItem key={i} {...st} delay={i * 0.09} />
            ))}
          </ul>
        </motion.div>

      </div>
    </section>
  );
}

export function CollabsphereServicesAndStats() {
  return (
    <>
      <Services />
      <Stats />
    </>
  );
}
