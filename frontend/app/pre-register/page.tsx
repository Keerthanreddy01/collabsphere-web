"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist } from "@/lib/waitlist";
import { Turnstile } from '@marsidev/react-turnstile';
import emailjs from "@emailjs/browser";
import Link from "next/link";

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

const sendConfirmationEmail = async (email: string, platform: string) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: email,
        user_name: email.split("@")[0],
        platform: platform,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
  } catch (error) {
    console.error("Email confirmation failed");
  }
};

function WaitlistContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [focused, setFocused] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const checkDuplicate = async (emailToCheck: string) => {
    if (!db) return false;
    const q = query(
      collection(db, 'app_waitlist'),
      where('email', '==', emailToCheck.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    if (honeypot) return;

    if (turnstileToken) {
      try {
        const verifyRes = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setErrorMsg('Verification failed.');
          return;
        }
      } catch {}
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Invalid email');
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const alreadyExists = await checkDuplicate(email);
    if (alreadyExists) {
      setErrorMsg('Already registered');
      setLoading(false);
      return;
    }

    try {
      const res = await joinWaitlist(email, "both", referredBy);
      if (res.success) {
        await sendConfirmationEmail(email, "both");
        setPosition(res.position);
        setSuccess(true);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg("Error joining waitlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="relative flex items-center bg-[#0d0d0d] rounded-full p-2 pr-6 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,1)] transition-colors duration-500 hover:bg-[#111111]">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-3 px-6 py-3 text-white text-[19px] tracking-tight font-sans font-medium transition-opacity hover:opacity-70 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 stroke-[1.5]" />}
                Join
              </button>
              
              <div className="relative flex items-center h-full group">
                {/* The Glowing Divider */}
                <div className={`w-[2px] h-8 transition-all duration-700 z-20 ${focused || email.length > 0 ? 'bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.6)]' : 'bg-white/20'}`} />
                
                {/* The Beam Effect - Dual Layer Soft Glow */}
                <AnimatePresence>
                  {(focused || email.length > 0) && (
                    <>
                      {/* Wide soft outer glow */}
                      <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[250px] origin-left pointer-events-none z-0 mix-blend-screen"
                        style={{
                          background: 'radial-gradient(ellipse 100% 50% at 0% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                          filter: 'blur(20px)'
                        }}
                      />
                      {/* Bright inner core */}
                      <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[100px] origin-left pointer-events-none z-0 mix-blend-screen"
                        style={{
                          background: 'radial-gradient(ellipse 100% 50% at 0% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)',
                          filter: 'blur(10px)'
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>
                
                {/* Dust Particles inside Beam */}
                <AnimatePresence>
                  {(focused || email.length > 0) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[400px] h-[150px] pointer-events-none z-0 mix-blend-screen opacity-40"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        maskImage: 'radial-gradient(ellipse 100% 50% at 0% 50%, black 0%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 100% 50% at 0% 50%, black 0%, transparent 100%)'
                      }}
                    />
                  )}
                </AnimatePresence>

                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="bg-transparent border-none outline-none text-white text-[19px] tracking-tight pl-6 w-[200px] sm:w-[320px] placeholder-white/30 z-10 relative font-sans" 
                  placeholder="Enter email address" 
                  required
                />
                
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="absolute top-full mt-6 h-6">
              <AnimatePresence>
                {errorMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[#ff453a] text-[13px] font-mono tracking-widest uppercase"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Invisible Turnstile */}
            <div className="absolute opacity-0 pointer-events-none">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
              />
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center bg-[#0d0d0d] rounded-full p-2 pr-8 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3 px-6 py-3 text-white text-[19px] tracking-tight font-sans font-medium">
              <Check className="w-6 h-6 stroke-[1.5] text-[#10b981]" />
              Spot Secured
            </div>
            
            <div className="relative flex items-center h-full">
              <div className="w-[2px] h-8 bg-[#10b981] shadow-[0_0_15px_3px_rgba(16,185,129,0.6)] z-20" />
              
              {/* Wide soft outer glow */}
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[400px] h-[200px] origin-left pointer-events-none z-0 mix-blend-screen"
                style={{
                  background: 'radial-gradient(ellipse 100% 50% at 0% 50%, rgba(16,185,129,0.5) 0%, rgba(16,185,129,0.1) 50%, transparent 100%)',
                  filter: 'blur(20px)'
                }}
              />
              {/* Bright inner core */}
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[250px] h-[80px] origin-left pointer-events-none z-0 mix-blend-screen"
                style={{
                  background: 'radial-gradient(ellipse 100% 50% at 0% 50%, rgba(16,185,129,0.9) 0%, rgba(16,185,129,0.2) 60%, transparent 100%)',
                  filter: 'blur(10px)'
                }}
              />

              <div className="text-white/60 text-[19px] tracking-tight pl-6 z-10 relative font-sans">
                #{position.toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col font-sans overflow-hidden selection:bg-white/20 selection:text-white">
      
      {/* Base Noise Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle Bottom Grid fading up */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
        }}
      />

      {/* Header */}
      <header className="absolute top-0 w-full flex justify-between items-center px-8 py-8 z-30 pointer-events-auto">
        <Link href="/dashboard/home" className="flex items-center gap-3 group">
          <img src="/newlogo.png" alt="Logo" className="w-5 h-5 opacity-90 invert group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <div className="flex flex-col items-end text-right">
          <span className="text-white/40 text-[11px] font-sans">Project</span>
          <span className="text-white text-[13px] font-medium font-sans tracking-tight">CollabSphere</span>
        </div>
      </header>

      {/* Main Content */}
      <Suspense fallback={null}>
        <WaitlistContent />
      </Suspense>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full flex justify-between items-end px-8 py-8 z-30 pointer-events-auto">
        <div className="flex flex-col text-left">
          <span className="text-white/40 text-[11px] font-sans">© CollabSphere,</span>
          <span className="text-white/40 text-[11px] font-sans">All Rights Reserved</span>
        </div>
        
        <div className="flex flex-col items-end text-right">
          <a href="#" className="text-white/40 text-[11px] font-sans hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-white text-[11px] font-bold font-sans hover:opacity-80 transition-opacity">@collabsphere</a>
        </div>
      </footer>

    </div>
  );
}
