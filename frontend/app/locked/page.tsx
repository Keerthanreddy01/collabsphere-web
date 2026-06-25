"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LockedPage() {
  const { user, loading, signOutAndClear } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth finishes loading and there is no user, they shouldn't be on the locked page
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
      </div>
    );
  }

  // Double check user exists to prevent flash before redirect
  if (!user) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-0 left-0 w-[50vw] h-[50vh] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(60,60,60,0.15) 0%, transparent 70%)" }} 
      />
      
      {/* Header */}
      <header className="absolute top-0 w-full flex justify-between items-center px-6 sm:px-10 py-6 z-30">
        <div className="flex items-center gap-2 group">
          <img src="/newlogo.png" alt="CS" className="w-5 h-5 invert opacity-80" />
          <span className="text-white/60 text-[13px] font-medium">CollabSphere</span>
        </div>
        
        <button 
          onClick={signOutAndClear}
          className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center z-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 stroke-[1.5]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            You're on the list.
          </h1>
          
          <p className="text-neutral-400 text-[15px] leading-relaxed mb-10">
            Your account is secured. We're putting the final touches on CollabSphere and will email you as soon as we open the doors.
          </p>

          <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3">
            <span className="text-neutral-500 text-[12px] uppercase tracking-widest font-medium">
              Signed in as
            </span>
            <span className="text-white text-[15px] truncate max-w-[200px] sm:max-w-xs font-mono bg-white/5 px-3 py-1 rounded-full">
              {user.email}
            </span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full flex justify-center items-center px-6 py-6 z-30">
        <span className="text-neutral-800 text-[11px]">© 2026 CollabSphere</span>
      </footer>
    </div>
  );
}
