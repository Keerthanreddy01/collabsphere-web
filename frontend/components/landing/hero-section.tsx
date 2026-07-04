"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Flame, GitFork, Star, Share2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const spacing = 45;
    const dots: { x: number; y: number; ox: number; oy: number; phase: number }[] = [];

    const initDots = () => {
      dots.length = 0;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * spacing;
          const y = r * spacing;
          dots.push({
            x,
            y,
            ox: x,
            oy: y,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    initDots();

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      dots.forEach((dot) => {
        const driftX = Math.sin(time + dot.phase) * 2;
        const driftY = Math.cos(time + dot.phase) * 2;
        const targetX = dot.ox + driftX;
        const targetY = dot.oy + driftY;

        const dx = mouse.x - targetX;
        const dy = mouse.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let finalX = targetX;
        let finalY = targetY;
        let opacity = 0.04;

        if (dist < 200) {
          const force = (200 - dist) / 200;
          finalX -= (dx / dist) * force * 8;
          finalY -= (dy / dist) * force * 8;
          opacity = 0.04 + force * 0.16;
        }

        ctx.beginPath();
        ctx.arc(finalX, finalY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [buildersCount, setBuildersCount] = useState(0);
  const [buildsCount, setBuildsCount] = useState(0);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.8"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 40, rotateX: 15, rotateY: -15, scale: 0.95 },
          { opacity: 1, y: 0, rotateX: 6, rotateY: -12, scale: 1, duration: 1.4, ease: "back.out(1.2)" },
          "-=1.0"
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8"
        );

      // Gentle floating loop for the card
      gsap.to(cardRef.current, {
        y: "-=12",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Animated numbers for stats
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
      className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Background Interactive Dot Grid */}
      <DotGridCanvas />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Subtle bottom gradient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      {/* Empty spacer for header height alignment */}
      <div className="h-24 shrink-0" />

      {/* Main Content Area: Responsive Grid */}
      <div className="relative z-20 flex-1 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 py-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Typography and CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline */}
            <h1
              ref={titleRef}
              className="text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.9] tracking-[-0.04em] mb-8 font-sans font-extralight text-[#a3a3a3]"
              style={{ opacity: 0 }}
            >
              The network <br className="sm:hidden" />
              <span className="font-bold text-white tracking-[-0.05em]">
                serious builders
              </span>{" "}
              use.
            </h1>

            {/* Subtext */}
            <p
              ref={subtextRef}
              className="text-lg sm:text-xl md:text-2xl text-[#8a8a8a] max-w-xl font-light leading-relaxed mb-10"
              style={{ opacity: 0 }}
            >
              Find your next co-builder. Share what you're shipping. Get
              discovered by people who want to build with you.
            </p>

            {/* Larger, Prominent CTA Button */}
            <div ref={ctaRef} style={{ opacity: 0 }}>
              <Link
                href="/pre-register"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black text-base sm:text-lg font-bold hover:bg-[#8FFF00] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:shadow-[0_0_50px_rgba(143,255,0,0.3)] duration-300"
              >
                Get early access
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Mockup Post Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000 py-8">
            <div
              ref={cardRef}
              style={{ opacity: 0 }}
              className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none pointer-events-auto transform-style-3d hover:border-[#8FFF00]/30 transition-colors duration-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8FFF00]/30 to-[#eca8d6]/30 border border-white/15 flex items-center justify-center text-xs font-mono font-bold text-white">
                    AR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-white">Alex Rivera</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        Rust Dev
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">@alex_r · 2h ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#8FFF00] text-xs font-mono px-2.5 py-1 rounded-full bg-[#8FFF00]/10 border border-[#8FFF00]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF00] animate-pulse" />
                  SHIPPING
                </div>
              </div>

              {/* Card Content */}
              <p className="text-[14px] leading-relaxed text-neutral-300 mb-6 font-light">
                Just pushed the initial commit for the Rust-based web socket gateway. It handles 50k concurrent developer sessions with 12ms latency. Looking for a React / Tailwind ninja to co-build the real-time collaboration canvas. DM if you want to ship this week!
              </p>

              {/* Specs Tagging */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">
                  #rust
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">
                  #websockets
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">
                  #realtime
                </span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 mb-4" />

              {/* Card Actions Mock */}
              <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> 14
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <Flame className="w-4 h-4 text-orange-500/70" /> 42
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <GitFork className="w-4 h-4" /> 3
                  </span>
                </div>
                <span className="text-[#8FFF00]/90 font-mono text-[11px] uppercase tracking-wider">
                  3 requests to build →
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Row: Stats and status */}
      <div
        ref={statsRef}
        className="relative z-20 px-6 sm:px-12 md:px-16 lg:px-24 py-10 border-t border-white/[0.04] bg-black/40 backdrop-blur-sm w-full"
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-[#737373] font-mono text-sm tracking-widest uppercase">
          {/* Animated counter row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg tabular-nums">
                {buildersCount.toString().padStart(2, "0")}
              </span>
              <span>builders</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg tabular-nums">
                {buildsCount}
              </span>
              <span>builds shipped</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[#8FFF00] animate-pulse">●</span>
              <span>early access open</span>
            </div>
          </div>

          {/* Scroll directive indicator */}
          <div className="text-[11px] text-[#404040] select-none pointer-events-none hidden md:block">
            scroll to explore ↓
          </div>
        </div>
      </div>
    </section>
  );
}
