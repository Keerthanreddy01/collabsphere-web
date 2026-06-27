"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

export function PodcastSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for the edge-to-edge image
  const yImage = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacityText = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0, 1, 0]);
  const yText = useTransform(scrollYProgress, [0.1, 0.4], [50, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={sectionRef} className="relative w-full py-20 bg-[#1c1c1c] text-white flex flex-col font-sans overflow-hidden selection:bg-[#8FFF00] selection:text-black">
      
      {/* Edge-to-Edge Image with Blend/Mask Effect */}
      <div className="absolute inset-0 top-0 w-full h-[60vh] sm:h-[80vh] z-0 pointer-events-none">
        <motion.div 
          style={{ y: yImage, scale: scaleImage }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-[url('/landing/keyboard.png')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1c1c1c]/50 to-[#1c1c1c] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c] via-transparent to-[#1c1c1c] pointer-events-none" />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-7xl mx-auto z-20 relative px-4 pt-[10vh] sm:pt-[20vh] pb-12 sm:pb-24">
        
        {/* Info Section */}
        <motion.div 
          style={{ opacity: opacityText, y: yText }}
          className="w-full flex flex-col items-start px-4 max-w-6xl mx-auto"
        >
          <h1 className="flex flex-col w-full text-left text-white mb-10 drop-shadow-2xl">
            <span className="font-anton text-[4rem] sm:text-[7rem] md:text-[9.5rem] leading-[0.85] tracking-normal uppercase">
              Build The Future,
            </span>
            <span className="font-serif-italic text-5xl sm:text-7xl md:text-[8rem] tracking-tighter leading-none mt-2 text-[#E83526] md:self-end md:pr-12">
              Together.
            </span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-10 mt-8 md:mt-16">
            <p className="text-lg sm:text-2xl text-white/80 max-w-xl leading-relaxed font-medium drop-shadow-lg">
              Connect with live builders in real-time, collaborate on open-source projects, and showcase your skills.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button className="flex items-center justify-center gap-3 bg-[#E83526] text-white hover:bg-[#F4F1EA] hover:text-black px-8 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg transition-colors group w-full sm:w-auto">
                <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                Watch Demo
              </button>
              
              <a href="/pre-register" className="flex items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-full bg-transparent border border-white/30 hover:border-white hover:bg-white hover:text-black transition-all font-bold text-base sm:text-lg text-white group w-full sm:w-auto">
                Join Waitlist <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
}
