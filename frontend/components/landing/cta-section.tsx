"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";

// Magnetic CTA button with glow
function CtaMagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mx.set(0); my.set(0); }}
      className="relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-[#D4FF26] text-black font-bold text-base tracking-wide cursor-pointer select-none overflow-hidden"
      whileTap={{ scale: 0.96 }}
    >
      {/* Glow behind button */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl bg-[#D4FF26]"
        animate={{ opacity: hovered ? 0.4 : 0, scale: hovered ? 1.3 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ zIndex: -1 }}
      />
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-120%", skewX: -20 }}
        animate={hovered ? { x: "200%" } : { x: "-120%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10 text-xl"
        animate={{ x: hovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#030303] flex items-center justify-center overflow-hidden"
    >
      {/* Breathing gradient background */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,255,38,0.07) 0%, transparent 70%)",
              "radial-gradient(ellipse 90% 70% at 50% 55%, rgba(212,255,38,0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,255,38,0.07) 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Radial grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Converging lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 50 + Math.cos(angle) * 50;
          const y1 = 50 + Math.sin(angle) * 50;
          return (
            <motion.line
              key={i}
              x1={`${x1}%`} y1={`${y1}%`}
              x2="50%" y2="50%"
              stroke="rgba(212,255,38,0.15)"
              strokeWidth="1"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </svg>

      {/* Main content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto will-change-transform"
      >
        <motion.span
          className="inline-flex items-center gap-2 text-[#D4FF26]/60 text-[11px] font-mono tracking-[0.25em] uppercase mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF26] animate-pulse" />
          Ready to build?
        </motion.span>

        {/* Big headline — split into two lines for drama */}
        <div className="mb-6 overflow-hidden">
          <motion.h2
            className="font-display text-[clamp(3rem,9vw,11rem)] leading-[0.85] tracking-tight text-white"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Find Your
          </motion.h2>
        </div>
        <div className="mb-12 overflow-hidden">
          <motion.h2
            className="font-display text-[clamp(3rem,9vw,11rem)] leading-[0.85] tracking-tight text-[#D4FF26]"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            Co-Founder.
          </motion.h2>
        </div>

        <motion.p
          className="text-white/40 text-lg mb-12 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Join the waitlist. Be first access when we launch. No spam, ever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <CtaMagneticButton href="/pre-register">
            Join the Waitlist
          </CtaMagneticButton>
          <Link
            href="/login"
            className="text-white/30 hover:text-white text-sm font-mono tracking-wide transition-colors duration-300"
          >
            Already have an account? Sign in →
          </Link>
        </motion.div>

        {/* Social proof below CTA */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-6 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {["No credit card", "Free to join", "1,200+ builders waiting"].map((label, i) => (
            <span key={i} className="flex items-center gap-2 text-white/25 text-xs font-mono">
              <span className="w-1 h-1 rounded-full bg-[#D4FF26]/50" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
