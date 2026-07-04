"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ProfileCards() {
  const ps = [
    { i: "MK", n: "Mike K.", r: "Full-Stack Dev", sk: ["React", "Node", "Postgres"], s: "Open to collab", g: "from-blue-600/20 to-violet-600/20", ro: "-5deg", t: "0", ri: "0" },
    { i: "AS", n: "Ana S.", r: "Product Designer", sk: ["Figma", "Framer", "UX"], s: "Looking for builders", g: "from-pink-600/20 to-rose-600/20", ro: "4deg", t: "110px", ri: "40px" },
    { i: "TG", n: "Tom G.", r: "Backend Eng", sk: ["Go", "Postgres", "gRPC"], s: "Open to equity", g: "from-emerald-600/20 to-teal-600/20", ro: "-2deg", t: "220px", ri: "10px" },
  ];
  return (
    <div className="relative h-[450px] w-full max-w-[380px] perspective-[1000px]">
      {ps.map((p, i) => (
        <div key={i} className={`profile-card profile-card-${i} absolute w-[280px] rounded-2xl bg-[#0d0d0d] border border-white/[0.08] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-md`}
          style={{ transform: `rotate(${p.ro}) translateZ(${-i * 50}px)`, top: p.t, right: p.ri, zIndex: 10 - i }}>
          <div className={`w-full h-12 rounded-xl mb-4 bg-gradient-to-br ${p.g}`} />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white">{p.i}</div>
            <div>
              <div className="text-sm font-semibold text-white">{p.n}</div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{p.r}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.sk.map(s => <span key={s} className="text-[10px] px-2 py-1 rounded bg-white/[0.03] text-neutral-400 border border-white/[0.05] font-mono">{s}</span>)}
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.05] pt-3 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#8FFF00] animate-pulse shadow-[0_0_10px_rgba(143,255,0,0.5)]" />
            <span className="text-[11px] text-[#8FFF00] font-medium tracking-wide uppercase">{p.s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturePanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    const cards = cardsRef.current?.querySelectorAll(".profile-card");

    // Timeline for the 3 steps during the 220vh scroll
    // Total progress 0 to 1
    
    // Step 1 active at start
    tl.to(step1Ref.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 1)
      .fromTo(step2Ref.current, { opacity: 0, y: 50, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, 1)
      
      // Animate cards for step 2
      .to(cards?.[0] || null, { x: -100, y: -50, rotation: -15, scale: 0.9, opacity: 0, duration: 1 }, 1)
      .to(cards?.[1] || null, { x: 0, y: -100, rotation: 0, scale: 1.05, duration: 1 }, 1)
      .to(numRef.current, { y: "-33.33%", duration: 1 }, 1)

      // Step 2 to 3
      .to(step2Ref.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 }, 3)
      .fromTo(step3Ref.current, { opacity: 0, y: 50, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }, 3)
      
      // Animate cards for step 3
      .to(cards?.[1] || null, { x: 100, y: -50, rotation: 15, scale: 0.9, opacity: 0, duration: 1 }, 3)
      .to(cards?.[2] || null, { x: 0, y: -220, rotation: 0, scale: 1.1, duration: 1 }, 3)
      .to(numRef.current, { y: "-66.66%", duration: 1 }, 3)
      
      // Hold at the end
      .to({}, { duration: 1 });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#050505]">
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-8 md:px-16">
        
        {/* Left Side: Split Layout Typography */}
        <div className="w-full md:w-1/2 flex flex-col relative z-20">
           
           {/* Huge masked scrolling numbers */}
           <div className="absolute -left-10 md:-left-20 top-1/2 -translate-y-1/2 h-[180px] overflow-hidden opacity-10 pointer-events-none select-none z-0">
             <div ref={numRef} className="flex flex-col font-anton text-[#E83526] leading-none" style={{ fontSize: "200px" }}>
               <span>01</span>
               <span>02</span>
               <span>03</span>
             </div>
           </div>

           <div className="relative z-10 h-[300px] flex items-center">
             
             {/* Step 1 */}
             <div ref={step1Ref} className="absolute w-full">
               <h3 className="font-anton text-5xl md:text-6xl text-white uppercase tracking-tight mb-6">
                 Post your<br/><span className="text-[#E83526]">build</span>
               </h3>
               <p className="font-sans text-neutral-400 text-base md:text-lg max-w-sm leading-relaxed border-l border-[#E83526]/50 pl-6">
                 Document your progress, stack, and goals. Share daily updates and let the community see what you're shipping.
               </p>
             </div>

             {/* Step 2 */}
             <div ref={step2Ref} className="absolute w-full opacity-0 translate-y-[50px] blur-[10px]">
               <h3 className="font-anton text-5xl md:text-6xl text-white uppercase tracking-tight mb-6">
                 Find your<br/><span className="text-[#E83526]">people</span>
               </h3>
               <p className="font-sans text-neutral-400 text-base md:text-lg max-w-sm leading-relaxed border-l border-[#E83526]/50 pl-6">
                 Connect with developers who complement your skills. No resume padding, just real proof of work.
               </p>
             </div>

             {/* Step 3 */}
             <div ref={step3Ref} className="absolute w-full opacity-0 translate-y-[50px] blur-[10px]">
               <h3 className="font-anton text-5xl md:text-6xl text-white uppercase tracking-tight mb-6">
                 Ship<br/><span className="text-[#E83526]">together</span>
               </h3>
               <p className="font-sans text-neutral-400 text-base md:text-lg max-w-sm leading-relaxed border-l border-[#E83526]/50 pl-6">
                 Form founding teams, spin up repositories, and launch. Stop planning and start shipping.
               </p>
             </div>
             
           </div>
        </div>

        {/* Right Side: Layered UI Mockups */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-16 md:mt-0 relative z-10">
          <div ref={cardsRef} className="relative">
            <div className="absolute inset-0 bg-[#E83526]/5 blur-[100px] rounded-full scale-150 pointer-events-none" />
            <ProfileCards />
          </div>
        </div>

      </div>
    </section>
  );
}
