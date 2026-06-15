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
  Share2
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
          <div className="flex items-center gap-2 text-[14px]">
            <span className="font-bold text-white hover:underline cursor-pointer">
              {post.author_name || "Builder"}
            </span>
            <span className="text-neutral-500 font-mono text-[12px]">
              @{post.author_username || "builder"}
            </span>
            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${postTypeBadge.badge}`}>
              {postTypeBadge.label}
            </span>
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    });
    
    setIsPosting(false);
    if (!result.error) {
      setContent("");
      setStackTags("");
      setAudioBlob(null);
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
                const hasContent = content.trim().length > 0 || stackTags.trim().length > 0 || isRecording || audioBlob !== null;
                return (
                  <div className="border-b border-[#2f3336]/30 p-4 bg-[#000000] flex justify-center pb-8 pt-6 relative shrink-0">
                    
                    <div className="relative w-full max-w-[620px] bg-neutral-900/40 border border-white/5 rounded-2xl p-4 transition-all duration-300 focus-within:border-white/10 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                      {/* Post Type Selector - Segmented Control */}
                      <div className="flex bg-neutral-950 p-1 rounded-xl mb-3 border border-white/5 w-fit">
                        <button
                          onClick={() => setSelectedPostType('update')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium ${
                            selectedPostType === 'update'
                              ? 'bg-white/10 text-white font-bold'
                              : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          📢 Update
                        </button>
                        <button
                          onClick={() => setSelectedPostType('looking_for')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium ${
                            selectedPostType === 'looking_for'
                              ? 'bg-[#00f2fe]/10 text-[#00f2fe] font-bold'
                              : 'text-neutral-400 hover:text-[#00f2fe]/80'
                          }`}
                        >
                          🤝 Collab
                        </button>
                        <button
                          onClick={() => setSelectedPostType('build_log')}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium ${
                            selectedPostType === 'build_log'
                              ? 'bg-[#D4F842]/10 text-[#D4F842] font-bold'
                              : 'text-neutral-400 hover:text-[#D4F842]/80'
                          }`}
                        >
                          🏆 Milestone
                        </button>
                      </div>

                      {/* Input Area */}
                      <div className="flex gap-3">
                        <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/5" />
                        <div className="flex-1">
                          <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleInput}
                            placeholder={
                              selectedPostType === 'looking_for'
                                ? "What skills or teammates are you looking for? (e.g. Need a frontend dev for a Figma plugin)..."
                                : selectedPostType === 'build_log'
                                ? "What major milestone did you hit? (e.g. hit 1k users, shipped beta)..."
                                : "What are you shipping today?..."
                            }
                            className="w-full bg-transparent text-white text-[15px] placeholder-neutral-600 outline-none resize-none pt-1 pb-1 border-none focus:ring-0 leading-relaxed font-normal min-h-[60px]"
                          />
                        </div>
                      </div>

                      {/* Bottom row: Tech stack & Ship It */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                        {/* Tags Input */}
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-lg px-2.5 py-1 focus-within:border-white/20 transition-all">
                          <span className="text-neutral-500 text-[12px] mr-1">#</span>
                          <input
                            type="text"
                            value={stackTags}
                            onChange={(e) => setStackTags(e.target.value)}
                            placeholder="tech stack (e.g. react nextjs)"
                            className="w-[150px] sm:w-[220px] text-[12px] text-white placeholder-neutral-700 bg-transparent border-none outline-none focus:ring-0 p-0"
                          />
                        </div>

                        {/* Actions & Submit */}
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer" title="Attach Image">
                            <Image className="w-4 h-4" />
                          </button>
                          <button
                            onClick={submitPost}
                            disabled={(!content.trim() && !audioBlob) || isPosting}
                            className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all active:scale-95 cursor-pointer ${
                              (!content.trim() && !audioBlob) || isPosting
                                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border-none"
                                : "bg-[#D4F842] text-black hover:bg-[#c5ec2d] shadow-[0_0_20px_rgba(212,248,66,0.1)] border-none"
                            }`}
                          >
                            {isPosting ? "..." : "Ship Update"}
                          </button>
                        </div>
                    </div>
                  </div>

                    {/* Error / Status floating below */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {micError && (
                        <div className="text-red-400 text-[12px] bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-md">{micError}</div>
                      )}
                      {isRecording && (
                        <div className="text-red-500 text-[12px] font-bold flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </div>
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
                    <p className="text-[13px] text-[#71767b]">When people post, you'll see them here.</p>
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