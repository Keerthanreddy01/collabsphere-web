"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <AnimatePresence>
      {showPromo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowPromo(false)} // Dismiss on backdrop tap
          role="dialog"
          aria-modal="true"
          aria-label="Promotional Offer"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop tap from firing when tapping the card
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPromo(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#ff453a] z-10"
              aria-label="Close promotional popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Promotional Image Container */}
            <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
              <img
                src="/poster.jpeg"
                alt="CollabSphere Promotional Poster"
                className="w-full h-auto object-cover block"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
