"use client";

import React from "react";
import { motion } from "framer-motion";

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

// --- SVG Icons ---
export const TennisMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M4.8 5.6A9 9 0 0 0 4.8 18.4"/>
    <path d="M19.2 5.6a9 9 0 0 1 0 12.8"/>
  </svg>
);

export const ArrowSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

export const CheckSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 13l4 4L19 7"/>
  </svg>
);

export const XSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
);

// --- Shared UI Components ---
export const Eyebrow = ({ text, tone = "dark" }: { text: string; tone?: "dark" | "light" }) => {
  const isDark = tone === "dark";
  return (
    <div className={`inline-flex items-center gap-[0.5rem] text-[0.75rem] font-medium uppercase tracking-[0.22em] ${isDark ? "text-[var(--ink-soft)]" : "text-white/70"}`}>
      <span className={`w-[0.375rem] h-[0.375rem] rounded-full ${isDark ? "bg-[var(--brand)]" : "bg-[var(--brand-light)]"}`} />
      {text}
    </div>
  );
};

export const PillButton = ({ 
  children, 
  variant = "solid", 
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "solid" | "light" | "outline"; 
  onClick?: () => void;
  className?: string;
}) => {
  const base = "group inline-flex items-center justify-center gap-[0.5rem] rounded-[var(--radius-pill)] px-[1.75rem] py-[0.875rem] text-[0.875rem] font-medium uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-light)] ";
  const variants = {
    solid: "bg-[var(--ink)] text-white hover:bg-[var(--brand-deep)]",
    light: "bg-white text-[var(--brand-deep)] hover:bg-[var(--brand-light)] hover:text-white",
    outline: "border border-current text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white"
  };

  return (
    <button onClick={onClick} className={base + variants[variant] + " " + className}>
      {children}
      <motion.div variants={{ hover: { x: 5 } }} transition={{ type: "spring", stiffness: 320, damping: 20 }}>
        <ArrowSVG className="w-[1rem] h-[1rem]" />
      </motion.div>
    </button>
  );
};

export const ArrowButton = ({ 
  direction = "next", 
  variant = "solid", 
  onClick 
}: { 
  direction?: "prev" | "next"; 
  variant?: "solid" | "outline";
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const base = "w-[3rem] h-[3rem] sm:w-[3.5rem] sm:h-[3.5rem] grid place-items-center rounded-[var(--radius-pill)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-light)] ";
  const variants = {
    solid: "bg-[var(--ink)] border border-[var(--ink)] text-white hover:bg-[var(--brand-deep)]",
    outline: "border border-[var(--hairline)] bg-transparent text-[var(--ink)] hover:border-[var(--ink)]"
  };

  return (
    <motion.button 
      onClick={onClick} 
      className={base + variants[variant]}
      whileHover="hover"
    >
      <motion.div 
        variants={{ hover: { scale: 1.15 } }} 
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className={direction === "prev" ? "-scale-x-100" : ""}
      >
        <ArrowSVG className="w-[1.25rem] h-[1.25rem]" />
      </motion.div>
    </motion.button>
  );
};

export const CarouselDots = ({ 
  count, 
  active, 
  tone = "dark",
  onClick
}: { 
  count: number; 
  active: number; 
  tone?: "dark" | "light";
  onClick?: (i: number) => void;
}) => {
  return (
    <div className="flex flex-row gap-[0.5rem]">
      {Array.from({ length: count }).map((_, i) => (
        <button 
          key={i} 
          onClick={() => onClick?.(i)}
          className="p-[0.375rem] focus-visible:outline focus-visible:outline-[var(--brand-light)]"
          aria-current={i === active}
        >
          <div 
            className={`h-[0.375rem] rounded-[var(--radius-pill)] transition-all duration-300 ${
              i === active 
                ? `w-[1.25rem] ${tone === "dark" ? "bg-[var(--ink)]" : "bg-white"}` 
                : `w-[0.375rem] ${tone === "dark" ? "bg-[var(--ghost)]" : "bg-white/40"}`
            }`}
          />
        </button>
      ))}
    </div>
  );
};
