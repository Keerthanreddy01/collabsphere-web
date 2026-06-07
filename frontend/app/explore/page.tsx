"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import {
  Search, TrendingUp, Users, Sparkles, Hash, Heart, MessageCircle,
  Repeat2, Share, Verified, Flame, Zap, Code2, Globe, Rocket,
  ChevronRight, MoreHorizontal, BookmarkPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Static demo data ──────────────────────────────────────────────────────────
const TRENDING_TOPICS = [
  { tag: "react", posts: "24.3K", category: "Technology", hot: true },
  { tag: "nextjs", posts: "18.1K", category: "Framework", hot: true },
  { tag: "rust", posts: "15.7K", category: "Language", hot: false },
  { tag: "ai", posts: "89.2K", category: "Trending", hot: true },
  { tag: "web3", posts: "12.4K", category: "Blockchain", hot: false },
  { tag: "indiehackers", posts: "9.8K", category: "Community", hot: false },
  { tag: "typescript", posts: "31.5K", category: "Language", hot: false },
  { tag: "opensource", posts: "44.1K", category: "Community", hot: true },
];

const SUGGESTED_BUILDERS = [
  { name: "Sarah Chen", handle: "sarahbuilds", role: "ML Engineer @ Google", followers: "12.4K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", verified: true, building: "AI content generator" },
  { name: "Marcus Dev", handle: "marcusdev", role: "Indie Hacker", followers: "8.1K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus", verified: false, building: "SaaS boilerplate" },
  { name: "Priya Sharma", handle: "priyacodes", role: "Full Stack Dev", followers: "5.6K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", verified: true, building: "Dev community tool" },
];

const CATEGORIES = [
  { label: "For You", icon: Sparkles, active: true },
  { label: "Trending", icon: TrendingUp, active: false },
  { label: "Builders", icon: Users, active: false },
  { label: "Open Source", icon: Code2, active: false },
  { label: "Global", icon: Globe, active: false },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } },
};

