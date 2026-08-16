"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSquibl } from "./squibl-context";
import { TennisMark } from "./squibl-shared";

export function SquiblLoader() {
  const { setReady } = useSquibl();
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    // Stop scroll while the loader is visible, but always restore the
    // previous document styles so route changes cannot leave the app locked.
    const previousOverflow = document.documentElement.style.overflow;
    const previousHeight = document.documentElement.style.height;

    const restoreScrollState = () => {
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.height = previousHeight;
    };

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";

    const MIN_VISIBLE_MS = 1400;
    const MAX_VISIBLE_MS = 2600;
    const EXIT_MS = 850;
    
    // Check if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minWait = prefersReduced ? 200 : MIN_VISIBLE_MS;
    const exitTime = prefersReduced ? 0 : EXIT_MS;

    let startTime = performance.now();
    let isMounted = true;
    let fallbackTimer: NodeJS.Timeout;

    const startExit = () => {
      if (!isMounted) return;
      setReady(true);
      setPhase("exiting");
      restoreScrollState();
      
      setTimeout(() => {
        if (isMounted) setPhase("done");
      }, exitTime);
    };

    const attemptExit = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= minWait) {
        startExit();
      } else {
        setTimeout(startExit, minWait - elapsed);
      }
    };

    if (document.readyState === "complete") {
      attemptExit();
    } else {
      window.addEventListener("load", attemptExit);
      fallbackTimer = setTimeout(attemptExit, MAX_VISIBLE_MS);
    }

    return () => {
      isMounted = false;
      window.removeEventListener("load", attemptExit);
      clearTimeout(fallbackTimer);
      restoreScrollState();
    };
  }, [setReady]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[2rem] bg-[var(--brand-deep)] text-white"
      initial={{ y: "0%" }}
      animate={phase === "exiting" ? { y: "-105%" } : { y: "0%" }}
      transition={{
        duration: 0.85,
        ease: [0.645, 0.045, 0.355, 1], // close to easeInOutCubic
      }}
    >
      <motion.div
        className="flex items-center gap-[0.5rem]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        <TennisMark className="w-[1.75rem] h-[1.75rem]" />
        <span className="text-[1.5rem] sm:text-[1.875rem] font-medium uppercase tracking-[0.2em]">
          Squibl
        </span>
      </motion.div>

      <div className="w-[10rem] h-[1px] rounded-[var(--radius-pill)] bg-white/20 overflow-hidden">
        <motion.div
          className="h-full bg-white origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 0.12,
            duration: 1.28,
            ease: [0.645, 0.045, 0.355, 1] // easeInOutCubic
          }}
        />
      </div>
    </motion.div>
  );
}
