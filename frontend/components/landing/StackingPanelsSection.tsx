"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame, MessageSquare, GitFork } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const NOISE = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ─── Visuals ──────────────────────────────────────────────────────────────────

function MockFeed() {
  return (
    <div className="w-full max-w-[440px] rounded-2xl bg-[#0d0d0d] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-white/[0.05]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/25 border border-red-500/40" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/25 border border-yellow-500/40" />
          <span className="w-3 h-3 rounded-full bg-green-500/25 border border-green-500/40" />
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">collabsphere.app/feed</span>
        <div className="w-12" />
      </div>
      <div className="flex gap-4 border-b border-white/[0.05] px-5 pt-3 pb-2">
        <span className="text-xs font-semibold text-white border-b border-white pb-1.5">Trending Builds</span>
        <span className="text-xs text-neutral-600 pb-1.5">Recent</span>
        <span className="text-xs text-neutral-600 pb-1.5">Looking for Team</span>
      </div>
      {[
        { i: "KR", n: "Keerthan Reddy", b: "FOUNDER", bc: "text-[#8FFF00] border-[#8FFF00]/30 bg-[#8FFF00]/10", t: "Shipped real-time matchmaking for co-founders! Evaluates tech stack overlap.", bo: 38, c: 12, f: 2 },
        { i: "SA", n: "Sara A.", b: "COLLAB", bc: "text-blue-300 border-blue-500/30 bg-blue-500/10", t: "Looking for a React dev — async-first IDE. 3-month runway.", bo: 22, c: 5, f: 1 },
        { i: "DX", n: "@dev_x", b: "UPDATE", bc: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10", t: "Cursor syncing in 40 lines of code 🤯", bo: 56, c: 14, f: 3 },
      ].map((p, i) => (
        <div key={i} className="px-5 py-3.5 border-b border-white/[0.04] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white">{p.i}</div>
            <span className="text-[11px] font-semibold text-white">{p.n}</span>
            <span className={`text-[8px] font-mono border px-1 py-0.5 rounded uppercase ${p.bc}`}>{p.b}</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed">{p.t}</p>
          <div className="flex gap-3 text-neutral-600 text-[9px] font-mono">
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.c}</span>
            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500/60" />{p.bo}</span>
            <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{p.f}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileCards() {
  const ps = [
    { i: "MK", n: "Mike K.", r: "Full-Stack Dev", sk: ["React", "Node", "Postgres"], s: "Open to collab", g: "from-blue-600/20 to-violet-600/20", ro: "-5deg", t: "0", ri: "0" },
    { i: "AS", n: "Ana S.", r: "Product Designer", sk: ["Figma", "Framer", "UX"], s: "Looking for builders", g: "from-pink-600/20 to-rose-600/20", ro: "4deg", t: "110px", ri: "40px" },
    { i: "TG", n: "Tom G.", r: "Backend Eng", sk: ["Go", "Postgres", "gRPC"], s: "Open to equity", g: "from-emerald-600/20 to-teal-600/20", ro: "-2deg", t: "220px", ri: "10px" },
  ];
  return (
    <div className="relative h-[380px] w-[320px]">
      {ps.map((p, i) => (
        <div key={i} className="absolute w-[250px] rounded-2xl bg-[#141414] border border-white/[0.08] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          style={{ transform: `rotate(${p.ro})`, top: p.t, right: p.ri, zIndex: i + 1 }}>
          <div className={`w-full h-10 rounded-xl mb-3 bg-gradient-to-br ${p.g}`} />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-[9px] font-bold text-white">{p.i}</div>
            <div>
              <div className="text-xs font-semibold text-white">{p.n}</div>
              <div className="text-[10px] text-neutral-500">{p.r}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {p.sk.map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/[0.07] font-mono">{s}</span>)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF00] animate-pulse" />
            <span className="text-[10px] text-[#8FFF00]">{p.s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DotGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "radial-gradient(circle, rgba(232,53,38,0.22) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
      maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
    }} />
  );
}

function Dots({ active }: { active: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-none">
      {[0,1,2,3].map(i => (
        <div key={i} className={`h-1 rounded-full ${i === active ? "w-6 bg-[#E83526]" : "w-2 bg-white/20"}`} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function StackingPanelsSection() {
  const isMobile = useIsMobile();

  // The outer scroll container (gives scroll distance)
  const scrollerRef = useRef<HTMLDivElement>(null);
  // The sticky viewport (100vh, never moves)
  const stickyRef  = useRef<HTMLDivElement>(null);
  // Individual panels (absolutely positioned inside sticky viewport)
  const p1 = useRef<HTMLDivElement>(null);
  const p2 = useRef<HTMLDivElement>(null);
  const p3 = useRef<HTMLDivElement>(null);
  const p4 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;

    const ctx = gsap.context(() => {
      // Start panels 2-4 below the viewport
      gsap.set([p2.current, p3.current, p4.current], { yPercent: 100 });

      // One scrubbed timeline drives all transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Each segment = 1 unit of timeline duration → maps to 100vh of scroll
      // Segment 0: panel 2 rises, panel 1 shrinks back
      tl.to(p2.current, { yPercent: 0, ease: "none" }, 0)
        .to(p1.current, { scale: 0.92, borderRadius: "20px", ease: "none" }, 0)

        // Segment 1: panel 3 rises, panel 2 shrinks back
        .to(p3.current, { yPercent: 0, ease: "none" }, 1)
        .to(p2.current, { scale: 0.92, borderRadius: "20px", ease: "none" }, 1)

        // Segment 2: panel 4 rises, panel 3 shrinks back
        .to(p4.current, { yPercent: 0, ease: "none" }, 2)
        .to(p3.current, { scale: 0.92, borderRadius: "20px", ease: "none" }, 2);
    }, scrollerRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <div className="bg-[#0a0a0a] py-20 px-6 flex flex-col gap-10 items-center">
          <div className="text-center space-y-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">01 — Post your build</p>
            <h2 className="font-anton uppercase text-white text-5xl leading-[0.9]">Share what you're shipping.</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">Updates, milestones, collab requests — get discovered by the right people.</p>
          </div>
          <MockFeed />
        </div>
        <div className="bg-[#111] py-20 px-6 flex flex-col gap-10 items-center">
          <div className="text-center space-y-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">02 — Find your people</p>
            <h2 className="font-anton uppercase text-white text-5xl leading-[0.9]">Stop building alone.</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">Find developers, designers, and domain experts who are actively looking to collaborate.</p>
          </div>
          <ProfileCards />
        </div>
        <div className="relative bg-[#0f0505] py-20 px-6 flex flex-col gap-6 items-center text-center overflow-hidden">
          <DotGrid />
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/30 relative z-10">03 — Ship together</p>
          <h2 className="font-anton uppercase text-white text-5xl leading-[0.9] relative z-10">Ideas that <span className="text-[#E83526]">actually</span> ship.</h2>
          <p className="text-neutral-400 text-sm leading-relaxed relative z-10">Form real teams. Set milestones. Ship together.</p>
        </div>
        <div className="bg-[#0a0a0a] py-20 px-6 flex flex-col gap-8 items-center text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">04 — You're ready</p>
          <h2 className="font-anton uppercase leading-[0.9] text-5xl"><span className="text-white">Ready to</span><br /><span className="text-[#E83526]">build?</span></h2>
          <p className="text-neutral-400 text-sm">Join the waitlist. Early access is limited.</p>
          <Link href="/pre-register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E83526] text-white font-bold hover:bg-[#c62d1e] transition-colors group">
            Get early access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    /*
     * scrollerRef: tall scroll container — 400vh gives 3 scroll segments (×100vh each)
     * between the 4 panels. "bottom bottom" of a 400vh element = user scrolled 300vh
     * past the top (100vh viewport × (400vh/100vh - 1) = 300vh of scroll travel).
     */
    <div ref={scrollerRef} style={{ height: "400vh" }}>
      {/*
       * stickyRef: stays pinned at top:0, height 100vh.
       * All panels live inside here, stacked via position:absolute.
       */}
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >

        {/* PANEL 1 — POST YOUR BUILD (z:10, always at bottom of stack) */}
        <div
          ref={p1}
          className="absolute inset-0 bg-[#0a0a0a] flex items-center overflow-hidden"
          style={{ zIndex: 10, willChange: "transform" }}
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: NOISE }} />
          <div className="max-w-7xl mx-auto w-full px-16 grid grid-cols-2 gap-16 items-center">
            <div className="flex justify-center"><MockFeed /></div>
            <div className="space-y-6">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">01 — POST YOUR BUILD</p>
              <h2 className="font-anton uppercase text-white leading-[0.88] tracking-tight" style={{ fontSize: "clamp(2.8rem,5.5vw,5.2rem)" }}>
                Share what<br />you're<br />shipping.
              </h2>
              <p className="font-sans text-neutral-400 text-base leading-relaxed max-w-md">
                Updates, milestones, collab requests — post what you're working on and get discovered by the right people.
              </p>
            </div>
          </div>
          <Dots active={0} />
        </div>

        {/* PANEL 2 — FIND YOUR PEOPLE (z:20, slides up over panel 1) */}
        <div
          ref={p2}
          className="absolute inset-0 bg-[#111111] flex items-center overflow-hidden"
          style={{ zIndex: 20, willChange: "transform" }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: NOISE }} />
          <div className="max-w-7xl mx-auto w-full px-16 grid grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">02 — FIND YOUR PEOPLE</p>
              <h2 className="font-anton uppercase text-white leading-[0.88] tracking-tight" style={{ fontSize: "clamp(2.8rem,5.5vw,5.2rem)" }}>
                Stop<br />building<br />alone.
              </h2>
              <p className="font-sans text-neutral-400 text-base leading-relaxed max-w-md">
                Find developers, designers, and domain experts who are actively looking to collaborate on real projects.
              </p>
            </div>
            <div className="flex justify-center"><ProfileCards /></div>
          </div>
          <Dots active={1} />
        </div>

        {/* PANEL 3 — SHIP TOGETHER (z:30, slides up over panel 2) */}
        <div
          ref={p3}
          className="absolute inset-0 bg-[#0f0505] flex items-center justify-center text-center overflow-hidden"
          style={{ zIndex: 30, willChange: "transform" }}
        >
          <DotGrid />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-[#E83526]/[0.07] blur-[100px]" />
          </div>
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto px-8">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-white/30">03 — SHIP TOGETHER</p>
            <h2 className="font-anton uppercase text-white leading-[0.88] tracking-tight" style={{ fontSize: "clamp(3.5rem,8vw,8rem)" }}>
              Ideas that<br /><span className="text-[#E83526]">actually</span><br />ship.
            </h2>
            <p className="font-sans text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto">
              Form real teams. Set milestones. Build in public. Ship together.
            </p>
          </div>
          <Dots active={2} />
        </div>

        {/* PANEL 4 — CTA (z:40, slides up over panel 3) */}
        <div
          ref={p4}
          className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center text-center overflow-hidden"
          style={{ zIndex: 40, willChange: "transform" }}
        >
          <span className="absolute inset-0 flex items-center justify-center font-anton uppercase text-white/[0.025] pointer-events-none select-none leading-none" style={{ fontSize: "clamp(140px,28vw,300px)" }}>GO</span>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full bg-[#E83526]/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 space-y-8 max-w-xl mx-auto px-8">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">04 — YOU'RE READY</p>
            <h2 className="font-anton uppercase leading-[0.88] tracking-tight" style={{ fontSize: "clamp(3.5rem,8vw,7rem)" }}>
              <span className="text-white">Ready to</span><br />
              <span className="text-[#E83526]">build?</span>
            </h2>
            <p className="font-sans text-neutral-400 text-lg leading-relaxed">
              Join the waitlist. Early access is limited.
            </p>
            <Link href="/pre-register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#E83526] text-white font-bold text-base hover:bg-[#c62d1e] transition-colors shadow-[0_8px_40px_rgba(232,53,38,0.35)] group">
              Get early access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Dots active={3} />
        </div>

      </div>
    </div>
  );
}
