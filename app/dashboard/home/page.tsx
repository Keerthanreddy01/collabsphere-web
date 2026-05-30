"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Search,
  PlusSquare,
  Smile,
  BadgeCheck
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost, addComment, getComments } from "@/lib/posts";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { usePostViewTracker } from "@/hooks/usePostViewTracker";

// Mock Stories Data
const MOCK_STORIES = [
  { username: "keerthan_reddy", avatar: "https://i.pravatar.cc/150?img=11", hasUnseen: true },
  { username: "v_naa", avatar: "https://i.pravatar.cc/150?img=12", hasUnseen: true },
  { username: "nagavaram_vrishin", avatar: "https://i.pravatar.cc/150?img=13", hasUnseen: false },
  { username: "skinny.blxct", avatar: "https://i.pravatar.cc/150?img=14", hasUnseen: true },
  { username: "l_ram_dayakar", avatar: "https://i.pravatar.cc/150?img=15", hasUnseen: false },
];

function PostCard({ post, user, handleLikeClick }: { post: any, user: any, handleLikeClick: (id: string) => void }) {
  const ref = usePostViewTracker(post.id);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const isLiked = Array.isArray(post.likes) && post.likes.includes(user.uid);
  const isTruncated = post.content?.length > 100;
  const displayContent = isExpanded || !isTruncated ? post.content : post.content?.slice(0, 100) + "...";

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return `${Math.floor(diffHours / 24)}d`;
    } catch { return "1w"; }
  };

  const handleFetchComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      const { data } = await getComments(post.id);
      if (data) setComments(data);
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
    setComments(prev => [...prev, { ...commentData, id: Date.now().toString() }]);
    setNewComment("");
    await addComment(post.id, commentData);
    setIsCommenting(false);
  };

  return (
    <article ref={ref} className="bg-black border-b border-[#262626] sm:border sm:rounded-[4px] sm:mb-4 pb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
            <img src={post.author_avatar} alt={post.author_name} className="w-full h-full rounded-full object-cover border-2 border-black" />
          </div>
          <div className="flex items-center gap-1.5 text-[14px]">
            <span className="font-semibold text-white hover:text-[#A8A8A8] cursor-pointer">{post.author_username}</span>
            {post.author_username && <BadgeCheck className="w-3.5 h-3.5 text-[#0095F6]" fill="currentColor" stroke="black" />}
            <span className="text-[#A8A8A8]">•</span>
            <span className="text-[#A8A8A8]">{timeAgo(post.created_at)}</span>
          </div>
        </div>
        <button className="text-white hover:text-[#A8A8A8]">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="w-full px-3 pt-2 pb-3">
        <p className="text-[15px] leading-relaxed text-white whitespace-pre-wrap break-words">
          {displayContent}
        </p>
        {isTruncated && !isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="text-[#A8A8A8] text-[14px] font-medium mt-1 hover:text-white">more</button>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between px-3 pb-2 border-t border-[#262626] pt-3">
        <div className="flex items-center gap-6">
          <button onClick={() => handleLikeClick(post.id)} className={`transition-colors flex items-center gap-2 text-[14px] font-semibold hover:opacity-70 ${isLiked ? 'text-[#FF3040]' : 'text-white'}`}>
            <Heart className={`w-[22px] h-[22px] ${isLiked ? 'scale-110' : ''} transition-transform`} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
            {likesCount > 0 && likesCount}
          </button>
          <button onClick={handleFetchComments} className="text-white hover:opacity-70 flex items-center gap-2 text-[14px] font-semibold">
            <MessageCircle className="w-[22px] h-[22px]" strokeWidth={2} style={{ transform: 'scaleX(-1)' }} />
            {post.comments_count > 0 && post.comments_count}
          </button>
          <button className="text-white hover:opacity-70">
            <Send className="w-[22px] h-[22px]" strokeWidth={2} />
          </button>
        </div>
        <button className="text-white hover:opacity-70">
          <Bookmark className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>
      </div>

      {/* Comments Preview */}
      {(post.comments_count > 0 || comments.length > 0) && (
        <button onClick={handleFetchComments} className="px-3 text-[14px] text-[#A8A8A8] mt-1 hover:text-white">
          View all {post.comments_count || comments.length} comments
        </button>
      )}

      {/* Inline Add Comment */}
      <div className="px-3 mt-2 flex items-center justify-between border-t border-[#262626] pt-2">
        <div className="flex items-center gap-3 w-full">
          <Smile className="w-5 h-5 text-white" strokeWidth={2} />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-none text-[14px] text-white placeholder-[#A8A8A8] focus:outline-none focus:ring-0"
          />
        </div>
        <button 
          onClick={submitComment}
          disabled={!newComment.trim() || isCommenting}
          className="text-[#0095F6] font-semibold text-[14px] disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </article>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });
    return () => unsubscribe();
  }, []);

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
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#0095F6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar isSidebarOpen={false} setIsSidebarOpen={() => {}} />

      {/* Main Feed Area */}
      <main className="flex-1 flex justify-center h-full overflow-y-auto no-scrollbar relative z-10 lg:pl-[72px] xl:pr-[320px]">
        <div className="w-full max-w-[470px] flex flex-col pt-8 pb-32 mx-auto">

          {/* Stories Reel Mock */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 px-2 sm:px-0">
            {MOCK_STORIES.map((story, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer">
                <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${story.hasUnseen ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600' : 'bg-[#262626]'}`}>
                  <div className="w-full h-full bg-black rounded-full p-[2px]">
                    <img src={story.avatar} alt={story.username} className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <span className="text-[12px] text-[#A8A8A8] truncate w-[66px] text-center">{story.username}</span>
              </div>
            ))}
          </div>

          {/* Feed Posts */}
          <div className="flex flex-col gap-2 sm:gap-4">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-[#262626] mb-4" />
                <h3 className="text-[16px] font-bold text-white mb-1">No posts yet</h3>
                <p className="text-[13px] text-[#A8A8A8]">When people post, you'll see them here.</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} user={user} handleLikeClick={handleLikeClick} />
              ))
            )}
          </div>

        </div>
      </main>

      <RightSidebar />
    </div>
  );
}