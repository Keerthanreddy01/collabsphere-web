// Complete replacement for frontend/app/dashboard/home/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  LayoutDashboard,
  Telescope,
  MessageSquare,
  User,
  Pencil
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

  const theme = isCollab
    ? { text: 'text-[#00f2fe]', bg: 'bg-[#00f2fe]/10', border: 'border-[#00f2fe]/20', icon: Handshake, label: 'Collab' }
    : isMilestone
      ? { text: 'text-[#D4F842]', bg: 'bg-[#D4F842]/10', border: 'border-[#D4F842]/20', icon: Trophy, label: 'Milestone' }
      : { text: 'text-neutral-400', bg: 'bg-white/5', border: 'border-white/10', icon: Megaphone, label: 'Update' };

  return (
    <article
      ref={ref}
      className="group/post relative w-full mb-2 sm:mb-4 bg-[#0A0A0A] border border-white/[0.08] rounded-[12px] sm:rounded-2xl transition-all duration-300 ease-out hover:bg-[#121212] overflow-hidden"
    >
      {/* Optional Top Accent Line for special posts */}
      {(isCollab || isMilestone) && (
        <div className={`absolute top-0 left-0 right-0 h-[1px] ${theme.bg} blur-[1px]`} />
      )}

      <div className="p-[14px] sm:p-5">
        {/* ── Header Row ── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div className="relative shrink-0 w-[36px] h-[36px] sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-white/5 to-white/10 group-hover/post:from-[#D4F842]/40 group-hover/post:to-[#00f2fe]/40 transition-all duration-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img
                  src={post.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.uid}`}
                  alt={post.author_name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Author info & Badges */}
            <div className="flex flex-col min-w-0 justify-center flex-1">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 overflow-hidden w-full">
                <span className="font-semibold text-[14px] sm:font-bold sm:text-[14.5px] text-white hover:text-white transition-colors cursor-pointer leading-none truncate shrink-0 max-w-[140px] sm:max-w-none">
                  {post.author_name || "Builder"}
                </span>
                <span className="text-neutral-400 font-mono text-[12px] sm:text-[13px] leading-none truncate shrink min-w-0 max-w-[100px] sm:max-w-none">
                  @{post.author_username || "builder"}
                </span>
                <span className="text-neutral-500 text-[13px] mx-0.5 sm:mx-1 shrink-0 hidden sm:inline">·</span>
                <span className="text-[11px] sm:text-[12px] text-neutral-400 font-mono leading-none hover:underline cursor-pointer shrink-0 whitespace-nowrap ml-auto sm:ml-0">{timeAgo(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {/* Clean inline post type badge */}
                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${theme.text} ${theme.bg}`}>
                  <theme.icon className="w-2.5 h-2.5" />
                  {theme.label}
                </div>

                {post.project && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded-md">
                    <Sparkles className="w-2.5 h-2.5" />
                    {post.project}
                  </span>
                )}
                {post.visibility === 'collabs' && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                    <Lock className="w-2.5 h-2.5" />
                    Collabs Only
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* More Menu */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer bg-transparent border-none">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* ── Main Content ── */}
        <div className="ml-13 mb-3">
          <div className={`text-[14px] sm:text-[15px] leading-[1.6] sm:leading-relaxed text-white whitespace-pre-wrap break-words ${!isExpanded ? 'line-clamp-3 sm:line-clamp-none' : ''}`}>
            {renderContentWithHashtags(displayContent)}
          </div>
          {isTruncated && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[#1d9bf0] hover:underline mt-1 text-[14px] bg-transparent border-none outline-none cursor-pointer p-0 inline-block"
            >
              Show more
            </button>
          )}

          {/* ── Tech Stack Tags ── */}
          {Array.isArray(post.stack_tags) && post.stack_tags.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 pr-4 sm:pr-0">
              {post.stack_tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[11px] sm:text-[13px] px-2 py-0.5 sm:px-0 sm:py-0 bg-blue-500/10 sm:bg-transparent rounded-full sm:rounded-none text-[#1d9bf0] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Collab Apply Action Block ── */}
          {isCollab && (
            <div className="mt-4 flex items-center justify-between border border-white/[0.08] bg-white/[0.02] rounded-xl p-4 transition-all hover:bg-white/[0.04]">
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-white">Open to Collaborators</span>
                <span className="text-[13px] text-neutral-400 mt-0.5">The author is looking for team members.</span>
              </div>
              <button
                onClick={() => handleCollabClick(post)}
                className="px-5 py-2 rounded-full text-[13px] font-bold transition-all active:scale-95 bg-white text-black hover:bg-neutral-200 cursor-pointer border-none"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* ── Actions Dock ── */}
        <div className="flex items-center justify-between ml-0 sm:ml-13 mr-0 sm:mr-2 pt-3 pb-1">
          {/* Comment */}
          <button
            onClick={handleFetchComments}
            className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-none p-1.5 rounded-full hover:bg-white/5 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            {post.comments_count > 0 && <span className="font-bold text-[12px] text-neutral-400 group-hover:text-white transition-colors">{post.comments_count}</span>}
          </button>

          {/* Boost */}
          <button className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-none p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors">
            <Rocket className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* Like (Zap) */}
          <ClickSpark sparkColor="#D4F842" sparkSize={4} sparkRadius={8} sparkCount={4} duration={300}>
            <button
              onClick={() => handleLikeClick(post.id)}
              className={`flex items-center gap-1.5 group cursor-pointer border-none p-1.5 rounded-full transition-colors ${isLiked ? 'bg-[#D4F842]/10' : 'bg-transparent hover:bg-white/5'}`}
            >
              <Zap className={`w-4 h-4 transition-colors ${isLiked ? 'text-[#D4F842]' : 'text-neutral-400 group-hover:text-[#D4F842]'}`} fill={isLiked ? "#D4F842" : "none"} />
              {likesCount > 0 && <span className={`font-bold text-[12px] transition-colors ${isLiked ? 'text-[#D4F842]' : 'text-neutral-400 group-hover:text-[#D4F842]'}`}>{likesCount}</span>}
            </button>
          </ClickSpark>

          {/* Views */}
          <button className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-none p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <Eye className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          {/* Bookmark */}
          <button className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-none p-1.5 rounded-full hover:bg-amber-500/10 transition-colors">
            <Bookmark className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 transition-colors" />
          </button>
        </div>

        {/* ── Comments Section ── */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col gap-3">
            <div className="flex items-center gap-2.5 bg-neutral-950/60 p-2.5 rounded-xl border border-white/5">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                alt=""
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10"
                referrerPolicy="no-referrer"
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
                      referrerPolicy="no-referrer"
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
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="flex justify-center min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden overflow-y-hidden selection:bg-blue-500/30 selection:text-white relative">
      <div className="flex w-full max-w-[1250px] h-screen relative overflow-x-hidden">
        <div className="hidden md:flex shrink-0">
          <LeftSidebar isSidebarOpen={false} setIsSidebarOpen={() => { }} />
        </div>

        <main
          className="flex-1 flex h-full overflow-hidden overflow-x-hidden relative z-10 bg-[#000000] min-w-0 text-[14px] leading-[1.4] sm:text-[15px] sm:leading-[1.5]"
          style={{
            fontFamily: 'var(--font-instrument), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Flat Dark Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#000000]"></div>

          <div className="flex w-full h-full relative z-10 justify-center">

            {/* COLUMN 1: FEED */}
            <div className="w-full md:w-[680px] md:max-w-[680px] flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative pt-0 pb-[80px] md:pb-32">

              {/* Premium Sticky Tab Selector with Glass Fade */}
              <div className="sticky top-0 z-40 flex justify-center w-full shrink-0 pt-[28px] sm:pt-[36px] pb-[8px] pointer-events-none mb-2">
                {/* Fade Overlay */}
                <div 
                  className="absolute inset-x-0 top-0 h-[140px] pointer-events-none bg-gradient-to-b from-[#000000] via-[#000000]/80 to-transparent"
                  style={{
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
                  }}
                />
                
                {/* Pill */}
                <div className="inline-flex items-center bg-[#111111] border border-[#222222] rounded-full p-1 gap-1 w-fit mx-auto pointer-events-auto shadow-lg relative z-10">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`relative rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 cursor-pointer border-none outline-none ${activeTab === 'all' ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'bg-transparent text-[#999999] hover:text-white'}`}
                  >
                    All Builds
                  </button>
                  <button
                    onClick={() => setActiveTab('collabs')}
                    className={`relative rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 cursor-pointer border-none outline-none ${activeTab === 'collabs' ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'bg-transparent text-[#999999] hover:text-white'}`}
                  >
                    Collab Board
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
                      btnText: 'Ship',
                      hint: 'Log a quick dev update'
                    };

                return (
                  <div className={`flex flex-col p-[12px] sm:p-4 relative shrink-0 transition-all duration-300 ease-out mx-0 sm:mx-4 mb-2 sm:mb-8 rounded-[24px] overflow-hidden border border-white/[0.08] ${isFocused ? 'bg-[#121212] border-white/[0.15] shadow-xl max-h-none' : 'bg-[#0a0a0a] max-h-[140px] sm:max-h-none'}`}>
                    {/* Removed ambient glow for cleaner aesthetic */}

                    {/* Top Controls: Post Type & Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">

                      <div className="flex items-center bg-neutral-950/80 p-1 rounded-xl border border-white/[0.06] shadow-inner">
                        <button
                          onClick={() => setSelectedPostType('update')}
                          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-[11.5px] rounded-lg transition-colors font-semibold cursor-pointer border-none bg-transparent ${selectedPostType === 'update' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                          {selectedPostType === 'update' && <motion.div layoutId="composerPostType" className="absolute inset-0 bg-neutral-700/60 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                          <span className="relative z-10 flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5" /> Update</span>
                        </button>
                        <button
                          onClick={() => setSelectedPostType('looking_for')}
                          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-[11.5px] rounded-lg transition-colors font-semibold cursor-pointer border-none bg-transparent ${selectedPostType === 'looking_for' ? 'text-[#00f2fe]' : 'text-neutral-400 hover:text-[#00f2fe]/70'}`}
                        >
                          {selectedPostType === 'looking_for' && <motion.div layoutId="composerPostType" className="absolute inset-0 bg-[#00f2fe]/15 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                          <span className="relative z-10 flex items-center gap-1.5"><Handshake className="w-3.5 h-3.5" /> Collab</span>
                        </button>
                        <button
                          onClick={() => setSelectedPostType('build_log')}
                          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-[11.5px] rounded-lg transition-colors font-semibold cursor-pointer border-none bg-transparent ${selectedPostType === 'build_log' ? 'text-[#D4F842]' : 'text-neutral-400 hover:text-[#D4F842]/70'}`}
                        >
                          {selectedPostType === 'build_log' && <motion.div layoutId="composerPostType" className="absolute inset-0 bg-[#D4F842]/15 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                          <span className="relative z-10 flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Milestone</span>
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
                    <div className="flex gap-2 sm:gap-3 items-start">
                      <img
                        src={avatarSrc}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <textarea
                          ref={textareaRef}
                          value={content}
                          onChange={handleInput}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder={
                            selectedPostType === 'looking_for'
                              ? "What roles, skills, or collaborators do you need?..."
                              : selectedPostType === 'build_log'
                                ? "What milestone did you unlock? (e.g. launched v1.0)..."
                                : "What are you shipping?"
                          }
                          className="w-full bg-transparent text-white text-[16px] sm:text-[17px] placeholder-neutral-400 outline-none resize-none pt-1 pb-1 border-none focus:ring-0 leading-relaxed font-sans transition-all"
                          style={{ minHeight: '40px' }}
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
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap mt-3 ml-0 sm:ml-13 pb-1 pr-4 sm:pr-0">
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
                          className="text-[11px] shrink-0 whitespace-nowrap font-mono bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3 ml-13">
                      {/* Left: Stack tags input + Media Buttons */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none" title="Attach Media">
                          <Image className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleRecording(); }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer border-none bg-transparent ${isRecording ? "text-red-500 bg-red-500/10" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
                          title="Record Voice"
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
                        </button>

                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>

                        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-neutral-300 font-mono text-[12px] focus-within:border-white/30 focus-within:bg-white/10 transition-all">
                          <span className="mr-1 opacity-50">#</span>
                          <input
                            type="text"
                            value={stackTags}
                            onChange={(e) => setStackTags(e.target.value)}
                            placeholder="stack"
                            className="w-[120px] bg-transparent border-none outline-none focus:ring-0 p-0 placeholder-neutral-500 text-white"
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
                                className={`fill-none transition-all duration-300 ${content.length > 250 ? 'stroke-red-500' : content.length > 200 ? 'stroke-amber-500' : 'stroke-[#1d9bf0]'
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
                          className={`relative group/submit rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[14px] transition-all active:scale-95 cursor-pointer border-none ml-auto ${(!content.trim() && !audioBlob) || isPosting
                            ? "bg-white/20 text-white/50 cursor-not-allowed pointer-events-none"
                            : theme.button
                            }`}
                        >
                          {isPosting ? "Posting..." : theme.btnText}
                          {/* Button Hover Glow */}
                          {!((!content.trim() && !audioBlob) || isPosting) && (
                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover/submit:opacity-20 blur-md transition-opacity duration-300 -z-10" />
                          )}
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
              <div className="flex flex-col pb-[80px] md:pb-24 px-3 sm:px-4 mt-0 pt-[12px] relative">
                {filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-neutral-600" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-white mb-1">No posts yet</h3>
                    <p className="text-[13px] text-neutral-600">Be the first to ship something today.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <PostCard post={post} user={user} handleLikeClick={handleLikeClick} handleCollabClick={handleCollabClick} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* COLUMN 2: RIGHT SIDEBAR */}
            <RightSidebar />

          </div>
        </main>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[rgba(0,0,0,0.95)] backdrop-blur-[20px] border-t border-[#1a1a1a] z-50 flex justify-around items-center px-2 pb-1">
          <button onClick={() => router.push('/dashboard/home')} className="flex flex-col items-center justify-center w-14 h-14 transition-colors cursor-pointer text-white bg-transparent border-none">
            <LayoutDashboard className="w-[22px] h-[22px] mb-1" />
            <span className="text-[10px] text-white">Home</span>
          </button>
          <button onClick={() => router.push('/explore')} className="flex flex-col items-center justify-center w-14 h-14 transition-colors cursor-pointer text-neutral-600 hover:text-white bg-transparent border-none group">
            <Telescope className="w-[22px] h-[22px] mb-1 group-hover:text-white" />
            <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">Explore</span>
          </button>
          <button onClick={() => router.push('/dashboard/home?compose=true')} className="flex flex-col items-center justify-center w-14 h-14 cursor-pointer transition-transform active:scale-95 border-none bg-transparent group">
            <div className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full mb-1 shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
              <Pencil className="w-[18px] h-[18px] fill-current" />
            </div>
            <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">Post</span>
          </button>
          <button onClick={() => router.push('/messages')} className="flex flex-col items-center justify-center w-14 h-14 transition-colors cursor-pointer text-neutral-600 hover:text-white bg-transparent border-none group">
            <MessageSquare className="w-[22px] h-[22px] mb-1 group-hover:text-white" />
            <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">Chat</span>
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center justify-center w-14 h-14 transition-colors cursor-pointer text-neutral-600 hover:text-white bg-transparent border-none group">
            <User className="w-[22px] h-[22px] mb-1 group-hover:text-white" />
            <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors">Profile</span>
          </button>
        </div>

        <Toaster theme="dark" position="bottom-right" richColors />
      </div>
    </div>
  );
}