"use client";

import { motion } from "framer-motion";
import { Eyebrow, ArrowSVG } from "./collabsphere-shared";

export function CollabspherePrograms() {
  const programs = [
    { num: "01", name: "Product Design", desc: "Crafting interfaces that are effortless to use and visually sharp.", id: "design" },
    { num: "02", name: "Engineering", desc: "Building scalable web and mobile products on modern stacks.", id: "engineering" },
    { num: "03", name: "QA & Testing", desc: "Rigorous automated and manual testing for flawless releases.", id: "qa" },
    { num: "04", name: "Consulting", desc: "Technical strategy and direction for ambitious teams.", id: "consulting" }
  ];

  return (
    <section id="programs" className="bg-[var(--surface)] px-[1.5rem] py-[6rem] sm:px-[2.5rem]">
      
      {/* Header */}
      <div>
        <Eyebrow text="Our Services" tone="dark" />
        <h2 className="mt-[1rem] text-[3rem] font-medium leading-[0.95] tracking-tight text-[var(--ink)]">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              className="block"
              initial={{ y: "115%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            >
              Built for
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              className="block"
              initial={{ y: "115%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            >
              scale
            </motion.span>
          </span>
        </h2>
      </div>

      {/* Rows */}
      <ul className="mt-[3.5rem]">
        {programs.map((prog, i) => (
          <motion.li
            key={i}
            className={`border-t border-[var(--hairline)] ${i === programs.length - 1 ? 'border-b' : ''}`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 190, damping: 26, delay: i * 0.09 }}
          >
            <a 
              href={`#${prog.id}`} 
              className="group flex flex-col sm:flex-row sm:items-center gap-[1.5rem] py-[1.75rem] focus-visible:bg-[var(--background)] transition-colors"
            >
              <div className="w-[2.5rem] text-[0.875rem] font-medium text-[var(--ink-soft)]">
                {prog.num}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-[0.5rem] sm:gap-[1.5rem]">
                <h3 className="text-[1.5rem] sm:text-[1.875rem] font-medium tracking-tight text-[var(--ink)] min-w-[12rem]">
                  {prog.name}
                </h3>
                <p className="text-[0.875rem] text-[var(--ink-soft)] flex-1">
                  {prog.desc}
                </p>
              </div>
              <div className="hidden sm:flex w-[2.75rem] h-[2.75rem] rounded-[var(--radius-pill)] border border-[var(--hairline)] items-center justify-center">
                <motion.div
                  initial={{ x: 0, opacity: 0.55 }}
                  variants={{ hover: { x: 8, opacity: 1 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-[var(--ink)]"
                >
                  <ArrowSVG className="w-[1rem] h-[1rem]" />
                </motion.div>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
      
    </section>
  );
}
