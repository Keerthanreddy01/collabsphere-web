"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative w-16 h-8 rounded-full flex items-center p-1 cursor-pointer overflow-hidden
          transition-colors duration-500 ease-in-out border-none
          ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e5e5ea]'}
          shadow-inner
        `}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
      >
        {/* Sun Icon Background */}
        <div className={`absolute left-2 transition-opacity duration-500 ${isDark ? 'opacity-30' : 'opacity-100 text-yellow-500'}`}>
          <Sun size={14} strokeWidth={2.5} />
        </div>
        
        {/* Moon Icon Background */}
        <div className={`absolute right-2 transition-opacity duration-500 ${isDark ? 'opacity-100 text-blue-400' : 'opacity-30 text-gray-400'}`}>
          <Moon size={14} strokeWidth={2.5} />
        </div>

        {/* Sliding Indicator */}
        <motion.div
          layout
          className={`
            w-6 h-6 rounded-full z-10 flex items-center justify-center
            ${isDark ? 'bg-black shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]'}
          `}
          animate={{
            x: isDark ? 32 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          {isDark ? (
            <Moon size={12} className="text-white" strokeWidth={2.5} />
          ) : (
            <Sun size={12} className="text-yellow-500" strokeWidth={2.5} />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
