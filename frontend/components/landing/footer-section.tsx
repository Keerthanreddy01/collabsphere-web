"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function FooterSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Set up the scrollytelling animation hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Background container reveal
  const yReveal = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const opacityReveal = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const scaleReveal = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  // Cool inner text parallax effects based on scroll! (Reduced to be more subtle)
  const collabX = useTransform(scrollYProgress, [0, 1], [-40, 0]);
  const taglineX = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const linksY = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <footer ref={containerRef} className="relative w-full bg-[#1c1c1c] px-4 sm:px-6 md:px-8 pb-8 pt-12 sm:pt-20 font-sans overflow-hidden perspective-1000">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,500&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .font-serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
      `}} />

      <motion.div 
        style={{ y: yReveal, opacity: opacityReveal, scale: scaleReveal }}
        className="w-full max-w-[1600px] mx-auto bg-[#F4F1EA] rounded-[2rem] px-8 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16 pt-28 lg:pt-36 flex flex-col gap-12 lg:gap-20 text-[#E83526] shadow-2xl will-change-transform"
      >
        
        {/* Top Section: Giant Text & Tagline */}
        <div className="flex flex-col justify-between items-start gap-4 lg:gap-2 overflow-visible w-full">
          
          <motion.div 
            style={{ x: collabX }}
            className="mt-8 mb-4 lg:mb-2 shrink-0 will-change-transform w-full z-10"
          >
              <h1 className="font-anton leading-[0.85] uppercase tracking-normal text-[#E83526]" style={{ fontSize: "clamp(2.5rem, 11vw, 13rem)" }}>
                COLLABSPHERE
              </h1>
          </motion.div>

          <motion.div 
            style={{ x: taglineX }}
            className="self-end shrink-0 mt-4 lg:mt-0 will-change-transform pb-4"
          >
            <h2 className="flex flex-col items-end text-right text-[#E83526]">
              {/* Mixed sizes for a highly unique, premium editorial typography look */}
              <span className="font-serif-italic text-3xl sm:text-4xl lg:text-5xl tracking-tight opacity-80 mb-1 lg:mb-2 pr-1 lg:pr-4">
                Built by builders,
              </span>
              <span className="font-serif-italic text-5xl sm:text-7xl lg:text-[7.5rem] tracking-tighter leading-none pr-1 lg:pr-4 pb-2">
                for builders.
              </span>
            </h2>
          </motion.div>

        </div>

        {/* Bottom Section: Massive Brutalist Menu */}
        <motion.div 
          style={{ y: linksY, opacity: opacityReveal }}
          className="w-full mt-16 lg:mt-32 border-t-2 border-[#E83526] pt-12 lg:pt-16 will-change-transform"
        >
          <div className="flex flex-col lg:flex-row justify-between w-full gap-16 lg:gap-8">
            
            {/* Left Side: Info & Platform */}
            <div className="flex flex-col gap-12 lg:w-1/3">
              <div className="flex flex-col gap-4">
                <h3 className="font-anton text-2xl tracking-wide uppercase text-[#E83526]">Contact</h3>
                <div className="flex flex-col gap-1 text-xl lg:text-2xl font-serif-italic text-[#E83526]">
                  <a href="mailto:hello@collabsphere.dev" className="hover:opacity-60 transition-opacity">hello@collabsphere.dev</a>
                  <p>CollabSphere HQ</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-anton text-2xl tracking-wide uppercase text-[#E83526]">Platform</h3>
                <div className="flex flex-col gap-1 text-xl lg:text-2xl font-serif-italic text-[#E83526]">
                  <Link href="#" className="hover:opacity-60 transition-opacity">Features</Link>
                  <Link href="#" className="hover:opacity-60 transition-opacity">Pricing</Link>
                  <Link href="#" className="hover:opacity-60 transition-opacity">Showcase</Link>
                </div>
              </div>
            </div>

            {/* Right Side: Giant Interactive Social Rows */}
            <div className="flex flex-col lg:w-2/3 w-full">
              <h3 className="font-anton text-2xl tracking-wide uppercase text-[#E83526] mb-4">Connect</h3>
              <div className="flex flex-col w-full border-t border-[#E83526]/20">
                {['Instagram', 'LinkedIn', 'Twitter'].map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-[8rem] uppercase text-[#E83526] hover:bg-[#E83526] hover:text-[#F4F1EA] transition-all duration-300 border-b border-[#E83526]/20 py-4 lg:py-6 flex justify-between items-center group px-4 lg:px-8 -mx-4 lg:-mx-8"
                  >
                    <span className="group-hover:translate-x-4 transition-transform duration-300">{link}</span>
                    <ArrowRight className="w-10 h-10 lg:w-16 lg:h-16 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-300 text-[#F4F1EA]" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Very Bottom footer links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-[#E83526]/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#E83526]/70 pb-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-8">
            <span className="hover:text-[#E83526] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#E83526] transition-colors cursor-pointer">Terms & Conditions</span>
          </div>
          <span className="hover:text-[#E83526] transition-colors cursor-pointer">© 2026 CollabSphere</span>
        </div>

      </motion.div>
    </footer>
  );
}
