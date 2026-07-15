"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const cards = [
  { title: "Open Source", desc: "Build in public with thousands of developers." },
  { title: "Proof of Work", desc: "Your code is your reputation. No resumes." },
  { title: "Global Reach", desc: "Match with elite talent across 150+ countries." }
];

export function UniqueEffectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative py-32 bg-black overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12">

        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display tracking-tight text-white mb-6">
            THE NEW STANDARD
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Experience a platform designed for the top 1% of builders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              onHoverStart={() => setHoveredIdx(i)}
              onHoverEnd={() => setHoveredIdx(null)}
              className="relative p-10 rounded-[2rem] border border-white/10 bg-[#050505] overflow-hidden group cursor-pointer"
            >
              {/* Dynamic hover glow */}
              <motion.div
                className="absolute inset-0 bg-[#E83526]/20 blur-3xl rounded-full pointer-events-none"
                animate={{
                  opacity: hoveredIdx === i ? 1 : 0,
                  scale: hoveredIdx === i ? 1.5 : 0.5,
                }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                <h3 className="text-3xl font-display text-white mb-4 group-hover:text-[#E83526] transition-colors duration-500">{card.title}</h3>
                <p className="text-white/60 leading-relaxed">{card.desc}</p>
              </div>

              {/* Corner accent line */}
              <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
