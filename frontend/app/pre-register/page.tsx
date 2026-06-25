"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ArrowRight, Users, Zap, Code2 } from "lucide-react";
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
  } catch {
    console.error("Email confirmation failed");
  }
};

const STATS = [
  { icon: Users, label: "Builders joined", value: "2,400+" },
  { icon: Code2, label: "Projects launched", value: "180+" },
  { icon: Zap, label: "Collabs formed",   value: "640+" },
];

function WaitlistContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [email, setEmail]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");
  const [success, setSuccess]           = useState(false);
  const [position, setPosition]         = useState(0);
  const [honeypot, setHoneypot]         = useState("");
  const [focused, setFocused]           = useState(false);
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
          setErrorMsg('Security verification failed. Please refresh and try again.');
          return;
        }
      } catch { /* non-blocking */ }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const alreadyExists = await checkDuplicate(email);
    if (alreadyExists) {
      setErrorMsg("You're already on the list! We'll reach out soon.");
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
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center px-6"
      >
        {/* Check circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <Check className="w-7 h-7 text-emerald-400 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
          You're in.
        </h2>
        <p className="text-neutral-400 text-[15px] max-w-xs leading-relaxed">
          You secured spot&nbsp;
          <span className="text-white font-semibold">#{position.toLocaleString()}</span>.
          We'll email you when access opens.
        </p>
        <Link
          href="/dashboard/home"
          className="mt-8 flex items-center gap-2 text-[13px] text-neutral-400 hover:text-white transition-colors"
        >
          Go to the app <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-6 w-full max-w-2xl"
    >
      {/* Tag line */}
      <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-neutral-400 font-medium tracking-wide uppercase">
          Early access — limited spots
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-5 leading-[1.1]">
        Build together.<br />
        <span className="text-neutral-500">Ship faster.</span>
      </h1>

      {/* Sub-headline */}
      <p className="text-neutral-400 text-[16px] sm:text-[17px] max-w-md leading-relaxed mb-10">
        CollabSphere is the social network for developers—find teammates, share builds, and grow your network.
      </p>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div
          className={`flex items-center gap-2 bg-white/[0.04] border rounded-xl px-4 py-3 transition-all duration-200 ${
            focused
              ? "border-white/30 bg-white/[0.07]"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder-neutral-600 min-w-0"
            placeholder="your@email.com"
            required
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="flex items-center gap-1.5 bg-white text-black text-[13px] font-semibold px-4 py-2 rounded-lg transition-all hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Join <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        {/* Error */}
        <AnimatePresence>
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 text-[13px] text-red-400 text-center"
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-3 text-neutral-600 text-[12px]">
          No spam. Unsubscribe any time.
        </p>
      </form>

      {/* Turnstile hidden */}
      <div className="absolute opacity-0 pointer-events-none">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-5 mt-14">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{value}</span>
            <span className="text-[12px] text-neutral-500">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PreRegisterPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#000000] text-white flex flex-col font-sans overflow-hidden">

      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Header */}
      <header className="absolute top-0 w-full flex justify-between items-center px-6 sm:px-10 py-7 z-30">
        <Link href="/dashboard/home" className="flex items-center gap-2.5 group">
          <img
            src="/newlogo.png"
            alt="CollabSphere"
            className="w-5 h-5 invert opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-white/60 text-[13px] font-medium group-hover:text-white transition-colors">
            CollabSphere
          </span>
        </Link>

        <Link
          href="/login"
          className="text-[13px] text-neutral-500 hover:text-white transition-colors"
        >
          Sign in →
        </Link>
      </header>

      {/* Main: vertically centered */}
      <main className="flex-1 flex items-center justify-center z-20">
        <Suspense fallback={null}>
          <WaitlistContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full flex justify-between items-end px-6 sm:px-10 py-7 z-30">
        <span className="text-neutral-700 text-[11px]">
          © 2026 CollabSphere
        </span>
        <a
          href="https://twitter.com/collabsphere"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-700 text-[11px] hover:text-white transition-colors"
        >
          @collabsphere
        </a>
      </footer>
    </div>
  );
}
