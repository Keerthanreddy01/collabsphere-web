"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePlatformStats } from "@/hooks/usePlatformStats";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
   const containerRef = useRef<HTMLDivElement>(null);
   const trackRef = useRef<HTMLDivElement>(null);
   const titleRef = useRef<HTMLHeadingElement>(null);
   const cardsRef = useRef<HTMLDivElement[]>([]);

   const { stats, isLoading } = usePlatformStats();

   useGSAP(() => {
      const tl = gsap.timeline({
         scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
         },
      });

      // Translate the track horizontally
      tl.to(titleRef.current, { x: "-20vw", opacity: 0, filter: "blur(5px)", ease: "none" }, 0)
         .to(trackRef.current, { x: "-90vw", ease: "none" }, 0);

      // Parallax on cards inner elements during scroll
      cardsRef.current.forEach((card, i) => {
         if (!card) return;
         tl.to(card, { rotationY: -5, rotationX: 2, scale: 0.95, ease: "none" }, 0);
      });

   }, { scope: containerRef });

   return (
      <section ref={containerRef} className="relative w-full h-[180vh] bg-[#050505] overflow-hidden">
         <div className="sticky top-0 h-[100vh] w-full flex flex-col justify-center perspective-[1000px]">

            {/* Layer 1: Noise & Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
               style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Floating title */}
            <h2 ref={titleRef} className="absolute left-8 md:left-24 top-24 md:top-32 font-anton text-6xl md:text-[8rem] text-white uppercase leading-none z-10 select-none drop-shadow-2xl mix-blend-difference">
               THE<br /><span className="text-[#E83526]">COMMUNITY</span>
            </h2>

            {/* Horizontal Track */}
            <div ref={trackRef} className="relative flex items-center gap-8 md:gap-16 pl-[20vw] md:pl-[45vw] mt-24 md:mt-32 w-[300vw] h-[600px] z-20">

               {/* Card 1 */}
               <div ref={el => { if (el) cardsRef.current[0] = el }} className="w-[320px] md:w-[420px] h-[450px] md:h-[550px] shrink-0 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                  <div>
                     <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E83526]" />
                        Global Network
                     </span>
                     <h3 className="font-anton text-3xl md:text-5xl text-white mt-6 uppercase leading-tight">Verified Builders</h3>
                     <p className="text-neutral-400 mt-6 leading-relaxed font-sans text-sm md:text-base max-w-sm">No LinkedIn fluff. Connect with developers who have real production history and code audits. The network is curated for action.</p>
                  </div>
                  <div className="pt-8 border-t border-white/[0.06] mt-8">
                     <div className="text-5xl md:text-7xl font-anton text-[#E83526] tracking-tighter">{isLoading ? "—" : stats.activeBuilders.toLocaleString()}+</div>
                     <div className="text-xs md:text-sm font-mono text-neutral-500 mt-3">Active Users</div>
                  </div>
               </div>

               {/* Card 2 */}
               <div ref={el => { if (el) cardsRef.current[1] = el }} className="w-[320px] md:w-[420px] h-[450px] md:h-[550px] shrink-0 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                     <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Collaboration
                     </span>
                     <h3 className="font-anton text-3xl md:text-5xl text-white mt-6 uppercase leading-tight">Build in Public</h3>
                     <p className="text-neutral-400 mt-6 leading-relaxed font-sans text-sm md:text-base max-w-sm">Share progress, attract high-tier collaborators, and build your reputation based on actual commits and shipped features.</p>
                  </div>
                  <div className="relative z-10 pt-8 border-t border-white/[0.06] mt-8">
                     <div className="text-5xl md:text-7xl font-anton text-blue-500 tracking-tighter">{isLoading ? "—" : stats.openCollabRequests.toLocaleString()}+</div>
                     <div className="text-xs md:text-sm font-mono text-neutral-500 mt-3">Open Requests</div>
                  </div>
               </div>

               {/* Card 3 */}
               <div ref={el => { if (el) cardsRef.current[2] = el }} className="w-[320px] md:w-[420px] h-[450px] md:h-[550px] shrink-0 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8FFF00]/10 blur-[100px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                     <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8FFF00]" />
                        Incubator
                     </span>
                     <h3 className="font-anton text-3xl md:text-5xl text-white mt-6 uppercase leading-tight">Projects Launched</h3>
                     <p className="text-neutral-400 mt-6 leading-relaxed font-sans text-sm md:text-base max-w-sm">The teams formed here are building the next generation of software. Start small, validate fast, and ship elite-grade products.</p>
                  </div>
                  <div className="relative z-10 pt-8 border-t border-white/[0.06] mt-8">
                     <div className="text-5xl md:text-7xl font-anton text-[#8FFF00] tracking-tighter">{isLoading ? "—" : stats.projectsLaunched.toLocaleString()}+</div>
                     <div className="text-xs md:text-sm font-mono text-neutral-500 mt-3">Successful Launches</div>
                  </div>
               </div>

            </div>

         </div>
      </section>
   );
}
