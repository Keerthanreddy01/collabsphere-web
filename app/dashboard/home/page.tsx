"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Image as ImageIcon, Video, Mic, MapPin, Heart, MessageCircle } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost } from "@/lib/posts";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";

type FeedTabKey = "recents" | "friends" | "popular";

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<FeedTabKey>("recents");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [composerContent, setComposerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth redirect
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Real-time posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });
    return () => unsubscribe();
  }, []);

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

  const handlePostSubmit = async () => {
    if (!user || !composerContent.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const newPostData = {
      uid: user.uid,
      author_name: user.displayName || user.email?.split('@')[0] || "Builder",
      author_email: user.email || "",
      author_avatar: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      author_username: user.email?.split('@')[0] || "builder",
      content: composerContent.trim(),
      stack_tags: [],
      post_type: 'update',
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

    setPosts((prev) => [optimisticPost, ...prev]);
    setComposerContent("");

    const { error } = await createPost(newPostData);
    if (error) {
      console.error("Failed to create post:", error);
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
    }
    setIsSubmitting(false);
  };

  const handleLikeClick = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likes.includes(user.uid);
    const newLikes = isLiked
      ? likes.filter((id: string) => id !== user.uid)
      : [...likes, user.uid];

    // Optimistic update
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: newLikes } : p));

    const { error } = await likePost(postId, user.uid);
    if (error) {
      console.error("Failed to like post:", error);
      // Revert on error
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes } : p));
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F4F6F8] text-[#121315] font-sans overflow-hidden">
      
      {/* 1. Left Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 2. Main Feed Content */}
      <main className="flex-1 flex justify-center h-full overflow-y-auto no-scrollbar relative z-10 px-4 sm:px-6 lg:pl-[240px]">
        <div className="w-full max-w-[700px] flex flex-col pt-6 pb-32">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-between mb-6 bg-white/60 p-3 rounded-2xl backdrop-blur-md border border-white">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-full shadow-sm">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="font-black text-lg">collabsphere</span>
            <div className="w-8 h-8 rounded-full bg-black/10" />
          </div>

          {/* Top Header Row */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-0 bg-[#F4F6F8]/90 backdrop-blur-md py-4 z-20">
            <h1 className="text-[28px] font-black tracking-tight text-black">Feeds</h1>
            <div className="flex items-center gap-6">
              {[
                { key: "recents", label: "Recents" },
                { key: "friends", label: "Friends" },
                { key: "popular", label: "Popular" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as FeedTabKey)}
                  className={`text-[13px] font-black transition-colors ${activeTab === tab.key ? "text-black" : "text-gray-400 hover:text-black/70"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* Posts Feed */}
          <div className="space-y-6 flex flex-col pb-20">
            {posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No posts yet. Be the first to share something!</div>
            ) : (
              posts.map((post) => {
                const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
                const isLiked = Array.isArray(post.likes) && post.likes.includes(user.uid);

                return (
                  <article key={post.id} className="bg-white/80 backdrop-blur-sm border border-white rounded-[32px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"} 
                          alt={post.author_name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                        />
                        <div className="flex flex-col leading-tight">
                          <span className="text-[14px] font-bold text-[#0F172A]">{post.author_name}</span>
                          <span className="text-[11px] font-medium text-[#64748B]">{timeAgo(post.created_at)}</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F6F8] text-[#64748B] transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-[14px] font-medium text-[#334155] mb-5 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6 text-[12px] font-bold text-[#64748B]">
                        <span className="flex items-center gap-2">
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> 
                          {post.views || 0}
                        </span>
                        <button 
                          onClick={() => handleLikeClick(post.id)}
                          className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-[#FF3366]' : 'hover:text-[#FF3366]'}`}
                        >
                          <Heart className="w-[18px] h-[18px]" fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} /> 
                          {likesCount} Like{likesCount !== 1 ? 's' : ''}
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#0F172A] transition-colors">
                          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} /> 
                          Comment
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Sticky Composer at Bottom */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[650px] px-4 z-50 pointer-events-none lg:ml-[120px] xl:ml-[0]">
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[32px] p-2 flex items-center justify-between shadow-[0_12px_40px_rgba(15,23,42,0.12)] pointer-events-auto transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
                <img 
                  src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shrink-0 shadow-sm" 
                />
                <input 
                  type="text"
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePostSubmit();
                  }}
                  placeholder="Share something with your network..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-[14px] font-semibold text-[#0F172A] placeholder-[#94A3B8] outline-none"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0 pr-1">
                <button className="p-2.5 text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#F4F6F8] rounded-full transition-colors">
                  <ImageIcon className="w-[18px] h-[18px]" />
                </button>
                <button className="p-2.5 text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#F4F6F8] rounded-full transition-colors">
                  <Video className="w-[18px] h-[18px]" />
                </button>
                <button className="p-2.5 text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#F4F6F8] rounded-full transition-colors hidden sm:block">
                  <Mic className="w-[18px] h-[18px]" />
                </button>
                <button 
                  onClick={handlePostSubmit}
                  disabled={!composerContent.trim() || isSubmitting}
                  className="ml-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#6366F1] hover:to-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[13px] px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Right Sidebar */}
      <RightSidebar />
      
    </div>
  );
}