export default function ExplorePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("For You");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrendingPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
          <span className="text-white/30 text-base">Loading explore…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-white/20 selection:text-white">

      {/* Ambient background (Removed blobs to fix mobile overlap) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_60%)]" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_60%)]" />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 flex justify-center h-full overflow-y-auto scrollbar-hide overflow-x-hidden relative z-10 md:pl-[72px] xl:pr-[340px] w-full max-w-full">
        <div className="w-full max-w-full md:max-w-[760px] flex flex-col pb-[140px] md:pb-0 overflow-x-hidden">

          {/* ── Sticky Search + Category Header ─────────────────────────────── */}
          <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">

            {/* Search bar */}
            <div className="px-6 pt-5 pb-4">
              <motion.div
                animate={{ scale: searchFocused ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-4 bg-white/[0.06] border rounded-2xl px-5 py-4 transition-all duration-200 ${searchFocused ? "border-white/20 bg-white/[0.08]" : "border-white/[0.06]"}`}
              >
                <Search className={`w-5 h-5 shrink-0 transition-colors duration-200 ${searchFocused ? "text-white" : "text-white/30"}`} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search builders, projects, topics…"
                  className="flex-1 bg-transparent text-[16px] text-white placeholder-white/25 outline-none"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="text-white/30 hover:text-white text-sm transition-colors"
                    >✕</motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 px-6 pb-0 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-none text-[15px] font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                    activeCategory === label
                      ? "text-white border-white"
                      : "text-white/40 border-transparent hover:text-white/70"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ──────────────────────────────────────────────────────── */}
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="flex flex-col"
          >

            {/* ── Trending Topics ── */}
            <motion.section variants={stagger.item} className="border-b border-white/[0.06]">
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-[18px] font-bold text-white">Trending in Dev</span>
                </div>
                <button className="text-[15px] text-blue-400 hover:text-blue-300 transition-colors">See all</button>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {TRENDING_TOPICS.slice(0, 5).map((topic, i) => (
                  <motion.button
                    key={topic.tag}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="w-full px-6 py-4 flex items-center justify-between group text-left transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-white/30">{i + 1} · {topic.category}</span>
                        {topic.hot && (
                          <span className="text-[11px] font-bold text-orange-400/80 bg-orange-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" /> HOT
                          </span>
                        )}
                      </div>
                      <span className="text-[16px] font-bold text-white group-hover:text-white/90">#{topic.tag}</span>
                      <span className="text-[14px] text-white/30">{topic.posts} posts</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* ── Suggested Builders (Instagram-style cards) ── */}
            <motion.section variants={stagger.item} className="border-b border-white/[0.06]">
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-[18px] font-bold text-white">Who to Follow</span>
                </div>
                <button className="text-[15px] text-blue-400 hover:text-blue-300 transition-colors">See all</button>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {SUGGESTED_BUILDERS.map((builder) => (
                  <motion.div
                    key={builder.handle}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="px-6 py-4 flex items-center gap-4 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={builder.avatar}
                        alt={builder.name}
                        className="w-12 h-12 rounded-full bg-white/10 object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[3px] border-black" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-bold text-white truncate">{builder.name}</span>
                        {builder.verified && <Verified className="w-4 h-4 text-blue-400 shrink-0 fill-blue-400" />}
                      </div>
                      <p className="text-[14px] text-white/40 truncate">@{builder.handle} · {builder.followers} followers</p>
                      <p className="text-[14px] text-white/50 mt-1 flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-purple-400" />
                        Building: {builder.building}
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFollowed(prev => ({ ...prev, [builder.handle]: !prev[builder.handle] }))}
                      className={`shrink-0 px-5 py-2 rounded-full text-[14px] font-bold transition-all duration-200 border ${
                        followed[builder.handle]
                          ? "bg-transparent border-white/20 text-white/60 hover:border-red-500/40 hover:text-red-400"
                          : "bg-white border-white text-black hover:bg-white/90"
                      }`}
                    >
                      {followed[builder.handle] ? "Following" : "Follow"}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Popular Discussions (Twitter/X-style feed) ── */}
            <motion.section variants={stagger.item}>
              <div className="flex items-center gap-2.5 px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-[18px] font-bold text-white">Popular Discussions</span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {trendingPosts.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-24 gap-5">
                    <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white/20" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-[18px]">Nothing here yet</p>
                      <p className="text-white/30 text-[15px] mt-1.5">Be the first to start a discussion.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/create")}
                      className="px-8 py-3 bg-white text-black text-[15px] font-bold rounded-full hover:bg-white/90 transition-colors"
                    >
                      Post something
                    </motion.button>
                  </div>
                ) : (
                  trendingPosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))
                )}
              </div>
            </motion.section>

          </motion.div>

          {/* Bottom spacer */}
          <div className="h-32" />
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

// ── Post Card component (X/Twitter style) ────────────────────────────────────
function PostCard({ post, index }: { post: any; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 200) + 5);
  const [bookmarked, setBookmarked] = useState(false);

  const timeAgo = (ts: any) => {
    if (!ts) return "now";
    const secs = Math.floor((Date.now() - (ts.toMillis?.() ?? Date.now())) / 1000);
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h`;
    return `${Math.floor(secs / 86400)}d`;
  };

  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_username || "user"}`;
  const replies = Math.floor(Math.random() * 30) + 1;
  const reposts = Math.floor(Math.random() * 80) + 2;
  const views = Math.floor(Math.random() * 5000) + 100;

  const TYPE_COLORS: Record<string, string> = {
    building: "text-green-400",
    looking_for: "text-blue-400",
    idea: "text-purple-400",
    shipped: "text-orange-400",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: EASE }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      className="px-6 py-5 flex gap-4 cursor-pointer group transition-colors"
    >
      {/* Avatar column */}
      <div className="shrink-0">
        <img src={avatar} alt={post.author_username} className="w-12 h-12 rounded-full bg-white/10" />
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[16px] font-bold text-white hover:underline cursor-pointer">
            {post.author_username || "builder"}
          </span>
          <span className="text-[15px] text-white/30">·</span>
          <span className="text-[15px] text-white/30">{timeAgo(post.created_at)}</span>
          {post.post_type && (
            <span className={`text-[13px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] ${TYPE_COLORS[post.post_type] || "text-white/50"}`}>
              {post.post_type.replace(/_/g, " ")}
            </span>
          )}
          <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white hover:bg-white/10 rounded-full p-1.5">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post content */}
        <p className="text-[17px] leading-[1.6] text-white/90 mb-4 break-words">
          {post.content}
        </p>

        {/* Action bar */}
        <div className="flex items-center justify-between max-w-[400px] -ml-2">

          {/* Reply */}
          <ActionButton
            icon={<MessageCircle className="w-[20px] h-[20px]" />}
            count={replies}
            color="group-hover/btn:text-blue-400"
            hoverBg="group-hover/btn:bg-blue-400/10"
          />

          {/* Repost */}
          <ActionButton
            icon={<Repeat2 className="w-[20px] h-[20px]" />}
            count={reposts}
            color="group-hover/btn:text-green-400"
            hoverBg="group-hover/btn:bg-green-400/10"
          />

          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(p => !p);
              setLikeCount(p => liked ? p - 1 : p + 1);
            }}
            className="flex items-center gap-1.5 group/btn"
          >
            <span className={`p-2 rounded-full transition-colors ${liked ? "bg-red-500/10" : "group-hover/btn:bg-red-500/10"}`}>
              <Heart className={`w-[20px] h-[20px] transition-all ${liked ? "text-red-500 fill-red-500 scale-110" : "text-white/40 group-hover/btn:text-red-400"}`} />
            </span>
            <span className={`text-[14px] transition-colors ${liked ? "text-red-500" : "text-white/40 group-hover/btn:text-red-400"}`}>
              {likeCount}
            </span>
          </motion.button>

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(p => !p)
            }}
            className="group/btn"
          >
            <span className={`p-2 rounded-full block transition-colors ${bookmarked ? "bg-blue-400/10" : "group-hover/btn:bg-blue-400/10"}`}>
              <BookmarkPlus className={`w-[20px] h-[20px] transition-all ${bookmarked ? "text-blue-400 fill-blue-400" : "text-white/40 group-hover/btn:text-blue-400"}`} />
            </span>
          </motion.button>

          {/* Views */}
          <div className="flex items-center gap-1.5 text-white/25">
            <Share className="w-[18px] h-[18px]" />
            <span className="text-[13px]">{views > 999 ? `${(views / 1000).toFixed(1)}K` : views}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ActionButton({ icon, count, color, hoverBg }: {
  icon: React.ReactNode; count: number; color: string; hoverBg: string;
}) {
  return (
    <motion.button whileTap={{ scale: 0.85 }} className={`flex items-center gap-1.5 group/btn`}>
      <span className={`p-2 rounded-full block transition-colors ${hoverBg}`}>
        <span className={`block text-white/40 transition-colors ${color}`}>{icon}</span>
      </span>
      <span className={`text-[14px] text-white/40 transition-colors ${color}`}>{count}</span>
    </motion.button>
  );
}
