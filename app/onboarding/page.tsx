"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  // Mount check: if user already onboarded
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkOnboarding = async () => {
      const docRef = doc(db, "builder_profiles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push("/dashboard/welcome");
      } else {
        if (docSnap.exists()) {
          const d = docSnap.data();
          setFormData({
            fullName: d.full_name || user.displayName || "",
            username: d.username || user.email?.split("@")[0] || "",
          });
        } else {
          setFormData({
            fullName: user.displayName || "",
            username: user.email?.split("@")[0] || ""
          });
        }
      }
    };
    checkOnboarding();
  }, [user, authLoading, router]);

  // Username availability check
  useEffect(() => {
    if (!formData.username.trim() || formData.username.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const q = query(
          collection(db, "builder_profiles"),
          where("username", "==", formData.username.trim().toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        
        let taken = false;
        querySnapshot.forEach((doc) => {
          if (doc.id !== user?.uid) {
            taken = true;
          }
        });
        
        setIsUsernameAvailable(!taken);
      } catch (err) {
        console.error("Error checking username:", err);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.username, user]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.fullName.trim() || !formData.username.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (isUsernameAvailable === false) {
      setError("Username is already taken.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await setDoc(
        doc(db, "builder_profiles", user.uid),
        {
          uid: user.uid,
          email: user.email,
          full_name: formData.fullName || user.displayName || "Builder",
          username: formData.username,
          avatar_url: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
          bio: "",
          location: "",
          skills: [],
          stack: [],
          experience_level: "Mid",
          looking_for: [],
          availability: "Open to collab",
          github_url: "",
          twitter_url: "",
          onboarding_completed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { merge: true }
      );
      router.push("/dashboard/welcome");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7EE8FA] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col items-center justify-center p-4 selection:bg-[#7e85fe] selection:text-white">
      
      {/* Top Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(126,133,254,0.4)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CollabSphere</h1>
      </div>

      <div className="w-full max-w-[340px] text-center mt-4">
        <h2 className="text-3xl font-bold text-white mb-3">
          Set up your profile
        </h2>
        <p className="text-[#888888] text-sm mb-8 leading-relaxed">
          Provide your name and choose a unique username to get started.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleFinish} className="space-y-3">
          
          <input
            type="text"
            required
            placeholder="Full Name"
            value={formData.fullName}
            onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full bg-[#111111] border border-white/5 focus:border-[#7e85fe] rounded-[10px] px-4 py-3.5 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
          />

          <div className="relative">
            <span className="absolute left-4 inset-y-0 flex items-center text-[#666666] font-medium text-sm">@</span>
            <input
              type="text"
              required
              placeholder="username"
              value={formData.username}
              onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
              className="w-full bg-[#111111] border border-white/5 focus:border-[#7e85fe] rounded-[10px] pl-9 pr-12 py-3.5 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
            />
            <div className="absolute right-4 inset-y-0 flex items-center">
              {isCheckingUsername && (
                <div className="h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              )}
              {!isCheckingUsername && isUsernameAvailable === true && (
                <span className="text-[#7EE8FA] font-bold text-sm">✓</span>
              )}
              {!isCheckingUsername && isUsernameAvailable === false && (
                <span className="text-red-500 font-bold text-sm">✗</span>
              )}
            </div>
          </div>

          <div className="h-4 text-left px-1 mt-1 mb-2">
            {isUsernameAvailable === true && (
              <span className="text-[11px] text-[#7EE8FA] font-medium">Username is available!</span>
            )}
            {isUsernameAvailable === false && (
              <span className="text-[11px] text-red-500 font-medium">Username is already taken.</span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || isUsernameAvailable === false}
            className="w-full bg-gradient-to-r from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] text-black font-bold rounded-[10px] py-3.5 mt-2 hover:opacity-90 transition-all text-sm flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>

      </div>

    </div>
  );
}
