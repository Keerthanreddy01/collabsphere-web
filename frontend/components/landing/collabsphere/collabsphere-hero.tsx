"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useCollabsphere } from "./collabsphere-context";
import { CollabsphereHeader } from "./collabsphere-header";
import { CarouselDots } from "./collabsphere-shared";

export function CollabsphereHero() {
  const { ready } = useCollabsphere();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const titleWords = ["Collabsphere"].join(" ").split(" "); // just one word for now, or "Build Together"
  // Actually, let's use "Build Together" to show off the word-by-word reveal
  const title = "Build Together";
  const words = title.split(" ");
  
  const tagline = ["Ship Fast,", "Scale Up"];

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/2.webp", brand: "Engineering", title: "Scale Your Stack", cta: "See tech →" },
    { img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/3.webp", brand: "Product Design", title: "Craft Interfaces", cta: "View work →" },
    { img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/5.webp", brand: "Consulting", title: "Strategic Growth", cta: "Learn how →" }
  ];

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setActiveSlide(p => (p + 1) % slides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [ready]);

  return (
    <section 
      id="home"
      ref={sectionRef} 
      className="relative isolate overflow-hidden rounded-[var(--radius-card-lg)] flex flex-col bg-[var(--brand-deep)] text-white"
      style={{ height: "calc(100svh - 1rem)", minHeight: "36rem" }}
    >
      {/* Background Plate */}
      <motion.div 
        className="absolute left-0 right-0 top-[-16%] h-[132%] w-full z-[-10] pointer-events-none"
        style={{ y: yParallax }}
      >
        <img 
          src="https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/hero/hero-court.webp" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2f63]/65 via-[#0f2f63]/35 to-[#0f2f63]/75" />
      </motion.div>

      <CollabsphereHeader />

      {/* Giant Title */}
      <div className="pt-[1rem] px-[1.5rem] sm:px-[2.5rem] mt-[5rem] sm:mt-[6rem]">
        <h1 className="flex flex-wrap text-[12.5vw] font-medium uppercase leading-[0.85] tracking-[-0.02em] whitespace-nowrap">
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden pb-[0.14em] mr-[0.2em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                animate={ready ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.14 }} // easeOutExpo
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Bottom Row */}
      <div className="mt-auto px-[1.5rem] pb-[2rem] sm:px-[2.5rem] sm:pb-[2.5rem] flex flex-col sm:flex-row sm:justify-between sm:items-end gap-[1.5rem]">
        
        {/* Tagline */}
        <div className="text-[2.4rem] font-medium uppercase leading-[0.95] tracking-[-0.02em] text-white/85">
          {tagline.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                animate={ready ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 + (i * 0.11) }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Right Cluster */}
        <div className="flex items-end gap-[1rem]">
          
          {/* Collection Slider */}
          <motion.div 
            className="hidden md:flex flex-col w-[16rem] gap-[0.75rem]"
            initial={{ opacity: 0, y: 28 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.65 }}
          >
            <div className="relative rounded-[var(--radius-card)] border border-white/15 bg-white/10 p-[0.75rem] shadow-[0_4px_24px_rgba(15,47,99,0.2)] backdrop-blur">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                  className="flex gap-[0.75rem]"
                >
                  <img src={slides[activeSlide].img} alt="" className="w-[3.5rem] h-[3.5rem] rounded-[var(--radius-xl)] object-cover" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[0.7rem] font-medium uppercase tracking-wide">{slides[activeSlide].brand}</span>
                    <span className="text-[0.7rem] uppercase opacity-80">{slides[activeSlide].title}</span>
                    <span className="text-[0.65rem] underline underline-offset-2 mt-1">{slides[activeSlide].cta}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center">
              <CarouselDots count={slides.length} active={activeSlide} tone="light" onClick={setActiveSlide} />
            </div>
          </motion.div>

          {/* Membership Card */}
          <motion.article 
            className="w-full sm:w-auto max-w-[20rem] sm:max-w-[15rem] flex gap-[0.75rem] rounded-[var(--radius-card)] border border-white/15 bg-white/10 p-[0.75rem] shadow-[0_4px_24px_rgba(15,47,99,0.2)] backdrop-blur"
            initial={{ opacity: 0, y: 28 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.78 }}
          >
            <div className="flex flex-col justify-between">
              <span className="text-[1.875rem] font-medium leading-none">9K+</span>
              <div className="flex -space-x-2 my-2">
                {["#5790e6", "#c2e029", "#0b6e97", "#ffffff"].map((color, i) => (
                  <div key={i} className="w-[1.25rem] h-[1.25rem] rounded-full border border-[#0f2f63]/40" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-[0.65rem] opacity-80">Projects delivered</span>
            </div>
            <img src="https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/1.webp" alt="" className="w-[4rem] aspect-[3/4] rounded-[var(--radius-xl)] object-cover ml-auto" />
          </motion.article>

        </div>
      </div>
    </section>
  );
}
