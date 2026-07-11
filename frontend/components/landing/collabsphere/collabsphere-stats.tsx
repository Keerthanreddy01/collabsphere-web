"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "./collabsphere-shared";

export function CollabsphereStats() {
  const stats = [
    { value: "24", label: "Specialized experts" },
    { value: "12", label: "Core technologies" },
    { value: "9K+", label: "Successful deploys" },
    { value: "15", label: "Years of experience" }
  ];

  return (
    <section className="bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-[0.75rem] px-[1.5rem] py-[5rem] sm:px-[2.5rem] relative z-20">
      
      {/* Header */}
      <Eyebrow text="By the numbers" tone="light" />
      <motion.h2 
        className="mt-[1rem] text-[3rem] font-medium leading-[0.95] tracking-tight"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <span className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "115%", opacity: 0 },
              visible: { y: "0%", opacity: 1 }
            }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            A team that
          </motion.span>
        </span>
        <span className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "115%", opacity: 0 },
              visible: { y: "0%", opacity: 1 }
            }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          >
            keeps score
          </motion.span>
        </span>
      </motion.h2>

      {/* Grid */}
      <dl className="mt-[4rem] grid grid-cols-2 lg:grid-cols-4 gap-x-[2rem] gap-y-[3rem]">
        {stats.map((st, i) => (
          <motion.div
            key={i}
            className="border-t border-white/20 pt-[1.25rem]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 180, damping: 24, delay: i * 0.11 }}
          >
            <dd className="text-[3.75rem] sm:text-[4.5rem] font-medium tracking-tight leading-none">
              {st.value}
            </dd>
            <dt className="sr-only">{st.label}</dt>
            <div className="mt-[0.75rem] text-[0.875rem] text-white/65">
              {st.label}
            </div>
          </motion.div>
        ))}
      </dl>

    </section>
  );
}
