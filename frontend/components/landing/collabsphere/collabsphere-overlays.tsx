"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TennisMark, XSVG, CheckSVG, Eyebrow, PillButton, scrollToId } from "./collabsphere-shared";

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener('open-collabsphere-menu', onOpen);
    return () => window.removeEventListener('open-collabsphere-menu', onOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleNav = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      if (id === 'contact') {
        window.dispatchEvent(new CustomEvent('open-collabsphere-modal'));
      } else {
        scrollToId(id);
      }
    }, 400);
  };

  const links = [
    { label: "Programs", id: "programs" },
    { label: "Facilities", id: "facilities" },
    { label: "Reviews", id: "testimonials" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div className="absolute inset-0 bg-[var(--brand-deep)]" onClick={() => setIsOpen(false)} />
          
          <motion.div
            className="relative flex-1 flex flex-col baseline-shell sm:px-[2.5rem]"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
          >
            {/* Top row */}
            <div className="flex justify-between items-center px-[1rem] pt-[1rem] sm:pt-[1.25rem]">
              <div className="flex items-center gap-[0.5rem] text-[1rem] font-medium uppercase tracking-[0.2em]">
                <TennisMark className="w-[1.25rem] h-[1.25rem]" />
                Collabsphere
              </div>
              <motion.button 
                onClick={() => setIsOpen(false)}
                className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-[var(--radius-pill)] bg-white/15 hover:bg-white/25 transition-colors"
                whileHover="hover"
              >
                <motion.div variants={{ hover: { rotate: 90 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                  <XSVG className="w-[1.125rem] h-[1.125rem]" />
                </motion.div>
              </motion.button>
            </div>

            {/* Center nav */}
            <nav className="flex-1 flex flex-col justify-center gap-[0.5rem] px-[1.5rem]">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => handleNav(link.id)}
                  className="block text-left text-[3rem] sm:text-[4.5rem] font-medium leading-tight tracking-tight hover:text-[var(--brand-light)] transition-colors"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.12 + (i * 0.07) }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            {/* Bottom row */}
            <div className="border-t border-white/15 pt-[2rem] pb-[1.5rem] px-[1.5rem] flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-[2rem]">
              <PillButton variant="light" onClick={() => handleNav('contact')}>Book a Visit</PillButton>
              <div className="flex gap-[1.25rem] text-[0.875rem] text-white/70">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">X</a>
                <a href="#" className="hover:text-white transition-colors">YouTube</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  useEffect(() => {
    const onOpen = () => { setIsOpen(true); setStatus("idle"); };
    window.addEventListener('open-collabsphere-modal', onOpen);
    return () => window.removeEventListener('open-collabsphere-modal', onOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    
    // Auto focus name field
    const timer = setTimeout(() => {
      document.getElementById('contact-name')?.focus();
    }, 120);

    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-[0.75rem] sm:p-[1.5rem]"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            className="absolute inset-0 bg-[#0f2f63]/40 backdrop-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            className="relative w-full max-w-[32rem] max-h-[92svh] overflow-y-auto rounded-[var(--radius-card-lg)] bg-[var(--surface-card)] p-[1.5rem] sm:p-[2rem] text-[var(--ink)] shadow-[0_24px_48px_rgba(15,47,99,0.3)]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            {status !== "success" ? (
              <>
                <div className="flex justify-between items-start mb-[1.75rem]">
                  <div>
                    <Eyebrow text="Start a project" tone="dark" />
                    <h2 className="mt-[0.75rem] text-[2.25rem] sm:text-[3rem] font-medium leading-[0.95] tracking-tight">
                      <span className="block overflow-hidden pb-[0.14em]">
                        <motion.span className="block" initial={{ y: "115%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>Come see</motion.span>
                      </span>
                      <span className="block overflow-hidden pb-[0.14em]">
                        <motion.span className="block" initial={{ y: "115%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.09 }}>the work</motion.span>
                      </span>
                    </h2>
                  </div>
                  <motion.button 
                    onClick={() => setIsOpen(false)}
                    className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--surface)] hover:bg-[var(--hairline)] transition-colors"
                    whileHover="hover"
                  >
                    <motion.div variants={{ hover: { rotate: 90 } }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                      <XSVG className="w-[1.125rem] h-[1.125rem]" />
                    </motion.div>
                  </motion.button>
                </div>

                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]">Full name</span>
                    <input id="contact-name" type="text" placeholder="Alex Rivera" required className="w-full rounded-[var(--radius-xl)] border border-[var(--hairline)] bg-[var(--background)] p-[0.75rem] px-[1rem] text-[0.875rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-light)]" />
                  </label>
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]">Email</span>
                    <input type="email" placeholder="you@email.com" required className="w-full rounded-[var(--radius-xl)] border border-[var(--hairline)] bg-[var(--background)] p-[0.75rem] px-[1rem] text-[0.875rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-light)]" />
                  </label>
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]">What are you building?</span>
                    <textarea rows={3} placeholder="I'd love to chat about re-architecting our platform..." required className="w-full resize-none rounded-[var(--radius-xl)] border border-[var(--hairline)] bg-[var(--background)] p-[0.75rem] px-[1rem] text-[0.875rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-light)]" />
                  </label>
                  <div className="mt-[0.75rem]">
                    <button 
                      type="submit" 
                      disabled={status === "submitting"}
                      className="w-full sm:w-auto rounded-[var(--radius-pill)] bg-[var(--ink)] text-white px-[1.75rem] py-[0.875rem] text-[0.875rem] font-medium uppercase tracking-wide hover:bg-[var(--brand-deep)] transition-colors disabled:opacity-70"
                    >
                      {status === "submitting" ? "Sending..." : "Request a visit"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <motion.div 
                className="mt-[2rem] rounded-[var(--radius-card)] bg-[var(--surface)] p-[1.5rem] text-center flex flex-col items-center gap-[1rem]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-[3rem] h-[3rem] flex items-center justify-center rounded-full bg-[var(--brand)] text-white">
                  <CheckSVG className="w-[1.5rem] h-[1.5rem]" />
                </div>
                <div>
                  <div className="text-[1.125rem] font-medium text-[var(--ink)]">Request received</div>
                  <div className="mt-[0.5rem] text-[0.875rem] text-[var(--ink-soft)] max-w-[20rem]">
                    Thanks, we've received your request — our team will be in touch to lock in your visit.
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-[0.5rem] rounded-[var(--radius-pill)] bg-[var(--ink)] text-white px-[1.75rem] py-[0.875rem] text-[0.875rem] font-medium uppercase tracking-wide hover:bg-[var(--brand-deep)] transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CollabsphereOverlays() {
  return (
    <>
      <NavMenu />
      <ContactModal />
    </>
  );
}
