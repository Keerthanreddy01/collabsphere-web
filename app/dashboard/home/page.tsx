"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, ImageIcon, Video, Mic, MapPin, 
  Heart, MessageCircle, Share, Search, BadgeCheck 
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost, computePostScore, addComment, getComments } from "@/lib/posts";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { usePostViewTracker } from "@/hooks/usePostViewTracker";

type FeedTabKey = "recents" | "friends" | "popular";
type PostType = "all" | "looking_for" | "showcase" | "help_needed" | "discussion";

// Available Tags for Filter
const POPULAR_TAGS = ["All", "React", "Python", "Firebase", "Open Source", "Hiring", "Showcase"];

const POST_TYPE_BADGES: Record<string, { label: string, color: string, icon: string }> = {
  "looking_for": { label: "Looking For", color: "bg-purple-100 text-purple-600 border-purple-200", icon: "🔍" },
  "showcase": { label: "Showcase", color: "bg-blue-100 text-blue-600 border-blue-200", icon: "🚀" },
  "help_needed": { label: "Help Needed", color: "bg-red-100 text-red-600 border-red-200", icon: "🆘" },
  "discussion": { label: "Discussion", color: "bg-green-100 text-green-600 border-green-200", icon: "💬" }
};

// Extracted PostCard to use the hook per item
function PostCard({ post, user, handleLikeClick }: { post: any, user: any, handleLikeClick: (id: string) => void }) {
  const ref = usePostViewTracker(post.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const isLiked = Array.isArray(post.likes) && post.likes.includes(user.uid);
  const isTruncated = post.content?.length > 150;
  const displayContent = isExpanded || !isTruncated ? post.content : post.content?.slice(0, 150) + "...";
  const postBadge = POST_TYPE_BADGES[post.post_type];

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch { return "Recently"; }
  };

  const handleFetchComments = async () => {
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0) {
        const { data } = await getComments(post.id);
        if (data) setComments(data);
      }
    } else {
      setShowComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    setIsCommenting(true);
    const commentData = {
      uid: user.uid,
      author_name: user.displayName || "Builder",
      author_avatar: user.photoURL || "",
      author_username: user.email?.split('@')[0] || "builder",
      content: newComment.trim(),
    };
    
    // Optimistic
    setComments(prev => [...prev, { ...commentData, id: Date.now().toString() }]);
    setNewComment("");

    await addComment(post.id, commentData);
    setIsCommenting(false);
  };

  return (
    <article ref={ref} className="bg-white/80 backdrop-blur-sm border border-white rounded-[32px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-bold text-[#0F172A]">{post.author_name}</span>
              {post.author_username && <BadgeCheck className="w-3.5 h-3.5 text-[#06B6D4]" fill="currentColor" stroke="white" />}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
              <span>@{post.author_username}</span>
              <span>•</span>
              <span>{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F6F8] text-[#64748B] transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {postBadge && (
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${postBadge.color}`}>
            {postBadge.icon} {postBadge.label}
          </span>
        </div>
      )}

      <p className="text-[14px] font-medium text-[#334155] mb-2 whitespace-pre-wrap leading-relaxed">
        {displayContent}
      </p>
      
      {isTruncated && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#6366F1] text-[12px] font-bold hover:underline mb-3">
          {isExpanded ? "Show less" : "See more"}
        </button>
      )}

      {post.stack_tags && post.stack_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
          {post.stack_tags.map((tag: string, idx: number) => (
            <span key={idx} className="bg-[#F4F6F8] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-[12px] font-bold text-[#64748B]">
          <span className="flex items-center gap-2">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> 
            {post.views_count || 0}
          </span>
          <button onClick={() => handleLikeClick(post.id)} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-[#FF3366]' : 'hover:text-[#FF3366]'}`}>
            <Heart className={`w-[18px] h-[18px] ${isLiked ? 'scale-110' : ''} transition-transform`} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} /> 
            {likesCount} Like{likesCount !== 1 ? 's' : ''}
          </button>
          <button onClick={handleFetchComments} className={`flex items-center gap-2 transition-colors ${showComments ? 'text-[#6366F1]' : 'hover:text-[#0F172A]'}`}>
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} /> 
            {post.comments_count || 0} Comment{(post.comments_count || 0) !== 1 ? 's' : ''}
          </button>
        </div>
        <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <Share className="w-[16px] h-[16px]" />
        </button>
      </div>

      {/* Inline Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100/50 flex flex-col gap-3 animate-in slide-in-from-top-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <img src={comment.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"} alt="" className="w-6 h-6 rounded-full mt-0.5 object-cover" />
                <div className="bg-[#F8FAFC] rounded-2xl rounded-tl-sm px-3 py-2 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[12px] font-bold text-[#0F172A]">{comment.author_name}</span>
                  </div>
                  <p className="text-[12px] text-[#334155]">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-gray-400 py-2">No comments yet. Be the first!</p>
          )}
          
          <div className="flex gap-2 mt-2 items-center">
            <img src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"} alt="" className="w-7 h-7 rounded-full object-cover shadow-sm" />
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Write a comment..." 
              className="flex-1 bg-[#F1F5F9] rounded-full px-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>
        </div>
      )}
    </article>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<FeedTabKey>("recents");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedType, setSelectedType] = useState<PostType>("all");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // Mock state for friends tab
  
  const [composerContent, setComposerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Fetch real-time posts (limit to 50 for popular tab scoring)
  useEffect(() => {
    // In a real app, this should be paginated. For this algorithm requirement, we fetch top 50 recent.
    let q = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(50));
    
    // Applying type filter server-side if possible, else we filter client side
    if (selectedType !== "all") {
      q = query(collection(db, "posts"), where("post_type", "==", selectedType), orderBy("created_at", "desc"), limit(50));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });
    return () => unsubscribe();
  }, [selectedType]); // Refetch when type filter changes

  // Client-side filtering and sorting based on Tabs and Tags
  const processedFeed = useMemo(() => {
    let result = [...posts];

    // 1. Tag Filter (Array Contains Simulation if not queried on server)
    if (selectedTag !== "All") {
      result = result.filter(p => Array.isArray(p.stack_tags) && p.stack_tags.includes(selectedTag));
    }

    // 2. Tab Routing
    if (activeTab === "recents") {
      // Already sorted by created_at desc from Firestore
    } else if (activeTab === "friends") {
      result = result.filter(p => following.includes(p.uid));
    } else if (activeTab === "popular") {
      // Popular Tab Scoring Algorithm
      result.sort((a, b) => computePostScore(b) - computePostScore(a));
    }

    return result;
  }, [posts, activeTab, selectedTag, following]);

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
      stack_tags: ["React"], // Default tag for now
      post_type: 'discussion', // Default type
    };
    
    const tempId = `temp-${Date.now()}`;
    setPosts(prev => [{ id: tempId, ...newPostData, likes: [], comments_count: 0, views_count: 0, created_at: new Date().toISOString() }, ...prev]);
    setComposerContent("");
    
    await createPost(newPostData as any);
    setIsSubmitting(false);
  };

  const handleLikeClick = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likes.includes(user.uid);
    const newLikes = isLiked ? likes.filter((id: string) => id !== user.uid) : [...likes, user.uid];
    
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    await likePost(postId, user.uid);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFC]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAFC] text-[#0F172A] font-sans overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 flex justify-center h-full overflow-y-auto no-scrollbar relative z-10 px-4 sm:px-6 lg:pl-[280px]">
        <div className="w-full max-w-[720px] flex flex-col pt-6 pb-32">
          
          <header className="flex flex-col gap-4 mb-6 sticky top-0 bg-[#FAFAFC]/95 backdrop-blur-md py-4 z-30 shadow-[0_4px_30px_rgba(250,250,252,1)]">
            <div className="flex items-center justify-between">
              <h1 className="text-[28px] font-black tracking-tight">Feeds</h1>
              <div className="flex bg-[#F1F5F9] p-1 rounded-full border border-white">
                {[
                  { key: "recents", label: "Recents" },
                  { key: "friends", label: "Friends" },
                  { key: "popular", label: "Popular" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as FeedTabKey)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${activeTab === tab.key ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Type Filter Row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[{ key: "all", label: "All Types", icon: "" }, ...Object.entries(POST_TYPE_BADGES).map(([k, v]) => ({ key: k, label: v.label, icon: v.icon }))].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key as PostType)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${selectedType === type.key ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-gray-200 hover:border-gray-300"}`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>

            {/* Tag Filter Row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`shrink-0 px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${selectedTag === tag ? "bg-[#6366F1]/10 text-[#6366F1]" : "text-[#94A3B8] hover:text-[#64748B] hover:bg-gray-100"}`}
                >
                  {tag === "All" ? tag : `#${tag}`}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-5 flex flex-col pb-20">
            {processedFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#94A3B8]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">
                  {activeTab === 'friends' ? "Follow some builders to see their updates" : 
                   selectedTag !== 'All' ? `No posts with #${selectedTag} yet` : 
                   "Be the first to post something! 🚀"}
                </h3>
                <p className="text-[13px] text-[#64748B]">Check back later or adjust your filters.</p>
              </div>
            ) : (
              processedFeed.map((post) => (
                <PostCard key={post.id} post={post} user={user} handleLikeClick={handleLikeClick} />
              ))
            )}
          </div>

          {/* Composer */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[650px] px-4 z-50 pointer-events-none lg:ml-[140px] xl:ml-[0]">
            <div className="bg-white/90 backdrop-blur-2xl border border-white rounded-[32px] p-2.5 flex items-center justify-between shadow-[0_16px_40px_rgba(15,23,42,0.15)] pointer-events-auto">
              <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
                <img src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"} alt="Avatar" className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm" />
                <input 
                  type="text"
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostSubmit()}
                  placeholder="Share something with your network..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-[14px] font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 text-[#94A3B8] hover:text-[#6366F1] transition-colors"><ImageIcon className="w-[18px] h-[18px]" /></button>
                <button className="p-2 text-[#94A3B8] hover:text-[#6366F1] transition-colors"><Video className="w-[18px] h-[18px]" /></button>
                <button onClick={handlePostSubmit} disabled={!composerContent.trim() || isSubmitting} className="ml-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-white font-bold text-[13px] px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}