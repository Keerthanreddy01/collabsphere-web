"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, User, Ticket
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist } from "@/lib/waitlist";
import { Turnstile } from '@marsidev/react-turnstile';
import emailjs from "@emailjs/browser";
import Link from "next/link";

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

// Animated Glowing Orb Background
const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#ff453a]/20 rounded-full blur-[120px] mix-blend-screen"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -70, 0],
          y: [0, 70, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ff2a1f]/20 rounded-full blur-[100px] mix-blend-screen"
      />
    </div>
  );
};

// Animated Number Counter for Success State
const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = (totalDuration / end) * 3;

    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start > end) start = end;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<'idle' | 'solved' | 'error'>('idle');

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
          setErrorMsg('Verification failed. Please refresh and try again.');
          return;
        }
      } catch {}
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

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
        await sendConfirmationEmail(email, platform);

        setPosition(res.position);
        setRefCode(res.refCode);
        setSuccess(true);
        
        // Premium Confetti
        const end = Date.now() + 3 * 1000;
        const colors = ['#ff453a', '#ffffff', '#ff2a1f'];
        
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });
        
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());

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
    : `collabsphere.com/pre-register?ref=${refCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col pt-24 pb-12 px-4 sm:px-6">
      
      {/* Header Navigation */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 z-50">
        <Link 
          href="/dashboard/home" 
          className="flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 text-xs font-syncopate tracking-widest font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to App</span>
        </Link>
        <div className="font-syncopate text-white text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
          <img src="/newlogo.png" alt="Logo" className="w-5 h-5 opacity-80" />
          <span className="hidden sm:inline">CollabSphere</span>
        </div>
      </div>

      <div className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center z-10 flex-1 justify-center relative">
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              {/* Premium Pill Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 relative group cursor-default"
              >
                <div className="absolute inset-0 bg-[#ff453a]/20 rounded-full blur-md group-hover:bg-[#ff453a]/30 transition-all duration-500"></div>
                <div className="relative border border-[#ff453a]/30 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-[#ff453a] text-[11px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,69,58,0.15)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Early Access</span>
                </div>
              </motion.div>

              {/* HEADING with Gradient Mask */}
              <h1 className="font-syne font-[800] tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-sm" style={{ fontSize: 'clamp(48px, 6vw, 76px)', lineHeight: '1.05' }}>
                CollabSphere is almost ready.
              </h1>
              
              {/* SUBTEXT */}
              <p className="text-white/50 text-[16px] sm:text-[18px] leading-[1.6] max-w-[500px] mx-auto mb-12 font-sans font-medium">
                We're inviting elite engineers to run it on real code and help shape what ships.
              </p>

              {/* PREMIUM GLASSMORPHISM FORM CARD */}
              <div className="w-full max-w-[480px] relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[32px] blur-xl opacity-50"></div>
                
                <form 
                  onSubmit={handleSubmit} 
                  className="relative w-full bg-white/[0.02] border border-white/10 rounded-[32px] p-2 sm:p-3 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-3 overflow-hidden transition-all duration-300 hover:bg-white/[0.03] hover:border-white/20"
                >
                  <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-white/30" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent border-none text-white placeholder-white/30 pl-11 pr-4 py-4 sm:py-3 text-[14px] font-sans outline-none focus:ring-0"
                    />
                  </div>
                  
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative overflow-hidden w-full sm:w-auto bg-white text-black font-sans font-bold px-8 py-4 sm:py-3 text-[13px] tracking-wide rounded-[24px] transition-all duration-300 flex items-center justify-center group shadow-[0_0_20px_rgba(255,255,255,0.2)]
                      ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer'}
                    `}
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        "Join Waitlist"
                      )}
                    </span>
                  </button>
                </form>

                {/* Turnstile & Errors */}
                <div className="w-full flex justify-center mt-6 min-h-[0px]">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                      setTurnstileStatus('solved');
                    }}
                    onError={() => {
                      setTurnstileToken(null);
                      setTurnstileStatus('error');
                    }}
                    onExpire={() => {
                      setTurnstileToken(null);
                      setTurnstileStatus('idle');
                    }}
                    options={{ theme: 'dark', size: 'flexible' }}
                  />
                </div>
                {turnstileStatus === 'error' && (
                  <p className="text-[#ff453a] text-xs font-medium mt-2 text-center animate-pulse">Verification failed. Please refresh.</p>
                )}
                {errorMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[#ff453a] text-sm font-medium mt-4 text-center bg-[#ff453a]/10 py-2 px-4 rounded-full border border-[#ff453a]/20 inline-block mx-auto"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="text-center w-full max-w-lg mx-auto flex flex-col items-center"
            >
              {/* VIP Ticket Graphic */}
              <div className="relative w-full mb-10 group perspective-1000">
                <motion.div 
                  initial={{ rotateX: 20, y: 50, opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-[32px] p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] transform-style-3d group-hover:rotate-x-2 group-hover:rotate-y-2 transition-transform duration-500"
                >
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  {/* Ticket Notches */}
                  <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0d0d0d] rounded-full border border-white/10 border-l-0"></div>
                  <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0d0d0d] rounded-full border border-white/10 border-r-0"></div>
                  
                  <Ticket className="w-12 h-12 text-[#ff453a] mx-auto mb-6 opacity-80" />
                  
                  <p className="text-white/50 text-sm font-syncopate uppercase tracking-[0.2em] mb-2">You are number</p>
                  <h2 className="font-syne text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 text-[64px] leading-none font-bold tracking-tight mb-2">
                    #<AnimatedCounter value={position} />
                  </h2>
                  <p className="text-[#10b981] text-xs font-mono font-medium tracking-widest uppercase bg-[#10b981]/10 py-1.5 px-3 rounded-full inline-block border border-[#10b981]/20 mt-4">
                    Spot Secured
                  </p>
                </motion.div>
              </div>
              
              <p className="text-white/60 text-[15px] leading-relaxed max-w-sm mx-auto mb-10 font-sans">
                A confirmation email has been dispatched. 
                <br/>Want priority access? Share your link below.
              </p>

              <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-6 rounded-[24px] backdrop-blur-xl">
                <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 mb-4 overflow-hidden">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-[13px] text-white/70 outline-none flex-1 font-mono px-4 py-3 border-none w-full truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-xl transition-colors cursor-pointer font-bold font-sans text-sm flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20secured%20my%20spot%20for%20CollabSphere!%20Join%20the%20waitlist%20for%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl py-3 text-sm transition-all font-sans font-bold"
                  >
                    <Twitter className="w-4 h-4" />
                    Share
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 text-[#0A66C2] rounded-xl py-3 text-sm transition-all font-sans font-bold"
                  >
                    <Linkedin className="w-4 h-4" />
                    Share
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="w-full mt-auto pt-24 pb-8 flex flex-col items-center z-20 relative bg-transparent">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-between items-start border-t border-white/10 pt-10">
          
          <div className="flex flex-col max-w-[300px] mb-10 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <img src="/newlogo.png" alt="Logo" className="w-5 h-5 opacity-70" />
              <span className="font-syne text-[18px] font-bold tracking-tight text-white/80 uppercase">
                CollabSphere
              </span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed font-sans">
              Local-first AI for developers who refuse to be dependent on the cloud.
            </p>
          </div>

          <div className="flex gap-16 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-white/30 text-[10px] font-syncopate font-bold tracking-widest uppercase">Connect</span>
              <a href="#" className="text-white/50 text-[13px] hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-white/50 text-[13px] hover:text-white transition-colors">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white/30 text-[10px] font-syncopate font-bold tracking-widest uppercase">Legal</span>
              <a href="#" className="text-white/50 text-[13px] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/50 text-[13px] hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div 
      className="min-h-screen w-full bg-[#050505] text-white flex flex-col relative font-sans overflow-x-hidden selection:bg-[#ff453a]/30 selection:text-white"
    >
      <AmbientBackground />
      
      {/* Heavy Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          mixBlendMode: 'screen'
        }}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />

      <Suspense fallback={
        <div className="h-full w-full flex flex-col items-center justify-center relative z-20 min-h-screen">
          <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4" />
        </div>
      }>
        <WaitlistFormContent />
      </Suspense>
    </div>
  );
}
