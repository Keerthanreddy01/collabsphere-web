// Complete replacement for frontend/app/dashboard/home/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Zap,
  MessageCircle,
  Rocket,
  Eye,
  Bookmark,
  Search,
  Smile,
  Image,
  Mic,
  X,
  Lock,
  Flag,
  Calendar,
  MapPin,
  Share2,
  Megaphone,
  Handshake,
  Trophy,
  Globe,
  ChevronDown,
  Trash2,
  Play,
  Pause,
  Sparkles
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost, addComment, getComments } from "@/lib/posts";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { usePostViewTracker } from "@/hooks/usePostViewTracker";
import ClickSpark from "@/components/ClickSpark";
import { Toaster, toast } from "sonner";

// Helper to render post content text and color hashtags lime green
const renderContentWithHashtags = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-[#D4F842] hover:underline cursor-pointer font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
};

function PostCard({ 
  post, 
  user, 
  handleLikeClick, 
  handleCollabClick 
}: { 
  post: any, 
  user: any, 
  handleLikeClick: (id: string) => void, 
  handleCollabClick: (post: any) => void 
}) {
  const ref = usePostViewTracker(post.id);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const isLiked = Array.isArray(post.likes) && post.likes.includes(user.uid);
  const isTruncated = post.content?.length > 280;
  const displayContent = isExpanded || !isTruncated ? post.content : post.content?.slice(0, 280) + "…";

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch { return "1d ago"; }
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
      author_avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      author_username: user.email?.split('@')[0] || "builder",
      content: newComment.trim(),
    };
    setComments(prev => [...prev, { ...commentData, id: Date.now().toString() }]);
    setNewComment("");
    await addComment(post.id, commentData);
    setIsCommenting(false);
  };

  const isCollab = post.post_type === 'looking_for';
  const isMilestone = post.post_type === 'build_log';

  const cardAccent = isCollab
    ? { border: 'border-[#00f2fe]/10 hover:border-[#00f2fe]/25', glow: 'hover:shadow-[0_0_30px_rgba(0,242,254,0.04)]', dot: 'bg-[#00f2fe]', badgeBg: 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20', label: 'Collab' }
    : isMilestone
    ? { border: 'border-[#D4F842]/10 hover:border-[#D4F842]/25', glow: 'hover:shadow-[0_0_30px_rgba(212,248,66,0.04)]', dot: 'bg-[#D4F842]', badgeBg: 'bg-[#D4F842]/10 text-[#D4F842] border-[#D4F842]/20', label: 'Milestone' }
    : { border: 'border-white/[0.06] hover:border-white/[0.10]', glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.04)]', dot: 'bg-purple-400', badgeBg: 'bg-white/5 text-white/50 border-white/10', label: 'Update' };

  return (
    <article
      ref={ref}
      className={`group relative w-full mb-3 rounded-2xl border bg-[#0a0a0a] transition-all duration-300 cursor-default ${cardAccent.border} ${cardAccent.glow}`}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      {/* Subtle left accent bar */}
      {(isCollab || isMilestone) && (
        <div className={`absolute left-0 top-4 bottom-4 w-[2px] rounded-full ${cardAccent.dot} opacity-60`} />
      )}

      <div className="p-5 pl-6">
        {/* ── Header Row ── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with subtle ring */}
            <div className={`relative shrink-0 w-9 h-9 rounded-full overflow-hidden border ${isCollab ? 'border-[#00f2fe]/20' : isMilestone ? 'border-[#D4F842]/20' : 'border-white/10'}`}>
              <img
                src={post.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.uid}`}
                alt={post.author_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Author info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[14px] text-white hover:text-[#D4F842] transition-colors cursor-pointer leading-none">
                  {post.author_name || "Builder"}
                </span>
                <span className="text-neutral-500 font-mono text-[11px] leading-none">
                  @{post.author_username || "builder"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {/* Post type pill */}
                <span className={`inline-flex items-center text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${cardAccent.badgeBg}`}>
                  {cardAccent.label}
                </span>
                {post.project && (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2 h-2" />
                    {post.project}
                  </span>
                )}
                {post.visibility === 'collabs' && (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded-full">
                    <Lock className="w-2 h-2" />
                    Collabs Only
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timestamp + menu */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-neutral-600 font-mono">{timeAgo(post.created_at)}</span>
            <button className="w-6 h-6 flex items-center justify-center rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer bg-transparent border-none">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Collab / Milestone Banner ── */}
        {isCollab && (
          <div className="mb-3 flex items-center gap-2.5 bg-[#00f2fe]/[0.04] border border-[#00f2fe]/10 rounded-xl px-3.5 py-2.5">
            <Handshake className="w-3.5 h-3.5 text-[#00f2fe] shrink-0" />
            <span className="text-[11px] font-semibold text-[#00f2fe]/80 tracking-wide">Open to collaborators · Apply below</span>
          </div>
        )}
        {isMilestone && (
          <div className="mb-3 flex items-center gap-2.5 bg-[#D4F842]/[0.04] border border-[#D4F842]/10 rounded-xl px-3.5 py-2.5">
            <Trophy className="w-3.5 h-3.5 text-[#D4F842] shrink-0" />
            <span className="text-[11px] font-semibold text-[#D4F842]/80 tracking-wide">Milestone shipped</span>
          </div>
        )}

        {/* ── Main Content ── */}
        <p className="text-[14.5px] leading-[1.65] text-neutral-200 whitespace-pre-wrap break-words mb-3.5">
          {renderContentWithHashtags(displayContent)}
          {isTruncated && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[#D4F842] hover:text-[#c5ec2d] ml-1.5 text-[13px] font-medium bg-transparent border-none outline-none cursor-pointer"
            >
              Show more
            </button>
          )}
        </p>

        {/* ── Tech Stack Tags ── */}
        {Array.isArray(post.stack_tags) && post.stack_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.stack_tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-[#D4F842]/40 hover:text-white transition-all px-2 py-0.5 rounded-md cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Collab Apply Button ── */}
        {isCollab && (
          <button
            onClick={() => handleCollabClick(post)}
            className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold tracking-wide cursor-pointer border transition-all active:scale-[0.99] bg-[#00f2fe]/8 hover:bg-[#00f2fe]/15 text-[#00f2fe] border-[#00f2fe]/15 hover:border-[#00f2fe]/35"
          >
            <Handshake className="w-3.5 h-3.5" />
            Request to Collaborate
          </button>
        )}

        {/* ── Actions Bar ── */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-1">
            {/* Comment */}
            <button
              onClick={handleFetchComments}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all text-[12px] font-medium cursor-pointer bg-transparent border-none"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comments_count > 0 && <span className="font-mono text-[11px]">{post.comments_count}</span>}
            </button>

            {/* Boost */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all text-[12px] font-medium cursor-pointer bg-transparent border-none">
              <Rocket className="w-3.5 h-3.5" />
            </button>

            {/* Like (Zap) */}
            <ClickSpark sparkColor="#D4F842" sparkSize={4} sparkRadius={8} sparkCount={4} duration={300}>
              <button
                onClick={() => handleLikeClick(post.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-[12px] font-medium cursor-pointer bg-transparent border-none ${
                  isLiked
                    ? 'text-[#D4F842] bg-[#D4F842]/10'
                    : 'text-neutral-500 hover:text-[#D4F842] hover:bg-[#D4F842]/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5" fill={isLiked ? "#D4F842" : "none"} />
                {likesCount > 0 && <span className="font-mono text-[11px]">{likesCount}</span>}
              </button>
            </ClickSpark>

            {/* Views */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all text-[12px] font-medium cursor-pointer bg-transparent border-none">
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-600 hover:text-amber-400 hover:bg-amber-400/10 transition-all cursor-pointer bg-transparent border-none">
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            {/* Share */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-600 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all cursor-pointer bg-transparent border-none">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Comments Section ── */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col gap-3">
            <div className="flex items-center gap-2.5 bg-neutral-950/60 p-2.5 rounded-xl border border-white/5">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                alt=""
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10"
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Share your thoughts..."
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-neutral-600 focus:ring-0"
              />
              <button
                onClick={submitComment}
                disabled={!newComment.trim() || isCommenting}
                className="bg-[#D4F842] text-black hover:bg-[#c5ec2d] disabled:opacity-40 rounded-lg px-3 py-1 text-[11px] font-bold transition-all cursor-pointer border-none shrink-0"
              >
                Reply
              </button>
            </div>

            {comments.length > 0 && (
              <div className="flex flex-col gap-3 pl-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    <img
                      src={comment.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.uid}`}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover bg-neutral-800 flex-shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0 bg-neutral-900/60 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-[12px] text-white">{comment.author_name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">@{comment.author_username}</span>
                        <span className="text-[10px] text-neutral-600">·</span>
                        <span className="text-[10px] text-neutral-600">{timeAgo(comment.created_at || new Date().toISOString())}</span>
                      </div>
                      <p className="text-[13px] text-neutral-300 break-words leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [content, setContent] = useState("");
  const [stackTags, setStackTags] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'collabs'>('all');
  const [selectedPostType, setSelectedPostType] = useState<'update' | 'looking_for' | 'build_log'>('update');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const [postVisibility, setPostVisibility] = useState<'public' | 'collabs'>('public');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowVisibilityMenu(false);
      setShowProjectMenu(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const handleCollabClick = (post: any) => {
    toast.success(`Collab request sent to @${post.author_username}!`, {
      description: `They will receive your request for "${post.content.slice(0, 30)}..."`,
    });
  };

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(post => post.post_type === 'looking_for');

  // Support opening compose modal via query parameter (?compose=true)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("compose=true")) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      router.replace("/dashboard/home");
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const qPosts = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(50));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });
    return () => unsubscribePosts();
  }, [user]);

  const toggleRecording = async () => {
    setMicError(null);
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setAudioBlob(null);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } catch (err: any) {
        setMicError('Could not access microphone.');
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const submitPost = async () => {
    const trimmed = content.trim();
    if (!trimmed || isPosting || !user) return;
    setIsPosting(true);
    const tags = stackTags
      .split(" ")
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);
      
    const result = await createPost({
      uid: user.uid,
      author_name: user.displayName || "Builder",
      author_avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      author_username: user.email?.split("@")[0] || "builder",
      content: trimmed,
      stack_tags: tags,
      post_type: selectedPostType,
      visibility: postVisibility,
      project: selectedProject,
    });
    
    setIsPosting(false);
    if (!result.error) {
      setContent("");
      setStackTags("");
      setAudioBlob(null);
      setPostVisibility('public');
      setSelectedProject(null);
    }
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
      <div 
        className="flex min-h-screen items-center justify-center"
        style={{
          background: "radial-gradient(ellipse at top-left, #0f0c29 0%, #17113f 40%, #08051a 100%)"
        }}
      >
        <div 
          className="w-8 h-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{
            borderColor: "#6366f1",
            borderTopColor: "transparent"
          }}
        />
      </div>
    );
  }

  const avatarSrc = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;

  return (
    <div className="flex justify-center min-h-screen bg-[#000000] text-white font-sans overflow-hidden selection:bg-blue-500/30 selection:text-white relative">
      <div className="flex w-full max-w-[1250px] h-screen relative">
        <LeftSidebar isSidebarOpen={false} setIsSidebarOpen={() => { }} />

        <main 
          className="flex-1 flex h-full overflow-hidden relative z-10 bg-[#000000] min-w-0"
          style={{ 
            fontFamily: 'var(--font-instrument), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: "15px",
            lineHeight: "1.5"
          }}
        >
          {/* Constrained layout matching X's 3-column style */}
          <div className="flex w-full h-full bg-[#000000] relative z-10">
            
            {/* COLUMN 1: FEED (max-width 600px, borders left/right) */}
            <div className="w-full md:w-[600px] md:min-w-[600px] flex-1 border-r border-[#2f3336] border-l border-[#2f3336] flex flex-col h-full overflow-y-auto no-scrollbar bg-[#000000]">
              
              {/* Sticky Header with Custom Tabs */}
              <div 
                className="sticky top-0 z-40 flex flex-col w-full shrink-0"
                style={{
                  background: "rgba(0, 0, 0, 0.72)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="flex h-[53px] items-center">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="flex-1 h-full flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <span className={`text-[15px] font-bold transition-colors ${activeTab === 'all' ? 'text-[#D4F842]' : 'text-[#71767b]'}`}>All Builds</span>
                    {activeTab === 'all' && (
                      <div className="absolute bottom-0 w-[64px] h-[3px] bg-[#D4F842] rounded-full shadow-[0_0_10px_rgba(212,248,66,0.5)]" />
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('collabs')}
                    className="flex-1 h-full flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <span className={`text-[15px] font-bold transition-colors ${activeTab === 'collabs' ? 'text-[#D4F842]' : 'text-[#71767b]'}`}>Collab Board</span>
                    {activeTab === 'collabs' && (
                      <div className="absolute bottom-0 w-[72px] h-[3px] bg-[#D4F842] rounded-full shadow-[0_0_10px_rgba(212,248,66,0.5)]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Premium Minimal Composer */}
              {(() => {
                const theme = selectedPostType === 'looking_for'
                  ? {
                      accent: 'text-[#00f2fe]',
                      button: 'bg-[#00f2fe] hover:bg-[#00d8e4] text-black font-bold',
                      btnText: 'Find Teammates',
                      hint: 'Find co-builders, designers, or cofounders'
                    }
                  : selectedPostType === 'build_log'
                  ? {
                      accent: 'text-[#D4F842]',
                      button: 'bg-[#D4F842] hover:bg-[#c5ec2d] text-black font-bold',
                      btnText: 'Log Milestone',
                      hint: 'Document a major project launch or milestone'
                    }
                  : {
                      accent: 'text-white',
                      button: 'bg-white hover:bg-neutral-200 text-black font-bold',
                      btnText: 'Ship Update',
                      hint: 'Log a quick dev update'
                    };

                return (
                  <div className="border-b border-white/[0.06] bg-[#000000] flex flex-col pt-4 pb-3 px-4 relative shrink-0">
                    
                    {/* Top Controls: Post Type & Metadata */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center bg-neutral-900/50 p-1 rounded-lg border border-white/[0.04]">
                        <button
                          onClick={() => setSelectedPostType('update')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md transition-all duration-200 font-semibold cursor-pointer border-none ${
                            selectedPostType === 'update'
                              ? 'bg-neutral-700/50 text-white shadow-sm'
                              : 'text-neutral-500 hover:text-neutral-300 bg-transparent'
                          }`}
                        >
                          <Megaphone className="w-3 h-3" /> Update
                        </button>
                        <button
                          onClick={() => setSelectedPostType('looking_for')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md transition-all duration-200 font-semibold cursor-pointer border-none ${
                            selectedPostType === 'looking_for'
                              ? 'bg-[#00f2fe]/10 text-[#00f2fe]'
                              : 'text-neutral-500 hover:text-[#00f2fe]/70 bg-transparent'
                          }`}
                        >
                          <Handshake className="w-3 h-3" /> Collab
                        </button>
                        <button
                          onClick={() => setSelectedPostType('build_log')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md transition-all duration-200 font-semibold cursor-pointer border-none ${
                            selectedPostType === 'build_log'
                              ? 'bg-[#D4F842]/10 text-[#D4F842]'
                              : 'text-neutral-500 hover:text-[#D4F842]/70 bg-transparent'
                          }`}
                        >
                          <Trophy className="w-3 h-3" /> Milestone
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Visibility Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowVisibilityMenu(!showVisibilityMenu); setShowProjectMenu(false); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-[11px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer font-medium border-none bg-transparent"
                          >
                            {postVisibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            <span>{postVisibility === 'public' ? 'Public' : 'Collabs'}</span>
                            <ChevronDown className="w-2.5 h-2.5 opacity-50" />
                          </button>
                          {showVisibilityMenu && (
                            <div className="absolute top-full right-0 mt-1 w-36 bg-[#0a0a0a] border border-white/10 rounded-xl p-1 z-50 shadow-xl">
                              <button
                                onClick={() => { setPostVisibility('public'); setShowVisibilityMenu(false); }}
                                className="w-full text-left px-2.5 py-2 text-[11px] rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-neutral-300 hover:text-white bg-transparent border-none cursor-pointer"
                              >
                                <Globe className="w-3 h-3" /> Public Feed
                              </button>
                              <button
                                onClick={() => { setPostVisibility('collabs'); setShowVisibilityMenu(false); }}
                                className="w-full text-left px-2.5 py-2 text-[11px] rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-neutral-300 hover:text-white bg-transparent border-none cursor-pointer"
                              >
                                <Lock className="w-3 h-3 text-amber-500" /> Collabs Only
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Project Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowProjectMenu(!showProjectMenu); setShowVisibilityMenu(false); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-[11px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer font-medium border-none bg-transparent"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>{selectedProject ? selectedProject : 'No Project'}</span>
                            <ChevronDown className="w-2.5 h-2.5 opacity-50" />
                          </button>
                          {showProjectMenu && (
                            <div className="absolute top-full right-0 mt-1 w-44 bg-[#0a0a0a] border border-white/10 rounded-xl p-1 z-50 shadow-xl">
                              <button
                                onClick={() => { setSelectedProject(null); setShowProjectMenu(false); }}
                                className="w-full text-left px-2.5 py-2 text-[11px] rounded-lg hover:bg-white/5 transition-colors text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer"
                              >
                                None (General Post)
                              </button>
                              <button
                                onClick={() => { setSelectedProject('CollabSphere'); setShowProjectMenu(false); }}
                                className="w-full text-left px-2.5 py-2 text-[11px] rounded-lg hover:bg-white/5 transition-colors text-neutral-300 hover:text-white flex items-center gap-2 bg-transparent border-none cursor-pointer"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                CollabSphere
                              </button>
                              <button
                                onClick={() => { setSelectedProject('SaaS Dashboard'); setShowProjectMenu(false); }}
                                className="w-full text-left px-2.5 py-2 text-[11px] rounded-lg hover:bg-white/5 transition-colors text-neutral-300 hover:text-white flex items-center gap-2 bg-transparent border-none cursor-pointer"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                SaaS Dashboard
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-3 items-start">
                      <img 
                        src={avatarSrc} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10" 
                      />
                      <div className="flex-1 min-w-0">
                        <textarea
                          ref={textareaRef}
                          value={content}
                          onChange={handleInput}
                          placeholder={
                            selectedPostType === 'looking_for'
                              ? "What roles, skills, or collaborators do you need?..."
                              : selectedPostType === 'build_log'
                              ? "What milestone did you unlock? (e.g. launched v1.0)..."
                              : "What coding progress are you shipping today?..."
                          }
                          className="w-full bg-transparent text-white text-[15px] placeholder-neutral-600 outline-none resize-none pt-1.5 pb-1 border-none focus:ring-0 leading-relaxed font-sans"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                    </div>

                    {/* Voice Recording / Audio Preview Blocks */}
                    {isRecording && (
                      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl mt-2 ml-13">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <span className="text-[12px] font-mono text-red-500 font-bold shrink-0">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </span>
                        
                        <div className="flex items-center gap-1 h-4 overflow-hidden flex-1 px-4">
                          {[...Array(16)].map((_, i) => (
                            <span
                              key={i}
                              className="w-[2px] bg-red-500 rounded-full transition-all duration-150"
                              style={{
                                height: `${Math.floor(Math.random() * 10) + 4}px`,
                                animation: `bounce 0.8s ease-in-out infinite alternate`,
                                animationDelay: `${i * 100}ms`
                              }}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleRecording()}
                          className="px-3 py-1 rounded-lg bg-red-500 text-black hover:bg-red-400 transition-colors cursor-pointer text-[11px] font-bold border-none"
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {audioBlob && (
                      <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-white/10 px-3 py-2 rounded-xl mt-2 ml-13">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (audioPreviewRef.current) {
                                if (isPlayingAudio) {
                                  audioPreviewRef.current.pause();
                                  setIsPlayingAudio(false);
                                } else {
                                  audioPreviewRef.current.play();
                                  setIsPlayingAudio(true);
                                }
                              }
                            }}
                            className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer border-none"
                          >
                            {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                          </button>
                          <span className="text-[12px] font-medium text-neutral-300">Voice devlog attached</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setAudioBlob(null); setIsPlayingAudio(false); }}
                          className="w-7 h-7 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all cursor-pointer border-none bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <audio ref={audioPreviewRef} src={URL.createObjectURL(audioBlob)} onEnded={() => setIsPlayingAudio(false)} className="hidden" />
                      </div>
                    )}

                    {/* Tags Quick Suggestions */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 ml-13">
                      {['nextjs', 'react', 'tailwind', 'typescript', 'ai'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const trimmedStack = stackTags.trim();
                            const words = trimmedStack.split(/\s+/).filter(Boolean);
                            if (!words.includes(tag)) {
                              setStackTags(trimmedStack ? `${trimmedStack} ${tag}` : tag);
                            }
                          }}
                          className="text-[11px] font-mono bg-transparent text-[#1d9bf0] hover:bg-[#1d9bf0]/10 px-2 py-0.5 rounded-full transition-all cursor-pointer border-none"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between mt-3 ml-13">
                      {/* Left: Stack tags input + Media Buttons */}
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1d9bf0]/10 text-[#1d9bf0] transition-colors cursor-pointer bg-transparent border-none" title="Attach Media">
                          <Image className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleRecording(); }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer border-none bg-transparent ${isRecording ? "text-red-500 bg-red-500/10" : "text-[#1d9bf0] hover:bg-[#1d9bf0]/10"}`}
                          title="Record Voice"
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
                        </button>
                        
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        
                        <div className="flex items-center text-neutral-400 font-mono text-[13px]">
                          <span className="mr-0.5 opacity-50">#</span>
                          <input
                            type="text"
                            value={stackTags}
                            onChange={(e) => setStackTags(e.target.value)}
                            placeholder="stack"
                            className="w-[120px] bg-transparent border-none outline-none focus:ring-0 p-0 placeholder-neutral-600 text-[#1d9bf0]"
                          />
                        </div>
                      </div>

                      {/* Right: Submit Button */}
                      <div className="flex items-center gap-3">
                        {/* Character Count Progress Ring */}
                        {content.length > 0 && (
                          <div className="flex items-center justify-center w-6 h-6 select-none relative">
                            <svg className="w-5 h-5 transform -rotate-90">
                              <circle cx="10" cy="10" r="8" className="stroke-neutral-800 fill-none" strokeWidth="2" />
                              <circle
                                cx="10" cy="10" r="8"
                                className={`fill-none transition-all duration-300 ${
                                  content.length > 250 ? 'stroke-red-500' : content.length > 200 ? 'stroke-amber-500' : 'stroke-[#1d9bf0]'
                                }`}
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 8}`}
                                strokeDashoffset={`${2 * Math.PI * 8 * (1 - Math.min(content.length, 280) / 280)}`}
                              />
                            </svg>
                          </div>
                        )}

                        <button
                          onClick={submitPost}
                          disabled={(!content.trim() && !audioBlob) || isPosting}
                          className={`rounded-full px-5 py-2 text-[14px] transition-all active:scale-95 cursor-pointer border-none ${
                            (!content.trim() && !audioBlob) || isPosting
                              ? "bg-white/20 text-white/50 cursor-not-allowed pointer-events-none"
                              : theme.button
                          }`}
                        >
                          {isPosting ? "Posting..." : theme.btnText}
                        </button>
                      </div>
                    </div>

                    {/* Mic Error */}
                    {micError && (
                      <div className="absolute top-2 right-4 text-red-400 text-[12px] bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
                        {micError}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Feed Posts */}
              <div className="flex flex-col gap-2 bg-[#000000] pb-24 px-4 pt-4 relative">
                {filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-neutral-600" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-white mb-1">No posts yet</h3>
                    <p className="text-[13px] text-neutral-600">Be the first to ship something today.</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} user={user} handleLikeClick={handleLikeClick} handleCollabClick={handleCollabClick} />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: RIGHT SIDEBAR */}
            <RightSidebar />

          </div>
        </main>
        <Toaster theme="dark" position="bottom-right" richColors />
      </div>
    </div>
  );
}