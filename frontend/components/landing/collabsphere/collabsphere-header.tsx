"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCollabsphere } from "./collabsphere-context";
import { LogoMark, GridIcon, scrollToId } from "./collabsphere-shared";

function LiveClock() {
  const [time, setTime] = useState("9:41am");
  const [dateStr, setDateStr] = useState("12 March, 2025");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      const displayHours = hours % 12 || 12;
      setTime(`${displayHours}:${mins}${ampm}`);

      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      setDateStr(`${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex border border-[var(--collabsphere-line)] bg-white/5 backdrop-blur-[4px] rounded-[0.875rem] py-[0.5rem] px-[0.75rem] gap-[0.75rem] text-[0.75rem] text-[var(--collabsphere-fg)] items-center">
      <span className="text-[var(--collabsphere-fg)]/45">Local time</span>
      <span className="min-w-[3.5rem] tabular-nums font-medium text-white">{time}</span>
      <span className="text-[var(--collabsphere-fg)]/30">•</span>
      <span className="font-medium">{dateStr}</span>
    </div>
  );
}

export function CollabsphereHeader() {
  const { ready } = useCollabsphere();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'contact') {
      // open modal
      window.dispatchEvent(new CustomEvent('open-collabsphere-modal'));
    } else {
      scrollToId(id);
    }
  };

  return (
    <motion.header
      className="absolute left-0 right-0 top-0 z-50 pointer-events-none"
      initial={{ opacity: 0, y: -14 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
      transition={{ type: "spring", stiffness: 210, damping: 26, delay: 0.15 }}
    >
      <div className="collabsphere-shell flex items-center justify-between gap-[1.5rem] p-[1.25rem] sm:py-[1.5rem] sm:px-[2rem] pointer-events-auto">
        
        {/* Brand */}
        <motion.button
          onClick={() => scrollToId("home")}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="flex items-center gap-[0.5rem] text-[1.125rem] font-semibold tracking-[-0.01em] text-white"
        >
          <LogoMark className="w-[1.25rem] h-[1.25rem] fill-[var(--collabsphere-accent)]" />
          Collabsphere
        </motion.button>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-[2rem] text-[0.875rem] font-medium text-[var(--collabsphere-fg)]">
          {[
            { label: "Home", id: "home" },
            { label: "Work", id: "works" },
            { label: "Services", id: "services", dropdown: true },
            { label: "Studio", id: "about" },
            { label: "Careers", id: "careers" },
            { label: "Contact", id: "contact" }
          ].map((item) => (
            <li key={item.label}>
              <motion.a
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="flex items-center gap-1 opacity-80"
                whileHover={{ y: -2, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {item.label}
                {item.dropdown && <span className="text-[0.75rem] opacity-60">▾</span>}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-[0.75rem]">
          <LiveClock />
          
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent('open-collabsphere-menu'))}
            className="border border-[var(--collabsphere-line)] bg-white/5 backdrop-blur-[4px] rounded-[0.875rem] hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <div className="py-[0.5rem] px-[1rem] text-[0.75rem] font-medium uppercase tracking-[0.05em] flex items-center gap-[0.5rem] text-[var(--collabsphere-fg)]">
              <GridIcon className="w-[0.875rem] h-[0.875rem]" />
              <span className="hidden sm:inline">Menu</span>
            </div>
          </motion.button>
        </div>

      </div>
    </motion.header>
  );
}
