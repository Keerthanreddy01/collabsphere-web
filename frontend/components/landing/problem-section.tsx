"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const copy =
    "Most great ideas never get built. Not because the idea was bad. Because the right people never found each other.";
  const words = copy.split(" ");

  useGSAP(
    () => {
      const wordsElements = textRef.current?.querySelectorAll(".word");
      if (!wordsElements || wordsElements.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      tl.to(wordsElements, {
        opacity: 1,
        y: 0,
        color: "#ffffff",
        stagger: 0.1,
        ease: "power1.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] text-white flex items-center justify-center overflow-hidden z-20 border-b border-white/[0.03]"
    >
      {/* Subtle Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Large centered typography quote */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 text-center z-20">
        <div
          ref={textRef}
          className="text-[clamp(2.2rem,6.5vw,5.8rem)] leading-[1.05] tracking-[-0.03em] font-serif-italic text-left md:text-center select-none italic text-neutral-800"
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="word inline-block mr-[0.22em] mb-[0.08em]"
              style={{
                opacity: 0.08,
                transform: "translateY(18px)",
                willChange: "opacity, transform",
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
