// Complete replacement for frontend/app/dashboard/home/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat,
  BarChart3,
  Bookmark,
  Upload,
  Search,
  Smile,
  Image,
  Mic,
  X,
  Lock,
  Flag,
  Calendar,
  MapPin,
  BarChart4
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost, addComment, getComments } from "@/lib/posts";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { usePostViewTracker } from "@/hooks/usePostViewTracker";
import ClickSpark from "@/components/ClickSpark";

// Helper to render post content text and color hashtags Twitter blue (Change 6)
const renderContentWithHashtags = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-[#1d9bf0] hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return part;
  });
};

function PostCard({ post, user, handleLikeClick }: { post: any, user: any, handleLikeClick: (id: string) => void }) {
  const ref = usePostViewTracker(post.id);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const isLiked = Array.isArray(post.likes) && post.likes.includes(user.uid);
  const isTruncated = post.content?.length > 150;
  const displayContent = isExpanded || !isTruncated ? post.content : post.content?.slice(0, 150) + "...";

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

  return (
    <article 
      ref={ref} 
      className="w-full border-b border-[#2f3336] p-4 bg-[#000000] hover:bg-white/[0.01] transition-colors overflow-hidden"
    >
      <div className="flex gap-3">
        {/* Avatar left (40px) */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity">
            <img src={post.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.uid}`} alt={post.author_name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content right */}
        <div className="flex-1 min-w-0">
          {/* Header - Username bold white, @handle and timestamp gray */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[15px] flex-wrap">
              <span className="font-bold text-white hover:underline cursor-pointer truncate">
                {post.author_name || "Builder"}
              </span>
              <span className="text-[#71767b] truncate">
                @{post.author_username || "builder"}
              </span>
              <span className="text-[#71767b]">·</span>
              <span className="text-[#71767b] whitespace-nowrap hover:underline cursor-pointer">
                {timeAgo(post.created_at)}
              </span>
            </div>
            <button className="text-[#71767b] hover:text-[#1d9bf0] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Post Text - 15px font size, hashtags in Twitter blue */}
          <p className="text-[15px] leading-normal text-white/95 whitespace-pre-wrap break-words mt-1 mb-2">
            {renderContentWithHashtags(displayContent)}
            {isTruncated && !isExpanded && (
              <button onClick={() => setIsExpanded(true)} className="text-[#1d9bf0] hover:text-[#1a8cd8] ml-1 font-medium bg-transparent border-none outline-none cursor-pointer">more</button>
            )}
          </p>

          {/* Tech stack tags - blue hashtags */}
          {Array.isArray(post.stack_tags) && post.stack_tags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-[14px]">
              {post.stack_tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-[#1d9bf0] hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions Bar - comment, repost, like hover (X Style) */}
          <div className="flex items-center justify-between mt-3 max-w-md text-[#71767b]">
            {/* Comment */}
            <button 
              onClick={handleFetchComments} 
              className="flex items-center gap-1.5 action-hover-comment transition-colors group bg-transparent border-none outline-none cursor-pointer text-[#71767b]"
            >
              <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              {post.comments_count > 0 && (
                <span className="text-[13px]">{post.comments_count}</span>
              )}
            </button>

            {/* Repost */}
            <button className="flex items-center gap-1.5 action-hover-repost transition-colors group bg-transparent border-none outline-none cursor-pointer text-[#71767b]">
              <div className="p-2 group-hover:bg-emerald-500/10 rounded-full transition-colors">
                <Repeat className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>

            {/* Like */}
            <ClickSpark
              sparkColor='#f91880'
              sparkSize={5}
              sparkRadius={10}
              sparkCount={5}
              duration={400}
            >
              <button 
                onClick={() => handleLikeClick(post.id)} 
                className={`flex items-center gap-1.5 action-hover-like transition-colors group bg-transparent border-none outline-none cursor-pointer ${isLiked ? 'text-[#f91880]' : 'text-[#71767b]'}`}
              >
                <div className={`p-2 transition-colors rounded-full ${isLiked ? 'bg-[#f91880]/10' : 'group-hover:bg-[#f91880]/10'}`}>
                  <Heart className={`w-[18px] h-[18px] ${isLiked ? 'scale-110' : ''} transition-transform`} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                </div>
                {likesCount > 0 && (
                  <span className="text-[13px]">{likesCount}</span>
                )}
              </button>
            </ClickSpark>

            {/* Views (chart icon) */}
            <button className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group bg-transparent border-none outline-none cursor-pointer text-[#71767b]">
              <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                <BarChart3 className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>

            {/* Bookmark */}
            <button className="flex items-center gap-1.5 hover:text-yellow-500 transition-colors group bg-transparent border-none outline-none cursor-pointer text-[#71767b]">
              <div className="p-2 group-hover:bg-yellow-500/10 rounded-full transition-colors">
                <Bookmark className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group bg-transparent border-none outline-none cursor-pointer text-[#71767b]">
              <div className="p-2 group-hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                <Upload className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-[#2f3336]/50 pt-3 flex flex-col gap-3">
              {/* Comment Input */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden flex-shrink-0">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Post your reply"
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-white placeholder-[#71767b] focus:ring-0 py-1"
                />
                <button
                  onClick={submitComment}
                  disabled={!newComment.trim() || isCommenting}
                  className="bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] disabled:opacity-50 disabled:pointer-events-none rounded-full px-4 py-1 text-[13px] font-bold transition-all border-none cursor-pointer"
                >
                  Reply
                </button>
              </div>

              {/* Render Comments */}
              {comments.length > 0 && (
                <div className="flex flex-col gap-3 mt-2 pl-2 border-l border-[#2f3336]">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <img src={comment.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.uid}`} alt="" className="w-7 h-7 rounded-full object-cover bg-neutral-800 flex-shrink-0" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[13px] flex-wrap">
                          <span className="font-bold text-white truncate">
                            {comment.author_name || comment.author_username}
                          </span>
                          <span className="text-[#71767b] truncate">@{comment.author_username}</span>
                          <span className="text-[#71767b]">·</span>
                          <span className="text-[#71767b]">{timeAgo(comment.created_at || new Date().toISOString())}</span>
                        </div>
                        <p className="text-[14px] text-white/90 mt-0.5 break-words whitespace-pre-wrap leading-normal">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
      post_type: "update",
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
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: "15px",
            lineHeight: "1.5"
          }}
        >
          {/* Constrained layout matching X's 3-column style */}
          <div className="flex w-full h-full bg-[#000000] relative z-10">
            
            {/* COLUMN 1: FEED (max-width 600px, borders left/right) */}
            <div className="w-full md:w-[600px] md:min-w-[600px] flex-1 border-r border-[#2f3336] border-l border-[#2f3336] flex flex-col h-full overflow-y-auto no-scrollbar bg-[#000000]">
              
              {/* Sticky Header with For You / Following Tabs */}
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
                  <button className="flex-1 h-full flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer">
                    <span className="text-[15px] font-bold text-white">For you</span>
                    <div className="absolute bottom-0 w-[56px] h-1 bg-[#1d9bf0] rounded-full" />
                  </button>
                  <button className="flex-1 h-full flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer">
                    <span className="text-[15px] font-bold text-[#71767b]">Following</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Island Morphing Composer */}
              {(() => {
                const hasContent = content.trim().length > 0 || stackTags.trim().length > 0 || isRecording || audioBlob !== null;
                return (
                  <div className="border-b border-[#2f3336]/50 p-4 bg-[#000000] flex justify-center pb-8 pt-6 relative shrink-0">
                    
                    <div className={`relative w-full max-w-[620px] bg-[#050505] border border-[#2f3336] rounded-[32px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group/composer focus-within:shadow-[0_0_40px_rgba(255,255,255,0.06)] focus-within:border-white/[0.2] ${hasContent ? 'shadow-[0_0_40px_rgba(255,255,255,0.06)] border-white/[0.2]' : 'hover:border-[#444]'}`}>
                      
                      {/* Top row: Avatar, Input */}
                      <div className="flex items-start gap-3 p-2 px-3 relative z-10">
                        <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/[0.05] mt-0.5 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity" />
                        
                        <div className="flex-1 flex items-center relative min-h-[40px]">
                          <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleInput}
                            placeholder="What are you building?..."
                            className={`w-full bg-transparent text-white text-[16px] placeholder-[#71767b] outline-none resize-none pt-[10px] pb-2 border-none focus:ring-0 leading-relaxed font-light transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-[40px] group-focus-within/composer:min-h-[80px] ${hasContent ? '!min-h-[80px]' : ''}`}
                          />
                          
                          {/* Quick Actions - Visible only when collapsed */}
                          <div className={`absolute right-0 top-0 bottom-0 flex items-center gap-1 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none opacity-100 group-focus-within/composer:opacity-0 group-focus-within/composer:scale-95 group-focus-within/composer:translate-x-4 ${hasContent ? '!opacity-0 !scale-95 !translate-x-4' : ''}`}>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full text-[#71767b] pointer-events-auto hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer" title="Attach Image">
                              <Image className="w-5 h-5" />
                            </div>
                            <div 
                              onClick={(e) => { e.preventDefault(); toggleRecording(); }}
                              className={`w-10 h-10 flex items-center justify-center rounded-full pointer-events-auto transition-colors cursor-pointer ${isRecording ? "bg-red-500/20 text-red-500" : "text-[#71767b] hover:text-white hover:bg-white/[0.1]"}`}
                            >
                              <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section (Tags & Post button) */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-t border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent group-focus-within/composer:max-h-[200px] group-focus-within/composer:opacity-100 ${hasContent ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-3 flex items-center justify-between gap-3">
                          {/* Tools inside expanded area */}
                          <div className="flex items-center gap-1">
                            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/[0.1] text-[#1d9bf0] transition-colors cursor-pointer" title="Attach Image">
                              <Image className="w-[18px] h-[18px]" />
                            </button>
                            <button 
                              onClick={(e) => { e.preventDefault(); toggleRecording(); }}
                              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isRecording ? "bg-red-500/20 text-red-500" : "hover:bg-white/[0.1] text-[#1d9bf0]"}`}
                            >
                              <Mic className={`w-[18px] h-[18px] ${isRecording ? "animate-pulse" : ""}`} />
                            </button>
                            
                            <div className="w-[1px] h-5 bg-[#2f3336] mx-2"></div>

                            {/* Tag Pill */}
                            <div className="flex items-center bg-[#000000] border border-[#2f3336] rounded-full px-3 py-1.5 focus-within:border-[#1d9bf0]/50 transition-all">
                              <span className="text-[#1d9bf0] font-medium mr-1.5 text-[13px]">#</span>
                              <input
                                type="text"
                                value={stackTags}
                                onChange={(e) => setStackTags(e.target.value)}
                                placeholder="tech stack"
                                className="w-[100px] sm:w-[150px] text-[13px] text-white placeholder-[#71767b] bg-transparent border-none outline-none focus:ring-0"
                              />
                            </div>
                          </div>

                          {/* Post Button */}
                          <button
                            onClick={submitPost}
                            disabled={(!content.trim() && !audioBlob) || isPosting}
                            className={`rounded-full px-6 py-2 text-[14px] font-bold transition-all active:scale-95 cursor-pointer ${(!content.trim() && !audioBlob) || isPosting ? "bg-[#2f3336] text-[#71767b] pointer-events-none" : "bg-[#D4F842] text-black hover:bg-[#c5ec2d] shadow-[0_0_20px_rgba(212,248,66,0.15)] hover:shadow-[0_0_25px_rgba(212,248,66,0.3)]"}`}
                          >
                            {isPosting ? "..." : "Post"}
                          </button>
                        </div>
                      </div>

                      {/* Animated Background Layer */}
                      <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none transition-opacity duration-700 group-focus-within/composer:opacity-100 ${hasContent ? 'opacity-100' : 'opacity-0'}`}></div>
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
              <div className="flex flex-col bg-[#000000] pb-24">
                {posts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="w-12 h-12 text-[#71767b] mb-4" />
                    <h3 className="text-[16px] font-bold text-white mb-1">No posts yet</h3>
                    <p className="text-[13px] text-[#71767b]">When people post, you'll see them here.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} user={user} handleLikeClick={handleLikeClick} />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: RIGHT SIDEBAR */}
            <RightSidebar />

          </div>
        </main>
      </div>
    </div>
  );
}