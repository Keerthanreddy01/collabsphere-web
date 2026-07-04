"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Animate the huge text scaling down/blurring and the CTA button appearing
    tl.to(textRef.current, { scale: 0.8, opacity: 0, filter: "blur(20px)", ease: "none" }, 0)
      .fromTo(ctaRef.current, 
         { y: 150, opacity: 0, scale: 0.9 }, 
         { y: 0, opacity: 1, scale: 1, ease: "none" }, 0.2);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[150vh] bg-[#050505]">
      <div className="sticky top-0 h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Layer 1: Noise */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Layer 2: Massive Text */}
        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <h2 className="font-anton text-[15vw] leading-none uppercase text-white tracking-tighter text-center mix-blend-difference">
            READY<br/>TO BUILD?
          </h2>
        </div>

        {/* Layer 3: CTA Box */}
        <div ref={ctaRef} className="relative z-20 flex flex-col items-center">
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#E83526] mb-8" />
          <Link href="/pre-register" className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 rounded-full bg-[#E83526] text-white font-anton text-3xl uppercase tracking-wider overflow-hidden transition-transform hover:scale-105 shadow-[0_20px_50px_rgba(232,53,38,0.3)]">
            <div className="absolute inset-0 bg-white/20 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Join the Waitlist</span>
            <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-8 font-mono text-neutral-500 text-sm uppercase tracking-widest">Early access opening soon</p>
        </div>

      </div>
    </section>
  );
}
