"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ArrowRight } from "lucide-react";
import Lanyard from "@/components/Lanyard";

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF512F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-[#FF512F] selection:text-white">
      
      {/* LEFT COLUMN: Form */}
      <div className="w-full md:w-1/2 min-h-screen bg-black flex flex-col items-center justify-center p-8 border-r border-[#262626] relative z-10">
        <div className="w-full max-w-md bg-[#111111]/80 backdrop-blur-3xl border border-[#262626] rounded-[24px] p-8 md:p-10 shadow-2xl relative">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF512F] to-[#F09819] text-white shadow-[0_0_30px_rgba(255,81,47,0.4)]">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              Welcome aboard
            </h2>
            <p className="text-gray-400 text-sm">
              Let's get your CollabSphere account set up. You can add more details to your profile later.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-3 text-left">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleFinish} className="space-y-5 text-left">
            
            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Keerthan Reddy"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full bg-black border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl px-4 py-3.5 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-500 font-bold select-none text-base">@</span>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                  className="w-full bg-black border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl pl-9 pr-12 py-3.5 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                />
                <div className="absolute right-4 flex items-center">
                  {isCheckingUsername && (
                    <div className="h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {!isCheckingUsername && isUsernameAvailable === true && (
                    <span className="text-[#00FF00] font-bold text-base shadow-[0_0_10px_rgba(0,255,0,0.3)] rounded-full">✓</span>
                  )}
                  {!isCheckingUsername && isUsernameAvailable === false && (
                    <span className="text-red-500 font-bold text-base shadow-[0_0_10px_rgba(255,0,0,0.3)] rounded-full">✗</span>
                  )}
                </div>
              </div>
              <div className="mt-2 h-4">
                {isUsernameAvailable === true && (
                  <span className="text-xs text-[#00FF00] font-bold block">Username is available!</span>
                )}
                {isUsernameAvailable === false && (
                  <span className="text-xs text-red-500 font-bold block">Username is already taken.</span>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || isUsernameAvailable === false}
                className="w-full bg-gradient-to-r from-[#FF512F] to-[#F09819] hover:from-[#e64627] hover:to-[#d98715] text-white rounded-xl h-14 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,81,47,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter CollabSphere</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive 3D Lanyard ID Card */}
      <div className="hidden md:flex w-1/2 h-screen bg-[#050505] relative overflow-hidden items-center justify-center">
        {/* Background glowing effects for the 3D card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF512F]/10 blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#F09819]/10 blur-[150px] mix-blend-screen" />
        </div>
        
        {/* Lanyard Component overlay */}
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
          <Lanyard 
            name={formData.fullName} 
            username={formData.username} 
          />
        </div>
      </div>
    </div>
  );
}
