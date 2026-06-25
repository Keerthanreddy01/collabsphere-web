"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Copy, CheckCheck, LogOut } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist } from "@/lib/waitlist";
import { Turnstile } from '@marsidev/react-turnstile';
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

const sendConfirmationEmail = async (email: string, platform: string) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      { to_email: email, user_name: email.split("@")[0], platform },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
  } catch { /* silent */ }
};

// ── Share helpers ─────────────────────────────────────────────────────────────
function ShareButtons({ refUrl }: { refUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(refUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { }
  };

  const shareText = encodeURIComponent("I just joined the CollabSphere waitlist — the social network for developers. Join me:");
  const shareUrl  = encodeURIComponent(refUrl);

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-5">
      {/* Referral link */}
      <div className="w-full flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-3">
        <span className="flex-1 text-[13px] text-neutral-400 truncate font-mono">{refUrl}</span>
        <button
          onClick={copy}
          className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
        >
          {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/70" />}
        </button>
      </div>

      {/* Or divider */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-[1px] bg-white/10" />
        <span className="text-neutral-600 text-[12px]">Or</span>
        <div className="flex-1 h-[1px] bg-white/10" />
      </div>

      {/* Share buttons */}
      <div className="flex gap-3 w-full justify-center flex-wrap">
        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}%20${shareUrl}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-neutral-200 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
          Share
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#20c45e] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Share
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] text-white text-[13px] font-semibold hover:bg-[#1565d8] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Share
        </a>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
function WaitlistContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [email, setEmail]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [errorMsg, setErrorMsg]             = useState("");
  const [success, setSuccess]               = useState(false);
  const [position, setPosition]             = useState(0);
  const [refCode, setRefCode]               = useState("");
  const [honeypot, setHoneypot]             = useState("");
  const [focused, setFocused]               = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const refUrl = refCode
    ? `${typeof window !== "undefined" ? window.location.origin : "https://collabsphereweb.vercel.app"}/pre-register?ref=${refCode}`
    : "";

  const checkDuplicate = async (emailToCheck: string) => {
    if (!db) return false;
    const snap = await getDocs(query(collection(db, 'app_waitlist'), where('email', '==', emailToCheck.toLowerCase().trim())));
    return !snap.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading || honeypot) return;

    if (turnstileToken) {
      try {
        const r = await fetch('/api/verify-turnstile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: turnstileToken }) });
        const d = await r.json();
        if (!d.success) { setErrorMsg('Security check failed. Refresh and try again.'); return; }
      } catch { }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg('Please enter a valid email.'); return; }

    setLoading(true); setErrorMsg("");

    if (await checkDuplicate(email)) { setErrorMsg("You're already on the list!"); setLoading(false); return; }

    try {
      const res = await joinWaitlist(email, "both", referredBy);
      if (res.success) {
        await sendConfirmationEmail(email, "both");
        setPosition(res.position);
        setRefCode(res.refCode);
        setSuccess(true);
      } else {
        setErrorMsg(res.message);
      }
    } catch { setErrorMsg("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center text-center px-4 w-full max-w-lg">
      <div className="mb-10">
        <img src="/newlogo.png" alt="CollabSphere" className="w-8 h-8 opacity-80" />
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                You're on the waitlist
              </h1>
              <p className="text-neutral-400 text-[15px] leading-relaxed">
                You've successfully secured spot <span className="text-white font-semibold">#{position.toLocaleString()}</span>.
                <br className="hidden sm:block" /> Feel free to refer your friends!
              </p>
            </div>
            <ShareButtons refUrl={refUrl} />
            <Link href="/dashboard/home" className="text-[13px] text-neutral-600 hover:text-white transition-colors mt-2">
              Go to the app →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full gap-6"
          >
            
            {/* Lottie Animation */}
            <div className="w-full max-w-sm h-48 sm:h-64 mb-2 pointer-events-none">
              <DotLottieReact
                src="/Slideshow.lottie"
                loop
                autoplay
              />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className={`flex items-center gap-2 bg-white/[0.04] border rounded-full px-4 py-3 transition-all duration-200 shadow-[0_0_40px_rgba(0,0,0,0.8)] ${focused ? "border-white/30 bg-white/[0.07]" : "border-white/10"}`}>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder-neutral-600 min-w-0"
                  placeholder="Enter email address" required
                />
                <button
                  type="submit" disabled={loading || !email.trim()}
                  className="flex items-center gap-1.5 bg-white text-black text-[13px] font-semibold px-4 py-1.5 rounded-full transition-all hover:bg-neutral-200 disabled:opacity-40 shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                </button>
              </div>
              <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              <AnimatePresence>
                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-[13px] text-red-400">
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Turnstile hidden */}
            <div className="absolute opacity-0 pointer-events-none">
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={t => setTurnstileToken(t)} onError={() => setTurnstileToken(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────
export default function PreRegisterPage() {
  const { user, signOutAndClear } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white flex flex-col font-sans overflow-hidden">


      {/* Subtle noise */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Header */}
      <header className="absolute top-0 w-full flex justify-between items-center px-6 sm:px-10 py-6 z-30">
        <Link href="/dashboard/home" className="flex items-center gap-2 group">
          <img src="/newlogo.png" alt="CS" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-white/50 text-[13px] group-hover:text-white transition-colors">CollabSphere</span>
        </Link>
        {user ? (
          <button 
            onClick={signOutAndClear}
            className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        ) : (
          <Link href="/login" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Sign in →</Link>
        )}
      </header>

      {/* Center content */}
      <main className="flex-1 flex items-center justify-center z-20">
        <Suspense fallback={null}>
          <WaitlistContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full flex justify-between items-end px-6 sm:px-10 py-6 z-30">
        <span className="text-neutral-800 text-[11px]">© 2026 CollabSphere</span>
        <a href="https://twitter.com/collabsphere" target="_blank" rel="noopener noreferrer" className="text-neutral-800 text-[11px] hover:text-white transition-colors">@collabsphere</a>
      </footer>
    </div>
  );
}
