"use client";

import { useRef } from "react";
import Link from "next/link";
import { Zap, Users, Flame, MessageSquare, GitFork } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─── Product Mockup ───────────────────────────────────────────────────────────
function ProductMockup() {
  const posts = [
    { i: "KR", n: "Keerthan Reddy", h: "@keerthan", badge: "FOUNDER", bc: "text-[#8FFF00] border-[#8FFF00]/30 bg-[#8FFF00]/10", t: "Shipped real-time matchmaking for co-founders! Evaluates tech stack overlap. 🚀", bo: 38, c: 12, f: 2 },
    { i: "SA", n: "Sara A.", h: "@sara_a", badge: "COLLAB", bc: "text-blue-300 border-blue-500/30 bg-blue-500/10", t: "Looking for a React dev — building async-first IDE. Equity available.", bo: 22, c: 5, f: 1 },
  ];

  return (
    <div className="relative w-full max-w-[500px]">
      <div className="relative rounded-2xl bg-[#0d0d0d] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
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
        <div className="flex gap-1 border-b border-white/[0.05] px-4 pt-2.5 pb-0 bg-[#111]">
          {["Trending Builds", "Recent"].map((tab, i) => (
            <button key={tab} className={`px-3 py-1.5 text-[11px] font-medium rounded-t-md transition-colors ${i === 0 ? "bg-[#0d0d0d] text-white border-t border-l border-r border-white/[0.07]" : "text-neutral-600 hover:text-neutral-400"}`}>
              {tab}
            </button>
          ))}
        </div>
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
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.c}</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{p.bo}</span>
                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{p.f}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 -left-8 w-[200px] rounded-xl bg-[#141414] border border-white/[0.08] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.7)]" style={{ transform: "rotate(-3deg)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">New Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-white/20 to-white/5 flex items-center justify-center text-[8px] font-bold text-white">MK</div>
          <div>
            <div className="text-[11px] font-semibold text-white">Mike K.</div>
            <div className="text-[9px] text-neutral-500">React · Node · Open</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-6 rounded-xl bg-[#141414] border border-white/[0.08] px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-2" style={{ transform: "rotate(2deg)" }}>
        <Users className="w-3.5 h-3.5 text-white" />
        <span className="text-[10px] font-mono text-neutral-300">24 builders online</span>
      </div>
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const bgRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Initial Reveal
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.fromTo(bgRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 })
      .fromTo(typeRef.current, { y: 80, scale: 0.9, opacity: 0, rotationX: 10, filter: "blur(10px)" }, { y: 0, scale: 1, opacity: 1, rotationX: 0, filter: "blur(0px)", duration: 1.8, ease: "expo.out" }, "-=1.2")
      .fromTo(accentRef.current, { y: 40, opacity: 0, rotation: -10, clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }, { y: 0, opacity: 1, rotation: -4, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.5, ease: "back.out(1.2)" }, "-=1.4")
      .fromTo(uiRef.current, { y: 150, opacity: 0, scale: 0.85, rotationY: 15 }, { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.8, ease: "power3.out" }, "-=1.4")
      .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1.2");

    // 2. Parallax Scroll (Motion Hierarchy)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    scrollTl
      .to(bgRef.current, { y: "10vh", opacity: 0, scale: 0.95, ease: "none" }, 0)
      .to(typeRef.current, { y: "20vh", opacity: 0, filter: "blur(10px)", scale: 0.9, ease: "none" }, 0)
      .to(accentRef.current, { y: "35vh", rotation: 5, opacity: 0, ease: "none" }, 0)
      .to(uiRef.current, { y: "60vh", opacity: 0, scale: 1.1, rotationX: -10, filter: "blur(5px)", ease: "none" }, 0)
      .to(ctaRef.current, { y: "10vh", opacity: 0, ease: "none" }, 0);
      
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[200vh] bg-[#050505]">
      {/* Pinned Viewport */}
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center pt-16">
        
        {/* Layer 1: Background Noise */}
        <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Navbar inside pinned view */}
        <header className="absolute top-0 w-full z-50 flex items-center justify-between px-8 md:px-14 h-[80px]">
          <Link href="/" className="font-anton tracking-tight text-xl text-white uppercase hover:text-neutral-400 transition-colors">
            CollabSphere
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[12px] font-mono uppercase tracking-[0.15em] text-neutral-500 hover:text-white transition-colors hidden md:block">
              Sign in
            </Link>
            <Link href="/pre-register" className="text-[12px] font-mono uppercase tracking-[0.15em] text-white border-b border-white pb-1 hover:text-neutral-400 hover:border-neutral-400 transition-all">
              Join Waitlist
            </Link>
          </div>
        </header>

        {/* Layer 2: Typography (Background) */}
        <div ref={typeRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none -mt-12">
          <h1 className="font-anton uppercase text-[#E83526] leading-[0.75] tracking-tight text-center w-full" style={{ fontSize: "clamp(4rem, 16vw, 14rem)" }}>
            <span className="block">WHERE</span>
            <span className="block text-white mix-blend-difference z-40 relative">BUILDERS</span>
            <span className="block">CONNECT</span>
          </h1>
        </div>

        {/* Layer 3: Accent Graphic */}
        <div ref={accentRef} className="absolute z-20 pointer-events-none mt-20 ml-32 md:ml-64 rotate-[-4deg]">
          <span className="font-['Caveat',cursive] text-white/90 text-6xl md:text-8xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Ship Faster
          </span>
        </div>

        {/* Layer 4: UI Mockup */}
        <div ref={uiRef} className="relative z-30 w-full flex justify-center mt-[10vh] px-4 pointer-events-auto" style={{ perspective: "1000px" }}>
          <ProductMockup />
        </div>

        {/* Layer 5: CTA / Details */}
        <div ref={ctaRef} className="absolute bottom-12 z-40 w-full flex flex-col items-center justify-center gap-4 px-6 pointer-events-auto text-center">
          <p className="font-sans text-neutral-400 text-sm md:text-base max-w-sm bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-2xl">
            Find your next co-builder. Share what you're shipping. Get discovered.
          </p>
          <div className="w-[1px] h-[40px] bg-white/20 mt-4 overflow-hidden relative">
             <div className="absolute top-0 w-full h-full bg-white animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>

      </div>
    </section>
  );
}
