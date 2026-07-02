"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ROW_1 = [
  { label: "TypeScript", color: "#3178c6" },
  { label: "Rust", color: "#f74c00" },
  { label: "Next.js", color: "#ffffff" },
  { label: "Go", color: "#00acd7" },
  { label: "Solidity", color: "#a78bfa" },
  { label: "Python", color: "#ffd43b" },
  { label: "Docker", color: "#2496ed" },
  { label: "GraphQL", color: "#e535ab" },
  { label: "Figma", color: "#f24e1e" },
  { label: "Supabase", color: "#3ecf8e" },
  { label: "Swift", color: "#f05138" },
  { label: "Kotlin", color: "#7f52ff" },
];

const ROW_2 = [
  { label: "AI/ML Engineers", color: "#D4FF26" },
  { label: "Indie Hackers", color: "#ffffff" },
  { label: "Startup Founders", color: "#f59e0b" },
  { label: "Open Source Devs", color: "#34d399" },
  { label: "System Architects", color: "#818cf8" },
  { label: "Full Stack Devs", color: "#fb923c" },
  { label: "Security Experts", color: "#f43f5e" },
  { label: "Blockchain Devs", color: "#a78bfa" },
  { label: "Mobile Engineers", color: "#22d3ee" },
  { label: "Product Designers", color: "#D4FF26" },
  { label: "DevOps Engineers", color: "#60a5fa" },
  { label: "Solo Builders", color: "#ffffff" },
];

function MarqueeTag({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <motion.span
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] text-white/60 text-sm font-mono tracking-wide whitespace-nowrap cursor-default shrink-0"
      whileHover={{
        backgroundColor: `${color}10`,
        borderColor: `${color}40`,
        color: "#fff",
        scale: 1.04,
      }}
      transition={{ duration: 0.2 }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </motion.span>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  speed = 35,
}: {
  items: typeof ROW_1;
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <motion.div
        className="flex gap-3 pr-3"
        animate={{
          x: reverse ? ["0%", "50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {doubled.map((item, i) => (
          <MarqueeTag key={i} label={item.label} color={item.color} />
        ))}
      </motion.div>
    </div>
  );
}

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0.1, 0.4], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[#030303] overflow-hidden">

      {/* Faint horizontal line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 lg:mb-20 will-change-transform"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase mb-4">
                <span className="w-8 h-px bg-white/20" />
                The Community
              </span>
              <h2 className="font-display text-[clamp(2rem,5vw,5rem)] text-white leading-[0.9] tracking-tight">
                Every stack.
                <br />
                <span className="text-white/30">Every builder.</span>
              </h2>
            </div>
            <p className="text-white/40 text-base leading-relaxed max-w-sm lg:text-right">
              From Rust systems engineers to AI/ML researchers to indie founders. If you build things, you belong here.
            </p>
          </div>
        </motion.div>

        {/* Marquee rows */}
        <div className="flex flex-col gap-3">
          <MarqueeRow items={ROW_1} reverse={false} speed={40} />
          <MarqueeRow items={ROW_2} reverse={true} speed={30} />
        </div>

        {/* Center call-to-action overlay */}
        <motion.div
          className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: "Grow your community" */}
            <div className="relative group cursor-pointer bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-8 lg:p-10 overflow-hidden flex flex-col justify-between min-h-[200px]">
              <motion.div
                className="absolute inset-0 bg-[#D4FF26]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-[11px] font-mono text-white/20 tracking-widest uppercase">
                For Builders
              </span>
              <div>
                <h3 className="font-display text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3">
                  Grow your
                  <br />community
                </h3>
                <span className="text-[#D4FF26] text-sm font-mono group-hover:gap-3 flex items-center gap-2 transition-all duration-300">
                  Explore builders <span>→</span>
                </span>
              </div>

              {/* Animated corner glow */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D4FF26]/[0.04] rounded-tl-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Right: "Own the future" */}
            <div className="relative group cursor-pointer bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-8 lg:p-10 overflow-hidden flex flex-col justify-between min-h-[200px]">
              <motion.div
                className="absolute inset-0 bg-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-[11px] font-mono text-white/20 tracking-widest uppercase">
                For Founders
              </span>
              <div>
                <h3 className="font-display text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3">
                  Own the
                  <br />future
                </h3>
                <span className="text-purple-400 text-sm font-mono flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Find co-founders <span>→</span>
                </span>
              </div>

              {/* Animated corner glow */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/[0.04] rounded-tl-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
