"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export default function PreRegisterMobilePromo() {
  const isMobile = useIsMobile();
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    // Only proceed if it's a mobile viewport
    if (!isMobile) return;

    // Check if the promo has already been seen in this session
    const promoSeen = sessionStorage.getItem("preRegisterPromoSeen_v2");
    if (promoSeen === "true") return;

    // Show popup after a 3-second delay
    const timer = setTimeout(() => {
      setShowPromo(true);
      sessionStorage.setItem("preRegisterPromoSeen_v2", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPromo) {
        setShowPromo(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPromo]);

  // Trap focus (basic implementation)
  useEffect(() => {
    if (showPromo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPromo]);

  if (!isMobile) return null;

  return (
    <>
      {showPromo && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide the mobile tab bar when promo is open to prevent it from showing through */
          div.md\\:hidden.fixed.bottom-0 { display: none !important; }
        `}} />
      )}
      <AnimatePresence>
        {showPromo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-[2px] pb-0 pt-20"
          onClick={() => setShowPromo(false)} // Dismiss on backdrop tap
          role="dialog"
          aria-modal="true"
          aria-label="Promotional Offer"
        >
          <motion.div
            initial={{ scale: 0.95, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop tap from firing when tapping the card
          >
            {/* Centered Close Button */}
            <button
              onClick={() => setShowPromo(false)}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-black transition-transform active:scale-95 cursor-pointer outline-none z-20"
              aria-label="Close promotional popup"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Promotional Image Container - Full width at bottom */}
            <div className="w-full bg-[#0a0a0a] border-t border-white/10 rounded-t-[32px] overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)] transition-transform active:scale-95">
              <Link href="/pre-register" onClick={() => setShowPromo(false)} className="block w-full h-full">
                <img
                  src="/poster.jpeg"
                  alt="CollabSphere Promotional Poster"
                  className="w-full h-auto object-cover block"
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
