"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
          statsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8"
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
      {/* Gritty Noise Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Subtle bottom gradient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      {/* Custom Brutalist Top Navigation Header */}
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
      <div className="h-36 sm:h-44 shrink-0" />

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 sm:px-12 md:px-16 max-w-7xl mx-auto w-full text-center py-10">
        
        {/* Layered Brutalist Title Block */}
        <div
          ref={titleWrapperRef}
          style={{ opacity: 0 }}
          className="relative select-none my-10 w-full max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Cursive white "the" */}
          <span className="absolute top-[-10%] left-[18%] sm:left-[28%] rotate-[-12deg] font-marker text-white text-3xl sm:text-4xl md:text-5xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none">
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
        <div ref={ctaRef} style={{ opacity: 0 }} className="mb-10">
          <Link
            href="/pre-register"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-black text-[#E83526] hover:bg-[#F4F1EA] hover:text-black text-base sm:text-lg font-bold transition-all shadow-[0_10px_35px_rgba(0,0,0,0.35)] duration-300 border-2 border-black"
          >
            Get early access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
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
