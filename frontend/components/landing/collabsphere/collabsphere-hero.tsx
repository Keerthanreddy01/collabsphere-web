"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCollabsphere } from "./collabsphere-context";
import { CollabsphereHeader } from "./collabsphere-header";

export function CollabsphereHero() {
  const { ready } = useCollabsphere();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax calculations
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden rounded-[var(--radius-card-lg)] flex flex-col bg-[#050505] text-white"
      style={{ height: "calc(100svh - 1rem)", minHeight: "45rem" }}
    >
      <CollabsphereHeader />

      {/* Massive Background Text Layer (z-10) */}
      <motion.div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        style={{ y: textY }}
      >
        <div className="w-full px-4 flex flex-col items-center leading-[0.75] font-black uppercase text-[#dc2626] tracking-tighter">
          <motion.span 
            className="text-[22vw]"
            initial={{ opacity: 0, y: 100 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            COLLAB
          </motion.span>
          <motion.span 
            className="text-[22vw]"
            initial={{ opacity: 0, y: 100 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            SPHERE
          </motion.span>
        </div>
      </motion.div>

      {/* Central Cutout Subject Layer (z-20) */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-[800px] h-[85%]"
        style={{ y: imageY }}
        initial={{ opacity: 0, y: 100, x: "-50%" }}
        animate={ready ? { opacity: 1, y: 0, x: "-50%" } : { opacity: 0, y: 100, x: "-50%" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        {/* Replace this src with your actual transparent PNG cutout */}
        <img 
          src="https://images.squarespace-cdn.com/content/v1/5c5a519771069924879cc8a3/1549503923508-RUMC4C5Y9U1X5I42X6H9/portrait-placeholder-transparent.png" 
          alt="Subject Cutout" 
          className="w-full h-full object-contain object-bottom opacity-90 contrast-125 grayscale"
        />
        {/* Added a subtle gradient to blend the bottom edge smoothly into the dark background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </motion.div>

      {/* Overlay UI Layer (z-30) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between pt-32 pb-12 px-8 sm:px-16">
        
        {/* Top Text Blocks */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          
          {/* Left Block */}
          <motion.div 
            className="flex flex-col font-black uppercase text-2xl sm:text-4xl leading-[0.9] tracking-tighter"
            initial={{ opacity: 0, x: -40 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>BUILDERS</span>
            <span>ENGINEERS</span>
            <span>DESIGNERS</span>
            <span>CREATIVES</span>
          </motion.div>

          {/* Right Paragraph */}
          <motion.div 
            className="max-w-[300px] text-right text-white/50 text-xs sm:text-sm leading-relaxed font-light"
            initial={{ opacity: 0, x: 40 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>
              We don't just build software that shouldn't be possible — we engineer culture and make it inevitable. Four exits, one playbook: conviction before consensus.
            </p>
          </motion.div>
        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div 
          className="flex items-center gap-4 text-white/40 pointer-events-auto cursor-pointer group w-max"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={() => {
            const nextSection = document.getElementById("home")?.nextElementSibling;
            nextSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div className="w-12 h-[1px] bg-red-600 group-hover:w-16 transition-all duration-300" />
          <span className="text-[0.65rem] uppercase tracking-[0.2em] font-medium group-hover:text-white transition-colors">
            Scroll to enter
          </span>
        </motion.div>

      </div>
    </section>
  );
}
