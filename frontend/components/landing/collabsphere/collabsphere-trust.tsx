"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowButton, CarouselDots } from "./collabsphere-shared";

export function CollabsphereTrust() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Map the ghost word pairs to X parallax
  const xLeftTop = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const xRightTop = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  const xLeftBot = useTransform(scrollYProgress, [0, 1], ["-2%", "4%"]);
  const xRightBot = useTransform(scrollYProgress, [0, 1], ["4%", "-3%"]);

  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      words: ["Expert", "Result-", "Driven", "Engineering"],
      img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/5.webp",
      name: "Marco Vidal",
      role: "Lead Engineer"
    },
    {
      words: ["Sharper", "Faster", "Stronger", "Products"],
      img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/4.webp",
      name: "Elena Sokolova",
      role: "Product Designer"
    },
    {
      words: ["Future", "Startups", "Scale", "Here"],
      img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/1.webp",
      name: "James Okoro",
      role: "Strategy Lead"
    }
  ];

  const handleNext = () => setActiveSlide(p => (p + 1) % slides.length);
  const handlePrev = () => setActiveSlide(p => (p - 1 + slides.length) % slides.length);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[var(--background)] px-[1.5rem] py-[4rem] sm:px-[2.5rem] sm:py-[5rem]">
      
      {/* Top Badges Row */}
      <div className="z-20 relative flex flex-col sm:flex-row justify-between gap-[1.5rem] sm:gap-[2rem]">
        
        {/* Percentage Badge */}
        <motion.div 
          className="w-[7rem] h-[7rem] sm:w-[8rem] sm:h-[8rem] rounded-[var(--radius-pill)] bg-[var(--surface)] flex flex-col items-center justify-center text-center p-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <span className="text-[1.5rem] font-medium leading-none">100%</span>
          <span className="text-[0.6rem] text-[var(--ink-soft)] max-w-[7em] mt-1">Built around your success</span>
        </motion.div>

        {/* Badge Card */}
        <motion.article 
          className="max-w-[28rem] rounded-[var(--radius-card)] bg-[var(--surface)] p-[1.25rem] sm:p-[1.5rem] flex flex-col gap-[1rem] sm:gap-[1.25rem]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.12 }}
        >
          <div className="inline-block w-fit rounded-[var(--radius-xl)] bg-[var(--background)] px-[1rem] py-[0.5rem] text-[1.25rem] font-medium">
            #01
          </div>
          <div>
            <h3 className="text-[1.125rem] font-medium text-[var(--ink)]">Trusted by serious builders</h3>
            <p className="text-[0.75rem] text-[var(--ink-soft)] leading-relaxed mt-2">
              From first-time founders to established teams entering a new chapter, companies build here because the progress shows up in the metrics.
            </p>
          </div>
        </motion.article>

      </div>

      {/* Oversized Ghost Heading */}
      <h2 className="pointer-events-none z-0 select-none max-w-[88rem] mx-auto mt-[3rem] text-[8.2vw] font-medium uppercase leading-[1.02] tracking-tight flex flex-col">
        {/* Row 1 */}
        <div className="flex justify-between w-full">
          {/* Word 1 */}
          <motion.div style={{ x: xLeftTop }} className="overflow-hidden pb-[0.12em] text-[var(--ghost)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${activeSlide}-w0`}
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {slides[activeSlide].words[0]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* Word 2 */}
          <motion.div style={{ x: xRightTop }} className="overflow-hidden pb-[0.12em] text-[var(--ghost)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${activeSlide}-w1`}
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              >
                {slides[activeSlide].words[1]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        {/* Row 2 */}
        <div className="flex justify-between w-full">
          {/* Word 3 (INK) */}
          <motion.div style={{ x: xLeftBot }} className="overflow-hidden pb-[0.12em] text-[var(--ink)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${activeSlide}-w2`}
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {slides[activeSlide].words[2]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* Word 4 */}
          <motion.div style={{ x: xRightBot }} className="overflow-hidden pb-[0.12em] text-[var(--ghost)]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${activeSlide}-w3`}
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              >
                {slides[activeSlide].words[3]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </h2>

      {/* Center Card */}
      <div className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block pointer-events-none mt-[4rem]">
        <motion.figure
          className="w-[16rem] aspect-[3/4] rounded-[var(--radius-card)] bg-[var(--brand)] overflow-hidden relative rotate-[6deg]"
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={activeSlide}
              src={slides[activeSlide].img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          </AnimatePresence>
          <div className="absolute inset-x-3 bottom-3 rounded-[var(--radius-xl)] bg-[#0f2f63]/40 text-white backdrop-blur px-[0.75rem] py-[0.5rem]">
            <div className="text-[0.875rem] font-medium">{slides[activeSlide].name}</div>
            <div className="text-[0.65rem] opacity-80">{slides[activeSlide].role}</div>
          </div>
        </motion.figure>
      </div>

      {/* Mobile Card (fallback if no absolute center) */}
      <div className="z-10 flex justify-center sm:hidden mt-[2rem]">
        <motion.figure
          className="w-[13rem] aspect-[3/4] rounded-[var(--radius-card)] bg-[var(--brand)] overflow-hidden relative rotate-[6deg]"
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={activeSlide}
              src={slides[activeSlide].img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          </AnimatePresence>
          <div className="absolute inset-x-3 bottom-3 rounded-[var(--radius-xl)] bg-[#0f2f63]/40 text-white backdrop-blur px-[0.75rem] py-[0.5rem]">
            <div className="text-[0.875rem] font-medium">{slides[activeSlide].name}</div>
            <div className="text-[0.65rem] opacity-80">{slides[activeSlide].role}</div>
          </div>
        </motion.figure>
      </div>

      {/* Controls */}
      <div className="z-20 relative mt-[3rem] sm:mt-[6rem] flex justify-between items-center">
        <ArrowButton direction="prev" variant="outline" onClick={handlePrev} />
        <CarouselDots count={slides.length} active={activeSlide} tone="dark" onClick={setActiveSlide} />
        <ArrowButton direction="next" variant="solid" onClick={handleNext} />
      </div>

    </section>
  );
}
