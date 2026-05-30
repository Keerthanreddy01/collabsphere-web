"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Github, 
  Twitter, 
  MapPin, 
  User, 
  Code, 
  Target,
  Sparkles
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    location: "",
    skills: [] as string[],
    stack: [] as string[],
    experienceLevel: "Mid",
    lookingFor: [] as string[],
    availability: "Open to collab",
    githubUrl: "",
    twitterUrl: ""
  });

  const [skillInput, setSkillInput] = useState("");
  const [stackInput, setStackInput] = useState("");

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
            bio: d.bio || "",
            location: d.location || "",
            skills: d.skills || [],
            stack: d.stack || [],
            experienceLevel: d.experience_level || "Mid",
            lookingFor: Array.isArray(d.looking_for) 
              ? d.looking_for 
              : d.looking_for 
                ? d.looking_for.split(",") 
                : [],
            availability: d.availability || "Open to collab",
            githubUrl: d.github_url || "",
            twitterUrl: d.twitter_url || ""
          });
        } else {
          setFormData(prev => ({
            ...prev,
            fullName: user.displayName || "",
            username: user.email?.split("@")[0] || ""
          }));
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

  const handleFinish = async () => {
    if (!user) return;
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
          bio: formData.bio,
          location: formData.location,
          skills: formData.skills,
          stack: formData.stack,
          experience_level: formData.experienceLevel,
          looking_for: formData.lookingFor,
          availability: formData.availability,
          github_url: formData.githubUrl,
          twitter_url: formData.twitterUrl,
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

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = skillInput.trim().toLowerCase();
      if (val && !formData.skills.includes(val)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, val] }));
      }
      setSkillInput("");
    }
  };

  const handleAddStack = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = stackInput.trim().toLowerCase();
      if (val && !formData.stack.includes(val)) {
        setFormData(prev => ({ ...prev, stack: [...prev.stack, val] }));
      }
      setStackInput("");
    }
  };

  const handleToggleLookingFor = (value: string) => {
    setFormData(prev => {
      const current = prev.lookingFor || [];
      const next = current.includes(value)
        ? current.filter(x => x !== value)
        : [...current, value];
      return { ...prev, lookingFor: next };
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF512F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-[#FF512F] selection:text-white">
      
      {/* Dynamic Slide Animations */}
      <style>{`
        @keyframes slideInFromRight {
          0% { transform: translate3d(25px, 0, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-slide-step {
          animation: slideInFromRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      {/* LEFT COLUMN: STEP CONTENT & FORM */}
      <div className="w-full md:w-1/2 h-full min-h-screen p-8 sm:p-12 lg:p-20 flex flex-col justify-between relative bg-[#0a0a0a] border-r border-[#262626] overflow-y-auto no-scrollbar z-10">
        
        {/* Top Logo and Step Progress Indicators */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#262626]">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF512F] to-[#F09819] text-white font-black shadow-[0_0_20px_rgba(255,81,47,0.3)] group-hover:shadow-[0_0_30px_rgba(255,81,47,0.5)] transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">CollabSphere</span>
          </div>

          {/* Stepper progress */}
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`rounded-full transition-all duration-500 flex items-center justify-center ${
                    step === i
                      ? "w-6 h-6 bg-[#FF512F] text-white shadow-[0_0_15px_rgba(255,81,47,0.5)] text-xs font-bold"
                      : step > i
                      ? "w-5 h-5 bg-[#FF512F] text-white text-[10px] font-bold"
                      : "w-5 h-5 bg-[#262626] text-gray-500"
                  }`}
                >
                  {step > i && <Check className="w-3 h-3" />}
                </div>
                {i < 3 && (
                  <div
                    className={`w-10 h-[2px] mx-1.5 transition-all duration-500 ${
                      step > i ? "bg-[#FF512F]" : "bg-[#262626]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Core step form wrapped in high-fidelity slider */}
        <div key={step} className="my-12 flex-1 flex flex-col justify-center animate-slide-step max-w-xl mx-auto w-full">
          
          {/* Step progress details */}
          <div className="flex flex-col gap-1.5 w-full text-left mb-10">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Step {step} of 3</span>
              <span className="text-[#FF512F]">{Math.round((step / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-[#262626] h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-gradient-to-r from-[#FF512F] to-[#F09819] h-full transition-all duration-700 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {/* Form Steps */}
          <form onSubmit={e => e.preventDefault()} className="space-y-8">
            
            {/* STEP 1: WHO ARE YOU */}
            {step === 1 && (
              <div className="space-y-8 text-left">
                <div>
                  <h2 className="text-white text-5xl font-black mb-3 tracking-tight">
                    Let's set up your profile.
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Tell the community who you are.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Keerthan Reddy"
                      value={formData.fullName}
                      onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl px-5 py-4 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Username</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-5 text-gray-500 font-bold select-none text-base">@</span>
                      <input
                        type="text"
                        required
                        placeholder="username"
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                        className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl pl-10 pr-14 py-4 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                      />
                      <div className="absolute right-5 flex items-center">
                        {isCheckingUsername && (
                          <div className="h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        {!isCheckingUsername && isUsernameAvailable === true && (
                          <span className="text-[#00FF00] font-bold text-lg shadow-[0_0_10px_rgba(0,255,0,0.3)] rounded-full">✓</span>
                        )}
                        {!isCheckingUsername && isUsernameAvailable === false && (
                          <span className="text-red-500 font-bold text-lg shadow-[0_0_10px_rgba(255,0,0,0.3)] rounded-full">✗</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 h-4">
                      {isUsernameAvailable === true && (
                        <span className="text-xs text-[#00FF00] font-bold">Username is available!</span>
                      )}
                      {isUsernameAvailable === false && (
                        <span className="text-xs text-red-500 font-bold">Username is already taken.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Bio</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us what you are passionate about shipping..."
                      value={formData.bio}
                      onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl px-5 py-4 text-base outline-none transition-all min-h-[120px] resize-none text-white placeholder-gray-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Location</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-5 flex items-center text-gray-500">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl pl-12 pr-5 py-4 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: YOUR TECH DNA */}
            {step === 2 && (
              <div className="space-y-8 text-left">
                <div>
                  <h2 className="text-white text-5xl font-black mb-3 tracking-tight">
                    What do you build?
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Select your skills and stack.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Experience cards */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Experience Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "Junior", label: "🌱 Junior", desc: "0-2 years, still learning" },
                        { id: "Mid", label: "⚡ Mid-level", desc: "2-5 years, shipping products" },
                        { id: "Senior", label: "🔥 Senior", desc: "5+ years, architecting systems" },
                        { id: "Lead", label: "👑 Lead/Founder", desc: "Building teams & companies" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: item.id }))}
                          className={`relative text-left border rounded-2xl p-6 transition-all duration-300 active:scale-[0.98] ${
                            formData.experienceLevel === item.id
                              ? "bg-[#FF512F]/10 border-[#FF512F] text-white shadow-[0_0_20px_rgba(255,81,47,0.15)]"
                              : "bg-[#111111] border-[#262626] text-gray-300 hover:border-[#FF512F]/50 hover:bg-[#1A1A1A]"
                          }`}
                        >
                          <h4 className="font-bold text-base">{item.label}</h4>
                          <p className={`text-xs mt-2 ${
                            formData.experienceLevel === item.id ? "text-[#FF512F]" : "text-gray-500"
                          }`}>
                            {item.desc}
                          </p>
                          {formData.experienceLevel === item.id && (
                            <div className="absolute top-5 right-5 w-5 h-5 rounded-full bg-[#FF512F] flex items-center justify-center text-white shadow-[0_0_10px_rgba(255,81,47,0.5)]">
                              <Check className="w-3 h-3 font-black" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Your Skills (Press Enter)</label>
                    <input
                      type="text"
                      placeholder="Type and press enter (e.g. Python, UI Design)"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl px-5 py-4 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.skills.map(s => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-2 bg-[#FF512F]/20 text-[#FF512F] border border-[#FF512F]/30 rounded-full px-4 py-1.5 text-sm font-semibold shadow-[0_0_10px_rgba(255,81,47,0.1)]"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))}
                            className="text-[#FF512F] hover:text-white font-black transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {formData.skills.length === 0 && (
                        <p className="text-sm text-gray-600 italic">No skills added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Stack */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Your Tech Stack (Press Enter)</label>
                    <input
                      type="text"
                      placeholder="Type and press enter (e.g. Next.js, Rust)"
                      value={stackInput}
                      onChange={e => setStackInput(e.target.value)}
                      onKeyDown={handleAddStack}
                      className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl px-5 py-4 text-base outline-none transition-all text-white placeholder-gray-600 font-medium"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.stack.map(s => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-2 bg-[#F09819]/20 text-[#F09819] border border-[#F09819]/30 rounded-full px-4 py-1.5 text-sm font-semibold shadow-[0_0_10px_rgba(240,152,25,0.1)]"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, stack: prev.stack.filter(x => x !== s) }))}
                            className="text-[#F09819] hover:text-white font-black transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {formData.stack.length === 0 && (
                        <p className="text-sm text-gray-600 italic">No tools added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: YOUR MISSION */}
            {step === 3 && (
              <div className="space-y-8 text-left">
                <div>
                  <h2 className="text-white text-5xl font-black mb-3 tracking-tight">
                    What brings you here?
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    We'll personalize your experience.
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-4">Looking For (Select multiple)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                      {[
                        { id: "Find Co-founder", emoji: "🤝", label: "Find Co-founder", desc: "Build your startup" },
                        { id: "Find Collaborators", emoji: "👥", label: "Find Collaborators", desc: "Get teammates" },
                        { id: "Explore Ideas", emoji: "💡", label: "Explore Ideas", desc: "Discover projects" },
                        { id: "Join a Project", emoji: "🚀", label: "Join a Project", desc: "Contribute to OSS" },
                        { id: "Build in Public", emoji: "📢", label: "Build in Public", desc: "Share your journey" },
                        { id: "Just Community", emoji: "💬", label: "Just Community", desc: "Connect with builders" }
                      ].map((item) => {
                        const isSelected = formData.lookingFor.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleToggleLookingFor(item.id)}
                            className={`relative text-left border rounded-2xl p-5 transition-all duration-300 active:scale-[0.98] ${
                              isSelected
                                ? "border-[#FF512F] bg-[#FF512F]/10 text-white shadow-[0_0_15px_rgba(255,81,47,0.15)]"
                                : "bg-[#111111] border-[#262626] text-gray-300 hover:border-[#FF512F]/50 hover:bg-[#1A1A1A]"
                            }`}
                          >
                            <span className="text-3xl block mb-2 opacity-90">{item.emoji}</span>
                            <h4 className="font-bold text-sm text-white">{item.label}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-normal">
                              {item.desc}
                            </p>
                            {isSelected && (
                              <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#FF512F] flex items-center justify-center text-white shadow-[0_0_10px_rgba(255,81,47,0.5)]">
                                <Check className="w-3 h-3 font-black" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#111111] border border-[#262626] rounded-2xl p-6">
                    <div className="text-left">
                      <span className="text-base font-bold text-white block mb-1">Open to collaborations?</span>
                      <span className="text-xs text-gray-500">Let others know your availability.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        availability: prev.availability === "Open to collab" ? "Busy" : "Open to collab"
                      }))}
                      className={`px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest border transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                        formData.availability === "Open to collab"
                          ? "bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.1)]"
                          : "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.1)]"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${formData.availability === "Open to collab" ? "bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.8)]"}`} />
                      {formData.availability === "Open to collab" ? "Open" : "Busy"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">GitHub URL</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                          <Github className="w-5 h-5" />
                        </span>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={formData.githubUrl}
                          onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl pl-12 pr-5 py-4 text-sm outline-none transition-all text-white placeholder-gray-600 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Twitter/X URL</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                          <Twitter className="w-5 h-5" />
                        </span>
                        <input
                          type="url"
                          placeholder="https://twitter.com/..."
                          value={formData.twitterUrl}
                          onChange={e => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                          className="w-full bg-[#111111] border border-[#262626] focus:border-[#FF512F] focus:ring-1 focus:ring-[#FF512F] rounded-xl pl-12 pr-5 py-4 text-sm outline-none transition-all text-white placeholder-gray-600 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper buttons wrapper */}
            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="w-1/3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-white rounded-xl h-14 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) {
                      if (!formData.fullName.trim() || !formData.username.trim() || !formData.bio.trim()) {
                        setError("Please complete all required fields.");
                        return;
                      }
                      if (isUsernameAvailable === false) {
                        setError("Please select an available username.");
                        return;
                      }
                    }
                    setError(null);
                    setStep(prev => prev + 1);
                  }}
                  className={`${step > 1 ? 'w-2/3' : 'w-full'} bg-white hover:bg-gray-100 text-black rounded-xl h-14 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95`}
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinish}
                  className="w-2/3 bg-gradient-to-r from-[#FF512F] to-[#F09819] hover:from-[#e64627] hover:to-[#d98715] text-white rounded-xl h-14 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,81,47,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-white" />
                      <span>Let's Build →</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: STEP ILLUSTRATIONS (50% Desktop, Full height) */}
      <div className="hidden md:flex w-1/2 h-screen bg-[#050505] relative overflow-hidden items-center justify-center">
        
        {/* Background gradient glowing effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF512F]/10 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#F09819]/10 blur-[150px] mix-blend-screen" />
        </div>

        {/* STEP 1 ILLUSTRATION: Stylized Builder Card Mockup */}
        {step === 1 && (
          <div className="w-full h-full flex items-center justify-center relative animate-slide-step p-12">
            <div 
              className="bg-[#111111]/80 backdrop-blur-3xl border border-[#262626] rounded-3xl p-8 shadow-2xl max-w-md w-full relative z-10 transition-all duration-500 hover:scale-[1.02] hover:border-[#333] hover:shadow-[0_0_50px_rgba(255,81,47,0.1)]"
            >
              <div className="flex items-center gap-5">
                <img 
                  src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-[#FF512F]/50 shadow-[0_0_20px_rgba(255,81,47,0.3)]"
                />
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-bold text-white text-2xl leading-tight truncate">
                    {formData.fullName || "Your Name"}
                  </h4>
                  <span className="text-[#FF512F] text-base font-semibold block mt-1">
                    @{formData.username || "username"}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mt-6 leading-relaxed line-clamp-3 min-h-[60px] text-left">
                {formData.bio || "Tell us what you are passionate about shipping..."}
              </p>

              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mt-6 bg-[#1A1A1A] p-3 rounded-xl border border-[#262626]">
                <MapPin className="w-4 h-4 text-[#FF512F]" />
                <span>{formData.location || "Earth"}</span>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#FF512F] to-[#F09819] text-white font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,81,47,0.4)]">
                BUILDER
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 ILLUSTRATION */}
        {step === 2 && (
          <div className="w-full h-full flex items-center justify-center relative animate-slide-step p-12">
            <style>{`
              @keyframes float1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
              @keyframes float2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(20px) rotate(-5deg); } }
            `}</style>

            <div className="relative w-full max-w-lg aspect-square">
              {/* Center Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#111111] border-2 border-[#FF512F] flex items-center justify-center shadow-[0_0_40px_rgba(255,81,47,0.3)] z-20">
                <Sparkles className="w-10 h-10 text-[#FF512F]" />
              </div>

              {/* Orbital Nodes */}
              <div className="absolute top-[15%] left-[20%] bg-[#111111] border border-[#333] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 z-10" style={{ animation: "float1 6s ease-in-out infinite" }}>
                <span>⚛️</span> React
              </div>
              <div className="absolute top-[25%] right-[15%] bg-[#111111] border border-[#333] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 z-10" style={{ animation: "float2 7s ease-in-out infinite" }}>
                <span>🟢</span> Node.js
              </div>
              <div className="absolute bottom-[20%] left-[15%] bg-[#111111] border border-[#333] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 z-10" style={{ animation: "float2 5s ease-in-out infinite" }}>
                <span>🐍</span> Python
              </div>
              <div className="absolute bottom-[25%] right-[20%] bg-[#111111] border border-[#333] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 z-10" style={{ animation: "float1 8s ease-in-out infinite" }}>
                <span>🦀</span> Rust
              </div>
              
              {/* Connecting lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#FF512F" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_60s_linear_infinite]" />
                <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#F09819" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite_reverse]" />
              </svg>
            </div>
          </div>
        )}

        {/* STEP 3 ILLUSTRATION */}
        {step === 3 && (
          <div className="w-full h-full flex items-center justify-center relative animate-slide-step p-12">
            <div 
              className="bg-[#111111]/80 backdrop-blur-3xl border border-[#262626] rounded-3xl p-12 shadow-2xl max-w-md w-full text-center relative z-10"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF512F] to-[#F09819] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,81,47,0.4)] animate-bounce">
                <RocketIcon className="w-12 h-12 text-white" />
              </div>
              <h4 className="font-black text-white text-3xl leading-tight mb-4">
                You're Ready.
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your profile is complete. You are now part of a global network of innovative builders and creators.
              </p>

              <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#333]">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#00FF00] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                    System Online
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Ready to build 🚀
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Quick inline icon component to avoid adding another import
function RocketIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 3.82-13 1.5 1.5 0 0 1 2.18 2.18A22 22 0 0 1 12 15Z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  );
}
