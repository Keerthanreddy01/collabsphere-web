"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Trophy,
} from "lucide-react";
import { 
  getProfile, 
  createProfile, 
  updateProfile, 
  connectToBuilder, 
  createSpace,
} from "@/lib/profiles";
import { createPost, likePost, addComment, computePostScore } from "@/lib/posts";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createProject } from "@/lib/projects";
import Sidebar from "@/components/Sidebar";

type FeedTabKey = "for-you" | "updates" | "teammates" | "logs";

const fallbackHackathons = [
  { id: 1, name: "AI Startup Sprint", date: "Apr 20 - Apr 27", builders: "1.2K", color: "bg-[#7A5BFF]" },
  { id: 2, name: "Build for India", date: "May 5 - May 11", builders: "856", color: "bg-[#A3E635]" },
  { id: 3, name: "Web3 Builders", date: "May 12 - May 18", builders: "732", color: "bg-[#7A5BFF]" },
];

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<FeedTabKey>("for-you");
  const [isTeamMode, setIsTeamMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSetupDismissed, setIsSetupDismissed] = useState(false);
  
  // Real Firestore States
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceColor, setNewSpaceColor] = useState("bg-[#CDFF3D]");
  const [composerContent, setComposerContent] = useState("");
  const [composerType, setComposerType] = useState<'update' | 'looking_for' | 'build_log'>('update');
  const [composerTags, setComposerTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [connectingBuilderId, setConnectingBuilderId] = useState<string | null>(null);
  const [myConnections, setMyConnections] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [userProjectsCount, setUserProjectsCount] = useState(0);

  // Comments Expander States
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Real-Time Safe Banner States
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [stagedPosts, setStagedPosts] = useState<any[]>([]);

  // Parse deep links & parameters from other subpages
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("createSpace") === "true") {
      setShowCreateSpaceModal(true);
      router.replace("/dashboard/home");
    }
    const tabParam = searchParams.get("tab");
    if (tabParam === "logs") {
      setActiveTab("logs");
      router.replace("/dashboard/home");
    }
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
      router.replace("/dashboard/home");
    }
  }, [router]);

  // Auth redirect
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Load user profile & auto-initialize
  useEffect(() => {
    if (loading || !user) return;

    const loadUserProfile = async () => {
      try {
        const { data, error } = await getProfile(user.uid);
        if (!error) {
          if (data) {
            setProfile(data);
          } else {
            const newProf = {
              uid: user.uid,
              full_name: user.displayName || user.email?.split('@')[0] || "Builder",
              avatar_url: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
              email: user.email || "",
              username: user.email?.split('@')[0] || "builder",
              stack: [],
              onboarding_completed: false
            };
            await createProfile(newProf);
            setProfile(newProf);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadUserProfile();
  }, [user, loading]);

  // Load all profiles dynamically
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "builder_profiles"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllProfiles(list);
    });
    return () => unsubscribe();
  }, [user]);

  // Load connections for follow checking
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "connections"), where("follower_id", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyConnections(snapshot.docs.map(doc => doc.data().following_id));
    });
    return () => unsubscribe();
  }, [user]);

  // Load user project counts in real-time
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "projects"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserProjectsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time comments listener for expanded comment drawers
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    Object.keys(expandedComments).forEach((postId) => {
      if (expandedComments[postId]) {
        const q = query(
          collection(db, "posts", postId, "comments"),
          orderBy("created_at", "asc")
        );
        const unsub = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCommentsMap(prev => ({ ...prev, [postId]: list }));
        }, (err) => {
          console.error("Error loading comments:", err);
        });
        unsubs.push(unsub);
      }
    });
    return () => {
      unsubs.forEach(fn => fn());
    };
  }, [expandedComments]);

  // Real-time smart posts feed listener with safeStage banner
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
    let isInitial = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isInitial) {
        setPosts(list);
        setLoadingPosts(false);
        isInitial = false;
      } else {
        // If a new post is added
        if (list.length > posts.length) {
          const newestPost = list[0] as any;
          // If authored by the current user, merge immediately
          if (user && newestPost.uid === user.uid) {
            setPosts(list);
          } else {
            // Stage incoming posts and alert reader
            setStagedPosts(list);
            setNewPostsAvailable(true);
          }
        } else {
          // Edits/Likes updates flow through
          setPosts(list);
        }
      }
    }, (err) => {
      console.error("Error subscribing to posts:", err);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [user, posts.length]);

  const handleLoadNewPosts = () => {
    setPosts(stagedPosts);
    setNewPostsAvailable(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trending Builders Memo (REAL builders sorted by recency)
  const trendingBuildersList = useMemo(() => {
    if (!user) return [];
    return allProfiles
      .filter(p => p.uid !== user.uid && p.username)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p.uid,
        name: p.full_name || "Builder",
        username: p.username || "builder",
        role: p.stack && p.stack.length > 0 ? p.stack[0] : "AI Explorer",
        avatar: p.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
      }));
  }, [allProfiles, user]);

  const greetingName = useMemo(() => {
    if (!profile) return "Keerthan";
    return profile.full_name?.split(' ')[0] || "Keerthan";
  }, [profile]);

  const currentUser = useMemo(() => {
    return {
      fullName: profile?.full_name || user?.displayName || user?.email || "Keerthan Reddy",
      username: profile?.username || user?.email?.split('@')[0] || "keerthan_codes",
      imageUrl: profile?.avatar_url || user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    };
  }, [user, profile]);

  // Setup Progress Checks (Checks real stats & bio details)
  const setupDone: Record<string, boolean> = useMemo(() => {
    return {
      stack: !!(profile?.stack && profile.stack.length > 0),
      project: userProjectsCount > 0,
      profile: !!(profile?.bio && profile?.username)
    };
  }, [profile, userProjectsCount]);

  const checklistProgressPercent = useMemo(() => {
    const completed = Object.values(setupDone).filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  }, [setupDone]);

  // Action Triggers for Checklist
  const handleAddStackClick = async () => {
    if (!user || !profile) return;
    const defaultStack = ["React", "Next.js", "Firebase", "TypeScript"];
    const { error } = await updateProfile(user.uid, { stack: defaultStack });
    if (!error) {
      setProfile((prev: any) => ({ ...prev, stack: defaultStack }));
    }
  };

  const handleCompleteProfileClick = async () => {
    if (!user || !profile) return;
    const defaultBio = "Passionate builder shipping awesome software.";
    const defaultUsername = profile.username || user.email?.split('@')[0] || "builder";
    const { error } = await updateProfile(user.uid, { bio: defaultBio, username: defaultUsername });
    if (!error) {
      setProfile((prev: any) => ({ ...prev, bio: defaultBio, username: defaultUsername }));
    }
  };

  const handleShipProjectClick = async () => {
    if (!user) return;
    const { error } = await createProject({
      name: "My First Collab",
      description: "Building an awesome project with Collabsphere!",
      tech_stack: ["React", "Next.js", "Firestore"],
      uid: user.uid,
      author_name: profile?.full_name || user.displayName || "Builder",
      created_at: new Date().toISOString()
    });
    if (error) {
      console.error(error);
    }
    const element = document.getElementById("composer-textarea");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => element.focus(), 500);
    }
  };

  // Compose Post submit handler
  const handlePostSubmit = async () => {
    if (!user || !composerContent.trim()) return;

    const newPostData = {
      uid: user.uid,
      author_name: currentUser.fullName,
      author_email: user.email || "",
      author_avatar: currentUser.imageUrl,
      author_username: currentUser.username,
      content: composerContent.trim(),
      stack_tags: composerTags,
      post_type: composerType,
    };

    const tempId = `temp-${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      ...newPostData,
      likes: [],
      comments_count: 0,
      views: 0,
      created_at: new Date().toISOString(),
    };

    setPosts((prev: any[]) => [optimisticPost, ...prev]);
    setComposerContent("");
    setComposerTags([]);

    const { error } = await createPost(newPostData);
    if (error) {
      console.error("Failed to create post:", error);
      setPosts((prev: any[]) => prev.filter((p: any) => p.id !== tempId));
    }
  };

  // Heart click like handler
  const handleLikeClick = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likes.includes(user.uid);
    const newLikes = isLiked 
      ? likes.filter((id: string) => id !== user.uid)
      : [...likes, user.uid];

    setPosts((prev: any[]) => prev.map((p: any) => p.id === postId ? { ...p, likes: newLikes } : p));

    const { error } = await likePost(postId, user.uid);
    if (error) {
      console.error("Failed to like post:", error);
      setPosts((prev: any[]) => prev.map((p: any) => p.id === postId ? { ...p, likes } : p));
    }
  };

  // Trending Builder connection handler
  const handleConnectClick = async (builderId: string) => {
    if (!user || connectingBuilderId) return;
    setConnectingBuilderId(builderId);
    const { error } = await connectToBuilder(user.uid, builderId);
    setConnectingBuilderId(null);
    if (error) {
      console.error("Failed to connect builder:", error);
    }
  };

  // Comment subcollection poster
  const handlePostComment = async (postId: string) => {
    if (!user) return;
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));

    const { error } = await addComment(postId, {
      uid: user.uid,
      author_name: currentUser.fullName,
      author_avatar: currentUser.imageUrl,
      author_username: currentUser.username,
      content
    });

    if (error) {
      console.error("Failed to reply:", error);
    }
  };

  // Custom space modal submitter
  const handleCreateSpaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSpaceName.trim()) return;

    const { error } = await createSpace(user.uid, {
      label: newSpaceName.trim(),
      dotColor: newSpaceColor
    });

    if (!error) {
      setNewSpaceName("");
      setShowCreateSpaceModal(false);
    }
  };

  // Score algorithm ranking & Tabs filter
  const filteredPosts = useMemo(() => {
    const userStack = profile?.stack || [];
    let result = [...posts];

    if (activeTab === "for-you") {
      result.sort((a, b) => {
        const scoreA = computePostScore(a, userStack);
        const scoreB = computePostScore(b, userStack);
        return scoreB - scoreA;
      });
    } else if (activeTab === "updates") {
      result = result.filter(post => post.post_type === "update");
    } else if (activeTab === "teammates") {
      result = result.filter(post => post.post_type === "looking_for");
    } else if (activeTab === "logs") {
      result = result.filter(post => post.post_type === "build_log");
    }
    return result;
  }, [posts, activeTab, profile]);

  // Search Filter posts
  const searchedPosts = useMemo(() => {
    let result = filteredPosts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        (post.content || "").toLowerCase().includes(q) || 
        (post.author_name || "").toLowerCase().includes(q) ||
        (post.author_username || "").toLowerCase().includes(q) ||
        (post.stack_tags || []).some((tag: string) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [filteredPosts, searchQuery]);

  // Relative Time Ago calculation helper
  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return "Recently";
    }
  };

  const handleNewPostClick = () => {
    const textarea = document.getElementById("composer-textarea");
    if (textarea) {
      textarea.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => textarea.focus(), 500);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E5EEFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A5BFF] border-t-transparent" />
          <p className="text-sm font-semibold text-[#7A5BFF]/70">Entering Collabsphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#ffffff] text-[#1D1E22] antialiased font-sans relative pb-12 lg:pb-16 overflow-x-hidden">
      
      {/* Custom Styles and Heartbeat animation keyframes */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.25; }
        }
        .animate-glow { animation: pulseGlow 4s ease-in-out infinite; }

        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Subtle premium dot grid background pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft blur backgrounds */}
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#7A5BFF]/6 blur-[120px] pointer-events-none z-0 animate-glow" />
      <div className="absolute top-[40%] right-[5%] w-[700px] h-[700px] rounded-full bg-[#3B82F6]/6 blur-[140px] pointer-events-none z-0 animate-glow" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#C4B5FD]/5 blur-[110px] pointer-events-none z-0 animate-glow" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 py-6 lg:pl-[304px]">
        
        {/* Main content grid */}
        <div className="grid items-start grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8">

          {/* Sidebar */}
          <Sidebar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showCreateSpaceModal={showCreateSpaceModal}
            setShowCreateSpaceModal={setShowCreateSpaceModal}
          />

          {/* Mobile sidebar backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Central Column */}
          <main className="min-w-0 space-y-5">

            {/* Mobile Header */}
            <div className="flex items-center justify-between bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm backdrop-blur-md lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-black select-none leading-none">*</span>
                <span className="font-bold text-black text-sm">collabsphere</span>
              </div>
              <img
                src={currentUser.imageUrl}
                alt="user"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement
                  t.onerror = null
                  t.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                }}
                className="w-8 h-8 rounded-full border shadow-sm object-cover"
              />
            </div>

            {/* Top row greeting */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 pt-2.5 pb-2 md:pt-4 md:pb-2.5 relative z-10">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.imageUrl}
                  alt={greetingName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement
                    t.onerror = null
                    t.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                  }}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
                />
                <h2 
                  className="text-3xl italic text-[#121315] select-none leading-none"
                  style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
                >
                  Hi, {greetingName}!
                </h2>
              </div>

              {/* Individual / Community toggle switch */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-1 rounded-full flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.03)] select-none shrink-0 self-start sm:self-auto gap-0.5 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsTeamMode(false)}
                  className={`px-4.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                    !isTeamMode ? "bg-[#121315] text-white shadow-sm" : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeamMode(true)}
                  className={`px-4.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                    isTeamMode ? "bg-[#121315] text-white shadow-sm" : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                  }`}
                >
                  Community
                </button>
              </div>
            </section>

            {/* Hero banner block */}
            <section className="relative overflow-hidden bg-white border border-white/60 rounded-[28px] pt-4.5 pb-3 px-4.5 sm:pt-5 sm:pb-3 sm:px-5 md:pt-5 md:pb-3 md:px-5.5 shadow-[0_10px_28px_rgba(31,38,135,0.012)] backdrop-blur-xl group z-10">
              
              <div className="absolute top-[-35px] right-[8%] w-[90px] h-[110px] pointer-events-none select-none z-10 transition-transform duration-500 group-hover:scale-105">
                <svg className="w-full h-full text-blue-200/50" viewBox="0 0 100 120" fill="none">
                  <defs>
                    <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#EEF2F6" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50,10 Q20,60 20,85 A30,30 0 0,0 80,85 Q80,60 50,10 Z"
                    fill="url(#dropGrad)"
                    filter="drop-shadow(0 15px 25px rgba(139, 92, 246, 0.12))"
                  />
                </svg>
              </div>

              <div className="absolute bottom-[16px] right-[24%] bg-[#CDFF3D] border border-[#BDE82F] rounded-lg shadow-[0_6px_20px_rgba(205,255,61,0.25)] w-9.5 h-9.5 flex items-center justify-center select-none rotate-[15deg] pointer-events-none text-black z-10 transition-transform duration-500 group-hover:rotate-[25deg]">
                <span className="font-mono text-sm font-bold leading-none">&lt;/&gt;</span>
              </div>

              <div className="max-w-[75%] text-left space-y-1.5 sm:space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-[1.1] font-sans">
                  Build together.<br />
                  <span className="relative inline-block px-4.5 py-0.5 mx-0.5 bg-[#D8F5A2] rounded-full border border-black rotate-[-2deg] font-bold text-black shadow-sm text-[0.85em]">
                    Ship
                  </span>{" "}
                  further.
                </h1>
                <p className="text-xs sm:text-sm text-[#6E7079] leading-relaxed font-medium">
                  Where developers find teammates, build projects, and grow together.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => router.push("/builders")}
                    className="inline-flex items-center gap-1.5 bg-[#0B0C10] hover:bg-black text-white px-5 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 group"
                  >
                    <span>Find Teammates</span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNewPostClick}
                    className="text-[#7A5BFF] hover:text-[#5232FF] font-bold text-xs px-3 py-1.5 transition-all hover:underline"
                  >
                    Post a Project
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-2">
                
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center">
                    <div className="flex -space-x-1">
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 1"
                        referrerPolicy="no-referrer"
                        onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" }}
                      />
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 2"
                        referrerPolicy="no-referrer"
                        onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" }}
                      />
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 3"
                        referrerPolicy="no-referrer"
                        onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/builders")}
                      className="ml-1.5 flex items-center justify-center w-5.5 h-5.5 rounded-full bg-gray-100 border border-gray-200/50 text-gray-500 hover:bg-gray-200 transition-all"
                    >
                      <span className="text-[9px] font-bold">→</span>
                    </button>
                  </div>

                  <div className="px-2 py-1 rounded-lg bg-gray-50/80 border border-gray-100/50 text-[9px] font-extrabold text-gray-500 flex items-center gap-1 shadow-sm select-none">
                    <span>Just shipped</span>
                    <span className="px-1 py-0.5 rounded-md bg-gray-200/50 font-mono text-[8px]">v1.0</span>
                    <span>🚀</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-1.5 px-2.5 shadow-sm flex items-center gap-2.5 min-w-[155px] group/card">
                  <div>
                    <span className="text-[8px] font-extrabold text-[#9EA0A8] uppercase tracking-wider block text-left">Active Builders</span>
                    <span className="text-lg font-black tracking-tight text-black block mt-0.5 text-left">8.2K</span>
                    <span className="text-[8px] font-black text-[#A3E635] flex items-center gap-0.5 mt-0.5">
                      <span>↗</span><span>+20% this week</span>
                    </span>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-center">
                    <svg className="w-[56px] h-[22px] text-[#7A5BFF] transition-all group-hover/card:scale-105 duration-300" viewBox="0 0 100 35" fill="none">
                      <path
                        d="M0,25 Q12,28 24,18 T48,15 T72,8 T100,2"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>
            </section>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2 relative z-10">
              <div className="flex flex-wrap items-center bg-white/50 backdrop-blur-xl p-1 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] gap-0.5">
                {[
                  { key: "for-you", label: "For You" },
                  { key: "updates", label: "Project Updates" },
                  { key: "teammates", label: "Looking for Teammates" },
                  { key: "logs", label: "Build Logs" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as FeedTabKey)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-[#121315] text-white shadow-[0_4px_12px_rgba(18,19,21,0.06)]"
                        : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real data-driven setup checklist with premium linear-gradient */}
            {!isSetupDismissed && (
              <div 
                className="border rounded-[24px] p-5 shadow-[0_8px_24px_rgba(122,91,255,0.03)] relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12))',
                  borderColor: 'rgba(139, 92, 246, 0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#7A5BFF] animate-pulse" />
                      <span className="text-xs font-extrabold text-[#121315] tracking-tight">Get started checklist</span>
                    </div>
                    <span className="text-[10px] text-[#9EA0A8] font-medium mt-0.5">Complete these core setups to start shipping at scale</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSetupDismissed(true)}
                    className="text-[10px] text-[#9EA0A8] hover:text-[#121315] font-bold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Progress bar showing real percentage */}
                <div className="my-3">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-black mb-1.5">
                    <span>ONBOARDING PROGRESS</span>
                    <span className="text-[#7A5BFF]">{checklistProgressPercent}% DONE</span>
                  </div>
                  <div className="w-full bg-[#EAEBF4]/60 h-2.5 rounded-full overflow-hidden shadow-inner border border-white/20">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${checklistProgressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Add your stack */}
                  <div className={`relative flex items-center gap-3 rounded-[16px] border px-4 py-3.5 transition-all duration-200 cursor-pointer group bg-white shadow-sm ${
                    setupDone["stack"]
                      ? "border-green-200 bg-white"
                      : "border-gray-200 hover:border-[#7A5BFF]/30 hover:shadow-md"
                  }`}
                    onClick={handleAddStackClick}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                      setupDone["stack"] ? "bg-green-100 text-green-600" : "bg-[#E9E7FF] text-[#7A5BFF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["stack"] ? "✓" : "⚡"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-semibold tracking-tight truncate ${
                        setupDone["stack"] ? "text-green-700 line-through opacity-70" : "text-gray-900"
                      }`}>Add your stack</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                        {setupDone["stack"] ? "Stack loaded!" : "React, Firebase..."}
                      </p>
                    </div>
                  </div>

                  {/* Ship your first project */}
                  <div className={`relative flex items-center gap-3 rounded-[16px] border px-4 py-3.5 transition-all duration-200 cursor-pointer group bg-white shadow-sm ${
                    setupDone["project"]
                      ? "border-green-200 bg-white"
                      : "border-gray-200 hover:border-[#7A5BFF]/30 hover:shadow-md"
                  }`}
                    onClick={handleShipProjectClick}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                      setupDone["project"] ? "bg-green-100 text-green-600" : "bg-[#E9E7FF] text-[#7A5BFF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["project"] ? "✓" : "🚀"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-semibold tracking-tight truncate ${
                        setupDone["project"] ? "text-green-700 line-through opacity-70" : "text-gray-900"
                      }`}>Ship first project</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                        {setupDone["project"] ? "Project shipped!" : "Post your build logs"}
                      </p>
                    </div>
                  </div>

                  {/* Complete builder profile */}
                  <div className={`relative flex items-center gap-3 rounded-[16px] border px-4 py-3.5 transition-all duration-200 cursor-pointer group bg-white shadow-sm ${
                    setupDone["profile"]
                      ? "border-green-200 bg-white"
                      : "border-gray-200 hover:border-[#7A5BFF]/30 hover:shadow-md"
                  }`}
                    onClick={handleCompleteProfileClick}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                      setupDone["profile"] ? "bg-green-100 text-green-600" : "bg-[#E9E7FF] text-[#7A5BFF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["profile"] ? "✓" : "👤"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-semibold tracking-tight truncate ${
                        setupDone["profile"] ? "text-green-700 line-through opacity-70" : "text-gray-900"
                      }`}>Complete profile</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                        {setupDone["profile"] ? "Profile ready!" : "Bio & username check"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Composer Redesign */}
            <div id="post-composer" className="bg-white border border-[#e5e7eb] rounded-[16px] p-5 shadow-sm text-left relative z-10 space-y-3.5">
              <div className="flex items-start gap-3">
                <img
                  src={currentUser.imageUrl}
                  alt={currentUser.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-150 shadow-sm shrink-0"
                />
                <textarea
                  id="composer-textarea"
                  placeholder="What are you building today?"
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  className="flex-1 border-0 outline-none placeholder-gray-400 text-[15px] min-h-[80px] bg-transparent resize-none py-1 text-gray-800"
                />
              </div>

              {composerTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-13">
                  {composerTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold border border-gray-200"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => setComposerTags(prev => prev.filter(t => t !== tag))}
                        className="text-gray-400 hover:text-red-500 font-bold ml-1 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="pl-13 relative max-w-xs">
                <input
                  type="text"
                  placeholder="Add tech tag (type & enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = tagInput.trim().toLowerCase().replace(/#/g, "");
                      if (val && !composerTags.includes(val)) {
                        setComposerTags(prev => [...prev, val]);
                      }
                      setTagInput("");
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-full px-4 py-2 text-sm outline-none transition-all placeholder-gray-400"
                />
              </div>

              <div className="border-t border-gray-100 my-2 pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {(['update', 'looking_for', 'build_log'] as const).map((type) => {
                    const label = type === 'update' ? 'Update' : type === 'looking_for' ? 'Looking For' : 'Build Log';
                    const isActive = composerType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setComposerType(type)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handlePostSubmit}
                  disabled={!composerContent.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Real-time incoming scroll-safe posts banner alerts */}
            {newPostsAvailable && (
              <div className="flex justify-center py-2 relative z-20">
                <button
                  type="button"
                  onClick={handleLoadNewPosts}
                  className="bg-gradient-to-r from-[#7A5BFF] to-[#EC4899] text-white px-5 py-2 rounded-full text-[11px] font-black tracking-wider uppercase shadow-md hover:shadow-lg transform active:scale-95 transition-all animate-bounce flex items-center gap-2 border border-white/20"
                >
                  <span>✨ New posts available</span>
                  <span className="bg-white/30 text-white px-1.5 py-0.5 rounded-full text-[9px]">Click to view</span>
                </button>
              </div>
            )}

            {/* Central Feed List */}
            <div className="space-y-5 relative z-10">
              {loadingPosts ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white border border-white/50 rounded-[28px] p-5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-1/4 rounded bg-gray-200" />
                        <div className="h-2 w-1/6 rounded bg-gray-100" />
                      </div>
                      <div className="h-5 w-16 rounded-full bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-200" />
                    </div>
                    <div className="h-6 w-24 rounded bg-gray-100" />
                  </div>
                ))
              ) : searchedPosts.length === 0 ? (
                <div className="bg-white/60 border border-white/50 rounded-[28px] p-10 text-center shadow-sm backdrop-blur-md">
                  <Trophy className="w-12 h-12 text-[#7A5BFF]/30 mx-auto mb-3" />
                  <h4 className="text-sm font-black text-black">No posts found</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Try another keyword, tags, or create a post to kickstart the timeline!</p>
                </div>
              ) : (
                searchedPosts.map((post) => {
                  const likes = Array.isArray(post.likes) ? post.likes : [];
                  const isLiked = user && likes.includes(user.uid);
                  const isCommentSectionOpen = !!expandedComments[post.id];
                  
                  // Optimized type badge color pills & accents
                  let typeBadgeClass = "";
                  let typeLabel = "";
                  let cardAccentStyle = "";
                  let avatarRingColor = "";

                  if (post.post_type === 'update') {
                    typeBadgeClass = "bg-blue-100 text-blue-700 font-semibold";
                    typeLabel = "Update";
                    cardAccentStyle = "border-l-4 border-l-[#3b82f6]";
                    avatarRingColor = "ring-[#3b82f6]";
                  } else if (post.post_type === 'looking_for') {
                    typeBadgeClass = "bg-purple-100 text-purple-700 font-semibold";
                    typeLabel = "Looking For";
                    cardAccentStyle = "border-l-4 border-l-[#8b5cf6]";
                    avatarRingColor = "ring-[#8b5cf6]";
                  } else if (post.post_type === 'build_log') {
                    typeBadgeClass = "bg-green-100 text-green-700 font-semibold";
                    typeLabel = "Build Log";
                    cardAccentStyle = "border-l-4 border-l-[#10b981]";
                    avatarRingColor = "ring-[#10b981]";
                  } else {
                    typeBadgeClass = "bg-orange-100 text-orange-700 font-semibold";
                    typeLabel = "Project Update";
                    cardAccentStyle = "border-l-4 border-l-[#f59e0b]";
                    avatarRingColor = "ring-[#f59e0b]";
                  }

                  return (
                    <div
                      key={post.id}
                      className={`bg-white border border-[#e5e7eb] ${cardAccentStyle} rounded-[16px] px-6 py-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all duration-200 ease-in-out text-left relative group`}
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                            alt={post.author_name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }}
                            className={`w-10 h-10 rounded-full object-cover border border-white ring-2 ring-offset-2 ${avatarRingColor}`}
                          />
                          <div className="min-w-0 text-left">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{post.author_name}</p>
                            <p className="text-gray-400 text-xs mt-0.5 truncate font-medium">
                              @{post.author_username} · {timeAgo(post.created_at)}
                            </p>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${typeBadgeClass}`}>
                          {typeLabel}
                        </span>
                      </div>

                      {/* Content */}
                      <p 
                        className="text-[15px] text-[#374151] leading-relaxed my-3 whitespace-pre-wrap font-medium"
                        style={{ lineHeight: '1.6' }}
                      >
                        {post.content}
                      </p>

                      {/* Stack Tags */}
                      {post.stack_tags && post.stack_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.stack_tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 cursor-pointer transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Action Bar */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 mt-4">
                        <div className="flex items-center gap-2">
                          {/* Like Button */}
                          <button
                            type="button"
                            onClick={() => handleLikeClick(post.id)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              isLiked 
                                ? "text-pink-500 bg-pink-50 font-semibold" 
                                : "text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                            }`}
                          >
                            <Heart className={`w-4 h-4 transition-transform ${
                              isLiked 
                                ? "fill-pink-500 text-pink-500 animate-[heartBeat_0.3s_ease-in-out]" 
                                : "text-gray-400"
                            }`} />
                            <span>{likes.length}</span>
                          </button>

                          {/* Comment Count Button: Clickable drawer toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              isCommentSectionOpen 
                                ? "text-blue-500 bg-blue-50" 
                                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            <MessageCircle className={`w-4 h-4 transition-colors ${
                              isCommentSectionOpen ? "text-blue-500" : "text-gray-400"
                            }`} />
                            <span>{post.comments_count || 0}</span>
                          </button>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `${post.author_name} on Collabsphere`,
                                text: post.content,
                                url: window.location.href,
                              });
                            } else {
                              navigator.clipboard.writeText(post.content);
                              alert("Post content copied to clipboard!");
                            }
                          }}
                          className="text-gray-400 hover:text-black transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.636-2.318M8.684 13.258l4.636 2.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Expandable Comment Drawer with negative offsets to blend into the card edge seamlessly */}
                      {isCommentSectionOpen && (
                        <div className="mt-4 pt-4 border-t border-[#f3f4f6] bg-[#f9fafb] -mx-6 px-6 -mb-5 pb-5 rounded-b-[16px] space-y-4 text-left animate-in fade-in duration-200">
                          {/* Replies listing */}
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {(commentsMap[post.id] || []).map((reply) => (
                              <div key={reply.id} className="flex gap-2.5 items-start bg-white p-3 rounded-2xl border border-gray-150 shadow-sm">
                                <img
                                  src={reply.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                                  alt={reply.author_name}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }}
                                  className="w-7 h-7 rounded-full object-cover border border-white shrink-0 shadow-sm"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-semibold text-gray-900 truncate leading-none">{reply.author_name}</p>
                                    <span className="text-[9px] text-gray-400 shrink-0">{timeAgo(reply.created_at)}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed font-medium">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                            {(!commentsMap[post.id] || commentsMap[post.id].length === 0) && (
                              <p className="text-[10px] text-gray-400 text-center font-medium py-1">No comments yet. Start the conversation!</p>
                            )}
                          </div>

                          {/* Reply input drawer */}
                          <div className="flex items-center gap-2">
                            <img
                              src={currentUser.imageUrl}
                              referrerPolicy="no-referrer"
                              onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" }}
                              className="w-7.5 h-7.5 rounded-full object-cover border border-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handlePostComment(post.id);
                                }
                              }}
                              className="flex-1 bg-white border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-full px-4 py-2 text-xs outline-none transition-all placeholder-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => handlePostComment(post.id)}
                              className="bg-gray-900 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-gray-700 transition-all active:scale-95 shrink-0"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </main>

          {/* Right Column */}
          <aside className="min-w-0 self-start space-y-6">
            
            {/* Online builders avatar stack */}
            <div className="bg-white border border-[#e5e7eb] rounded-[28px] p-2.5 shadow-sm flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center pl-1.5">
                <div className="flex -space-x-1.5">
                  {allProfiles.slice(0, 4).map((p, index) => (
                    <img
                      key={p.id || index}
                      className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                      src={p.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"}
                      alt="online builder"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/50 shadow-sm">
                  +{allProfiles.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-[#121315] hover:bg-black text-[#F3F7FF] px-4.5 py-2.5 rounded-full text-xs font-black shadow-sm inline-flex items-center gap-1.5 active:scale-95 transition-all"
                  onClick={handleNewPostClick}
                >
                  <Plus className="w-3.5 h-3.5 text-white font-black" />
                  <span>New Post</span>
                </button>
              </div>
            </div>

            {/* Dark glass sphere card */}
            <div className="bg-[#121318] text-white rounded-[36px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[280px] z-10 group">
              <div className="absolute right-[-25px] bottom-[-20px] pointer-events-none select-none transition-transform duration-[4000ms] group-hover:scale-105 group-hover:rotate-12">
                <svg className="w-[190px] h-[190px]" viewBox="0 0 200 200" fill="none">
                  <defs>
                    <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#CDFF3D" />
                      <stop offset="40%" stopColor="#A3E635" />
                      <stop offset="100%" stopColor="#1B4D08" />
                    </radialGradient>
                  </defs>
                  
                  <ellipse cx="100" cy="100" rx="90" ry="24" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" transform="rotate(-15 100 100)" />
                  <ellipse cx="100" cy="100" rx="68" ry="16" stroke="rgba(255,255,255,0.15)" strokeWidth="1" transform="rotate(-15 100 100)" />
                  
                  <circle cx="100" cy="100" r="26" fill="url(#sphereGrad)" filter="drop-shadow(0 0 20px rgba(163,230,53,0.35))" />
                  
                  <path d="M 33 113 A 90 25 0 0 0 167 67" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-15 100 100)" />
                  
                  <path d="M40,55 L42,57 L40,59 L38,57 Z" fill="#CDFF3D" opacity="0.7" />
                  <path d="M150,150 L152,152 L150,154 L148,152 Z" fill="#CDFF3D" opacity="0.6" />
                  <path d="M165,30 L166.5,31.5 L165,33 L163.5,31.5 Z" fill="#fff" opacity="0.8" />
                </svg>
              </div>

              <div className="space-y-4 max-w-[80%] text-left">
                <h3 className="text-2xl font-bold leading-snug tracking-tight text-white font-sans">
                  You don't<br />have to<br />build alone.
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Collabsphere connects you with verified builders through real project history, not LinkedIn fluff.
                </p>
              </div>

              <div className="z-10 mt-6 text-left">
                <button
                  type="button"
                  onClick={() => router.push("/builders")}
                  className="bg-[#CDFF3D] hover:bg-[#B5E82F] text-black text-xs font-extrabold px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all group/cta"
                >
                  <span>Join the Movement</span>
                  <span className="text-sm leading-none group-hover/cta:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Trending Builders Widget */}
            <div className="bg-white border border-[#e5e7eb] rounded-[32px] p-5 shadow-sm space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black tracking-tight font-sans">Trending Builders</span>
                <button
                  type="button"
                  onClick={() => router.push("/builders")}
                  className="text-xs font-bold text-[#7A5BFF] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {trendingBuildersList.map((builder) => {
                  const isConnected = myConnections.includes(builder.id);
                  return (
                    <div key={builder.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0" onClick={() => router.push(`/builders`)}>
                        <img
                          src={builder.avatar}
                          alt={builder.name}
                          className="w-10 h-10 rounded-full object-cover border border-white shadow-sm shrink-0"
                        />
                        <div className="text-left min-w-0">
                          <p className="text-sm font-bold text-black group-hover:text-[#7A5BFF] transition-colors leading-none truncate">{builder.name}</p>
                          <p className="text-xs text-[#8A8B94] mt-1.5 truncate">@{builder.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-bold text-gray-400 truncate max-w-[80px]">{builder.role}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isConnected) {
                              handleConnectClick(builder.id);
                            }
                          }}
                          disabled={isConnected || connectingBuilderId === builder.id}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isConnected 
                              ? "bg-green-50 text-green-500 cursor-default animate-pulse"
                              : "bg-gray-50 group-hover:bg-[#E9E7FF] text-gray-400 hover:text-[#7A5BFF] active:scale-95"
                          }`}
                        >
                          {isConnected ? (
                            <span className="text-xs font-bold font-sans">✓</span>
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {trendingBuildersList.length === 0 && (
                  <p className="text-[10px] text-gray-400 text-center font-medium">No other builders found.</p>
                )}
              </div>
            </div>

            {/* Active Hackathons Trophy Widget */}
            <div className="bg-white border border-[#e5e7eb] rounded-[32px] p-5 shadow-sm space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black tracking-tight font-sans">Active Hackathons</span>
                <button
                  type="button"
                  onClick={() => router.push("/hackathons")}
                  className="text-xs font-bold text-[#7A5BFF] hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {fallbackHackathons.map((hackathon) => (
                  <div key={hackathon.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50/60 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl ${hackathon.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                        <Trophy className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-black leading-none">{hackathon.name}</p>
                        <p className="text-[10px] text-[#8A8B94] mt-1.5 font-medium">{hackathon.date}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-[#7A5BFF] bg-[#E9E7FF] px-2 py-0.5 rounded-lg">{hackathon.builders} builders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* Create Space Modal */}
      {showCreateSpaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-white/60 rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-black tracking-tight font-sans uppercase">Create New Space</h3>
            
            <form onSubmit={handleCreateSpaceSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-[#9EA0A8] uppercase tracking-wider mb-1">Space Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solopreneurs Hub"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="w-full bg-[#EAEBF4]/40 border border-transparent focus:border-[#7A5BFF]/40 px-3.5 py-2.5 rounded-2xl text-xs placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#7A5BFF]/30 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#9EA0A8] uppercase tracking-wider mb-1.5">Color Accent</label>
                <div className="flex gap-2">
                  {[
                    { color: "bg-[#CDFF3D]", value: "bg-[#CDFF3D]" },
                    { color: "bg-[#B69DFF]", value: "bg-[#B69DFF]" },
                    { color: "bg-[#FF9D42]", value: "bg-[#FF9D42]" },
                    { color: "bg-[#42EFFF]", value: "bg-[#42EFFF]" },
                    { color: "bg-[#FF42A1]", value: "bg-[#FF42A1]" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setNewSpaceColor(item.value)}
                      className={`w-6 h-6 rounded-full ${item.color} border-2 transition-transform ${
                        newSpaceColor === item.value ? "border-black scale-110 shadow-sm" : "border-transparent hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateSpaceModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black py-3 rounded-full active:scale-95 transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#121315] hover:bg-black text-[#CDFF3D] text-xs font-black py-3 rounded-full active:scale-95 transition-all text-center"
                >
                  Create Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}