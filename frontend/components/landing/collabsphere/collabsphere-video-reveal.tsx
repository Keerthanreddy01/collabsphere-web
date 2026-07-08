"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";

export function CollabsphereVideoReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const textBlur = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [10, 0, 0, 10]);

  return (
    <section ref={containerRef} className="relative w-full min-h-[120vh] bg-[#0a0a0a] overflow-hidden flex flex-col items-center pt-24 pb-32">
      
      {/* Big Top Text */}
      <motion.h2 
        className="text-[12vw] sm:text-[15vw] leading-[0.8] font-bold text-[#dc2626] tracking-tighter uppercase z-10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        BUILDERS
      </motion.h2>

      <div className="relative w-full flex-1 flex flex-col items-center justify-center mt-[-4vw]">
        
        {/* Background Blurred Typography */}
        <motion.div 
          style={{ filter: `blur(${textBlur}px)` }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center leading-[0.9] text-[6vw] sm:text-[8vw] font-bold uppercase tracking-tight text-[#dc2626]"
        >
          <span>A Culture Driven</span>
          <span>Creative</span>
          <span className="text-white font-['Playfair_Display'] italic text-[8vw] sm:text-[10vw] lowercase my-2">and</span>
          <span>Digital Shop</span>
        </motion.div>

        {/* Video / Image Plate */}
        <motion.div 
          style={{ scale, y }}
          className="relative w-[90%] max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 z-20 mt-16 sm:mt-32 cursor-pointer group"
        >
          {/* Placeholder for actual video - using a red gradient placeholder for now */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7f1d1d] to-black opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
          
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop" 
            alt="Team collaboration" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-2" />
            </div>
          </div>
          
          {/* Progress Bar Mockup */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
            <Play className="w-5 h-5 text-white fill-white" />
            <div className="text-white font-mono text-sm">0:02 / 0:21</div>
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 bottom-0 w-[10%] bg-white rounded-full" />
              <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-white rounded-full -translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
