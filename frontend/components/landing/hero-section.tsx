"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, MessageSquare, GitFork, Users, Zap } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─── Animated dot grid canvas ─────────────────────────────────────────────────
export function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; initDots(); };
    window.addEventListener("resize", handleResize);

    const mouse = { x: -1000, y: -1000 };
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const spacing = 40;
    const dots: { x: number; y: number; ox: number; oy: number; phase: number }[] = [];
    const initDots = () => {
      dots.length = 0;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const x = c * spacing, y = r * spacing;
          dots.push({ x, y, ox: x, oy: y, phase: Math.random() * Math.PI * 2 });
        }
    };
    initDots();

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.007;
      dots.forEach((d) => {
        const tx = d.ox + Math.sin(time + d.phase) * 1.5;
        const ty = d.oy + Math.cos(time + d.phase) * 1.5;
        const dx = mouse.x - tx, dy = mouse.y - ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let fx = tx, fy = ty, op = 0.05;
        if (dist < 180) { const f = (180 - dist) / 180; fx -= (dx / dist) * f * 7; fy -= (dy / dist) * f * 7; op = 0.05 + f * 0.18; }
        ctx.beginPath();
        ctx.arc(fx, fy, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", handleResize); cancelAnimationFrame(rafId); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

// ─── Product Mockup ───────────────────────────────────────────────────────────
function ProductMockup() {
  const posts = [
    { i: "KR", n: "Keerthan Reddy", h: "@keerthan", badge: "FOUNDER", bc: "text-[#8FFF00] border-[#8FFF00]/30 bg-[#8FFF00]/10", t: "Shipped real-time matchmaking for co-founders! Evaluates tech stack overlap and shipping frequency. 🚀", bo: 38, c: 12, f: 2 },
    { i: "SA", n: "Sara A.", h: "@sara_a", badge: "COLLAB", bc: "text-blue-300 border-blue-500/30 bg-blue-500/10", t: "Looking for a React dev — building async-first IDE. 3-month runway, equity available.", bo: 22, c: 5, f: 1 },
    { i: "DX", n: "@dev_x", h: "@dev_x", badge: "UPDATE", bc: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10", t: "Cursor syncing in 40 lines of code. Wild what you can do with WebSockets.", bo: 56, c: 14, f: 3 },
  ];

  return (
    <div className="relative w-full max-w-[460px]">
      {/* Glow behind the card */}
      <div className="absolute -inset-8 bg-[#E83526]/10 blur-[60px] rounded-full pointer-events-none" />

      {/* Main feed window */}
      <div className="relative rounded-2xl bg-[#0d0d0d] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/50" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-md px-3 py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8FFF00]/70" />
            <span className="text-[10px] text-neutral-500 font-mono">collabsphere.app/feed</span>
          </div>
          <div className="w-12" />
        </div>

        {/* Tab row */}
        <div className="flex gap-1 border-b border-white/[0.05] px-4 pt-2.5 pb-0 bg-[#111]">
          {["Trending Builds", "Recent", "For You"].map((tab, i) => (
            <button key={tab} className={`px-3 py-1.5 text-[11px] font-medium rounded-t-md transition-colors ${i === 0 ? "bg-[#0d0d0d] text-white border-t border-l border-r border-white/[0.07]" : "text-neutral-600 hover:text-neutral-400"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Post cards */}
        <div className="divide-y divide-white/[0.04]">
          {posts.map((p, i) => (
            <div key={i} className="px-4 py-3.5 space-y-2 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white shrink-0">{p.i}</div>
                <span className="text-[11px] font-semibold text-white">{p.n}</span>
                <span className="text-[10px] text-neutral-600">{p.h}</span>
                <span className={`ml-auto text-[8px] font-mono border px-1.5 py-0.5 rounded uppercase shrink-0 ${p.bc}`}>{p.badge}</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed pl-8">{p.t}</p>
              <div className="flex gap-3.5 text-neutral-600 text-[10px] font-mono pl-8">
                <span className="flex items-center gap-1 hover:text-neutral-400 cursor-pointer"><MessageSquare className="w-3 h-3" />{p.c}</span>
                <span className="flex items-center gap-1 hover:text-orange-400 cursor-pointer"><Flame className="w-3 h-3" />{p.bo}</span>
                <span className="flex items-center gap-1 hover:text-neutral-400 cursor-pointer"><GitFork className="w-3 h-3" />{p.f}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Composer hint at bottom */}
        <div className="px-4 py-3 border-t border-white/[0.05] bg-[#0a0a0a] flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white shrink-0">ME</div>
          <div className="flex-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 text-[10px] text-neutral-600">
            What are you shipping today?
          </div>
        </div>
      </div>

      {/* Floating notification card (offset) */}
      <div className="absolute -bottom-6 -left-8 w-[200px] rounded-xl bg-[#141414] border border-white/[0.08] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.7)]" style={{ transform: "rotate(-3deg)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-[#E83526]" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">New Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-[8px] font-bold text-white">MK</div>
          <div>
            <div className="text-[11px] font-semibold text-white">Mike K.</div>
            <div className="text-[9px] text-neutral-500">React · Node · Open</div>
          </div>
        </div>
      </div>

      {/* Floating active users badge */}
      <div className="absolute -top-4 -right-6 rounded-xl bg-[#141414] border border-white/[0.08] px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-2" style={{ transform: "rotate(2deg)" }}>
        <Users className="w-3.5 h-3.5 text-[#8FFF00]" />
        <span className="text-[10px] font-mono text-neutral-300">24 builders online</span>
      </div>
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const line1Ref      = useRef<HTMLSpanElement>(null);
  const line2Ref      = useRef<HTMLSpanElement>(null);
  const line3Ref      = useRef<HTMLSpanElement>(null);
  const subtextRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const mockupRef     = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);

  const [buildersCount, setBuildersCount] = useState(0);
  const [buildsCount, setBuildsCount]     = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(badgeRef.current,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(line1Ref.current,   { opacity: 0, y: 40, skewX: -4 }, { opacity: 1, y: 0, skewX: 0, duration: 0.9 }, "-=0.3")
      .fromTo(line2Ref.current,   { opacity: 0, y: 50, skewX: -4 }, { opacity: 1, y: 0, skewX: 0, duration: 0.9 }, "-=0.7")
      .fromTo(line3Ref.current,   { opacity: 0, y: 50, skewX: -4 }, { opacity: 1, y: 0, skewX: 0, duration: 0.9 }, "-=0.7")
      .fromTo(subtextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .fromTo(ctaRef.current,     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
      .fromTo(mockupRef.current,  { opacity: 0, x: 40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "power2.out" }, "-=1.2")
      .fromTo(statsRef.current,   { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3");

    const counter = { b: 0, s: 0 };
    gsap.to(counter, {
      b: 8, s: 4, duration: 2.4, delay: 0.4, ease: "power2.out",
      onUpdate: () => { setBuildersCount(Math.floor(counter.b)); setBuildsCount(Math.floor(counter.s)); },
    });

    // Subtle floating animation on mockup
    gsap.to(mockupRef.current, {
      y: -12, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5,
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden"
    >
      {/* Dot grid */}
      <DotGridCanvas />

      {/* Red glow top-right */}
      <div className="absolute top-0 right-[15%] w-[600px] h-[500px] rounded-full bg-[#E83526]/[0.07] blur-[120px] pointer-events-none" />
      {/* Red glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-[#E83526]/[0.05] blur-[100px] pointer-events-none" />

      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="relative z-30 flex items-center justify-between px-8 md:px-14 h-[68px] border-b border-white/[0.06]">
        {/* Logo */}
        <Link href="/" className="font-anton tracking-tight text-lg text-white uppercase hover:text-[#E83526] transition-colors">
          CollabSphere
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500">
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="/builders" className="hover:text-white transition-colors">Builders</Link>
          <Link href="/showcase" className="hover:text-white transition-colors">Showcase</Link>
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500 hover:text-white transition-colors hidden md:block">
            Sign in
          </Link>
          <Link href="/pre-register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E83526] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#c62d1e] transition-colors shadow-[0_4px_20px_rgba(232,53,38,0.3)]">
            Join Waitlist
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-8 md:px-14 py-16 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-6 items-center">

          {/* LEFT: Typography */}
          <div className="flex flex-col items-start max-w-xl">

            {/* Eyebrow badge */}
            <div ref={badgeRef} style={{ opacity: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF00] animate-pulse" />
              <span className="font-mono text-[10px] text-neutral-400 tracking-[0.2em] uppercase">Early Access Open</span>
            </div>

            {/* Headline stack */}
            <div className="overflow-hidden mb-2 w-full">
              <span ref={line1Ref}
                className="font-anton uppercase text-[#F4F1EA] leading-[0.88] tracking-tight block"
                style={{ opacity: 0, display: "block", fontSize: "clamp(3.8rem, 8.5vw, 7.5rem)" }}>
                WHERE
              </span>
            </div>
            <div className="overflow-hidden mb-2 w-full">
              <span ref={line2Ref}
                className="font-anton uppercase leading-[0.88] tracking-tight block"
                style={{ opacity: 0, display: "block", fontSize: "clamp(3.8rem, 8.5vw, 7.5rem)", color: "#E83526" }}>
                BUILDERS
              </span>
            </div>
            <div className="overflow-hidden mb-10 w-full">
              <span ref={line3Ref}
                className="font-anton uppercase text-[#F4F1EA] leading-[0.88] tracking-tight block"
                style={{ opacity: 0, display: "block", fontSize: "clamp(3.8rem, 8.5vw, 7.5rem)" }}>
                CONNECT.
              </span>
            </div>

            {/* Subtext */}
            <p ref={subtextRef} style={{ opacity: 0 }}
              className="font-sans text-neutral-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
              Find your next co-builder. Share what you're shipping. Get discovered by people who want to build with you.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} style={{ opacity: 0 }} className="flex flex-wrap items-center gap-4">
              <Link href="/pre-register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#E83526] text-white font-bold text-sm hover:bg-[#c62d1e] transition-all shadow-[0_8px_32px_rgba(232,53,38,0.35)] border border-[#E83526]">
                Get early access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/[0.12] text-neutral-400 font-medium text-sm hover:border-white/25 hover:text-white transition-all">
                See how it works
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["KR","SA","MK","DX","TG"].map((i, idx) => (
                  <div key={idx} className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-[#0a0a0a] flex items-center justify-center text-[7px] font-bold text-white">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono">
                <span className="text-white font-semibold">8+ builders</span> already signed up
              </p>
            </div>
          </div>

          {/* RIGHT: Product mockup */}
          <div ref={mockupRef} style={{ opacity: 0 }} className="flex justify-center lg:justify-end">
            <ProductMockup />
          </div>

        </div>
      </div>

      {/* ── Bottom stats bar ────────────────────────────────────── */}
      <div ref={statsRef} style={{ opacity: 0 }}
        className="relative z-10 border-t border-white/[0.06] px-8 md:px-14 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs tracking-widest uppercase">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base tabular-nums">{buildersCount.toString().padStart(2, "0")}</span>
              <span>Builders</span>
            </div>
            <span className="hidden sm:block text-white/10">·</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base tabular-nums">{buildsCount}</span>
              <span>Builds Shipped</span>
            </div>
            <span className="hidden sm:block text-white/10">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF00] animate-pulse" />
              <span className="text-[#F4F1EA]">Early Access Open</span>
            </div>
          </div>
          <span className="text-neutral-700 hidden md:block">Scroll to explore ↓</span>
        </div>
      </div>
    </section>
  );
}
