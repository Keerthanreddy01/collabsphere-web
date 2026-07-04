"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FeaturePanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tape1Ref = useRef<HTMLDivElement>(null);
  const tape2Ref = useRef<HTMLDivElement>(null);
  const tape3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Pin the section container and scrub the slide-in timeline of the tapes
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Scroll distance for pinning
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Animate each tape sliding in from alternating sides
      tl.to(tape1Ref.current, { x: "0%", duration: 1 })
        .to(tape2Ref.current, { x: "0%", duration: 1 }, "+=0.3")
        .to(tape3Ref.current, { x: "0%", duration: 1 }, "+=0.3");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden z-20 flex flex-col justify-center border-b border-white/[0.03]"
    >
      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Background large decorative text */}
      <div className="absolute top-[8%] left-[10%] opacity-[0.02] text-white text-[12vw] font-anton leading-none uppercase pointer-events-none select-none tracking-wider">
        HOW WE BUILD
      </div>

      <div className="w-full relative flex flex-col justify-center gap-12 sm:gap-16 py-10 z-20">
        
        {/* Tape 1: Slides in from the right, tilted slightly up */}
        <div
          ref={tape1Ref}
          style={{ transform: "translateX(120%)" }}
          className="w-[115vw] -ml-[7vw] bg-[#E83526] py-5 sm:py-7 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-y-2 border-black rotate-[-2deg] flex items-center justify-center transition-transform duration-75"
        >
          <div className="w-full max-w-7xl mx-auto px-10 flex items-center justify-between text-black">
            <div className="flex items-center gap-6 sm:gap-10">
              <span className="font-anton text-7xl sm:text-[7.5rem] leading-none text-black select-none tracking-tighter">
                01
              </span>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-anton text-2xl sm:text-4xl uppercase tracking-tight">
                    POST YOUR BUILD
                  </h3>
                  <span className="text-xl sm:text-2xl">★</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-black/85 max-w-md md:max-w-xl font-medium leading-tight">
                  Document your progress, stack, and goals. Share daily updates and let the community see what you're shipping.
                </p>
              </div>
            </div>
            {/* Right side large star detail */}
            <div className="hidden lg:block text-5xl">★</div>
          </div>
        </div>

        {/* Tape 2: Slides in from the left, tilted slightly down */}
        <div
          ref={tape2Ref}
          style={{ transform: "translateX(-120%)" }}
          className="w-[115vw] -ml-[7vw] bg-[#E83526] py-5 sm:py-7 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-y-2 border-black rotate-[2.5deg] flex items-center justify-center transition-transform duration-75"
        >
          <div className="w-full max-w-7xl mx-auto px-10 flex items-center justify-between text-black">
            <div className="flex items-center gap-6 sm:gap-10">
              <span className="font-anton text-7xl sm:text-[7.5rem] leading-none text-black select-none tracking-tighter">
                02
              </span>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-anton text-2xl sm:text-4xl uppercase tracking-tight">
                    FIND YOUR PEOPLE
                  </h3>
                  <span className="text-xl sm:text-2xl">★</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-black/85 max-w-md md:max-w-xl font-medium leading-tight">
                  Connect with developers who complement your skills. No resume padding, just real proof of work.
                </p>
              </div>
            </div>
            <div className="hidden lg:block text-5xl">★</div>
          </div>
        </div>

        {/* Tape 3: Slides in from the right, tilted slightly up */}
        <div
          ref={tape3Ref}
          style={{ transform: "translateX(120%)" }}
          className="w-[115vw] -ml-[7vw] bg-[#E83526] py-5 sm:py-7 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-y-2 border-black rotate-[-1.8deg] flex items-center justify-center transition-transform duration-75"
        >
          <div className="w-full max-w-7xl mx-auto px-10 flex items-center justify-between text-black">
            <div className="flex items-center gap-6 sm:gap-10">
              <span className="font-anton text-7xl sm:text-[7.5rem] leading-none text-black select-none tracking-tighter">
                03
              </span>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-anton text-2xl sm:text-4xl uppercase tracking-tight">
                    SHIP TOGETHER
                  </h3>
                  <span className="text-xl sm:text-2xl">★</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-black/85 max-w-md md:max-w-xl font-medium leading-tight">
                  Form founding teams, spin up repositories, and launch. Stop planning and start shipping.
                </p>
              </div>
            </div>
            <div className="hidden lg:block text-5xl">★</div>
          </div>
        </div>

      </div>
    </section>
  );
}
