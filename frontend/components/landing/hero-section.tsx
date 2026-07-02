"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePlatformStats } from "@/hooks/usePlatformStats";
import Link from "next/link";

// ── Smooth animated counter ────────────────────────────────
function AnimatedStat({ end, suffix = "+", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted || end === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasStarted(true);
        const duration = 2000;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setCount(Math.floor(eased * end));
          if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [end, hasStarted]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="text-2xl lg:text-3xl font-display text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Word-by-word reveal ────────────────────────────────────
const HEADLINE_WORDS = ["Where", "Elite", "Builders", "Find", "Each", "Other."];

function WordReveal() {
  return (
    <h1 className="text-left text-[clamp(2.8rem,7vw,8.5rem)] font-display leading-[0.88] tracking-tight text-white">
      {HEADLINE_WORDS.map((word, i) => (
        <motion.span
          key={word}
          className="inline-block mr-[0.25em] overflow-hidden"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 0.9,
            delay: 0.3 + i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

// ── Mouse-reactive grid canvas ────────────────────────────
function ReactiveGrid({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    targetRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse interpolation
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.06;

      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;
      const gridSize = 60;

      for (let x = 0; x <= w; x += gridSize) {
        for (let y = 0; y <= h; y += gridSize) {
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          const influence = Math.max(0, 1 - dist / 350);
          const alpha = 0.04 + influence * 0.2;
          const size = 1 + influence * 3;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 255, 38, ${alpha})`;
          ctx.fill();
        }
      }

      // Draw grid lines with mouse influence
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += gridSize) {
        const dist = Math.abs(x - mx);
        const alpha = 0.03 + Math.max(0, 1 - dist / 400) * 0.08;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        const dist = Math.abs(y - my);
        const alpha = 0.03 + Math.max(0, 1 - dist / 400) * 0.08;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Cursor glow ────────────────────────────────────────────
function CursorGlow({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const springConfig = { stiffness: 120, damping: 28, mass: 0.5 };
  const x = useSpring(useMotionValue(mouseX), springConfig);
  const y = useSpring(useMotionValue(mouseY), springConfig);

  useEffect(() => { x.set(mouseX); }, [mouseX, x]);
  useEffect(() => { y.set(mouseY); }, [mouseY, y]);

  return (
    <motion.div
      className="absolute pointer-events-none z-10 rounded-full"
      style={{
        left: x,
        top: y,
        translateX: "-50%",
        translateY: "-50%",
        width: 500,
        height: 500,
        background: "radial-gradient(circle, rgba(212,255,38,0.04) 0%, transparent 70%)",
      }}
    />
  );
}

// ── Magnetic CTA Button ────────────────────────────────────
function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    mx.set(dx * 0.3);
    my.set(dy * 0.3);
  };

  const onMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-[#D4FF26] text-black text-sm font-bold tracking-wide rounded-full overflow-hidden cursor-pointer select-none"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10 text-lg"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        →
      </motion.span>
      {/* Shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-white/30"
        initial={{ x: "-100%", skewX: -15 }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.a>
  );
}

// ── Main Hero Section ──────────────────────────────────────
export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [rawMouse, setRawMouse] = useState({ x: -500, y: -500 });
  const { stats, isLoading } = usePlatformStats();
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
    setRawMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Parallax for video bg
  const bgX = (mousePos.x - 0.5) * -20;
  const bgY = (mousePos.y - 0.5) * -12;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-[#030303]"
    >
      {/* ── Background video with mouse parallax ── */}
      <motion.div
        className="absolute inset-[-4%] z-0"
        animate={{ x: bgX, y: bgY }}
        transition={{ type: "spring", stiffness: 60, damping: 30, mass: 1 }}
      >
        <video
          autoPlay muted loop playsInline aria-hidden="true"
          className="w-full h-full object-cover opacity-50"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-[#030303]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303]/90" />
      </motion.div>

      {/* ── Reactive grid canvas ── */}
      <ReactiveGrid mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* ── Cursor glow ── */}
      <CursorGlow mouseX={rawMouse.x} mouseY={rawMouse.y} />

      {/* ── Noise texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-32">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF26] animate-pulse" />
            <span className="text-[#D4FF26]/70 text-[11px] font-mono tracking-[0.2em] uppercase">
              The Builder Network
            </span>
          </span>
          <span className="w-12 h-px bg-white/10" />
          <span className="text-white/20 text-[11px] font-mono tracking-widest">v2.0</span>
        </motion.div>

        {/* Headline — word by word reveal */}
        <div className="lg:max-w-[65%] mb-6">
          <WordReveal />
        </div>

        {/* Sub line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/50 text-lg lg:text-xl leading-relaxed max-w-[480px] mb-12 font-sans"
        >
          CollabSphere connects serious developers, designers, and founders.{" "}
          <span className="text-white/80">No noise. Just builders.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-24"
        >
          <MagneticButton href="/pre-register">Find Your Co-Founder</MagneticButton>
          <a
            href="#about"
            className="text-white/40 hover:text-white text-sm font-mono tracking-wide transition-colors duration-300 group flex items-center gap-2"
          >
            See how it works
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex items-start gap-8 lg:gap-16 pt-8 border-t border-white/[0.06]"
        >
          {!isLoading && (
            <>
              <AnimatedStat end={stats.activeBuilders} suffix="+" label="Active Builders" />
              <div className="w-px h-8 bg-white/10 self-center" />
              <AnimatedStat end={stats.projectsLaunched} suffix="+" label="Projects Launched" />
              <div className="w-px h-8 bg-white/10 self-center" />
              <AnimatedStat end={stats.openCollabRequests} suffix="+" label="Open Collabs" />
            </>
          )}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
              <span className="text-white/20 text-xs font-mono">Loading live data...</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Bottom vignette ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030303] to-transparent z-20 pointer-events-none" />
    </section>
  );
}
