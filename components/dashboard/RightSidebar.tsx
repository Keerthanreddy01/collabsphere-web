"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Plus, X, Activity, Compass, Flame, Users, Sparkles } from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { computePostScore } from "@/lib/posts";

export default function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch top 50 recent posts to derive stats for Right Sidebar
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentPosts(list);
    });
    return () => unsubscribe();
  }, []);

  const trendingTags = useMemo(() => {
    const counts: Record<string, number> = {};
    recentPosts.forEach(post => {
      if (Array.isArray(post.stack_tags)) {
        post.stack_tags.forEach((tag: string) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [recentPosts]);

  const peopleToFollow = useMemo(() => {
    if (!user) return [];
    // Extract unique users from recent posts who are not the current user
    const usersMap = new Map();
    recentPosts.forEach(post => {
      if (post.uid && post.uid !== user.uid && !usersMap.has(post.uid)) {
        usersMap.set(post.uid, {
          uid: post.uid,
          name: post.author_name,
          username: post.author_username,
          avatar: post.author_avatar,
          tags: post.stack_tags || []
        });
      }
    });
    return Array.from(usersMap.values()).slice(0, 3);
  }, [recentPosts, user]);

  const hotProjects = useMemo(() => {
    return recentPosts
      .filter(post => post.post_type === "showcase")
      .sort((a, b) => computePostScore(b) - computePostScore(a))
      .slice(0, 3);
  }, [recentPosts]);

  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col gap-6 pl-4 py-6 sticky top-0 h-screen overflow-y-auto no-scrollbar pb-16">
      
      {/* Trending Tags */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-black text-[#0F172A] tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#6366F1]" /> Trending Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingTags.length > 0 ? trendingTags.map((tag, idx) => (
            <span key={idx} className="bg-[#6366F1]/10 text-[#6366F1] px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-[#6366F1]/20 transition-colors">
              #{tag}
            </span>
          )) : (
            <span className="text-[12px] text-gray-400">No trending tags yet.</span>
          )}
        </div>
      </div>

      {/* People to Follow */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-black text-[#0F172A] tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-[#06B6D4]" /> People to Follow
        </h3>
        <div className="flex flex-col gap-3 bg-white/50 backdrop-blur-md p-4 rounded-[24px] border border-white shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
          {peopleToFollow.length > 0 ? peopleToFollow.map((u, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"} alt={u.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#0F172A]">{u.name}</span>
                  <span className="text-[11px] text-[#64748B]">@{u.username}</span>
                </div>
              </div>
              <button className="bg-[#0F172A] hover:bg-[#6366F1] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors shadow-sm">
                Follow
              </button>
            </div>
          )) : (
            <span className="text-[12px] text-gray-400">Interact to see suggestions.</span>
          )}
        </div>
      </div>

      {/* Hot Projects (Recommendations) */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-black text-[#0F172A] tracking-tight flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" /> Hot Projects
        </h3>
        <div className="flex flex-col gap-3">
          {hotProjects.length > 0 ? hotProjects.map((project, idx) => (
            <div key={idx} className="relative group cursor-pointer overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 rounded-[24px] shadow-[0_8px_20px_rgba(15,23,42,0.1)] border border-white/10 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#06B6D4]/20 rounded-full blur-2xl -z-0"></div>
              
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold">
                    🚀 Showcase
                  </span>
                  <span className="text-[10px] text-white/50">{project.likes?.length || 0} Likes</span>
                </div>
                <p className="text-[13px] font-semibold text-white leading-snug line-clamp-2">
                  {project.content}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={project.author_avatar} alt={project.author_name} className="w-5 h-5 rounded-full border border-white/20" />
                  <span className="text-[10px] text-white/70 font-medium">by {project.author_name}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white/50 backdrop-blur-md p-4 rounded-[24px] border border-white shadow-[0_4px_16px_rgba(15,23,42,0.03)] text-center">
              <Sparkles className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-[12px] text-gray-500">No showcases to display this week. Build something awesome!</p>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}
