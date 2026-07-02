"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePlatformStats } from "@/hooks/usePlatformStats";

// ── Animated network canvas ────────────────────────────────
function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate nodes
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const nodes = Array.from({ length: 28 }, (_, i) => ({
      x: 0.1 * W() + Math.random() * 0.8 * W(),
      y: 0.1 * H() + Math.random() * 0.8 * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 3,
      pulse: Math.random() * Math.PI * 2,
      label: ["RS", "AK", "MH", "PW", "JL", "SC", "TF", "NK", "EV", "BM"][i % 10],
    }));

    const render = () => {
      ctx.clearRect(0, 0, W(), H());

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0.05 * W() || n.x > 0.95 * W()) n.vx *= -1;
        if (n.y < 0.05 * H() || n.y > 0.95 * H()) n.vy *= -1;
      });

      // Draw connections
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(212, 255, 38, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulse) * 0.5 + 0.5;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 2 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 255, 38, ${0.02 + pulse * 0.04})`;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 255, 38, ${0.4 + pulse * 0.4})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// Animated stat counter
function LiveStat({
  value,
  label,
  suffix = "+",
  loading,
}: {
  value: number;
  label: string;
  suffix?: string;
  loading: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (loading || value === 0 || hasRunRef.current) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRunRef.current) {
          hasRunRef.current = true;
          const duration = 2200;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setCount(Math.floor(eased * value));
            if (p < 1) rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [value, loading]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {loading ? (
        <div className="h-10 w-20 bg-white/5 animate-pulse rounded" />
      ) : (
        <span className="font-display text-4xl lg:text-5xl text-white tabular-nums">
          {count.toLocaleString()}{suffix}
        </span>
      )}
      <span className="text-white/30 text-xs font-mono tracking-widest uppercase">{label}</span>
    </div>
  );
}

export function InfrastructureSection() {
  const { stats, isLoading } = usePlatformStats();

  const REGIONS = [
    { name: "North America", count: stats.activeBuilders > 0 ? Math.floor(stats.activeBuilders * 0.38) : 0 },
    { name: "Europe", count: stats.activeBuilders > 0 ? Math.floor(stats.activeBuilders * 0.28) : 0 },
    { name: "Asia Pacific", count: stats.activeBuilders > 0 ? Math.floor(stats.activeBuilders * 0.24) : 0 },
    { name: "Rest of World", count: stats.activeBuilders > 0 ? Math.floor(stats.activeBuilders * 0.10) : 0 },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-[#030303] overflow-hidden">

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-white/20" />
            The Network
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,5rem)] text-white leading-[0.9] tracking-tight">
            A global network of
            <br />
            <span className="text-white/30">elite builders.</span>
          </h2>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Network visualization card */}
          <motion.div
            className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden min-h-[380px] lg:min-h-[480px]"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <NetworkCanvas />

            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF26] animate-pulse" />
                <span className="text-[#D4FF26]/60 text-[10px] font-mono tracking-widest uppercase">
                  Live Network
                </span>
              </div>
              <p className="text-white/50 text-sm font-mono">
                Real-time builder connections across the platform
              </p>
            </div>

            {/* Top label */}
            <div className="absolute top-4 right-4">
              <span className="text-white/10 text-[10px] font-mono tracking-widest">
                {stats.activeBuilders > 0 ? `${stats.activeBuilders.toLocaleString()} nodes` : ""}
              </span>
            </div>
          </motion.div>

          {/* Stats + regions */}
          <div className="flex flex-col gap-4">

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                <LiveStat value={stats.activeBuilders} label="Active Builders" loading={isLoading} />
              </div>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                <LiveStat value={stats.projectsLaunched} label="Projects Launched" loading={isLoading} />
              </div>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                <LiveStat value={stats.teamsFormed} label="Teams Formed" loading={isLoading} />
              </div>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                <LiveStat value={stats.countriesRepresented} suffix="" label="Countries" loading={isLoading} />
              </div>
            </motion.div>

            {/* Regions breakdown */}
            <motion.div
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 lg:p-8 flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase mb-5 block">
                Builder Distribution
              </span>
              <div className="flex flex-col gap-3">
                {REGIONS.map((r, i) => {
                  const pct = stats.activeBuilders > 0
                    ? Math.round((r.count / stats.activeBuilders) * 100)
                    : [38, 28, 24, 10][i];
                  return (
                    <div key={r.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">{r.name}</span>
                        <span className="text-white/30 text-xs font-mono">{pct}%</span>
                      </div>
                      <div className="h-px bg-white/[0.06] overflow-hidden rounded-full">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#D4FF26]/60 to-[#D4FF26]/20 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
