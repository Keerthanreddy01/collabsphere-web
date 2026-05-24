"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Compass, Sparkles, ChevronRight, ChevronLeft, Github, Twitter, MapPin } from "lucide-react";

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
    lookingFor: "Teammates",
    availability: "Open to collab",
    githubUrl: "",
    twitterUrl: ""
  });

  const [skillInput, setSkillInput] = useState("");
  const [stackInput, setStackInput] = useState("");

  // Mount checking if user already onboarded
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
            lookingFor: d.looking_for || "Teammates",
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

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E5EEFF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A5BFF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 relative pb-12 overflow-x-hidden flex items-center justify-center p-4">
      {/* Background dot grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7A5BFF]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#EC4899]/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-xl bg-white border border-[#e5e7eb] rounded-[32px] p-8 shadow-lg backdrop-blur-xl space-y-6">
        
        {/* Wizard Headers */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight font-sans uppercase">
            SETUP BUILDER PROFILE
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Step {step} of 3 · Complete your builder space to start collaborating
          </p>

          {/* Stepper Dots bar */}
          <div className="flex justify-center gap-1.5 pt-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i ? "w-8 bg-gradient-to-r from-pink-500 to-purple-600" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center select-none animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={e => e.preventDefault()} className="space-y-5 text-left">
          
          {/* STEP 1: Basic details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. johndoe"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                  className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  required
                  placeholder="Tell us what you are passionate about shipping..."
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all min-h-[80px] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Location</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-9 pr-4 py-3 text-xs outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & stacks */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Skills (press Enter)
                </label>
                <input
                  type="text"
                  placeholder="Add skill (e.g. Python, UI Design)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.skills.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }))}
                        className="text-pink-400 hover:text-red-500 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-[10px] text-gray-400 font-medium italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Tech Stack (press Enter)
                </label>
                <input
                  type="text"
                  placeholder="Add tool/stack (e.g. Next.js, Figma, Tailwind)"
                  value={stackInput}
                  onChange={e => setStackInput(e.target.value)}
                  onKeyDown={handleAddStack}
                  className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.stack.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, stack: prev.stack.filter(x => x !== s) }))}
                        className="text-blue-400 hover:text-red-500 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.stack.length === 0 && (
                    <p className="text-[10px] text-gray-400 font-medium italic">No tech stack added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Experience level availability */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Experience</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={e => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                    className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Looking For</label>
                  <select
                    value={formData.lookingFor}
                    onChange={e => setFormData(prev => ({ ...prev, lookingFor: e.target.value }))}
                    className="w-full bg-[#fafafa] border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                  >
                    <option value="Teammates">Teammates</option>
                    <option value="Co-founders">Co-founders</option>
                    <option value="Mentors">Mentors</option>
                    <option value="Advisors">Advisors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Availability</label>
                <select
                  value={formData.availability}
                  onChange={e => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full bg-[#fafafa] border border-[#e5e7eb] focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl px-4 py-3 text-xs outline-none transition-all"
                >
                  <option value="Open to collab">Open to collab</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">GitHub URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Github className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="w-full bg-[#fafafa] border border-[#e5e7eb] focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-9 pr-4 py-3 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Twitter/X URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Twitter className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={formData.twitterUrl}
                    onChange={e => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                    className="w-full bg-[#fafafa] border border-[#e5e7eb] focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl pl-9 pr-4 py-3 text-xs outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stepper buttons wrapper */}
          <div className="flex gap-3 pt-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full h-11 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!formData.fullName.trim() || !formData.username.trim() || !formData.bio.trim())) {
                    setError("Please complete all required fields.");
                    return;
                  }
                  setError(null);
                  setStep(prev => prev + 1);
                }}
                className="flex-1 bg-gray-900 hover:bg-black text-white rounded-full h-11 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full h-11 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Complete Onboarding</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
