"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PROBLEMS = [
  { text: "Ideas die alone.", size: "text-[clamp(2rem,6vw,7rem)]", delay: 0 },
  { text: "Teams collapse.", size: "text-[clamp(1.8rem,5vw,6rem)]", delay: 0.05 },
  { text: "Founders quit.", size: "text-[clamp(1.6rem,4.5vw,5.5rem)]", delay: 0.1 },
  { text: "Projects stop.", size: "text-[clamp(1.4rem,4vw,5rem)]", delay: 0.15 },
  { text: "Co-founders vanish.", size: "text-[clamp(1.3rem,3.5vw,4.5rem)]", delay: 0.2 },
];

function ProblemLine({ text, size, index }: { text: string; size: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="overflow-hidden"
    >
      <span
        className={`block font-display leading-[0.9] tracking-tight text-white/25 ${size} hover:text-white/40 transition-colors duration-500 cursor-default`}
        style={{ fontStyle: "italic" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const revealOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.3, 0.55], [60, 0]);
  const revealScale = useTransform(scrollYProgress, [0.3, 0.55], [0.9, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-[#030303] flex flex-col justify-center py-32 overflow-hidden"
    >
      {/* Subtle horizontal lines across screen */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-white/[0.03]"
            style={{ top: `${15 + i * 14}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-16 lg:mb-20"
        >
          <span className="w-8 h-px bg-white/20" />
          <span className="text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase">
            The Problem
          </span>
        </motion.div>

        {/* Two column: problems left, solution right */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Problem statements */}
          <div className="flex flex-col gap-3 lg:gap-5">
            {PROBLEMS.map((p, i) => (
              <ProblemLine key={i} text={p.text} size={p.size} index={i} />
            ))}
          </div>

          {/* Right: Solution reveal */}
          <div className="lg:pl-8">
            <motion.div
              style={{ opacity: revealOpacity, y: revealY, scale: revealScale }}
              className="will-change-transform"
            >
              {/* NOT ANYMORE — big reveal */}
              <div className="mb-10">
                <motion.span
                  className="block text-[11px] font-mono text-[#D4FF26]/60 tracking-[0.25em] uppercase mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  The solution
                </motion.span>
                <h2 className="font-display text-[clamp(3rem,7vw,8rem)] leading-[0.85] tracking-tight text-white">
                  Not
                  <br />
                  <span className="text-[#D4FF26]">anymore.</span>
                </h2>
              </div>

              <motion.p
                className="text-white/50 text-lg leading-relaxed max-w-md mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                CollabSphere is built for builders who are serious. Not hobbyists. Not talkers.{" "}
                <span className="text-white/80 font-medium">People who ship.</span>
              </motion.p>

              {/* Three proof points */}
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {[
                  "Verified builder profiles with real project history",
                  "Find co-founders matched to your tech stack",
                  "A community that builds, not just talks",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-4 h-4 rounded-full bg-[#D4FF26]/10 border border-[#D4FF26]/30 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF26]" />
                    </span>
                    <span className="text-white/60 text-sm leading-relaxed">{point}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </section>
  );
}
