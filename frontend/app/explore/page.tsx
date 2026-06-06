"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Telescope, Flame, Users, Sparkles, Hash } from "lucide-react";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    // In a real app we'd query by likes. For now, fetch recent posts as "trending".
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrendingPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#0095F6] border-t-transparent" />
      </div>
    );
  }

  const trendingTags = ["#react", "#rust", "#web3", "#nextjs", "#indiehackers", "#ai"];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-blue-500/30 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05)_0,transparent_50%)] blur-[80px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_50%)] blur-[80px]" />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 flex justify-center h-full overflow-y-auto no-scrollbar relative z-10 lg:pl-[72px] xl:pr-[340px]">
        <div className="w-full max-w-[680px] flex flex-col pt-8 pb-24 mx-auto px-4">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <Telescope className="w-8 h-8 text-blue-400" />
              Discover
            </h1>
            <p className="text-[#A8A8A8] text-[15px]">Find new builders, projects, and discussions.</p>
          </motion.div>

          {/* Trending Tags Section */}
          <section className="mb-10">
            <h2 className="text-[16px] font-bold text-white mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" /> Trending Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, i) => (
                <motion.button 
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl text-[13px] font-medium text-white transition-all flex items-center gap-1.5"
                >
                  <Hash className="w-3.5 h-3.5 text-white/40" />
                  {tag.replace('#', '')}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Recommended Builders Mock */}
          <section className="mb-10">
            <h2 className="text-[16px] font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" /> Builders to Follow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=builder${i}`} className="w-10 h-10 rounded-full bg-white/10" alt="Avatar" />
                    <div>
                      <p className="text-[14px] font-bold text-white">Builder {i}</p>
                      <p className="text-[12px] text-[#A8A8A8]">Full Stack Developer</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-white text-black text-[12px] font-bold rounded-full hover:bg-gray-200 transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Posts */}
          <section>
            <h2 className="text-[16px] font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Popular Discussions
            </h2>
            <div className="space-y-4">
              {trendingPosts.length === 0 ? (
                <div className="text-center py-10 text-white/40 text-sm">No trending posts right now.</div>
              ) : (
                trendingPosts.map((post) => (
                  <div key={post.id} className="bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-5 hover:border-white/[0.1] transition-all cursor-pointer">
                    <div className="flex items-center gap-2 text-[13px] mb-2">
                      <span className="font-bold text-white">{post.author_username}</span>
                      <span className="text-[#555]">·</span>
                      <span className="text-blue-400">{post.post_type}</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/90 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      <RightSidebar />
    </div>
  );
}
