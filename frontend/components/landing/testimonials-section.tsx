"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "Finally found my backend co-founder here. We shipped our MVP in 6 weeks.",
    author: "Alex K.",
    role: "Full-Stack Developer",
    metric: "6w to MVP",
    side: "left",
    delay: 0,
    color: "#D4FF26",
  },
  {
    quote: "Posted a React bug at 11pm. Had 3 working solutions by midnight. Unreal community.",
    author: "Priya M.",
    role: "Frontend Engineer",
    metric: "1h response",
    side: "right",
    delay: 0.15,
    color: "#a78bfa",
  },
  {
    quote: "CollabSphere is what LinkedIn wishes it was for developers. No noise, just builders.",
    author: "James O.",
    role: "Indie Hacker",
    metric: "94% match rate",
    side: "left",
    delay: 0.3,
    color: "#67e8f9",
  },
  {
    quote: "Found my entire founding team in 2 months. All verified, all serious. This is it.",
    author: "Sophia Chen",
    role: "Founder & CEO",
    metric: "4-person team, 2m",
    side: "right",
    delay: 0.45,
    color: "#fbbf24",
  },
];

function ChatBubble({
  quote, author, role, metric, side, delay, color, index,
}: {
  quote: string; author: string; role: string; metric: string;
  side: string; delay: number; color: string; index: number;
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full`}
      initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`flex items-end gap-3 max-w-[85%] lg:max-w-[60%] ${isLeft ? "" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-black"
          style={{ backgroundColor: color }}
        >
          {author.charAt(0)}
        </div>

        <div className={`flex flex-col gap-1 ${isLeft ? "items-start" : "items-end"}`}>
          {/* Typing indicator appears briefly before message */}
          <motion.div
            className={`px-4 py-3 rounded-2xl ${isLeft ? "rounded-bl-sm" : "rounded-br-sm"} bg-white/[0.05] border border-white/[0.06]`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.4 }}
          >
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Actual bubble */}
          <motion.div
            className={`px-5 py-4 rounded-2xl ${isLeft ? "rounded-bl-sm" : "rounded-br-sm"} bg-[#0e0e0e] border border-white/[0.08] relative overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Color accent left/right border */}
            <div
              className={`absolute top-0 bottom-0 w-0.5 ${isLeft ? "left-0" : "right-0"}`}
              style={{ backgroundColor: color + "60" }}
            />

            <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-3">
              &ldquo;{quote}&rdquo;
            </p>

            <div className={`flex items-center gap-3 ${isLeft ? "" : "flex-row-reverse"}`}>
              <div>
                <span className="text-white text-xs font-semibold block">{author}</span>
                <span className="text-white/30 text-[11px] font-mono">{role}</span>
              </div>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + "15", color }}
              >
                {metric}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#030303] overflow-hidden"
    >
      {/* Background inversion — dark becomes slightly brighter */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-[#060606] pointer-events-none"
      />

      {/* Subtle top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <motion.span
              className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-8 h-px bg-white/20" />
              Builder Stories
            </motion.span>
            <motion.h2
              className="font-display text-[clamp(2rem,5vw,5rem)] text-white leading-[0.9] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              From the community.
            </motion.h2>
          </div>

          {/* Live indicator */}
          <motion.div
            className="hidden lg:flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#D4FF26] animate-pulse" />
            <span className="text-white/30 text-[11px] font-mono tracking-widest uppercase">
              Real builders, real results
            </span>
          </motion.div>
        </div>

        {/* Chat bubbles interface */}
        <div className="relative max-w-3xl mx-auto">
          {/* Interface chrome */}
          <motion.div
            className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Window header bar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-4 text-[11px] font-mono text-white/20">
                CollabSphere — Community Feed
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF26] animate-pulse" />
                <span className="text-[10px] font-mono text-white/20">LIVE</span>
              </div>
            </div>

            {/* Bubbles */}
            <div className="p-6 lg:p-8 flex flex-col gap-5">
              {TESTIMONIALS.map((t, i) => (
                <ChatBubble key={i} index={i} {...t} />
              ))}

              {/* Typing status at bottom */}
              <motion.div
                className="flex items-center gap-2 mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <span className="text-white/20 text-[11px] font-mono">
                  3 builders typing...
                </span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-white/20"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
