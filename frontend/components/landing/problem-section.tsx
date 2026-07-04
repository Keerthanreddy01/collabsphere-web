"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const bgTextRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const uiLeftRef = useRef<HTMLDivElement>(null);
  const uiRightRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Cinematic Motion Hierarchy
    tl.to(bgTextRef.current, { y: "15vh", opacity: 0.08, filter: "blur(6px)", scale: 1.05, ease: "none" }, 0)
      .fromTo(quoteRef.current, 
         { y: 150, opacity: 0, clipPath: "inset(100% 0 0 0)", filter: "blur(10px)", scale: 0.95 }, 
         { y: "-10vh", opacity: 1, clipPath: "inset(0% 0 0 0)", filter: "blur(0px)", scale: 1, ease: "none" }, 0)
      .fromTo(uiLeftRef.current,
         { y: 400, x: -100, rotation: -20, opacity: 0, scale: 0.8 },
         { y: "-50vh", x: -20, rotation: -5, opacity: 1, scale: 1, ease: "none" }, 0)
      .fromTo(uiRightRef.current,
         { y: 500, x: 100, rotation: 20, opacity: 0, scale: 0.8 },
         { y: "-60vh", x: 20, rotation: 5, opacity: 1, scale: 1, ease: "none" }, 0)
      .to(graphicRef.current, { scale: 1.3, rotation: 15, opacity: 0.1, ease: "none" }, 0);
      
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[180vh] bg-[#050505]">
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Layer 1: Noise & Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
             style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Layer 2: Massive Background Typography */}
        <div ref={bgTextRef} className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]">
          <h2 className="font-anton uppercase text-white leading-none whitespace-nowrap" style={{ fontSize: "clamp(10rem, 30vw, 30rem)" }}>
            ISOLATED
          </h2>
        </div>

        {/* Layer 3: The Quote (Main Focus) */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-12 text-center pointer-events-none">
          <div ref={quoteRef} className="flex flex-col items-center gap-10">
            <span className="font-mono text-[10px] text-[#E83526] tracking-[0.3em] uppercase border border-[#E83526]/30 px-5 py-2 rounded-full bg-[#E83526]/10 backdrop-blur-sm">
              The Problem
            </span>
            <h3 className="font-serif-italic text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight text-white/90 italic drop-shadow-2xl">
              Most great ideas never get built.<br />
              <span className="text-white/40">Not because the idea was bad.</span><br />
              Because the right people never found each other.
            </h3>
          </div>
        </div>

        {/* Layer 4: Disconnected UI Elements (Floating) */}
        <div ref={uiLeftRef} className="absolute left-[5%] md:left-[15%] top-[80%] z-30 w-52 bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-blue-400" /></div>
             <div><p className="text-[12px] text-white font-bold">Designer</p><p className="text-[10px] text-neutral-500 font-mono mt-0.5">Looking for Dev</p></div>
          </div>
        </div>

        <div ref={uiRightRef} className="absolute right-[5%] md:right-[15%] top-[90%] z-30 w-52 bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><X className="w-5 h-5 text-emerald-400" /></div>
             <div><p className="text-[12px] text-white font-bold">Backend Dev</p><p className="text-[10px] text-neutral-500 font-mono mt-0.5">Looking for UI</p></div>
          </div>
        </div>
        
        {/* Layer 5: Center Graphic Connection Broken */}
        <div ref={graphicRef} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[0.5px] border-white/5 rounded-full opacity-20 pointer-events-none" />

      </div>
    </section>
  );
}
