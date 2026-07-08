"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark, XIcon, ArrowUpRight, scrollToId } from "./collabsphere-shared";

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
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    
    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const items = [
    { label: "Home", id: "home" },
    { label: "Work", id: "works" },
    { label: "Services", id: "services" },
    { label: "Studio", id: "about" },
    { label: "Careers", id: "careers" },
    { label: "Contact", id: "contact" }
  ];

  const handleNav = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      if (id === 'contact') {
        window.dispatchEvent(new CustomEvent('open-collabsphere-modal'));
      } else {
        scrollToId(id);
      }
    }, 400); // Wait for menu to close
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[115] flex flex-col bg-[#0a0a0a] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        >
          {/* Top bar */}
          <div className="collabsphere-shell w-full flex items-center justify-between p-[1.25rem] sm:p-[1.5rem] sm:px-[2rem]">
            <div className="flex items-center gap-[0.5rem] text-[1.125rem] font-semibold">
              <LogoMark className="w-[1.25rem] h-[1.25rem] fill-[var(--collabsphere-accent)]" />
              Collabsphere
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-[0.5rem] border border-white/15 rounded-[0.875rem] px-[1rem] py-[0.5rem] text-[0.75rem] font-medium uppercase tracking-[0.05em] text-white/70 hover:border-white/40 hover:text-white transition-colors"
            >
              <XIcon className="w-[0.875rem] h-[0.875rem]" />
              Close
            </button>
          </div>

          {/* Nav Links */}
          <div className="collabsphere-shell flex-1 w-full flex flex-col justify-center px-[1.25rem] sm:px-[2rem]">
            <ul className="flex flex-col gap-[0.25rem]">
              {items.map((item, i) => (
                <li key={item.label} className="overflow-hidden">
                  <motion.button
                    onClick={() => handleNav(item.id)}
                    className="group flex items-center gap-[1rem] py-[0.5rem] w-full text-left text-[2.25rem] sm:text-[3.75rem] font-semibold tracking-[-0.02em] text-white/70 hover:text-white transition-colors duration-300"
                    initial={{ y: "1rem", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "1rem", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: (i * 0.045) + 0.08 }}
                  >
                    <span className="text-[1rem] font-normal text-white/30 group-hover:text-[var(--collabsphere-accent)] transition-colors">
                      0{i + 1}
                    </span>
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Bar */}
          <div className="collabsphere-shell w-full flex flex-col sm:flex-row justify-between gap-[0.75rem] border-t border-white/10 p-[1.5rem] px-[1.25rem] sm:px-[2rem] text-[0.75rem] uppercase tracking-[0.025em] text-white/45">
            <div>Local time</div>
            <button 
              onClick={() => handleNav('contact')}
              className="text-white/70 hover:text-white hover:underline text-left sm:text-right"
            >
              Start a project &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => {
      setIsOpen(true);
      setStatus("idle");
    };
    window.addEventListener('open-collabsphere-modal', onOpen);
    return () => window.removeEventListener('open-collabsphere-modal', onOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    
    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStatus("idle"), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-[1rem] bg-[#111111]/30 backdrop-blur-[16px]"
          role="dialog"
          aria-modal="true"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-[32rem] overflow-hidden rounded-[2rem] bg-white p-[1.5rem] sm:p-[2rem] shadow-2xl ring-1 ring-[#e6e5e2] text-[#111111]"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            exit={{ y: 18 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            
            {status !== "success" && (
              <button 
                onClick={handleClose}
                className="absolute right-[1rem] top-[1rem] w-[2.25rem] h-[2.25rem] grid place-items-center rounded-full bg-[#f1f0ee] text-[#111]/60 hover:bg-[#e3e2df] hover:text-[#111] transition-colors"
              >
                <XIcon className="w-[1rem] h-[1rem]" />
              </button>
            )}

            {status !== "success" ? (
              <div>
                <div className="mb-[1.5rem] flex flex-col gap-[0.375rem]">
                  <div className="inline-flex items-center gap-[0.5rem] text-[0.875rem] font-medium text-[#111]/60">
                    <span className="w-[0.375rem] h-[0.375rem] bg-[var(--collabsphere-accent)] rounded-full" />
                    Start a project
                  </div>
                  <h2 className="text-[1.5rem] sm:text-[1.875rem] font-semibold tracking-[-0.01em]">
                    Tell us what you're building.
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.025em] text-[#111]/50">Name</span>
                    <input 
                      type="text" 
                      required 
                      placeholder="Your name" 
                      className="w-full border border-[#e6e5e2] bg-[#f1f0ee]/50 rounded-[0.875rem] px-[1rem] py-[0.75rem] text-[0.875rem] outline-none transition-colors focus:border-[#111]/30 focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.025em] text-[#111]/50">Email</span>
                    <input 
                      type="email" 
                      required 
                      placeholder="you@company.com" 
                      className="w-full border border-[#e6e5e2] bg-[#f1f0ee]/50 rounded-[0.875rem] px-[1rem] py-[0.75rem] text-[0.875rem] outline-none transition-colors focus:border-[#111]/30 focus:bg-white"
                    />
                  </label>
                  <label className="flex flex-col gap-[0.5rem]">
                    <span className="text-[0.75rem] font-medium uppercase tracking-[0.025em] text-[#111]/50">Project</span>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="A few words about your project, timeline, and budget." 
                      className="resize-none w-full border border-[#e6e5e2] bg-[#f1f0ee]/50 rounded-[0.875rem] px-[1rem] py-[0.75rem] text-[0.875rem] outline-none transition-colors focus:border-[#111]/30 focus:bg-white"
                    />
                  </label>

                  <div className="mt-[0.5rem] flex items-center justify-between gap-[1rem]">
                    <span className="text-[0.75rem] text-[#111]/45">We reply within one business day.</span>
                    
                    <button 
                      type="submit"
                      disabled={status === "submitting"}
                      className="group flex items-center gap-[0.75rem] bg-[#0a0a0a] text-white rounded-full py-[0.375rem] pl-[1.5rem] pr-[0.375rem] text-[0.875rem] font-medium disabled:opacity-80"
                    >
                      {status === "submitting" ? "Sending..." : "Send request"}
                      {status !== "submitting" && (
                        <div className="w-[2.25rem] h-[2.25rem] bg-white text-[#0a0a0a] rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-[1rem] h-[1rem] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div 
                className="flex flex-col items-center text-center py-[2rem] gap-[1rem]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-[3.5rem] h-[3.5rem] grid place-items-center rounded-full bg-[#0a0a0a] text-[var(--collabsphere-accent)]">
                  <LogoMark className="w-[1.5rem] h-[1.5rem]" />
                </div>
                <h2 className="text-[1.5rem] font-semibold">Request received</h2>
                <p className="max-w-[32ch] text-[0.875rem] text-[#111]/60">
                  Thanks for reaching out — we'll get back to you within one business day.
                </p>
                <button 
                  onClick={handleClose}
                  className="mt-[0.5rem] bg-[#0a0a0a] text-white rounded-full py-[0.875rem] px-[1.75rem] text-[0.875rem] font-medium hover:scale-105 transition-transform"
                >
                  Close
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
      <RequestModal />
    </>
  );
}
