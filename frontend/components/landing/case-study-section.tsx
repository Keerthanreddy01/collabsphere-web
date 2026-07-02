"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CARDS = [
  {
    id: 1,
    bg: "bg-[#161616]",
    content: (
      <div className="w-full h-full flex flex-col p-8 items-center justify-center text-white/40">
        <div className="text-3xl font-serif-italic">Dark Mode App</div>
      </div>
    )
  },
  {
    id: 2,
    bg: "bg-[#e5e5e5]",
    content: (
      <div className="w-full h-full flex flex-col p-8 text-black">
        <div className="text-xl font-bold mb-4 text-[#e83526]">Cizzle</div>
        <h3 className="text-5xl font-medium leading-[1.1] tracking-tight">Meet your<br/>thinking</h3>
        <p className="mt-4 text-black/60 font-medium max-w-[200px]">The new way to organize your complex thoughts.</p>
      </div>
    )
  },
  {
    id: 3,
    bg: "bg-[#9DFF00]",
    content: (
      <div className="w-full h-full flex flex-col p-6 overflow-hidden relative text-black">
        {/* Fake Top Nav */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-black/10"/>
            <span className="w-3 h-3 rounded-full bg-black/10"/>
          </div>
          <div className="flex gap-4">
            <span className="hover:opacity-60 cursor-pointer">Nutrition</span>
            <span className="hover:opacity-60 cursor-pointer">Benefits</span>
            <span className="hover:opacity-60 cursor-pointer">Reviews</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer shadow-sm">
            <span className="text-[10px]">▶</span> Shop all
          </div>
        </div>

        {/* Big Logo */}
        <div className="flex-1 flex flex-col items-center justify-center mt-8 z-10">
          <h1 
            className="text-[100px] sm:text-[140px] font-bold leading-none tracking-tighter text-[#1b4332] -ml-4 select-none" 
            style={{ fontFamily: "Georgia, serif" }}
          >
            more
          </h1>
          <div className="bg-[#1b4332] text-[#9DFF00] rounded-full px-6 py-2 text-xs sm:text-sm font-bold mt-2 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
            <span>▶</span> Buy now
          </div>
        </div>

        {/* Text bottom right */}
        <div className="absolute bottom-16 right-8 text-right z-10 pointer-events-none">
          <h2 className="text-4xl sm:text-5xl font-black uppercase text-white drop-shadow-md leading-[0.9]">
            MATCHA<br/>MEETS<br/>PROTEIN
          </h2>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-12 top-1/2 w-48 h-48 border-[20px] border-white/30 rounded-full blur-sm" />

        {/* Fake bottom bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center text-[10px] sm:text-xs font-bold border-t border-black/10 bg-[#9DFF00]">
          <span>More Nutrition</span>
          <div className="flex items-center gap-3">
            5 RESOURCES USED 
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[12px]">↗</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    bg: "bg-[#2563eb]",
    content: (
      <div className="w-full h-full flex flex-col p-8 items-center justify-center text-white relative overflow-hidden">
        <div className="text-8xl font-black opacity-20 absolute top-8 right-8">04</div>
        <div className="w-full h-48 bg-black/20 rounded-xl mt-auto backdrop-blur-sm p-4">
          <div className="w-1/2 h-4 bg-white/20 rounded mb-2" />
          <div className="w-3/4 h-4 bg-white/20 rounded" />
        </div>
      </div>
    )
  },
  {
    id: 5,
    bg: "bg-[#111111]",
    content: (
      <div className="w-full h-full flex flex-col p-8 items-center justify-center text-white/50 border border-white/5">
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          <div className="bg-white/5 rounded-lg" />
          <div className="bg-white/5 rounded-lg" />
          <div className="bg-white/5 rounded-lg" />
          <div className="bg-white/5 rounded-lg" />
        </div>
      </div>
    )
  }
];

export function CaseStudySection() {
  const [currentIndex, setCurrentIndex] = useState(2);

  return (
    <section className="relative w-full min-h-[120vh] bg-[#050505] overflow-hidden py-32 flex flex-col items-center justify-center">
      
      {/* Dashed Circles Background */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[150vw] h-[200vw] sm:h-[150vw] rounded-full border border-white/5 border-dashed pointer-events-none opacity-50" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] sm:w-[110vw] h-[140vw] sm:h-[110vw] rounded-full border border-white/10 border-dashed pointer-events-none opacity-50" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[70vw] h-[80vw] sm:h-[70vw] rounded-full border border-white/10 border-dashed pointer-events-none opacity-50" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center mb-16 lg:mb-24">
        <h2 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter">Made</h2>
        <h2 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter">with</h2>
        <div className="relative">
          <h2 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter">CollabSphere</h2>
          
          {/* Arrow & handwritten text */}
          <div className="absolute -top-12 -left-4 sm:-top-16 sm:-left-24 flex flex-col items-end rotate-[-5deg] z-20 hidden md:flex">
            <span className="text-[#9DFF00] font-serif-italic text-lg lg:text-xl whitespace-nowrap mb-1 drop-shadow-md">These folks are talented</span>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="transform rotate-[-10deg]">
              <path d="M10 10 Q 25 35, 45 40" stroke="#9DFF00" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
              <path d="M35 32 L 45 40 L 37 46" stroke="#9DFF00" strokeWidth="2.5" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative z-20 w-full h-[450px] sm:h-[500px] lg:h-[650px] flex justify-center items-center perspective-[1200px]">
        {CARDS.map((card, i) => {
          const relativeIndex = i - currentIndex;
          const absIndex = Math.abs(relativeIndex);
          
          // Responsive positions
          const x = `calc(${relativeIndex * 18}vw + ${relativeIndex * 2}rem)`;
          const y = absIndex * 40; 
          const rotateZ = relativeIndex * 6; 
          const scale = 1 - (absIndex * 0.12);
          const zIndex = 50 - absIndex;
          const isCenter = relativeIndex === 0;

          return (
            <motion.div
              key={card.id}
              className={`absolute w-[280px] h-[380px] sm:w-[350px] sm:h-[480px] lg:w-[480px] lg:h-[620px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] cursor-pointer transition-colors duration-300 ${card.bg}`}
              initial={false}
              animate={{
                x,
                y,
                rotateZ,
                scale,
                zIndex,
                filter: isCenter ? "brightness(100%) grayscale(0%)" : "brightness(35%) grayscale(30%)"
              }}
              transition={{ type: "spring", stiffness: 220, damping: 30, mass: 1.2 }}
              onClick={() => setCurrentIndex(i)}
            >
              <div className={`${isCenter ? 'pointer-events-auto' : 'pointer-events-none'} w-full h-full`}>
                {card.content}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Tags */}
      <div className="absolute bottom-12 flex gap-8 z-30">
        <span className="text-white/30 text-xs tracking-[0.2em] font-mono">@COLLABSPHERE</span>
        <span className="text-white/30 text-xs tracking-[0.2em] font-mono">@BUILDERS</span>
      </div>

    </section>
  );
}
