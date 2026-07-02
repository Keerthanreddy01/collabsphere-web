"use client";

import { useRef } from "react";
import { ChevronsRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll animations tied to scroll position
  const opacityHeader = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const yConnect = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
  const xEverything = useTransform(scrollYProgress, [0.15, 0.35], [100, 0]);
  const opacityEverything = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  
  const yParagraph = useTransform(scrollYProgress, [0.2, 0.4], [50, 0]);
  const opacityParagraph = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  
  const yCards = useTransform(scrollYProgress, [0.3, 0.55], [150, 0]);
  const opacityCards = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const scaleCards = useTransform(scrollYProgress, [0.3, 0.55], [0.95, 1]);

  return (
    <section id="integrations" ref={sectionRef} className="relative overflow-hidden pb-32">

      {/* The Header was removed per user request */}

      {/* Pixelated Cards Section */}
      <motion.div 
        style={{ y: yCards, opacity: opacityCards, scale: scaleCards }}
        className="relative w-full max-w-6xl mx-auto mt-16 lg:mt-32 p-4 lg:p-12 will-change-transform"
      >
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] rounded-3xl z-0" />
        
        {/* Eyebrow tiny text */}
        <div className="relative z-10 w-full flex justify-center mb-8">
          <span className="text-[#D4FF26] text-[10px] sm:text-xs font-bold tracking-widest uppercase">GET INVOLVED</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Card 1 (Yellow) */}
          <div className="relative w-full aspect-square flex items-center justify-center group cursor-pointer">
            <div 
              className="absolute inset-0 bg-[#D4FF26] transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                clipPath: "polygon(20% 20%, 30% 20%, 30% 10%, 40% 10%, 40% 20%, 60% 20%, 60% 10%, 70% 10%, 70% 20%, 80% 20%, 80% 30%, 90% 30%, 90% 40%, 100% 40%, 100% 60%, 90% 60%, 90% 70%, 80% 70%, 80% 80%, 70% 80%, 70% 90%, 50% 90%, 50% 80%, 30% 80%, 30% 90%, 20% 90%, 20% 80%, 10% 80%, 10% 70%, 0% 70%, 0% 50%, 10% 50%, 10% 40%, 0% 40%, 0% 30%, 10% 30%, 10% 20%)"
              }}
            />
            <div className="relative z-10 flex flex-col justify-between w-full h-full p-16 sm:p-24 lg:p-32 pointer-events-none">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#111111] leading-[1.1]">
                Grow your<br />community
              </h3>
              <div className="flex justify-end mt-auto">
                <ChevronsRight className="w-10 h-10 text-[#111111] transition-transform duration-300 group-hover:translate-x-3" />
              </div>
            </div>
          </div>

          {/* Card 2 (Dark) */}
          <div className="relative w-full aspect-square flex items-center justify-center group cursor-pointer">
            <div 
              className="absolute inset-0 bg-[#161616] transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                clipPath: "polygon(10% 20%, 20% 20%, 20% 10%, 40% 10%, 40% 20%, 50% 20%, 50% 10%, 70% 10%, 70% 20%, 80% 20%, 80% 40%, 90% 40%, 90% 60%, 100% 60%, 100% 80%, 80% 80%, 80% 90%, 60% 90%, 60% 80%, 50% 80%, 50% 90%, 30% 90%, 30% 80%, 20% 80%, 20% 90%, 10% 90%, 10% 80%, 0% 80%, 0% 60%, 10% 60%, 10% 50%, 0% 50%, 0% 30%, 10% 30%)"
              }}
            />
            <div className="relative z-10 flex flex-col justify-between w-full h-full p-16 sm:p-24 lg:p-32 pointer-events-none">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#D4FF26] leading-[1.1]">
                Own the<br />future
              </h3>
              <div className="flex justify-end mt-auto">
                <ChevronsRight className="w-10 h-10 text-[#D4FF26] transition-transform duration-300 group-hover:translate-x-3" />
              </div>
            </div>
          </div>

        </div>
      </motion.div>

    </section>
  );
}
