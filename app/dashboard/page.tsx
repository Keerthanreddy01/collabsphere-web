"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getProfile, updateProfile } from "@/lib/profiles";
import { useRouter } from "next/navigation";

type TabKey = "profile" | "projects" | "saved";

type ProfileForm = {
  username: string;
  bio: string;
  location: string;
  website: string;
  github_url: string;
  twitter_url: string;
  skills: string[];
  stack: string[];
  experience_level: string;
  availability: string;
};

const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;

function TagInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const next = input.trim();
    if (!next) {
      return;
    }
    if (tags.includes(next)) {
      setInput("");
      return;
    }
    onChange([...tags, next]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#111111] px-3 py-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-200 transition hover:bg-pink-500/20"
          >
            <span>{tag}</span>
            <span className="text-pink-200/70">x</span>
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

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shouldRedirectOnboarding, setShouldRedirectOnboarding] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    username: "",
    bio: "",
    location: "",
    website: "",
    github_url: "",
    twitter_url: "",
    skills: [],
    stack: [],
    experience_level: "",
    availability: "Open to Collab",
  });

  const isAvailable = form.availability === "Open to Collab";

  const initials = useMemo(() => {
    const fullName = user?.fullName?.trim();
    if (!fullName) {
      return "U";
    }
    return fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.fullName]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      router.replace("/");
      return;
    }
    if (!userId) {
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await getProfile(userId);
      console.log("Profile data:", data, "Error:", error);

      if (!data || error) {
        setShouldRedirectOnboarding(true);
        router.push("/onboarding");
        return;
      }

      if (!data.onboarding_completed) {
        setShouldRedirectOnboarding(true);
        router.push("/onboarding");
        return;
      }

      setForm((prev) => ({
        ...prev,
        username: data.username ?? "",
        bio: data.bio ?? "",
        location: data.location ?? "",
        website: data.website ?? "",
        github_url: data.github_url ?? "",
        twitter_url: data.twitter_url ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        stack: Array.isArray(data.stack) ? data.stack : [],
        experience_level: data.experience_level ?? "",
        availability: data.availability ?? "Open to Collab",
      }));
    };

    loadProfile();
  }, [isLoaded, isSignedIn, userId, router]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    if (!userId) {
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);

    const { error } = await updateProfile(userId, {
      username: form.username,
      bio: form.bio,
      location: form.location,
      website: form.website,
      github_url: form.github_url,
      twitter_url: form.twitter_url,
      skills: form.skills,
      stack: form.stack,
      availability: form.availability,
      experience_level: form.experience_level,
    });

    if (!error) {
      setStatusMessage("Profile saved! ✓");
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      toastTimerRef.current = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
    setIsSaving(false);
  };

  if (shouldRedirectOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="md:flex">
        <aside className="w-full border-b border-white/10 bg-black px-6 py-8 md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
          <div className="flex flex-col items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "User avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white/70">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-white">
                {user?.fullName ?? "Builder"}
              </div>
              <div className="text-sm text-white/50">
                @{user?.username ?? "username"}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAvailable ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="text-white/70">
                {isAvailable ? "Open to Collab" : "Not Available"}
              </span>
            </div>
          </div>

          <div className="my-6 h-px w-full bg-white/10" />

          <nav className="flex flex-col gap-2 text-sm">
            {(
              [
                { key: "profile", label: "My Profile" },
                { key: "projects", label: "My Projects" },
                { key: "saved", label: "Saved Builders" },
              ] as { key: TabKey; label: string }[]
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`rounded-full px-4 py-2 text-left transition ${
                  activeTab === item.key
                    ? "bg-pink-500/15 text-pink-200"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-10 md:ml-64">
          {activeTab === "profile" && (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
              <div>
                <h1 className="text-2xl font-semibold text-white">My Profile</h1>
                <p className="text-sm text-white/50">
                  Update your public builder profile.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Username</label>
                  <input
                    value={form.username}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, username: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="buildername"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, location: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-white/70">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, bio: event.target.value }))
                    }
                    className="min-h-[120px] w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="Tell others about your builder journey"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Website</label>
                  <input
                    value={form.website}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, website: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">GitHub URL</label>
                  <input
                    value={form.github_url}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, github_url: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="https://github.com/"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Twitter URL</label>
                  <input
                    value={form.twitter_url}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, twitter_url: event.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                    placeholder="https://twitter.com/"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Experience Level</label>
                  <select
                    value={form.experience_level}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        experience_level: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/60"
                  >
                    <option value="" className="bg-black">Select level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level} className="bg-black">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <TagInput
                label="Skills"
                tags={form.skills}
                onChange={(next) => setForm((prev) => ({ ...prev, skills: next }))}
                placeholder="Type a skill and press Enter"
              />

              <TagInput
                label="Tech Stack"
                tags={form.stack}
                onChange={(next) => setForm((prev) => ({ ...prev, stack: next }))}
                placeholder="Type a stack item and press Enter"
              />

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
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
                      availability: prev.availability === "Open to Collab"
                        ? "Not Available"
                        : "Open to Collab",
                    }))
                  }
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    isAvailable
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {isAvailable ? "Open to Collab" : "Not Available"}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
                {statusMessage && (
                  <span className="text-sm text-emerald-400">
                    {statusMessage}
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">My Projects</h1>
                <p className="text-sm text-white/50">No projects yet</p>
              </div>
              <button
                type="button"
                className="w-fit rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400"
              >
                Post a Project
              </button>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Saved Builders</h1>
                <p className="text-sm text-white/50">No saved builders yet</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
