"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

type Confession = {
  text: string;
  author: string;
  role: string;
  theme: "cream" | "red" | "dark";
  rotate: number;
  yOffset: number;
};

const confessions: Confession[] = [
  {
    text: "The team at Collabsphere has been epic to work with. Their creativity is not just aesthetically impressive, it drives business value.",
    author: "Jeff Mziray",
    role: "DashQ, CEO",
    theme: "cream",
    rotate: -3,
    yOffset: 0
  },
  {
    text: "Collabsphere is the best design team we have worked with. Their work immediately brought more credibility and authenticity to our long term goal of building community.",
    author: "@phobosdei",
    role: "Dogelon Mars",
    theme: "red",
    rotate: 2,
    yOffset: 40
  },
  {
    text: "Collabsphere's team is wildly creative, professional in all the right ways, and made the whole process of rebranding our company fun and effortless. They helped us Elevate our brand into something that finally feels like us, giving our company a fresh identity that's already driving momentum.",
    author: "Ryan Keisel",
    role: "Elevate, CEO",
    theme: "cream",
    rotate: -4,
    yOffset: 20
  },
  {
    text: "We loved working with Collabsphere. They took the time to really understand who we are and brought our vision to life.",
    author: "Alex Rivera",
    role: "TechNova",
    theme: "red",
    rotate: 1,
    yOffset: -20
  }
];

export function CollabsphereClientConfessions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#121212] overflow-hidden flex flex-col items-center">
      
      {/* Title */}
      <motion.div style={{ y: titleY }} className="relative z-10 text-center mb-16 sm:mb-24">
        <h2 className="font-['Playfair_Display'] italic text-[10vw] sm:text-[8vw] leading-[0.9] text-[#F4F1EA]">
          Client<br />
          Confessions
        </h2>
        {/* Decorative Badge/Cursor */}
        <motion.div 
          className="absolute -bottom-10 right-0 sm:right-[-40px] w-20 h-20 rounded-full border border-[#E83526]/50 flex items-center justify-center bg-[#E83526]/10 backdrop-blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-[#E83526] text-sm">👀</span>
        </motion.div>
      </motion.div>

      {/* Cards Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap justify-center items-start gap-4 sm:gap-6 min-h-[60vh]">
        {confessions.map((conf, idx) => {
          
          const isCream = conf.theme === "cream";
          const bg = isCream ? "bg-[#F4F1EA]" : "bg-[#E83526]";
          const textColors = isCream ? "text-[#E83526]" : "text-white";
          const quoteColor = isCream ? "text-[#E83526]" : "text-white";

          return (
            <motion.div
              key={idx}
              className={`relative flex-1 min-w-[280px] sm:min-w-[400px] max-w-[500px] p-8 sm:p-12 rounded-[2rem] shadow-2xl ${bg} ${textColors} cursor-pointer`}
              initial={{ opacity: 0, y: 50, rotate: conf.rotate - 10 }}
              whileInView={{ opacity: 1, y: conf.yOffset, rotate: conf.rotate }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0, 
                zIndex: 20,
                y: conf.yOffset - 10,
                transition: { duration: 0.3 }
              }}
              style={{ zIndex: 10 - idx }} // Earlier items have higher z-index generally, but hover overrides it
            >
              <Quote className={`w-8 h-8 sm:w-12 sm:h-12 mb-6 ${quoteColor} opacity-50`} />
              
              <p className="font-sans text-lg sm:text-2xl font-medium leading-relaxed tracking-tight mb-8">
                "{conf.text}"
              </p>
              
              <div className="flex flex-col items-end text-right">
                <span className="font-bold text-base sm:text-lg">{conf.author}</span>
                <span className="text-sm sm:text-base opacity-80">{conf.role}</span>
              </div>
              
              <Quote className={`absolute bottom-8 left-8 w-8 h-8 sm:w-12 sm:h-12 ${quoteColor} opacity-30 rotate-180`} />
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
