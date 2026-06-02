"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signUpWithEmail, checkPasswordStrength } from "@/lib/auth";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Github, Chrome, Zap, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

function StepItem({ number, text, active }: { number: number, text: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-white text-black border border-white' : 'bg-brand-dark text-white border border-transparent'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 ${active ? 'bg-black text-white' : 'bg-white/10 text-white/40'}`}>
        {number}
      </div>
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
}

function SocialButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-2 bg-black border border-white/10 rounded-xl h-12 hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold text-white">
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function InputGroup({ label, placeholder, type, helper, value, onChange, id, required }: any) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={isPassword ? "new-password" : id === "email" ? "email" : "off"}
          className="w-full bg-[#111] border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 outline-none transition-all text-sm"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helper && <p className="text-xs text-white/30 mt-1">{helper}</p>}
    </div>
  );
}

// ── Password Strength Meter ──────────────────────────────────────────────────
function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const strength = checkPasswordStrength(password);

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: strength.color }}>
          {strength.label}
        </span>
        {strength.score === 4 && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Strong password
          </span>
        )}
      </div>
      {/* Unmet requirements */}
      {strength.errors.length > 0 && (
        <ul className="space-y-1">
          {strength.errors.map((err) => (
            <li key={err} className="flex items-center gap-1.5 text-xs text-white/40">
              <XCircle className="w-3 h-3 text-red-500/60 shrink-0" />
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stack, setStack] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAndRedirect = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, "builder_profiles", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push("/dashboard/home");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      router.push("/onboarding");
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) checkAndRedirect(user.uid);
    });
    return () => unsubscribe();
  }, [checkAndRedirect]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Full strength validation before submitting
    const strength = checkPasswordStrength(password);
    if (strength.score < 4) {
      setError(`Password is too weak. Missing: ${strength.errors.join(", ")}.`);
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await signUpWithEmail(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    try {
      await signInWithGithub();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with GitHub.");
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      
      {/* Left Column */}
      <div className="relative hidden lg:flex flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full w-[52%] shrink-0">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
          }}
          className="relative z-10 w-full max-w-xs space-y-8"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white fill-white" />
            <span className="text-xl font-semibold tracking-tight text-white">CollabSphere</span>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white">Build Together.</h1>
            <p className="text-white/60 text-sm leading-relaxed mt-2 px-4">
              Join a community of developers building, showcasing, and growing together.
            </p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="space-y-3">
            <StepItem number={1} text="Create your builder profile" active={true} />
            <StepItem number={2} text="Set your stack & skills" />
            <StepItem number={3} text="Start collaborating" />
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column — Sign Up Form */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
        >
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-white">Join CollabSphere</h2>
            <p className="text-white/40 text-sm mt-1.5">Connect with builders, share projects, find collaborators.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={Chrome} label="Google" onClick={handleGoogleSignIn} />
            <SocialButton icon={Github} label="GitHub" onClick={handleGithubSignIn} />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest shrink-0">Or</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name" placeholder="John" id="firstName" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} type="text" required />
              <InputGroup label="Last Name" placeholder="Doe" id="lastName" value={lastName} onChange={(e: any) => setLastName(e.target.value)} type="text" required />
            </div>

            <InputGroup label="Username" placeholder="@yourhandle" id="username" value={username} onChange={(e: any) => setUsername(e.target.value)} type="text" required />
            <InputGroup label="Email" placeholder="you@example.com" id="email" value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" required />

            {/* Password with live strength meter */}
            <div>
              <InputGroup
                label="Password"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                type="password"
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <InputGroup label="Stack Tags" placeholder="React, Node, Python..." id="stack" value={stack} onChange={(e: any) => setStack(e.target.value)} type="text" helper="You can update this later in your profile." />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Builder Account"
              )}
            </button>
          </form>

          <p className="text-sm text-white/40">
            Already a builder?{" "}
            <Link href="/login" className="text-white hover:underline transition-colors">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
