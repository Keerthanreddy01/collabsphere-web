"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ── 3D Tilt card wrapper ───────────────────────────────────
function TiltCard({
  children,
  className = "",
  glowColor = "rgba(212,255,38,0.15)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: isHovered ? `0 30px 80px -20px ${glowColor}` : "none",
      }}
      className={`relative overflow-hidden cursor-pointer will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

const CARDS = [
  {
    id: "find",
    label: "01 — DISCOVER",
    title: "Find Your\nCo-Founder",
    desc: "Browse verified builders with real shipped projects. Filter by stack, role, availability. No LinkedIn fluff.",
    accent: "#D4FF26",
    bg: "bg-[#0d0d0d]",
    border: "border-white/[0.06]",
    size: "lg:col-span-2 lg:row-span-2",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "ship",
    label: "02 — BUILD",
    title: "Ship Projects\nTogether",
    desc: "Post your project, define your stack, recruit your team. Launch faster than going solo.",
    accent: "#ffffff",
    bg: "bg-[#111111]",
    border: "border-white/[0.06]",
    size: "",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: "hack",
    label: "03 — COMPETE",
    title: "Hackathons",
    desc: "Join team-based hackathons. Find your squad, build in 48 hours, win together.",
    accent: "#a78bfa",
    bg: "bg-[#0a0a14]",
    border: "border-purple-500/[0.1]",
    size: "",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
  },
  {
    id: "explore",
    label: "04 — EXPLORE",
    title: "Builder\nShowcase",
    desc: "Discover what the community is shipping. Upvote, remix, collaborate on live projects.",
    accent: "#67e8f9",
    bg: "bg-[#030d0f]",
    border: "border-cyan-500/[0.08]",
    size: "",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
];

function BentoCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${card.size}`}
    >
      <TiltCard
        className={`h-full min-h-[240px] lg:min-h-[280px] border ${card.border} ${card.bg} p-7 lg:p-8 flex flex-col justify-between rounded-2xl`}
        glowColor={`${card.accent}25`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            className="text-[10px] font-mono tracking-[0.2em] uppercase"
            style={{ color: `${card.accent}80` }}
          >
            {card.label}
          </span>
          <span style={{ color: `${card.accent}60` }}>{card.icon}</span>
        </div>

        {/* For the large card — extra visual */}
        {card.id === "find" && (
          <div className="flex-1 my-6 relative">
            {/* Animated builder avatars */}
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                >
                  {["RK", "SL", "AJ", "PW", "MH"][i]}
                </motion.div>
              ))}
              <motion.div
                className="text-white/30 text-xs font-mono"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                +{Math.floor(Math.random() * 400 + 800)} more
              </motion.div>
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ top: 40 }}>
              {[...Array(3)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={`${18 + i * 18}%`} y1="10%"
                  x2={`${30 + i * 15}%`} y2="90%"
                  stroke="#D4FF26"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Bottom: title + desc */}
        <div>
          <h3
            className="font-display text-2xl lg:text-3xl text-white leading-tight tracking-tight mb-2 whitespace-pre-line"
          >
            {card.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            {card.desc}
          </p>
        </div>

        {/* Bottom right accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${card.accent}40, transparent)` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
        />
      </TiltCard>
    </motion.div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="service"
      className="relative py-24 lg:py-32 bg-[#030303] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4FF26]/[0.02] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex items-end justify-between mb-12 lg:mb-16 will-change-transform"
        >
          <div>
            <span className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-white/20" />
              What We Offer
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,5rem)] leading-[0.9] tracking-tight text-white">
              Everything a serious
              <br />
              <span className="text-white/30">builder needs.</span>
            </h2>
          </div>

          <a
            href="/pre-register"
            className="hidden lg:flex items-center gap-2 text-[#D4FF26] text-sm font-mono tracking-wide hover:gap-4 transition-all duration-300"
          >
            Join now <span>→</span>
          </a>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Large card (col-span-2, row-span-2) */}
          <BentoCard card={CARDS[0]} index={0} />

          {/* Smaller cards stack in col 3 */}
          <div className="flex flex-col gap-4">
            <BentoCard card={CARDS[1]} index={1} />
            <BentoCard card={CARDS[2]} index={2} />
          </div>

          {/* Bottom full-width card */}
          <div className="lg:col-span-3">
            <BentoCard card={CARDS[3]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
