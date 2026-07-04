"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Image, Tag, Code, MessageSquare, Flame, GitFork } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const [buildersCount, setBuildersCount] = useState(0);
  const [buildsCount, setBuildsCount] = useState(0);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleWrapperRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.3 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.9"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7"
        )
        .fromTo(
          mockupRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8"
        );

      // Mockup perspective reveal on scroll
      gsap.fromTo(
        mockupRef.current,
        { rotateX: 12, scale: 0.95 },
        {
          rotateX: 0,
          scale: 1.0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        }
      );

      // Stats counters count-up loading
      const statsObj = { builders: 0, builds: 0 };
      gsap.to(statsObj, {
        builders: 8,
        builds: 4,
        duration: 2.2,
        delay: 0.2,
        ease: "power2.out",
        onUpdate: () => {
          setBuildersCount(Math.floor(statsObj.builders));
          setBuildsCount(Math.floor(statsObj.builds));
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#E83526] text-black flex flex-col justify-between overflow-visible"
    >
      {/* Gritty Noise Texture Overlay (matches the creative agency style) */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Custom Brutalist Top Navigation Header (styled like the agency screenshot) */}
      <header className="absolute top-0 left-0 right-0 z-30 border-b-2 border-black flex justify-between items-stretch select-none h-16 bg-[#E83526]">
        <div className="flex items-center px-6 md:px-10 border-r-2 border-black font-anton tracking-tight text-xl text-black">
          COLLABSPHERE
        </div>
        <div className="hidden md:flex items-stretch text-xs font-anton tracking-widest uppercase text-black">
          <Link href="#about" className="flex items-center px-6 border-r-2 border-black hover:bg-black hover:text-[#E83526] transition-colors">
            About us
          </Link>
          <Link href="/builders" className="flex items-center px-6 border-r-2 border-black hover:bg-black hover:text-[#E83526] transition-colors">
            Builders
          </Link>
          <Link href="/showcase" className="flex items-center px-6 border-r-2 border-black hover:bg-black hover:text-[#E83526] transition-colors">
            Showcase
          </Link>
        </div>
        <div className="flex items-stretch font-anton text-xs tracking-widest uppercase">
          <Link href="/login" className="flex items-center px-6 border-l-2 border-black hover:bg-black hover:text-[#E83526] transition-colors">
            Sign in
          </Link>
          <Link href="/pre-register" className="flex items-center px-6 border-l-2 border-black bg-black text-[#E83526] hover:bg-[#F4F1EA] hover:text-black transition-colors font-bold">
            Join Waitlist
          </Link>
        </div>
      </header>

      {/* Upper-center layout spacer */}
      <div className="h-28 sm:h-36 shrink-0" />

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-start px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full text-center">
        
        {/* Layered Brutalist Title Block (styled like "the STORYSELLING agency") */}
        <div
          ref={titleWrapperRef}
          style={{ opacity: 0 }}
          className="relative select-none my-12 w-full max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Cursive white "the" */}
          <span className="absolute top-[-8%] left-[18%] sm:left-[28%] rotate-[-12deg] font-marker text-white text-3xl sm:text-4xl md:text-5xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none">
            the
          </span>

          {/* Mixed white/black "COLLABSPHERE" stack */}
          <h1 className="font-anton leading-[0.76] uppercase tracking-tighter text-[clamp(4.2rem,13vw,11rem)] text-center flex flex-wrap justify-center items-baseline gap-x-2">
            <span className="text-[#F4F1EA]">COLLAB</span>
            <span className="text-black relative inline-block">
              SPHERE
              {/* Hand-drawn sketchy horizontal black mark under SPHERE */}
              <svg className="absolute bottom-[-8%] left-0 w-full h-4 text-black pointer-events-none" fill="none" viewBox="0 0 100 10">
                <path d="M 2,5 Q 50,8 98,3" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Sub-headline: Spaced, thin, black all-caps */}
          <h2 className="font-anton uppercase tracking-[0.25em] text-black text-[clamp(1rem,2.8vw,2.2rem)] leading-none mt-6 relative z-20 select-none">
            THE NETWORK FOR SERIOUS BUILDERS
          </h2>
        </div>

        {/* Descriptor under the headline */}
        <p
          ref={subtextRef}
          className="font-sans text-black/85 text-base sm:text-lg max-w-2xl font-medium leading-relaxed mb-10 text-center"
          style={{ opacity: 0 }}
        >
          Find your next co-builder. Share what you're shipping. Get
          discovered by people who want to build with you.
        </p>

        {/* Primary CTA: Solid Black pill button with white text */}
        <div ref={ctaRef} style={{ opacity: 0 }} className="mb-20">
          <Link
            href="/pre-register"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-black text-[#E83526] hover:bg-[#F4F1EA] hover:text-black text-base sm:text-lg font-bold transition-all shadow-[0_10px_35px_rgba(0,0,0,0.35)] duration-300 border-2 border-black"
          >
            Get early access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mockup Container */}
        <div className="relative w-full max-w-4xl mx-auto mb-28 perspective-1000">
          
          {/* Subtle radial shadow behind the mockup to pop it out from the red background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] rounded-full bg-black/35 opacity-40 blur-[85px] pointer-events-none z-0" />

          {/* High-Fidelity App Mockup */}
          <div
            ref={mockupRef}
            style={{
              opacity: 0,
              transform: "perspective(1000px) rotateX(12deg)",
              transformOrigin: "top center",
            }}
            className="relative z-10 w-full rounded-xl border-2 border-black bg-[#0c0c0c] shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden select-none text-left pointer-events-auto transform-style-3d transition-colors duration-300"
          >
            {/* Mock Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#121212] border-b-2 border-black">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <div className="text-[11px] text-neutral-500 font-mono tracking-widest uppercase">
                collabsphere.app/feed
              </div>
              <div className="w-12" />
            </div>

            {/* Mock Layout Grid */}
            <div className="grid grid-cols-12 min-h-[380px] bg-[#0c0c0c]">
              
              {/* Mock Left Sidebar Tabs */}
              <div className="hidden md:block col-span-3 border-r-2 border-black p-4 space-y-2">
                <div className="text-[10px] text-neutral-600 font-mono tracking-wider uppercase mb-3 px-2">
                  Navigation
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 text-white text-xs font-medium">
                  ⚡ Feed
                </div>
                <div className="px-3 py-2 rounded-lg text-neutral-500 hover:text-neutral-300 text-xs transition-colors">
                  📁 Projects
                </div>
                <div className="px-3 py-2 rounded-lg text-neutral-500 hover:text-neutral-300 text-xs transition-colors">
                  👥 Builders
                </div>
                <div className="px-3 py-2 rounded-lg text-neutral-500 hover:text-neutral-300 text-xs transition-colors">
                  💬 Collabs
                </div>
              </div>

              {/* Mock Main Feed */}
              <div className="col-span-12 md:col-span-9 p-4 sm:p-5 space-y-4 overflow-hidden">
                
                {/* Tab switcher */}
                <div className="flex gap-4 border-b border-white/5 pb-3">
                  <span className="text-xs font-semibold text-white border-b border-white pb-2 px-1">
                    Trending Builds
                  </span>
                  <span className="text-xs text-neutral-500 hover:text-neutral-300 pb-2 px-1 cursor-pointer transition-colors">
                    Recent
                  </span>
                  <span className="text-xs text-neutral-500 hover:text-neutral-300 pb-2 px-1 cursor-pointer transition-colors">
                    Looking for Team
                  </span>
                </div>

                {/* What are you shipping composer */}
                <div className="rounded-xl border border-white/5 bg-[#121212] p-4 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-white/10">
                    ME
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-neutral-500 text-xs py-1">What are you shipping today?</div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex gap-3 text-neutral-500">
                        <Image className="w-4 h-4 hover:text-white cursor-pointer" />
                        <Tag className="w-4 h-4 hover:text-white cursor-pointer" />
                        <Code className="w-4 h-4 hover:text-white cursor-pointer" />
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-white text-black font-semibold text-[11px] hover:bg-neutral-200">
                        Ship it
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feed Post Card */}
                <div className="rounded-xl border border-white/5 bg-[#121212] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                        KR
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-white">Keerthan Reddy</span>
                          <span className="text-[9px] font-mono text-[#8FFF00] uppercase bg-[#8FFF00]/10 border border-[#8FFF00]/20 px-1 py-0.5 rounded">
                            Founder
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-500">@keerthan · 1h ago</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Shipped the real-time matchmaking algorithm for co-founders today! Evaluates tech stack overlap and active shipping frequency. Try it out in the matching dashboard.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono border border-white/10">#algorithms</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono border border-white/10">#nextjs</span>
                  </div>
                  <div className="flex gap-4 text-neutral-500 text-[10px] pt-1">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 12</span>
                    <span className="flex items-center gap-1 text-orange-500/60"><Flame className="w-3.5 h-3.5" /> 38</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> 2</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Solid black footer-style stats row */}
      <div
        ref={statsRef}
        className="relative z-20 px-6 sm:px-12 md:px-16 lg:px-24 py-10 border-t-2 border-black bg-black text-[#737373] w-full shrink-0"
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-sm tracking-widest uppercase">
          {/* Animated counter row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[#E83526] font-bold text-lg tabular-nums">
                {buildersCount.toString().padStart(2, "0")}
              </span>
              <span>builders</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#E83526] font-bold text-lg tabular-nums">
                {buildsCount}
              </span>
              <span>builds shipped</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#E83526] animate-pulse">●</span>
              <span className="text-[#F4F1EA]">early access open</span>
            </div>
          </div>

          {/* Scroll directive indicator */}
          <div className="text-[11px] text-neutral-600 select-none pointer-events-none hidden md:block">
            scroll to explore ↓
          </div>
        </div>
      </div>
    </section>
  );
}
