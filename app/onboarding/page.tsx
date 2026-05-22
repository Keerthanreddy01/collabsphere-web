"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type StepKey = 1 | 2 | 3;

type FormState = {
  username: string;
  fullName: string;
  location: string;
  bio: string;
  skills: string[];
  stack: string[];
  experienceLevel: string;
  lookingFor: string[];
  availability: "Open to Collab" | "Not Available";
  twitterUrl: string;
  githubUrl: string;
};

type TagVariant = "pink" | "neutral";

type TagInputProps = {
  label: string;
  tags: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  variant: TagVariant;
};

const experienceOptions = [
  { value: "Junior", label: "🌱 Junior" },
  { value: "Mid-level", label: "⚡ Mid-level" },
  { value: "Senior", label: "🔥 Senior" },
  { value: "Lead", label: "👑 Lead" },
];

const lookingForOptions = [
  "🤝 Co-founder",
  "👨‍💻 Collaborators",
  "💡 Project ideas",
  "🚀 Join a project",
  "👥 Build in public",
  "💬 Community",
];

function TagInput({ label, tags, onChange, placeholder, variant }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const next = input.trim();
    if (!next || tags.includes(next)) {
      setInput("");
      return;
    }
    onChange([...tags, next]);
    setInput("");
  };

  const tagStyles =
    variant === "pink"
      ? "border-pink-500/40 bg-pink-500/10 text-pink-200"
      : "border-white/10 bg-white/5 text-white/70";

  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111111] px-3 py-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition hover:bg-white/10 ${tagStyles}`}
          >
            <span>{tag}</span>
            <span className="text-white/50">x</span>
          </button>
        ))}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="min-w-[160px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [step, setStep] = useState<StepKey>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; fullName?: string }>(
    {}
  );

  const [form, setForm] = useState<FormState>({
    username: "",
    fullName: "",
    location: "",
    bio: "",
    skills: [],
    stack: [],
    experienceLevel: "",
    lookingFor: [],
    availability: "Open to Collab",
    twitterUrl: "",
    githubUrl: "",
  });

  const progress = useMemo(() => (step / 3) * 100, [step]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn || !userId) {
      router.replace("/");
      return;
    }

    let isMounted = true;

    const checkOnboarding = async () => {
      const { data } = await supabase
        .from("builder_profiles")
        .select("onboarding_completed")
        .eq("clerk_user_id", userId)
        .single();

      if (!isMounted) {
        return;
      }

      if (data?.onboarding_completed) {
        router.replace("/dashboard");
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, userId, router]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || "",
      username: prev.username || user.username || "",
    }));
  }, [user]);

  const goToStep = (next: StepKey) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setIsTransitioning(false);
    }, 150);
  };

  const handleNextFromStep1 = () => {
    const nextErrors: { username?: string; fullName?: string } = {};
    if (!form.username.trim()) {
      nextErrors.username = "Username is required";
    }
    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    goToStep(2);
  };

  const handleFinish = async () => {
    if (!userId) {
      return;
    }
    setIsSaving(true);

    await supabase.from("builder_profiles").upsert({
      clerk_user_id: userId,
      username: form.username,
      full_name: form.fullName,
      location: form.location || null,
      bio: form.bio || null,
      avatar_url: user?.imageUrl || null,
      skills: form.skills,
      stack: form.stack,
      experience_level: form.experienceLevel,
      looking_for: form.lookingFor,
      availability: form.availability,
      github_url: form.githubUrl || null,
      twitter_url: form.twitterUrl || null,
      onboarding_completed: true,
    });

    setIsSaving(false);
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-[0_0_60px_rgba(236,72,153,0.08)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`mt-8 transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100"
            }`}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                    Who are you?
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold">
                    LET'S BUILD YOUR PROFILE
                  </h1>
                  <p className="mt-2 text-sm text-white/60">
                    Tell the community who you are.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Username</label>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-[#111111] px-3">
                      <span className="text-sm text-white/40">@</span>
                      <input
                        value={form.username}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            username: event.target.value,
                          }))
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none"
                        placeholder="buildername"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-pink-300">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Full name</label>
                    <input
                      value={form.fullName}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          fullName: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
                      placeholder="Jane Doe"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-pink-300">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Location</label>
                    <input
                      value={form.location}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          location: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, bio: event.target.value }))
                      }
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
                      placeholder="I build things in public..."
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                    Your avatar is pulled from your account
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextFromStep1}
                    className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                    What do you build?
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold">YOUR TECH DNA</h1>
                  <p className="mt-2 text-sm text-white/60">
                    What's in your stack?
                  </p>
                </div>

                <TagInput
                  label="Skills"
                  tags={form.skills}
                  onChange={(next) => setForm((prev) => ({ ...prev, skills: next }))}
                  placeholder="e.g. React, Node.js, Python"
                  variant="pink"
                />

                <TagInput
                  label="Tech Stack"
                  tags={form.stack}
                  onChange={(next) => setForm((prev) => ({ ...prev, stack: next }))}
                  placeholder="e.g. Next.js, Supabase, Tailwind"
                  variant="neutral"
                />

                <div className="space-y-3">
                  <label className="text-sm text-white/70">Experience Level</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {experienceOptions.map((option) => {
                      const isSelected = form.experienceLevel === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              experienceLevel: option.value,
                            }))
                          }
                          className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                            isSelected
                              ? "border-pink-500/80 bg-pink-500/10 text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                              : "border-white/10 text-white/70 hover:border-pink-500/40"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                    What are you looking for?
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold">YOUR MISSION</h1>
                  <p className="mt-2 text-sm text-white/60">
                    What brings you to Collabsphere?
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-white/70">Looking for</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {lookingForOptions.map((option) => {
                      const isSelected = form.lookingFor.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              lookingFor: isSelected
                                ? prev.lookingFor.filter((item) => item !== option)
                                : [...prev.lookingFor, option],
                            }))
                          }
                          className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                            isSelected
                              ? "border-pink-500/80 bg-pink-500/10 text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                              : "border-white/10 text-white/70 hover:border-pink-500/40"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-white">Availability</div>
                    <div className="text-xs text-white/50">
                      Toggle your collaboration status.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        availability:
                          prev.availability === "Open to Collab"
                            ? "Not Available"
                            : "Open to Collab",
                      }))
                    }
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      form.availability === "Open to Collab"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {form.availability}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Twitter URL</label>
                    <input
                      value={form.twitterUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          twitterUrl: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
                      placeholder="https://twitter.com/"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">GitHub URL</label>
                    <input
                      value={form.githubUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          githubUrl: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none"
                      placeholder="https://github.com/"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={isSaving}
                    className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Finish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
