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
        router.push("/dashboard/home");
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
      router.push("/dashboard/home");
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-gray-900 font-sans antialiased flex items-center justify-center p-4 md:p-8 select-none">
      
      {/* Dynamic Slide Animations */}
      <style>{`
        @keyframes slideInFromRight {
          0% { transform: translate3d(25px, 0, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-slide-step {
          animation: slideInFromRight 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Main Full-Screen Layout Wrapper */}
      <div className="w-full max-w-[1200px] min-h-[700px] bg-white border border-gray-100 rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: STEP CONTENT & FORM (60% Desktop) */}
        <div className="w-full md:w-[60%] p-8 sm:p-12 md:p-16 flex flex-col justify-between relative bg-white">
          
          {/* Top Logo and Step Progress Indicators */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-gray-900 text-white font-black text-xs">
                <span className="leading-none font-bold text-xs">*</span>
              </div>
              <span className="text-base font-black tracking-tight text-gray-900 font-sans">collabsphere</span>
            </div>

            {/* Stepper progress dots connected by thin lines */}
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                      step === i
                        ? "w-5 h-5 bg-pink-500 text-white ring-4 ring-pink-100 text-[10px] font-bold"
                        : step > i
                        ? "w-4 h-4 bg-pink-500 text-white text-[8px] font-bold"
                        : "w-4 h-4 bg-gray-200"
                    }`}
                  >
                    {step > i && "✓"}
                  </div>
                  {i < 3 && (
                    <div
                      className={`w-8 h-[2px] mx-1 transition-all duration-300 ${
                        step > i ? "bg-pink-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core step form wrapped in high-fidelity slider */}
          <div key={step} className="my-8 flex-1 flex flex-col justify-center animate-slide-step">
            
            {/* Step progress details */}
            <div className="flex flex-col gap-1 w-full text-left mb-8 max-w-sm">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Step {step} of 3</span>
                <span className="text-pink-500">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 h-[3px] rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center select-none">
                {error}
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={e => e.preventDefault()} className="space-y-6">
              
              {/* STEP 1: WHO ARE YOU */}
              {step === 1 && (
                <div className="space-y-5 text-left">
                  <div>
                    <h2 className="text-gray-900 text-4xl font-bold mb-2 tracking-tight">
                      Let's set up your builder profile.
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Tell the community who you are.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.fullName}
                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-gray-400 font-bold select-none text-sm">@</span>
                        <input
                          type="text"
                          required
                          placeholder="username"
                          value={formData.username}
                          onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                          className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-8 pr-12 py-3.5 text-sm outline-none transition-all font-medium text-gray-800"
                        />
                        <div className="absolute right-4 flex items-center">
                          {isCheckingUsername && (
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {!isCheckingUsername && isUsernameAvailable === true && (
                            <span className="text-emerald-500 font-bold text-sm">✓</span>
                          )}
                          {!isCheckingUsername && isUsernameAvailable === false && (
                            <span className="text-red-500 font-bold text-sm">✗</span>
                          )}
                        </div>
                      </div>
                      {isUsernameAvailable === true && (
                        <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">Username is available!</span>
                      )}
                      {isUsernameAvailable === false && (
                        <span className="text-[10px] text-red-600 font-bold mt-1.5 block">Username is already taken.</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell us what you are passionate about shipping..."
                        value={formData.bio}
                        onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3.5 text-sm outline-none transition-all min-h-[100px] resize-none font-medium text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. San Francisco, CA"
                          value={formData.location}
                          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: YOUR TECH DNA */}
              {step === 2 && (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className="text-gray-900 text-4xl font-bold mb-2 tracking-tight">
                      What do you build?
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Select your skills and stack.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* 2x2 clickable experience cards */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5">Experience Level</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: "Junior", label: "🌱 Junior", desc: "0-2 years, still learning the ropes" },
                          { id: "Mid", label: "⚡ Mid-level", desc: "2-5 years, shipping real products" },
                          { id: "Senior", label: "🔥 Senior", desc: "5+ years, architecting systems" },
                          { id: "Lead", label: "👑 Lead/Founder", desc: "Building teams and companies" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, experienceLevel: item.id }))}
                            className={`relative text-left border-2 rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] ${
                              formData.experienceLevel === item.id
                                ? "bg-gray-900 border-gray-900 text-white shadow-md"
                                : "bg-white border-gray-100 text-gray-800 hover:border-pink-400 shadow-sm"
                            }`}
                          >
                            <h4 className="font-bold text-sm">{item.label}</h4>
                            <p className={`text-[11px] mt-1 ${
                              formData.experienceLevel === item.id ? "text-gray-300" : "text-gray-400"
                            }`}>
                              {item.desc}
                            </p>
                            {formData.experienceLevel === item.id && (
                              <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <Check className="w-3 h-3 font-black" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Skills pills */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Your Skills (Press Enter)</label>
                      <input
                        type="text"
                        placeholder="Type and press enter (e.g. Python, UI Design)"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium text-gray-800"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {formData.skills.map(s => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-3 py-1 text-xs font-semibold"
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))}
                              className="text-pink-400 hover:text-red-500 font-black text-xs"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {formData.skills.length === 0 && (
                          <p className="text-[11px] text-gray-400 italic">No skills added yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Tech stack pills */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Your Tech Stack (Press Enter)</label>
                      <input
                        type="text"
                        placeholder="Type and press enter (e.g. Next.js, Rust)"
                        value={stackInput}
                        onChange={e => setStackInput(e.target.value)}
                        onKeyDown={handleAddStack}
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3.5 text-sm outline-none transition-all font-medium text-gray-800"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {formData.stack.map(s => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs font-semibold"
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, stack: prev.stack.filter(x => x !== s) }))}
                              className="text-blue-400 hover:text-red-500 font-black text-xs"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {formData.stack.length === 0 && (
                          <p className="text-[11px] text-gray-400 italic">No tools added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: YOUR MISSION */}
              {step === 3 && (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className="text-gray-900 text-4xl font-bold mb-2 tracking-tight">
                      What brings you here?
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We'll personalize your experience.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Big selection Notion style cards */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5">Looking For (Select multiple)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                        {[
                          { id: "Find Co-founder", emoji: "🤝", label: "Find Co-founder", desc: "Build your startup with the right partner" },
                          { id: "Find Collaborators", emoji: "👥", label: "Find Collaborators", desc: "Get teammates for your project" },
                          { id: "Explore Ideas", emoji: "💡", label: "Explore Ideas", desc: "Discover what others are building" },
                          { id: "Join a Project", emoji: "🚀", label: "Join a Project", desc: "Contribute to existing projects" },
                          { id: "Build in Public", emoji: "📢", label: "Build in Public", desc: "Share your journey with the community" },
                          { id: "Just Community", emoji: "💬", label: "Just Community", desc: "Connect with like-minded builders" }
                        ].map((item) => {
                          const isSelected = formData.lookingFor.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleLookingFor(item.id)}
                              className={`relative text-center border-2 rounded-2xl p-4 transition-all duration-200 active:scale-[0.98] ${
                                isSelected
                                  ? "border-pink-500 bg-pink-50/50 text-gray-900"
                                  : "bg-white border-gray-100 text-gray-800 hover:border-pink-300 hover:shadow-sm"
                              }`}
                            >
                              <span className="text-2xl block mb-1">{item.emoji}</span>
                              <h4 className="font-bold text-xs">{item.label}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                                {item.desc}
                              </p>
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-pink-500 flex items-center justify-center text-white">
                                  <Check className="w-2.5 h-2.5 font-bold" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Availability toggle component */}
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <div className="text-left">
                        <span className="text-xs font-bold text-gray-800 block">Are you open to collaborations?</span>
                        <span className="text-[10px] text-gray-400">Let other builders know your availability.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          availability: prev.availability === "Open to collab" ? "Busy" : "Open to collab"
                        }))}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm transition-all duration-300 active:scale-95 ${
                          formData.availability === "Open to collab"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        {formData.availability === "Open to collab" ? "🟢 Open to Collab" : "🔴 Busy"}
                      </button>
                    </div>

                    {/* Social URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">GitHub URL</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <Github className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={formData.githubUrl}
                            onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Twitter/X URL</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <Twitter className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="url"
                            placeholder="https://twitter.com/username"
                            value={formData.twitterUrl}
                            onChange={e => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                            className="w-full bg-gray-50/50 border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stepper buttons wrapper */}
              <div className="flex gap-3 pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full h-12 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
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
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full h-12 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleFinish}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full h-12 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Let's Build →</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: STEP ILLUSTRATIONS & VISUALS (40% Desktop, Hidden on Mobile) */}
        <div className="hidden md:flex w-full md:w-[40%] bg-gray-50 border-l border-gray-100 flex-col justify-center p-8 lg:p-12 relative overflow-hidden">
          
          {/* STEP 1 ILLUSTRATION: Stylized Builder Card Mockup */}
          {step === 1 && (
            <div className="w-full h-full flex items-center justify-center relative animate-slide-step">
              <div className="w-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-[32px] p-8 flex items-center justify-center relative overflow-hidden border border-purple-500/10 min-h-[400px]">
                {/* Floating blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-48 h-48 rounded-full bg-pink-500/10 blur-xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full bg-purple-500/10 blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

                {/* Live Card Preview */}
                <div 
                  className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative z-10 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                      alt="Avatar" 
                      referrerPolicy="no-referrer"
                      onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-pink-100"
                    />
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight truncate max-w-[180px]">
                        {formData.fullName || "Your Name"}
                      </h4>
                      <span className="text-pink-500 text-sm font-semibold block mt-0.5">
                        @{formData.username || "username"}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-xs mt-4 leading-relaxed line-clamp-3 min-h-[50px] text-left">
                    {formData.bio || "Tell us what you are passionate about shipping..."}
                  </p>

                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{formData.location || "Earth"}</span>
                  </div>

                  <div className="absolute -top-3 -right-3 bg-pink-500 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                    BUILDER
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 ILLUSTRATION: Floating stack constellation pattern */}
          {step === 2 && (
            <div className="w-full h-full flex items-center justify-center relative animate-slide-step">
              {/* CSS float animations */}
              <style>{`
                @keyframes floatSlow1 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-15px) rotate(3deg); }
                }
                @keyframes floatSlow2 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(12px) rotate(-4deg); }
                }
                @keyframes floatSlow3 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-10px) rotate(5deg); }
                }
              `}</style>

              <div className="w-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-[32px] p-8 flex items-center justify-center relative overflow-hidden border border-purple-500/10 min-h-[400px]">
                <div className="relative w-full h-64 max-w-sm">
                  {/* Center Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white border border-purple-100 flex items-center justify-center shadow-lg z-20">
                    <span className="text-2xl">🧬</span>
                  </div>

                  {/* Badges Constellation */}
                  <div 
                    className="absolute top-4 left-6 bg-sky-50 border border-sky-100 text-sky-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 z-10"
                    style={{ animation: "floatSlow1 6s ease-in-out infinite" }}
                  >
                    <span>⚛️</span> React
                  </div>

                  <div 
                    className="absolute top-10 right-4 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 z-10"
                    style={{ animation: "floatSlow2 7s ease-in-out infinite" }}
                  >
                    <span>🟢</span> Node.js
                  </div>

                  <div 
                    className="absolute bottom-6 left-2 bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 z-10"
                    style={{ animation: "floatSlow3 5s ease-in-out infinite" }}
                  >
                    <span>🐍</span> Python
                  </div>

                  <div 
                    className="absolute bottom-12 right-2 bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 z-10"
                    style={{ animation: "floatSlow1 8s ease-in-out infinite" }}
                  >
                    <span>🦀</span> Rust
                  </div>

                  <div 
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-50 border border-blue-100 text-blue-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 z-10"
                    style={{ animation: "floatSlow2 6s ease-in-out infinite" }}
                  >
                    <span>📘</span> TypeScript
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 ILLUSTRATION: CelebrationSuccess illustration preview */}
          {step === 3 && (
            <div className="w-full h-full flex items-center justify-center relative animate-slide-step">
              <style>{`
                @keyframes confettiDrop {
                  0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
                  10% { opacity: 1; }
                  100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
                }
                .confetti-dot {
                  position: absolute;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                }
              `}</style>

              <div className="w-full bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-[32px] p-8 flex items-center justify-center relative overflow-hidden border border-purple-500/10 min-h-[400px]">
                {/* Fall confetti */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i}
                    className="confetti-dot"
                    style={{
                      backgroundColor: ["#EC4899", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"][i % 5],
                      left: `${(i * 6.5) + 5}%`,
                      top: "-10px",
                      animation: `confettiDrop ${3 + (i % 3)}s linear infinite`,
                      animationDelay: `${i * 0.25}s`
                    }}
                  />
                ))}

                {/* Celebration Card */}
                <div 
                  className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center relative z-10 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
                  }}
                >
                  <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-bounce">
                    🚀
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl leading-tight">
                    Welcome to Collabsphere!
                  </h4>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    Your profile is ready. You are now part of a global network of innovative builders.
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-1">
                    <span className="text-pink-500 font-bold text-xs uppercase tracking-widest">
                      Join 2,400+ builders
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Shipping worldwide 🌍
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
