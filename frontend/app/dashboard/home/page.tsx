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
  const isTruncated = post.content?.length > 250;
  const displayContent = isExpanded || !isTruncated ? post.content : post.content?.slice(0, 250) + "...";

  const timeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMins < 1) return "Now";
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h`;
      return `${Math.floor(diffHours / 24)}d`;
    } catch { return "1d"; }
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

  const postTypeBadge = post.post_type === 'looking_for'
    ? { badge: 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20', label: 'Collab' }
    : post.post_type === 'build_log'
    ? { badge: 'bg-[#D4F842]/10 text-[#D4F842] border-[#D4F842]/20', label: 'Milestone' }
    : { badge: 'bg-white/5 text-white/50 border-white/10', label: 'Update' };

  return (
    <article 
      ref={ref} 
      className="relative pl-12 pb-12 w-full max-w-[600px] mx-auto group text-left"
    >
      {/* Vertical Timeline Line */}
      <div className="absolute left-[15px] top-9 bottom-[-48px] w-[1px] bg-white/10 group-last:hidden" />

      {/* Timeline Node (Avatar) */}
      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-neutral-900 overflow-hidden border border-white/10 z-10 shadow-lg cursor-pointer hover:opacity-85 transition-opacity">
        <img src={post.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.uid}`} alt={post.author_name} className="w-full h-full object-cover" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col">
        {/* Header (Author + Badge + Time) */}
        <div className="flex items-center justify-between flex-wrap gap-y-1 mb-2">
          <div className="flex items-center gap-2 flex-wrap text-[14px]">
            <span className="font-bold text-white hover:underline cursor-pointer">
              {post.author_name || "Builder"}
            </span>
            <span className="text-neutral-500 font-mono text-[12px]">
              @{post.author_username || "builder"}
            </span>
            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${postTypeBadge.badge}`}>
              {postTypeBadge.label}
            </span>
            {post.project && (
              <span className="text-[9px] bg-purple-500/10 border border-purple-500/25 text-purple-300 font-mono px-2 py-0.5 rounded flex items-center gap-1 select-none">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                {post.project}
              </span>
            )}
            {post.visibility === 'collabs' && (
              <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded flex items-center gap-1 select-none" title="Collabs Only">
                <Lock className="w-2.5 h-2.5 text-amber-500" />
                Collabs
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-neutral-500">
            <span>{timeAgo(post.created_at)}</span>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Opportunity/Milestone Info Card if applicable */}
        {post.post_type === 'looking_for' && (
          <div className="bg-[#00f2fe]/5 border border-[#00f2fe]/10 rounded-xl p-3.5 mb-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#00f2fe] font-bold">🤝 COLLABORATION BOARD</span>
            <p className="text-[13px] text-neutral-300 leading-relaxed">
              Looking for team members and collaborators. Apply below to submit your interest.
            </p>
          </div>
        )}

        {post.post_type === 'build_log' && (
          <div className="bg-[#D4F842]/5 border border-[#D4F842]/10 rounded-xl p-3.5 mb-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#D4F842] font-bold">🏆 MILESTONE ACHIEVED</span>
            <p className="text-[13px] text-neutral-300 leading-relaxed">
              Project update logged! A new development phase has been reached and shipped.
            </p>
          </div>
        )}

        {/* Main Text Content */}
        <p className="text-[15px] leading-relaxed text-neutral-200 whitespace-pre-wrap break-words mb-3.5 px-0.5">
          {renderContentWithHashtags(displayContent)}
          {isTruncated && !isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="text-[#D4F842] hover:underline ml-1 font-medium bg-transparent border-none outline-none cursor-pointer">more</button>
          )}
        </p>

        {/* Tech Stack tags */}
        {Array.isArray(post.stack_tags) && post.stack_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3.5 px-0.5">
            {post.stack_tags.map((tag: string, idx: number) => (
              <span key={idx} className="text-[11px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded hover:border-[#D4F842]/40 hover:text-white transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Apply Collab CTA */}
        {post.post_type === 'looking_for' && (
          <div className="mb-3.5">
            <button 
              onClick={() => handleCollabClick(post)}
              className="w-full flex items-center justify-center gap-2 text-xs bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/25 hover:border-[#00f2fe]/50 py-2 rounded-lg font-bold tracking-wide transition-all cursor-pointer active:scale-[0.99]"
            >
              🤝 Apply to Collaborate
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center gap-6 text-neutral-500 text-[13px] pt-1">
          {/* Comment */}
          <button 
            onClick={handleFetchComments} 
            className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-105 transition-transform" />
            {post.comments_count > 0 && <span className="font-mono text-[12px]">{post.comments_count}</span>}
          </button>

          {/* Boost */}
          <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors group cursor-pointer">
            <Rocket className="w-4 h-4 group-hover:scale-105 transition-transform" />
          </button>

          {/* Spark (Like) */}
          <ClickSpark
            sparkColor='#D4F842'
            sparkSize={4}
            sparkRadius={8}
            sparkCount={4}
            duration={300}
          >
            <button 
              onClick={() => handleLikeClick(post.id)} 
              className={`flex items-center gap-1.5 hover:text-[#D4F842] transition-colors group cursor-pointer ${isLiked ? 'text-[#D4F842]' : ''}`}
            >
              <Zap className={`w-4 h-4 group-hover:scale-110 transition-transform ${isLiked ? 'scale-110' : ''}`} fill={isLiked ? "#D4F842" : "none"} />
              {likesCount > 0 && <span className="font-mono text-[12px]">{likesCount}</span>}
            </button>
          </ClickSpark>

          {/* Views */}
          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group cursor-pointer">
            <Eye className="w-4 h-4 group-hover:scale-105 transition-transform" />
          </button>

          {/* Bookmark */}
          <button className="flex items-center gap-1.5 hover:text-amber-500 transition-colors group cursor-pointer">
            <Bookmark className="w-4 h-4 group-hover:scale-105 transition-transform" />
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors group cursor-pointer">
            <Share2 className="w-4 h-4 group-hover:scale-105 transition-transform" />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-white/5 pt-3.5 flex flex-col gap-3">
            {/* Comment Input */}
            <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-white/5">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Add feedback..."
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-neutral-600 focus:ring-0 py-0.5"
              />
              <button
                onClick={submitComment}
                disabled={!newComment.trim() || isCommenting}
                className="bg-[#D4F842] text-black hover:bg-[#c5ec2d] disabled:opacity-50 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer border-none"
              >
                Reply
              </button>
            </div>

            {/* Render Comments */}
            {comments.length > 0 && (
              <div className="flex flex-col gap-3 mt-2 pl-3 border-l border-white/5">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 items-start text-[13px]">
                    <img src={comment.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.uid}`} alt="" className="w-5 h-5 rounded-full object-cover bg-neutral-800 flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                        <span className="font-bold text-white truncate">{comment.author_name}</span>
                        <span>@{comment.author_username}</span>
                        <span>·</span>
                        <span>{timeAgo(comment.created_at || new Date().toISOString())}</span>
                      </div>
                      <p className="text-neutral-300 mt-0.5 break-words leading-relaxed">{comment.content}</p>
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

              {/* Dynamic Island Morphing Composer */}
              {(() => {
                const theme = selectedPostType === 'looking_for'
                  ? {
                      accent: 'text-[#00f2fe]',
                      accentBg: 'bg-[#00f2fe]/10',
                      border: 'border-[#00f2fe]/20 focus-within:border-[#00f2fe]/40',
                      shadow: 'focus-within:shadow-[0_0_35px_rgba(0,242,254,0.08)]',
                      glowGradient: 'from-cyan-500 via-blue-500 to-cyan-500',
                      avatarBorder: 'border-[#00f2fe]/30',
                      button: 'bg-[#00f2fe] hover:bg-[#00d8e4] text-black shadow-[0_0_15px_rgba(0,242,254,0.15)] font-bold',
                      btnText: 'Find Teammates',
                      hint: '🤝 Find co-builders, designers, or cofounders to join your project.'
                    }
                  : selectedPostType === 'build_log'
                  ? {
                      accent: 'text-[#D4F842]',
                      accentBg: 'bg-[#D4F842]/10',
                      border: 'border-[#D4F842]/20 focus-within:border-[#D4F842]/40',
                      shadow: 'focus-within:shadow-[0_0_35px_rgba(212,248,66,0.08)]',
                      glowGradient: 'from-[#D4F842] via-emerald-500 to-[#D4F842]',
                      avatarBorder: 'border-[#D4F842]/30',
                      button: 'bg-[#D4F842] hover:bg-[#c5ec2d] text-black shadow-[0_0_15px_rgba(212,248,66,0.15)] font-bold',
                      btnText: 'Log Milestone',
                      hint: '🏆 Document a major project launch, beta release, or user milestone.'
                    }
                  : {
                      accent: 'text-purple-400',
                      accentBg: 'bg-purple-500/10',
                      border: 'border-purple-500/20 focus-within:border-purple-500/40',
                      shadow: 'focus-within:shadow-[0_0_35px_rgba(168,85,247,0.08)]',
                      glowGradient: 'from-purple-500 via-pink-500 to-purple-500',
                      avatarBorder: 'border-purple-500/30',
                      button: 'bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold',
                      btnText: 'Ship Update',
                      hint: '📢 Log a quick dev update about features you are currently coding.'
                    };

                return (
                  <div className="border-b border-white/[0.04] p-4 bg-[#000000] flex justify-center pb-8 pt-6 relative shrink-0">
                    
                    <div className={`group relative w-full max-w-[620px] bg-neutral-950/40 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-500 ${theme.border} ${theme.shadow}`}>
                      
                      {/* Ambient Glowing Background Halos */}
                      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${theme.glowGradient} opacity-[0.08] blur-[2px] -z-10 transition-all duration-700 group-focus-within:opacity-25`} />
                      <div className={`absolute -inset-[12px] rounded-2xl bg-gradient-to-r ${theme.glowGradient} opacity-[0.02] blur-[20px] -z-20 transition-all duration-700 group-focus-within:opacity-10`} />

                      {/* Top Gradient Active Lightbar Line */}
                      <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-60 blur-[1px] transition-all duration-500 ${theme.accent}`} />

                      {/* Controls Header: Segmented tabs & Dropdowns */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/5 w-fit">
                          <button
                            onClick={() => setSelectedPostType('update')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-medium cursor-pointer bg-transparent border-none ${
                              selectedPostType === 'update'
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25 font-bold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                                : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                            }`}
                          >
                            <Megaphone className={`w-3.5 h-3.5 ${selectedPostType === 'update' ? 'text-purple-400' : ''}`} />
                            Update
                          </button>
                          <button
                            onClick={() => setSelectedPostType('looking_for')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-medium cursor-pointer bg-transparent border-none ${
                              selectedPostType === 'looking_for'
                                ? 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/25 font-bold shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                                : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                            }`}
                          >
                            <Handshake className={`w-3.5 h-3.5 ${selectedPostType === 'looking_for' ? 'text-[#00f2fe]' : ''}`} />
                            Collab
                          </button>
                          <button
                            onClick={() => setSelectedPostType('build_log')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-medium cursor-pointer bg-transparent border-none ${
                              selectedPostType === 'build_log'
                                ? 'bg-[#D4F842]/15 text-[#D4F842] border border-[#D4F842]/25 font-bold shadow-[0_0_12px_rgba(212,248,66,0.15)]'
                                : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                            }`}
                          >
                            <Trophy className={`w-3.5 h-3.5 ${selectedPostType === 'build_log' ? 'text-[#D4F842]' : ''}`} />
                            Milestone
                          </button>
                        </div>

                        {/* Metadata Dropdowns */}
                        <div className="flex items-center gap-2">
                          {/* Visibility Dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowVisibilityMenu(!showVisibilityMenu); setShowProjectMenu(false); }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/[0.04] text-[11px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer font-medium"
                            >
                              {postVisibility === 'public' ? (
                                <Globe className="w-3 h-3 text-[#D4F842]" />
                              ) : (
                                <Lock className="w-3 h-3 text-amber-500" />
                              )}
                              <span>{postVisibility === 'public' ? 'Public' : 'Collabs Only'}</span>
                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                            </button>
                            {showVisibilityMenu && (
                              <div className="absolute top-full right-0 mt-1 w-36 bg-neutral-950 border border-white/10 rounded-lg p-1 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                                <button
                                  onClick={() => { setPostVisibility('public'); setShowVisibilityMenu(false); }}
                                  className="w-full text-left px-2.5 py-2 text-[11px] rounded-md hover:bg-white/5 transition-colors flex items-center gap-2 text-neutral-300 hover:text-white bg-transparent border-none"
                                >
                                  <Globe className="w-3 h-3 text-[#D4F842]" />
                                  Public Feed
                                </button>
                                <button
                                  onClick={() => { setPostVisibility('collabs'); setShowVisibilityMenu(false); }}
                                  className="w-full text-left px-2.5 py-2 text-[11px] rounded-md hover:bg-white/5 transition-colors flex items-center gap-2 text-neutral-300 hover:text-white bg-transparent border-none"
                                >
                                  <Lock className="w-3 h-3 text-amber-500" />
                                  Collabs Only
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Project Dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowProjectMenu(!showProjectMenu); setShowVisibilityMenu(false); }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/[0.04] text-[11px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer font-medium"
                            >
                              <Sparkles className="w-3 h-3 text-purple-400" />
                              <span>{selectedProject ? selectedProject : 'No Project'}</span>
                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                            </button>
                            {showProjectMenu && (
                              <div className="absolute top-full right-0 mt-1 w-44 bg-neutral-950 border border-white/10 rounded-lg p-1 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                                <button
                                  onClick={() => { setSelectedProject(null); setShowProjectMenu(false); }}
                                  className="w-full text-left px-2.5 py-2 text-[11px] rounded-md hover:bg-white/5 transition-colors text-neutral-400 hover:text-white bg-transparent border-none"
                                >
                                  None (General Post)
                                </button>
                                <button
                                  onClick={() => { setSelectedProject('CollabSphere'); setShowProjectMenu(false); }}
                                  className="w-full text-left px-2.5 py-2 text-[11px] rounded-md hover:bg-white/5 transition-colors text-neutral-300 hover:text-white flex items-center gap-2 bg-transparent border-none"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  CollabSphere
                                </button>
                                <button
                                  onClick={() => { setSelectedProject('SaaS Dashboard'); setShowProjectMenu(false); }}
                                  className="w-full text-left px-2.5 py-2 text-[11px] rounded-md hover:bg-white/5 transition-colors text-neutral-300 hover:text-white flex items-center gap-2 bg-transparent border-none"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  SaaS Dashboard
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hint text explaining post types */}
                      <p className="text-[11px] text-neutral-500 transition-all duration-300 font-medium mb-3.5">
                        {theme.hint}
                      </p>

                      {/* Input Area */}
                      <div className="flex gap-3 items-start mt-2">
                        <div className="relative shrink-0 mt-0.5">
                          <img 
                            src={avatarSrc} 
                            alt="avatar" 
                            className={`w-9 h-9 rounded-full object-cover border transition-all duration-500 ${theme.avatarBorder}`} 
                          />
                          <div className={`absolute inset-0 rounded-full animate-ping opacity-15 pointer-events-none transition-all duration-500 ${theme.accentBg}`} />
                        </div>
                        <div className="flex-1">
                          <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleInput}
                            placeholder={
                              selectedPostType === 'looking_for'
                                ? "What roles, skills, or collaborators do you need? (e.g., UI Designer for a calendar app)..."
                                : selectedPostType === 'build_log'
                                ? "What project milestone did you unlock? (e.g., launched v1.0, crossed 500 waitlist)..."
                                : "What coding progress are you shipping today?..."
                            }
                            className="w-full bg-transparent text-white text-[15px] placeholder-neutral-600 outline-none resize-none pt-1.5 pb-1 border-none focus:ring-0 leading-relaxed font-sans"
                            style={{ minHeight: '60px' }}
                          />
                        </div>
                      </div>

                      {/* Voice Recording Waveform Indicator if recording */}
                      {isRecording && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl mt-3 animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                          <span className="text-[12px] font-mono text-red-400 font-bold shrink-0">RECORDING:</span>
                          <span className="text-[12px] font-mono text-red-500 font-bold shrink-0">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                          
                          {/* Animated pulsing audio wave */}
                          <div className="flex items-center gap-1.5 h-6 overflow-hidden flex-1 px-4">
                            {[...Array(16)].map((_, i) => {
                              const delay = `${i * 100}ms`;
                              return (
                                <span
                                  key={i}
                                  className="w-1 bg-red-500 rounded-full transition-all duration-150"
                                  style={{
                                    height: `${Math.floor(Math.random() * 16) + 4}px`,
                                    animation: `bounce 0.8s ease-in-out infinite alternate`,
                                    animationDelay: delay
                                  }}
                                />
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => { toggleRecording(); }}
                            className="px-2 py-0.5 rounded bg-red-500 text-black hover:bg-red-400 transition-colors cursor-pointer text-[10px] font-bold font-mono border-none"
                          >
                            Done
                          </button>
                        </div>
                      )}

                      {/* Voice Recording attached preview block */}
                      {audioBlob && (
                        <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-white/10 px-4 py-2.5 rounded-xl mt-3">
                          <div className="flex items-center gap-2.5">
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
                              className="w-8 h-8 rounded-full bg-[#D4F842] text-black flex items-center justify-center hover:bg-[#c5ec2d] transition-colors cursor-pointer border-none"
                            >
                              {isPlayingAudio ? <Pause className="w-4 h-4 fill-black text-black" /> : <Play className="w-4 h-4 fill-black text-black ml-0.5" />}
                            </button>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-neutral-300">Voice devlog attached</span>
                              <span className="text-[9px] font-mono text-neutral-500">audio/webm</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => { setAudioBlob(null); setIsPlayingAudio(false); }}
                            className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all cursor-pointer border-none"
                            title="Delete audio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <audio
                            ref={audioPreviewRef}
                            src={audioBlob ? URL.createObjectURL(audioBlob) : ""}
                            onEnded={() => setIsPlayingAudio(false)}
                            className="hidden"
                          />
                        </div>
                      )}

                      {/* Tag Suggestion Row */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-4 mb-1 px-1">
                        <span className="text-[10px] text-neutral-500 font-mono select-none">Quick tags:</span>
                        {['nextjs', 'react', 'tailwind', 'typescript', 'ai', 'firebase'].map((tag) => (
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
                            className="text-[10px] font-mono bg-neutral-900 hover:bg-neutral-800 border border-white/[0.03] text-neutral-400 hover:text-white px-2 py-0.5 rounded transition-all cursor-pointer hover:border-white/10"
                          >
                            +{tag}
                          </button>
                        ))}
                      </div>

                      {/* Bottom row: Tech stack & Ship It */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                        {/* Tags Input */}
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 focus-within:border-white/20 transition-all font-mono">
                          <span className="text-neutral-500 text-[12px] mr-1">#</span>
                          <input
                            type="text"
                            value={stackTags}
                            onChange={(e) => setStackTags(e.target.value)}
                            placeholder="tech stack (e.g. react next)"
                            className="w-[140px] sm:w-[180px] text-[12px] text-white placeholder-neutral-700 bg-transparent border-none outline-none focus:ring-0 p-0"
                          />
                        </div>

                        {/* Actions & Submit */}
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none" title="Attach Image">
                            <Image className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleRecording(); }}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer border-none bg-transparent ${isRecording ? "text-red-500" : "text-neutral-400 hover:text-white hover:bg-white/5 bg-transparent"}`}
                            title="Voice devlog"
                          >
                            <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
                          </button>
                          
                          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                          
                          {/* Character Count Progress Ring */}
                          {content.length > 0 && (
                            <div className="flex items-center gap-1.5 mr-1 select-none">
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {content.length}
                              </span>
                              <svg className="w-3.5 h-3.5 transform -rotate-90">
                                <circle
                                  cx="7"
                                  cy="7"
                                  r="5"
                                  className="stroke-neutral-800 fill-none"
                                  strokeWidth="1.2"
                                />
                                <circle
                                  cx="7"
                                  cy="7"
                                  r="5"
                                  className={`fill-none transition-all duration-300 ${
                                    content.length > 250
                                      ? 'stroke-red-500'
                                      : content.length > 200
                                      ? 'stroke-amber-500'
                                      : 'stroke-[#D4F842]'
                                  }`}
                                  strokeWidth="1.2"
                                  strokeDasharray={`${2 * Math.PI * 5}`}
                                  strokeDashoffset={`${2 * Math.PI * 5 * (1 - Math.min(content.length, 280) / 280)}`}
                                />
                              </svg>
                            </div>
                          )}

                          <button
                            onClick={submitPost}
                            disabled={(!content.trim() && !audioBlob) || isPosting}
                            className={`rounded-full px-5 py-2 text-[13px] font-bold transition-all active:scale-95 cursor-pointer border-none ${
                              (!content.trim() && !audioBlob) || isPosting
                                ? "bg-neutral-900 text-neutral-600 cursor-not-allowed pointer-events-none"
                                : theme.button
                            }`}
                          >
                            {isPosting ? "..." : theme.btnText}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Error / Status floating below */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {micError && (
                        <div className="text-red-400 text-[12px] bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-md">{micError}</div>
                      )}
                    </div>
                  </div>             
                );
              })()}

              {/* Feed Posts */}
              <div className="flex flex-col bg-[#000000] pb-24 px-6 pt-8 relative">
                {filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="w-12 h-12 text-[#71767b] mb-4" />
                    <h3 className="text-[16px] font-bold text-white mb-1">No posts yet</h3>
                    <p className="text-[13px] text-[#71767b]">When people post, you&apos;ll see them here.</p>
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