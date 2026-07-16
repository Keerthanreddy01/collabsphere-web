"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollingRevealSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress for the whole section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Track scroll progress just for the text reveal (starts when center of screen hits top of section)
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center center"]
  });

  // Parallax rows
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // New: Background Reveal Parallax Effect
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const scrollerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.2]);

  const paragraph = "WE ARE A NETWORK OF TIRELESS CREATORS. NO EXCUSES. JUST SHIPPED PRODUCTS. IF YOU ARE READY TO BUILD THE FUTURE, YOU BELONG HERE.";
  const words = paragraph.split(" ");

  return (
    <section ref={containerRef} className="relative w-full bg-[#1c1c1c] py-32 lg:py-48 overflow-hidden flex flex-col items-center justify-center min-h-screen z-10">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,500&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .font-serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
      `}} />

      {/* New: Cinematic Background Glow Reveal */}
      <motion.div 
        style={{ opacity: bgOpacity, scale: bgScale, y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
      >
        <div className="w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E83526]/15 via-transparent to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Massive Background Scrollers */}
      <motion.div style={{ opacity: scrollerOpacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden select-none gap-8 z-0">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap gap-12">
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="font-anton text-[8rem] sm:text-[12rem] lg:text-[16rem] uppercase text-[#E83526] leading-none tracking-tight">
              CONNECT. BUILD.
            </h1>
          ))}
        </motion.div>

        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap gap-12 -ml-[20%]">
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="font-anton text-[8rem] sm:text-[12rem] lg:text-[16rem] uppercase text-transparent leading-none tracking-tight" style={{ WebkitTextStroke: '2px #E83526' }}>
              FIND YOUR TRIBE.
            </h1>
          ))}
        </motion.div>

        <motion.div style={{ x: x3 }} className="flex whitespace-nowrap gap-12">
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="font-anton text-[8rem] sm:text-[12rem] lg:text-[16rem] uppercase text-[#E83526] leading-none tracking-tight">
              SHIP. REPEAT.
            </h1>
          ))}
        </motion.div>
      </motion.div>

      {/* Foreground Word-by-Word Reveal */}
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 text-center flex flex-wrap justify-center gap-x-4 gap-y-2 lg:gap-x-6 lg:gap-y-4">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          return (
            <RevealWord key={i} word={word} progress={revealProgress} start={start} end={end} />
          );
        })}
      </div>

    </section>
  );
}

function RevealWord({ word, progress, start, end }: { word: string, progress: any, start: number, end: number }) {
  // Map this word's opacity to its specific slice of the scroll progress
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const color = useTransform(progress, [start, end], ["#444444", "#F4F1EA"]);

  return (
    <motion.span 
      style={{ opacity, color }}
      className="font-anton text-3xl sm:text-6xl lg:text-[6.5rem] uppercase tracking-wide"
    >
      {word}
    </motion.span>
  );
}
