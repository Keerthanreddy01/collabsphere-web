"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/hooks/useAuth";
import ReflectiveCard from "@/components/ReflectiveCard";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];


export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarUploadUrl, setAvatarUploadUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
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
        router.push("/dashboard/home");
      } else {
        if (docSnap.exists()) {
          const d = docSnap.data();
          setFormData({
            fullName: d.full_name || user.displayName || "",
            username: d.username || user.email?.split("@")[0] || "",
            bio: d.bio || "",
          });
        } else {
          setFormData({
            fullName: user.displayName || "",
            username: user.email?.split("@")[0] || "",
            bio: "",
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
      const avatarUrl =
        avatarUploadUrl ||
        user.photoURL ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
      await setDoc(
        doc(db, "builder_profiles", user.uid),
        {
          uid: user.uid,
          email: user.email,
          full_name: formData.fullName || user.displayName || "Builder",
          username: formData.username,
          bio: formData.bio || "",
          avatar_url: avatarUrl,
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
      router.push("/dashboard/home");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!storage || !user) {
      setError("Storage is not configured.");
      return;
    }

    if (!AVATAR_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError("Image must be 2MB or smaller.");
      return;
    }

    setError(null);
    const localUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(localUrl);
    setAvatarUploading(true);

    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `builder_avatars/${user.uid}/profile_${Date.now()}.${ext}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(ref);
      setAvatarUploadUrl(downloadUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setError("Failed to upload image. Try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  const displayName = formData.fullName || 'Your Name';
  const displayHandle = formData.username || 'username';
  const displayTitle = formData.bio.trim() || 'Software Engineer';

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col md:flex-row overflow-hidden selection:bg-white selection:text-black">
      
      {/* LEFT COLUMN: Clean Form */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-black flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-[340px]">
          
          <div className="mb-10 flex items-start justify-between gap-4 text-left">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
                Setup Profile
              </h1>
              <p className="text-[#888888] text-sm leading-relaxed">
                Let's create your developer identity.
              </p>
            </div>

            <div className="shrink-0 text-right">
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="sr-only"
              />
              <label
                htmlFor="avatar-upload"
                title="Optional profile photo"
                aria-label="Optional profile photo upload"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/30 bg-white/5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 ${
                  avatarUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                +
              </label>
              <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                Optional
              </div>
            </div>
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

            {avatarUploadUrl ? (
              <div className="pt-1 text-xs text-[#8f8f8f]">Upload complete.</div>
            ) : (
              <div className="pt-1 text-xs text-[#666666]">JPG, PNG, or WEBP. Max 2MB.</div>
            )}

            <div>
              <textarea
                maxLength={120}
                placeholder="Short bio (max 120 chars)"
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full resize-none bg-transparent border-b border-white/20 focus:border-white px-1 py-3 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
                rows={2}
              />
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
        <div className="absolute bottom-8 left-0 right-0 w-full text-center text-[#444444] text-xs font-medium">
          © CollabSphere {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT COLUMN: ProfileCard Preview */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen bg-[#050505] border-t md:border-t-0 md:border-l border-white/5 relative overflow-hidden flex items-center justify-center p-8">
        <div className="w-full max-w-[320px]">
          <ReflectiveCard
            name={displayName}
            title={displayTitle}
            handle={displayHandle}
            status="Online"
            contactText="Contact Me"
            overlayColor="rgba(0, 0, 0, 0.2)"
            blurStrength={12}
            glassDistortion={30}
            metalness={1}
            roughness={0.75}
            displacementStrength={20}
            noiseScale={1}
            specularConstant={5}
            grayscale={0.15}
            color="#ffffff"
            className="mx-auto"
            style={{ height: 500, width: '100%' }}
          />
        </div>
      </div>

    </div>
  );
}
