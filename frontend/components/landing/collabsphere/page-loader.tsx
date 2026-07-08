"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCollabsphere } from "./collabsphere-context";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const { setReady } = useCollabsphere();

  useEffect(() => {
    // stop scroll
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";

    const duration = 1300;
    const start = performance.now();

    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsDone(true);
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  if (isRemoved) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-[2rem] bg-[#0a0a0a] text-white rounded-b-[2rem]"
      initial={{ y: "0%" }}
      animate={isDone ? { y: "-100%" } : { y: "0%" }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 30,
        delay: 0.1, // brief pause at 100
      }}
      onAnimationComplete={(def) => {
        if (def && (def as any).y === "-100%") {
          setIsRemoved(true);
          setReady(true);
          document.documentElement.style.removeProperty("overflow");
          document.documentElement.style.removeProperty("height");
        }
      }}
    >
      <motion.div
        className="flex flex-col items-center gap-[1.25rem]"
        animate={isDone ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div className="font-semibold text-[1.5rem] sm:text-[1.875rem] flex items-center gap-2">
          <svg viewBox="0 0 48 48" className="w-[1.875rem] h-[1.875rem] fill-[#FF3B30]">
            <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
          </svg>
          Collabsphere
        </div>
        <p className="max-w-[24ch] text-[0.875rem] text-white/55 text-center">
          Bold ideas, shipped with quiet precision.
        </p>
      </motion.div>

      <motion.div
        className="w-[min(22rem,72vw)] flex flex-col gap-[0.75rem]"
        animate={isDone ? { opacity: 0 } : { opacity: 1 }}
      >
        <div className="h-[1px] w-full bg-white/15 relative overflow-hidden">
          <div
            className="h-full bg-[#FF3B30] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[0.75rem] font-medium uppercase tracking-[0.05em] text-white/45">
          <span>Loading</span>
          <span className="text-white/80 tabular-nums">
            {progress.toString().padStart(3, "0")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
