"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "ABOUT US",      href: "#about"         },
  { name: "CASE STUDY",    href: "#case-study"    },
  { name: "SERVICE",       href: "#service"       },
  { name: "PAGE",          href: "#page"          },
  { name: "BUILDERS",      href: "/builders"      },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const docRef = doc(db, "builder_profiles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push("/dashboard/home");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Error checking onboarding:", err);
      router.push("/onboarding");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
      <motion.div 
        layout
        animate={{ 
          maxWidth: isMenuOpen ? "1400px" : "800px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.8 }}
        className="w-full flex flex-col shadow-2xl overflow-hidden will-change-[max-width]"
        style={{ borderRadius: "12px" }}
      >
        {/* Top Dark Bar */}
        <div className="bg-[#1c1c1c] px-4 py-3 flex items-center justify-between z-20 relative">
          
          {/* Left: Menu */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 text-white hover:opacity-70 transition-opacity"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <div className="flex flex-col gap-1.5 w-5">
                <div className="w-full h-px bg-white/80" />
                <div className="w-full h-px bg-white/80" />
              </div>
            )}
            <span className="font-medium text-sm tracking-wide">Menu</span>
          </button>

          {/* Center: Logo */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 border border-white/20 rounded-full px-6 py-1 items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-white font-black tracking-tighter text-2xl" style={{ fontFamily: 'Arial, sans-serif' }}>
              COLLABSPHERE
            </span>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!user ? (
              <>
                <button 
                  onClick={() => router.push('/login')}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                  Join
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleDashboardClick}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={async () => {
                    await signOut()
                    router.replace('/')
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.8 }}
              className="bg-[#1c1c1c] text-white border-t border-white/10 overflow-y-auto overflow-x-hidden will-change-[height] max-h-[85vh] md:max-h-[80vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 p-6 sm:p-8 md:p-12">
                {/* Column 1 */}
                <div>
                  <h4 className="text-[10px] text-white/40 tracking-widest uppercase mb-4 md:mb-6 font-mono">Our Products</h4>
                  <div className="flex flex-col gap-4 md:gap-6">
                    {["The Vault", "Page Transition Course", "Button Pack", "Community"].map((item) => (
                      <a key={item} href="#" className="text-lg sm:text-xl md:text-2xl font-medium hover:text-white/70 transition-colors border-b border-white/10 pb-3 md:pb-4 last:border-0 flex items-center">
                        {item} 
                        {item === "Button Pack" && (
                          <span className="ml-3 text-[9px] font-bold bg-[#635BFF] px-2 py-0.5 rounded text-white tracking-widest">NEW</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Column 2 */}
                <div>
                  <h4 className="text-[10px] text-white/40 tracking-widest uppercase mb-4 md:mb-6 font-mono">Explore</h4>
                  <div className="flex flex-col gap-4 md:gap-6">
                    {["CollabSphere Showcase", "Collection", "Pricing"].map((item) => (
                      <a key={item} href="#" className="text-base sm:text-lg md:text-xl hover:text-white/70 transition-colors border-b border-white/10 pb-3 md:pb-4 last:border-0 flex items-center">
                        {item} 
                        {item === "Collection" && <span className="text-[10px] text-white/40 ml-2 font-mono">190</span>}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-[#242424] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer border border-white/5 mt-4 md:mt-0">
                  <div className="absolute top-4 md:top-6 flex items-center gap-2 z-10">
                    <span className="text-[10px] font-bold text-white tracking-widest">START</span>
                    <span className="text-[10px] font-bold bg-[#635BFF] text-white px-2 py-0.5 rounded-full tracking-widest">LEARNING</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mt-10 mb-6 md:mb-8 relative z-10 tracking-tight leading-tight">Page Transition<br/>Course</h3>
                  <div className="w-full aspect-video bg-black/50 rounded-xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                     <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                     <div className="absolute inset-x-4 sm:inset-x-8 -bottom-4 top-8 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-t-xl shadow-2xl rotate-2" />
                     <div className="absolute inset-x-4 sm:inset-x-8 -bottom-4 top-4 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-t-xl shadow-2xl -rotate-2 opacity-50" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Red Ticker Bar (Hidden when menu is open) */}
        <AnimatePresence>
          {!isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.8 }}
              className="bg-red-500 overflow-hidden py-1 border-t border-[#1c1c1c]/10 will-change-[height] flex"
            >
              <div className="flex whitespace-nowrap text-[10px] font-mono font-bold tracking-widest text-white">
                <div className="flex gap-8 px-4 shrink-0" style={{ animation: 'marquee 25s linear infinite' }}>
                  <span className="flex items-center gap-8 shrink-0">
                    <span>FIND YOUR CO-FOUNDER</span><span>*</span>
                    <span>DISCOVER NEW BUILDERS</span><span>*</span>
                    <span>JOIN THE COMMUNITY</span><span>*</span>
                    <span>SHIP FASTER TOGETHER</span><span>*</span>
                    <span>BUILD THE FUTURE</span><span>*</span>
                  </span>
                </div>
                <div className="flex gap-8 px-4 shrink-0" style={{ animation: 'marquee 25s linear infinite' }} aria-hidden="true">
                  <span className="flex items-center gap-8 shrink-0">
                    <span>FIND YOUR CO-FOUNDER</span><span>*</span>
                    <span>DISCOVER NEW BUILDERS</span><span>*</span>
                    <span>JOIN THE COMMUNITY</span><span>*</span>
                    <span>SHIP FASTER TOGETHER</span><span>*</span>
                    <span>BUILD THE FUTURE</span><span>*</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Global CSS for marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </header>
  );
}
