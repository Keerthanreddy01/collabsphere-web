"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import ProfileCard from "@/components/ProfileCard";

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-white selection:text-black">
      
      {/* LEFT COLUMN: Clean Form */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-[340px]">
          
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
              Setup Profile
            </h1>
            <p className="text-[#888888] text-sm leading-relaxed">
              Let's create your developer identity.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleFinish} className="space-y-4">
            
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full bg-transparent border-b border-white/20 focus:border-white px-1 py-3 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
            />

            <div className="relative">
              <span className="absolute left-1 inset-y-0 flex items-center text-[#666666] font-medium text-sm">@</span>
              <input
                type="text"
                required
                placeholder="username"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                className="w-full bg-transparent border-b border-white/20 focus:border-white pl-6 pr-10 py-3 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
              />
              <div className="absolute right-1 inset-y-0 flex items-center">
                {isCheckingUsername && (
                  <div className="h-3 w-3 border-2 border-[#666] border-t-transparent rounded-full animate-spin" />
                )}
                {!isCheckingUsername && isUsernameAvailable === true && (
                  <span className="text-white font-medium text-sm">✓</span>
                )}
                {!isCheckingUsername && isUsernameAvailable === false && (
                  <span className="text-white font-medium text-sm">✗</span>
                )}
              </div>
            </div>
            
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || isUsernameAvailable === false}
                className="w-full bg-white text-black font-semibold rounded-full py-3.5 hover:bg-gray-200 transition-all text-sm flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Copyright Footer */}
        <div className="absolute bottom-8 left-8 right-8 text-center md:text-left text-[#444444] text-xs font-medium">
          © CollabSphere {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT COLUMN: ProfileCard Preview */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-[#050505] border-t md:border-t-0 md:border-l border-white/5 relative overflow-hidden flex items-center justify-center p-8">
        <ProfileCard 
          name={formData.fullName || "Your Name"}
          handle={formData.username || "username"}
          title="Software Engineer"
          status="Online"
          contactText="Contact Me"
          avatarUrl={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=600&q=80"}
          innerGradient="linear-gradient(145deg, #111111 0%, #000000 100%)"
          behindGlowColor="rgba(255, 255, 255, 0.1)"
        />
      </div>

    </div>
  );
}
