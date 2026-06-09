"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, Smartphone, Award
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { joinWaitlist, getRecentSignups, getWaitlistCount } from "@/lib/waitlist";
import SideRays from "@/components/ui/SideRays";

function WaitlistFormContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"android" | "ios" | "both">("both");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(0);
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Live total count from Firestore
  const [totalCount, setTotalCount] = useState(247);
  // Animated count up state
  const [animatedCount, setAnimatedCount] = useState(0);
  // Recent 3 signups
  const [recentSignups, setRecentSignups] = useState<string[]>(["Keerthan", "Alex", "Purbledx"]);

  // Listen to Firestore waitlist updates for real-time counters
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, "app_waitlist"), (snapshot) => {
      // Update count
      setTotalCount(snapshot.size > 0 ? snapshot.size : 247);
    });
    return () => unsub();
  }, []);

  // Animate count up on count change
  useEffect(() => {
    let start = animatedCount;
    const end = totalCount;
    if (start === end) return;

    const duration = 1200; // 1.2s
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      setAnimatedCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [totalCount]);

  // Fetch recent signups on mount
  useEffect(() => {
    getRecentSignups().then(names => {
      if (names && names.length > 0) setRecentSignups(names);
    });
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await joinWaitlist(email, platform, referredBy);
      if (res.success) {
        setPosition(res.position);
        setRefCode(res.refCode);
        setSuccess(true);
        
        // Trigger confetti celebration
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#06b6d4"]
        });
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/pre-register?ref=${refCode}`
    : `collabsphereweb.vercel.app/pre-register?ref=${refCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Milestone Calculations
  const milestone = Math.ceil((animatedCount + 1) / 500) * 500 || 1500;
  const progressPercent = Math.min(100, Math.floor((animatedCount / milestone) * 100)) || 82;

  return (
    <div className="relative z-10 w-full h-full flex flex-col lg:flex-row">
      
      {/* LEFT PANEL - Typography and Stats */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 relative h-full py-16 lg:py-0">
        {/* Header inside left panel */}
        <div className="absolute top-10 left-8 lg:left-20 flex items-center gap-6">
          <a 
            href="/dashboard/home" 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] uppercase font-syncopate tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </a>
          <div className="font-syncopate text-white text-[12px] font-bold uppercase tracking-widest">
            CollabSphere
          </div>
        </div>

        {/* Pill */}
        <div className="border border-[#D4F842] rounded-full px-5 py-2 inline-flex w-max mb-6 lg:mb-10 bg-black backdrop-blur-md">
          <span className="font-syne text-[#D4F842] text-[11px] uppercase tracking-[0.2em] font-bold">
            Official Mobile Beta
          </span>
        </div>

        <h1 className="font-syncopate text-white text-[5vw] lg:text-[7vw] font-extrabold leading-[0.9] tracking-tighter mb-4 uppercase">
          THE APP <br/> IS COMING
        </h1>
        
        <p className="font-sans text-white/60 text-sm lg:text-base leading-relaxed max-w-md font-medium mt-4 lg:mt-6">
          Pre-register to jump the queue. We're launching the next generation of builder collaboration tools on iOS and Android.
        </p>

        {/* Numbers + Progress */}
        <div className="mt-8 lg:mt-16 w-full max-w-md">
          <div className="flex items-baseline gap-6 lg:gap-8 mb-4">
            <div className="font-syncopate text-[#063CB9] text-[64px] lg:text-[140px] leading-none font-black tracking-tighter drop-shadow-[0_0_20px_rgba(6,60,185,0.3)]">
              {animatedCount.toLocaleString()}
            </div>
            <div className="font-syncopate text-white/80 text-[18px] lg:text-[24px] font-bold uppercase leading-[1.1] tracking-tight">
              Builders<br/>Waiting
            </div>
          </div>
          
          <div className="w-full h-2 lg:h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#063CB9] rounded-full shadow-[0_0_20px_rgba(6,60,185,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-white/40 text-[10px] lg:text-[11px] font-syncopate uppercase tracking-widest mt-4">
            <span>Milestone Progress</span>
            <span>Goal: {milestone.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Ticker at bottom left */}
        <div className="absolute bottom-10 left-8 lg:left-20 max-w-md hidden lg:block">
          <p className="text-white/30 text-[10px] tracking-widest font-bold flex items-center gap-2 font-syncopate uppercase">
            <span>🧑</span>
            {recentSignups.map((name, i) => (
              <span key={i}>
                <span className="text-white/60 hover:text-[#063CB9] transition-colors">{name}</span>
                {i < recentSignups.length - 1 ? <span className="text-white/20 mx-1">·</span> : null}
              </span>
            ))}
            <span className="text-white/30 ml-1">joined</span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - The Arch Form */}
      <div className="w-full lg:w-[450px] xl:w-[600px] bg-[#D4F842] rounded-t-[60px] lg:rounded-t-none lg:rounded-l-[80px] min-h-[70vh] lg:h-full relative flex flex-col justify-center px-8 lg:px-16 xl:px-20 shadow-[-30px_0_80px_rgba(212,248,66,0.15)] py-12 lg:py-0 lg:overflow-y-auto">
        {/* Toggle graphic */}
        <div className="absolute top-8 right-8 lg:top-12 lg:right-12 bg-[#063CB9] w-12 h-6 rounded-full p-[3px] flex items-center justify-end shadow-inner">
          <div className="bg-white w-[18px] h-[18px] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="font-syncopate text-black text-[28px] font-bold tracking-tight uppercase mb-8 leading-tight">
                Join The<br/>Waitlist
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-white/40 border-2 border-black/10 focus:border-[#063CB9] focus:bg-white rounded-xl px-5 py-4 text-black placeholder-black/40 outline-none transition-all font-syne font-bold text-sm tracking-wide"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-syncopate font-bold text-black/50 uppercase tracking-widest block w-full">Select Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["android", "ios", "both"] as const).map((p) => {
                      const isActive = platform === p;
                      const label = p === "android" ? "Android" : p === "ios" ? "iOS" : "Both";
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`py-3.5 px-2 rounded-xl text-[11px] font-syncopate font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                            isActive 
                              ? "bg-[#063CB9] text-white shadow-md shadow-[#063CB9]/30 scale-105" 
                              : "bg-black/5 text-black/50 hover:bg-black/10"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-xs font-bold font-sans">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#063CB9] hover:bg-[#052b82] text-white font-syncopate font-bold rounded-xl py-4 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#063CB9]/20 flex items-center justify-center gap-2 cursor-pointer border-none uppercase tracking-widest text-[13px]"
                >
                  {loading ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Pre-Register Now</span>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center w-full"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 bg-[#063CB9]/10 border-[4px] border-[#063CB9] rounded-full flex items-center justify-center mx-auto mb-8 text-[#063CB9] shadow-2xl shadow-[#063CB9]/20"
              >
                <Check className="w-12 h-12 stroke-[3]" />
              </motion.div>

              <h2 className="font-syne text-[#063CB9] text-[64px] font-extrabold tracking-tighter leading-none mb-4">
                #{position.toLocaleString()}
              </h2>
              <div className="font-syncopate text-black text-[20px] font-bold tracking-tight uppercase mb-8">
                You're in line
              </div>
              
              <p className="text-black/60 text-sm leading-relaxed max-w-xs mx-auto mb-10 font-sans font-medium">
                We'll email you at <br/><span className="text-[#063CB9] font-bold text-base block mt-2">{email}</span><br/>when the beta launches.
              </p>

              <div className="bg-black/5 border border-black/10 rounded-2xl p-6 text-left w-full">
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest block mb-4 font-syncopate text-center">
                  Move up the line — share
                </span>
                
                <div className="flex gap-2 items-center bg-white/50 border border-black/10 rounded-xl p-2 pl-4">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-sm text-black outline-none flex-1 font-mono select-all border-none font-bold"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-[#063CB9]/10 hover:bg-[#063CB9] text-[#063CB9] hover:text-white rounded-lg transition-colors border-none cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20pre-registered%20for%20CollabSphere%20mobile!%20Join%20the%20waitlist%20to%20get%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-black/10 hover:border-[#063CB9] bg-transparent text-black rounded-xl py-3 text-xs font-bold transition-all text-decoration-none font-syncopate uppercase tracking-widest"
                  >
                    <Twitter className="w-4 h-4 fill-current" />
                    <span>X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-black/10 hover:border-[#063CB9] bg-transparent text-black rounded-xl py-3 text-xs font-bold transition-all text-decoration-none font-syncopate uppercase tracking-widest"
                  >
                    <Linkedin className="w-4 h-4 fill-current" />
                    <span>In</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div 
      className="min-h-screen lg:h-screen w-full bg-black text-white flex flex-col relative lg:overflow-hidden font-sans select-none"
      style={{
        backgroundImage: `repeating-radial-gradient(circle at 50% 100%, transparent 0, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)`
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
      `}} />

      {/* Massive Faded Background Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-start pointer-events-none opacity-[0.05] z-0">
        <div className="font-syncopate text-[#D4F842] text-[15vw] font-bold uppercase tracking-tighter whitespace-nowrap leading-none translate-y-1/4 italic pl-10">
          CollabSphere
        </div>
      </div>

      <Suspense fallback={
        <div className="h-full w-full flex flex-col items-center justify-center relative z-10">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <span className="text-sm font-mono text-emerald-300">Loading Waitlist...</span>
        </div>
      }>
        <WaitlistFormContent />
      </Suspense>
    </div>
  );
}
