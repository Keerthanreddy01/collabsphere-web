"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const buttonContent = (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative w-12 h-12 md:w-16 md:h-8 rounded-full flex items-center justify-center md:justify-start md:p-1 cursor-pointer overflow-hidden
        transition-colors duration-500 ease-in-out border md:border-none
        ${isDark ? 'bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 md:bg-[#1a1a1a]' : 'bg-white/40 border-black/5 md:bg-[#e5e5ea]'}
        shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-xl md:backdrop-blur-none md:shadow-inner
      `}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {/* Mobile Single Tap Icon */}
      <div className="md:hidden flex items-center justify-center w-full h-full">
        {isDark ? (
          <Moon size={20} className="text-black dark:text-white" strokeWidth={2.5} />
        ) : (
          <Sun size={20} className="text-yellow-600" strokeWidth={2.5} />
        )}
      </div>

      {/* Desktop Sliding Pill Icons */}
      <div className="hidden md:block">
        <div className={`absolute left-2 transition-opacity duration-500 ${isDark ? 'opacity-30' : 'opacity-100 text-yellow-500'}`}>
          <Sun size={14} strokeWidth={2.5} />
        </div>
        <div className={`absolute right-2 transition-opacity duration-500 ${isDark ? 'opacity-100 text-blue-400' : 'opacity-30 text-gray-400'}`}>
          <Moon size={14} strokeWidth={2.5} />
        </div>
        <motion.div
          layout
          className={`
            w-6 h-6 rounded-full z-10 flex items-center justify-center
            ${isDark ? 'bg-white dark:bg-black shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]'}
          `}
          animate={{ x: isDark ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {isDark ? (
            <Moon size={12} className="text-black dark:text-white" strokeWidth={2.5} />
          ) : (
            <Sun size={12} className="text-yellow-500" strokeWidth={2.5} />
          )}
        </motion.div>
      </div>
    </motion.button>
  );

  if (inline) {
    return buttonContent;
  }

  return (
    <div className="hidden md:flex fixed top-4 right-4 md:top-6 md:right-6 z-[110]">
      {buttonContent}
    </div>
  );
}
