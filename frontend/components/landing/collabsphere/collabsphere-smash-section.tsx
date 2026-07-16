"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function CollabsphereSmashSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Ultimate Parallax for the main image
  const imageY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  const imageRotateX = useTransform(scrollYProgress, [0, 1], [10, -5]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#ffffff] pt-24 sm:pt-32 pb-20 flex flex-col items-center"
      style={{ perspective: "1000px" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .wise-section {
          --color-forest-ink: #163300;
          --color-lime-voltage: #9fe870;
        }
        .font-elegant {
          font-family: var(--font-fraunces), serif;
          font-weight: 500;
          letter-spacing: -0.02em;
        }
      `}} />

      {/* 4k crisp grid background lines - fades in below the text */}
      <div
        className="absolute inset-0 z-0 pointer-events-none top-[30vh]"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: 'center top',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
        }}
      />

      {/* Text Section */}
      <div className="wise-section mx-auto flex max-w-[1200px] flex-col items-center px-4 text-center relative z-20 mb-4 sm:mb-8">
        <motion.div style={{ y: textY }} className="flex flex-col items-center w-full">
          
          <div className="relative w-full max-w-[900px] mx-auto">
            {/* Side Info Tagline (Desktop) */}
            <div className="absolute top-[20%] -left-[10%] xl:-left-[20%] hidden lg:flex flex-col items-start text-left max-w-[160px] opacity-80">
              <div className="w-10 h-[2px] bg-[#dc2626] mb-4"></div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#dc2626] mb-2">Global Scale</span>
              <p className="text-[13px] font-sans text-[#454745] leading-relaxed">
                Connect with the top 1% of builders and engineers worldwide.
              </p>
            </div>

            <h1 className="font-elegant text-[clamp(48px,8vw,100px)] leading-[0.95] text-[#0e0f0c]">
              Collaborate here,<br className="hidden sm:block" />
              there and <span className="text-[#dc2626] italic font-normal">everywhere.</span>
            </h1>
          </div>

          <p className="mt-8 max-w-[600px] text-[18px] leading-[1.5] text-[#454745] font-sans px-4">
            The platform built to scale your vision across the globe. Join the network today.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link href="/pre-register">
              <button className="rounded-full bg-[#dc2626] hover:bg-[#991b1b] px-10 py-[16px] text-[18px] font-black text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.6)] border border-red-500/20">
                JOIN NOW
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Image Container */}
      <motion.div
        style={{
          y: imageY,
          scale: imageScale,
          rotateX: imageRotateX,
          opacity: imageOpacity,
          transformStyle: "preserve-3d"
        }}
        className="relative z-10 w-full max-w-[1400px] flex items-center justify-center overflow-visible origin-top"
      >
        <img 
          src="/smash-image.png" 
          alt="Collabsphere Smash" 
          className="w-full md:w-[110%] h-auto object-cover object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" 
          style={{
            maskImage: 'linear-gradient(to right, black 92%, transparent 99%)',
            WebkitMaskImage: 'linear-gradient(to right, black 92%, transparent 99%)'
          }}
        />
      </motion.div>
    </section>
  );
}
