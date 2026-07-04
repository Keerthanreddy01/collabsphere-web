"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PushPin = ({ className }: { className?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute z-20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] ${className}`}
  >
    {/* Pin shadow */}
    <path d="M22 28L14 42" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round" className="origin-top-right scale-y-75 translate-x-1" />
    {/* Metal pin */}
    <path d="M22 28L14 42" stroke="#B0C4DE" strokeWidth="2.5" strokeLinecap="round" />
    {/* Plastic head base */}
    <path d="M18 24L26 18L29 22L21 28L18 24Z" fill="#7ACC00" />
    {/* Plastic head top */}
    <path d="M26 18L32 10C33 8 36 10 35 12L29 22L26 18Z" fill="#9DFF00" />
    {/* Highlight */}
    <path d="M28 13L32 10" stroke="#D4FF66" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const StickyNote = ({
  title,
  desc,
  index,
  rotate,
  yOffset,
  xOffset,
  delay,
  pinPos = "right"
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 100, x: xOffset, rotate: rotate - 20 }}
      whileInView={{ opacity: 1, y: yOffset, x: xOffset, rotate: rotate }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.3 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-[280px] h-[280px] bg-[#1a1a1a] p-8 flex flex-col justify-between shrink-0"
      style={{
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(255,255,255,0.03)",
      }}
    >
      {/* Crumpled paper noise texture */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", backgroundSize: "150px" }}
      />

      {/* Thumbtack */}
      {pinPos === "right" ? (
        <PushPin className="-top-6 right-6" />
      ) : (
        <PushPin className="-top-6 left-6 -scale-x-100" />
      )}

      <p className="relative z-10 text-white/70 text-[13px] font-medium leading-relaxed tracking-wide mt-2">
        {desc}
      </p>

      <div className="relative z-10 flex justify-between items-end mt-auto">
        <span className="text-white/20 text-xs font-mono tracking-widest">[{index}]</span>
        <h3 className="text-white font-bold text-xl text-right max-w-[130px] leading-tight">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[120vh] bg-[#050505] overflow-hidden flex flex-col items-center justify-center py-32"
    >
      {/* Heavy Noise Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* Dramatic Spotlight */}
      <div className="absolute top-[-10%] right-[30%] w-[80vw] h-[80vw] bg-white opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-[40%] w-[40vw] h-[80vh] bg-gradient-to-b from-white/10 to-transparent blur-[80px] pointer-events-none transform -skew-x-12 rotate-12 origin-top" />

      {/* Background Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-[0.15] mix-blend-overlay scale-110 select-none">
        <h2 className="font-anton text-[12vw] leading-[0.85] uppercase text-white tracking-tight">LET'S</h2>
        <h2 className="font-anton text-[12vw] leading-[0.85] uppercase text-white tracking-tight">IMPROVE</h2>
        <h2 className="font-anton text-[12vw] leading-[0.85] uppercase text-white tracking-tight">YOUR BUSINESS</h2>
        <h2 className="font-anton text-[12vw] leading-[0.85] uppercase text-white tracking-tight">OUR SERVICES</h2>
      </div>

      {/* Top Right Mini Text */}
      <div className="absolute top-32 right-12 lg:right-32 max-w-[280px] hidden lg:block z-10">
        <div className="text-white/30 font-mono text-sm mb-4 tracking-widest">× × ×</div>
        <p className="text-white/50 text-[13px] font-medium leading-relaxed">
          We combine creative ideas with advanced technology to create <span className="text-[#9DFF00] font-semibold opacity-80">unique solutions</span> that meet your goals and objectives.
        </p>
        <div className="text-white/30 text-[10px] uppercase tracking-widest mt-6 text-right">[ Services ]</div>
      </div>

      {/* Bottom Right Mini Text */}
      <div className="absolute bottom-32 right-12 lg:right-32 max-w-[280px] hidden lg:block z-10">
        <div className="text-white/30 font-mono text-sm mb-4 tracking-widest">× × ×</div>
        <p className="text-white/50 text-[13px] font-medium leading-relaxed">
          Every service, from targeted advertising to business promotion, is designed to <span className="text-[#9DFF00] font-semibold opacity-80">maximize effectiveness</span> and achieve sustainable results.
        </p>
        <div className="text-white/30 text-[10px] uppercase tracking-widest mt-6 text-right">[ 2 ]</div>
      </div>

      {/* Floating Sticky Notes Container */}
      <div className="relative z-20 flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 lg:gap-0 mt-20 max-w-7xl mx-auto">
        <StickyNote
          title="Marketing strategy"
          desc="We create unique, personalized marketing strategies that ensure you achieve your business goals and maximize ROI."
          index="1"
          rotate={-12}
          yOffset={-40}
          xOffset={40}
          delay={0.1}
          pinPos="right"
        />
        <StickyNote
          title="Marketing strategy"
          desc="We create unique, personalized marketing strategies that ensure you achieve your business goals and maximize ROI."
          index="1"
          rotate={-4}
          yOffset={-10}
          xOffset={10}
          delay={0.2}
          pinPos="right"
        />
        <StickyNote
          title="Marketing strategy"
          desc="We create unique, personalized marketing strategies that ensure you achieve your business goals and maximize ROI."
          index="1"
          rotate={8}
          yOffset={30}
          xOffset={-10}
          delay={0.3}
          pinPos="left"
        />
        <StickyNote
          title="Marketing strategy"
          desc="We create unique, personalized marketing strategies that ensure you achieve your business goals and maximize ROI."
          index="1"
          rotate={18}
          yOffset={60}
          xOffset={-30}
          delay={0.4}
          pinPos="right"
        />
      </div>

    </section>
  );
}
