"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, Smartphone, Award, ArrowUpRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist, getRecentSignups, getWaitlistCount } from "@/lib/waitlist";
import SideRays from "@/components/ui/SideRays";
import emailjs from "@emailjs/browser";

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

const sendConfirmationEmail = async (
  email: string, 
  platform: string
) => {
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
  const [honeypot, setHoneypot] = useState("");

  // Live total count from Firestore
  const [totalCount, setTotalCount] = useState(0);
  const [recentSignups, setRecentSignups] = useState<string[]>([]);

  // Listen to Firestore waitlist updates for real-time counters
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, "app_waitlist"), (snapshot) => {
      // Update count
      setTotalCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  // Fetch recent signups on mount
  useEffect(() => {
    getRecentSignups().then(names => {
      if (names && names.length > 0) setRecentSignups(names);
    });
  }, [success]);

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

    // Client-side honeypot check
    if (honeypot) {
      console.log('Bot detected');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Server-side rate limit + validation via API route
    try {
      const apiRes = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform, honeypot }),
      });

      if (!apiRes.ok) {
        const errData = await apiRes.json();
        setErrorMsg(errData.error || 'Something went wrong.');
        return;
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      return;
    }

    // Duplicate check against Firestore
    const alreadyExists = await checkDuplicate(email);
    if (alreadyExists) {
      setErrorMsg('This email is already registered!');
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await joinWaitlist(email, platform, referredBy);
      if (res.success) {
        // 2. Send confirmation email
        await sendConfirmationEmail(email, platform);

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

  return (
    <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
      
      {/* LEFT PANEL - Typography and Stats */}
      <div className="flex-1 flex flex-col relative h-full overflow-y-auto no-scrollbar bg-[#D4F842]">
        
        {/* Header inside left panel */}
        <div className="flex items-center gap-6 p-6 md:p-8 w-full z-20 shrink-0">
          <a 
            href="/dashboard/home" 
            className="flex items-center gap-2 text-black hover:text-black/70 transition-colors text-[10px] uppercase font-syncopate tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </a>
          <div className="font-syncopate text-black text-[12px] font-bold uppercase tracking-widest">
            CollabSphere
          </div>
        </div>

        <div className="flex flex-col xl:flex-row flex-1 w-full">
          {/* Text Content Column */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-10 xl:px-12 pb-6 md:pb-8 z-10">
            
            <h1 className="font-serif italic text-black text-[36px] md:text-[48px] lg:text-[64px] font-bold leading-[0.9] tracking-tighter mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Decode the chain.<br/>Earn the edge.
            </h1>
            
            {/* Thick black horizontal bar */}
            <div className="w-12 h-2 bg-black mb-4" />

            <p className="font-sans text-black text-[11px] md:text-[12px] leading-relaxed max-w-sm font-bold mb-6">
              We turn raw, complex on-chain data into clear insights, gamified missions, and real-time rewards. Whether you're a developer, analyst, or curious explorer, CollabSphere lets you track, learn, and compete — all in one seamless, interactive space. The chain is open. It's time to play.
            </p>

          {/* SEGMENTED PROGRESS METRIC BOARD */}
          <div className="mt-4 lg:mt-auto w-full max-w-[400px]">
            <div className="border border-white/20 bg-[#0a0a0a] p-4 md:p-5 rounded-xl font-sans relative z-20 shadow-2xl">
              
              {/* Tags & Menu */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="border border-white/20 px-2 py-0.5 rounded-md text-[9px] text-white/70 tracking-wide uppercase">
                    v1.0.0-BETA
                  </span>
                  <span className="border border-white/20 px-2 py-0.5 rounded-md text-[9px] text-white/70 tracking-wide uppercase">
                    live
                  </span>
                  <span className="border border-white/20 px-2 py-0.5 rounded-md text-[9px] text-white/70 tracking-wide uppercase">
                    global
                  </span>
                </div>
                <div className="flex gap-1 items-center mr-1">
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-[22px] font-medium text-white tracking-tight leading-none mb-3">
                Beta Allocation
              </h2>

              {/* Divider */}
              <div className="h-px w-full bg-white/20 mb-3" />

              {/* Subtext */}
              <p className="text-[11px] leading-relaxed text-white/70 mb-4">
                Tracking early-access registrations across the global network. Spots are limited.
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[40px] font-medium text-white tracking-tighter leading-none">
                  {Math.min(100, Math.max(0, Math.round((totalCount / 150) * 100)))}%
                </span>
                <div className="flex items-center gap-2">
                  <span className="border border-white/20 px-2 py-1 rounded-md text-[11px] text-white flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {totalCount}
                  </span>
                  <span className="text-[11px] text-white/50">
                    builders joined
                  </span>
                </div>
              </div>

              {/* Segmented Progress Bar */}
              <div className="flex gap-[2px] h-8 md:h-10 w-full mb-4">
                {Array.from({ length: 32 }).map((_, i) => {
                  const capacityPercent = Math.min(100, Math.max(0, (totalCount / 150) * 100));
                  const filledBars = Math.round((capacityPercent / 100) * 32);
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-[1.5px] ${i < filledBars ? 'bg-[#e5e5e5]' : 'bg-[#2a2a2a]'}`} 
                    />
                  );
                })}
              </div>

              {/* Unique Terminal Feed for Recent Users */}
              <div className="w-full bg-[#111111] rounded-lg p-2.5 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D4F842]/50 group-hover:bg-[#D4F842] transition-colors" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 pl-2">
                    <div className="relative flex h-2 w-2 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4F842] opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4F842]"></span>
                    </div>
                    <span className="text-[9px] font-syncopate font-bold text-white/40 uppercase tracking-[0.2em]">
                      SYS_FEED
                    </span>
                  </div>
                  
                  <div className="font-mono text-[10px] text-white/80 flex items-center">
                    {recentSignups.length > 0 ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-white/40">_new:</span>
                        <span className="text-[#D4F842] font-bold">[{recentSignups[0]}]</span>
                        <span className="text-white/30 ml-0.5">joined</span>
                      </span>
                    ) : (
                      <span className="text-white/30 animate-pulse">_ scanning...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Graphic Column - Black Block with Yellow Pixel Star */}
          <div className="hidden xl:flex w-[350px] 2xl:w-[450px] shrink-0 bg-black items-center justify-center relative border-l-4 border-black">
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
              
              {/* Brutalist Pixel Star built with Grid */}
              <div className="grid grid-cols-11 grid-rows-11 gap-0 w-[220px] h-[220px]">
                {Array.from({ length: 121 }).map((_, i) => {
                  const x = i % 11;
                  const y = Math.floor(i / 11);
                  // Create the jagged star shape
                  let isYellow = false;
                  if (x >= 4 && x <= 6 && y >= 1 && y <= 9) isYellow = true; // Vertical core
                  if (y >= 4 && y <= 6 && x >= 1 && x <= 9) isYellow = true; // Horizontal core
                  if ((x===2||x===3||x===7||x===8) && (y===2||y===3||y===7||y===8)) isYellow = true; // Thick diagonals
                  if ((x===1||x===9) && (y===3||y===7)) isYellow = true; // Outer jags
                  if ((y===1||y===9) && (x===3||x===7)) isYellow = true; // Outer jags
                  if ((x===5) && (y===0||y===10)) isYellow = true; // Tips
                  if ((y===5) && (x===0||x===10)) isYellow = true; // Tips
                  
                  // Black out the center to match poster
                  if (x >= 4 && x <= 6 && y >= 4 && y <= 6) isYellow = false;
                  
                  return (
                    <div key={i} className={`w-full h-full ${isYellow ? 'bg-[#D4F842]' : 'bg-transparent'}`} />
                  );
                })}
              </div>
            </div>
            
            {/* Pixel accents extending from the black background */}
            <div className="absolute top-[20%] -left-6 w-6 h-6 bg-black" />
            <div className="absolute bottom-[30%] -left-4 w-4 h-4 bg-black" />
            <div className="absolute top-[45%] -left-8 w-8 h-4 bg-black" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Arch Form */}
      <div className="w-full md:w-[380px] lg:w-[450px] xl:w-[600px] bg-[#D4F842] rounded-t-[60px] md:rounded-t-none md:rounded-l-[80px] min-h-[70vh] md:h-full relative flex flex-col justify-center px-8 md:px-10 lg:px-16 xl:px-20 shadow-[-30px_0_80px_rgba(212,248,66,0.15)] py-12 md:py-0 md:overflow-y-auto no-scrollbar">
        {/* Toggle graphic */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 bg-[#063CB9] w-12 h-6 rounded-full p-[3px] flex items-center justify-end shadow-inner">
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

                <div className="space-y-3">
                  <label className="text-[10px] font-syncopate font-bold text-black/50 uppercase tracking-widest block w-full">Select Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["android", "ios", "both"] as const).map((p) => {
                      const isActive = platform === p;
                      const label = p === "android" ? "Android" : p === "ios" ? "iOS" : "Both";
                      
                      const AppleIcon = () => (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-[14px] h-[14px] fill-current shrink-0"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                      );
                      const PlayIcon = () => (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-[14px] h-[14px] fill-current shrink-0"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                      );

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`py-3.5 px-2 rounded-xl text-[11px] font-syncopate font-bold uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                            isActive 
                              ? "bg-[#063CB9] text-white shadow-md shadow-[#063CB9]/30 scale-105" 
                              : "bg-black/5 text-black/50 hover:bg-black/10"
                          }`}
                        >
                          {p === "ios" && <AppleIcon />}
                          {p === "android" && <PlayIcon />}
                          {p === "both" && (
                            <div className="flex items-center gap-0.5 opacity-80">
                              <AppleIcon />
                              <PlayIcon />
                            </div>
                          )}
                          <span>{label}</span>
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
      className="min-h-screen md:h-screen w-full bg-black text-white flex flex-col relative md:overflow-hidden font-sans select-none"
      style={{
        backgroundImage: `repeating-radial-gradient(circle at 50% 100%, transparent 0, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)`
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
      `}} />



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

// Trigger deployment


