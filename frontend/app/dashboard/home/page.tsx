"use client";import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Search,
  Smile,
  SendHorizonal,
  BadgeCheck,
  Image,
  Mic,
  X
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createPost, likePost, addComment, getComments } from "@/lib/posts";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { usePostViewTracker } from "@/hooks/usePostViewTracker";
import ClickSpark from "@/components/ClickSpark";

const POST_TYPES = [
  { value: "update", label: "Update" },
  { value: "looking_for", label: "Looking For" },
  { value: "showcase", label: "Showcase" },
  { value: "help_needed", label: "Help Needed" },
  { value: "discussion", label: "Discussion" },
];

function BottomComposerBar({ user, onPostCreated }: { user: any; onPostCreated: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("looking_for");
  const [stackTags, setStackTags] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const expand = () => {
    if (!isExpanded) setIsExpanded(true);
  };

  const collapse = () => {
    setIsExpanded(false);
    setContent("");
    setStackTags("");
    setPostType("looking_for");
    setAudioBlob(null);
    setMicError(null);
    setShowInstructions(false);
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!content.trim() && !stackTags.trim()) {
          setIsExpanded(false);
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        if (!content.trim() && !stackTags.trim()) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, content, stackTags]);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const toggleRecording = async () => {
    setMicError(null);
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      try {
        if (typeof navigator !== 'undefined' && navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (permissionStatus.state === 'denied') {
              setMicError('🔒 Microphone is blocked by your browser. To fix:\n1. Click the lock 🔒 icon in the address bar\n2. Go to Site Settings → Microphone → Allow\n3. Refresh the page and try again');
              return;
            }
          } catch (pErr) {
            console.warn("Permissions query not supported or failed:", pErr);
          }
        }

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
        setMicError('🔒 Microphone is blocked by your browser. To fix:\n1. Click the lock 🔒 icon in the address bar\n2. Go to Site Settings → Microphone → Allow\n3. Refresh the page and try again');
        console.warn("Microphone access blocked (suppressed console.error to prevent Next.js overlay):", err);
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
    if (!trimmed || isPosting) return;
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
      post_type: postType as any,
    });
    setIsPosting(false);
    if (!result.error) {
      collapse();
      onPostCreated();
    }
  };

  const avatarSrc = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;

  const hasContent = content.trim().length > 0 || audioBlob !== null;

  const springTransition = {
    type: "spring" as const,
    stiffness: 220,
    damping: 24,
    mass: 1,
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-end pointer-events-none w-full max-w-[600px] px-4">
      <motion.div
        ref={containerRef}
        layout
        layoutRoot
        layoutId="composer"
        initial={{ scale: 0.985, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springTransition}
        onClick={expand}
        className="pointer-events-auto relative overflow-hidden"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: isExpanded ? "blur(32px)" : "blur(16px)",
          WebkitBackdropFilter: isExpanded ? "blur(32px)" : "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          cursor: isExpanded ? "default" : "text",
          transform: "translateZ(0)",
          willChange: "transform, opacity, height",
          backfaceVisibility: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-white/5 flex-shrink-0"
              />
              <div className="flex-1 text-[15px] text-[#777] font-medium truncate">
                What are you building today?
              </div>
              <button
                disabled
                className="rounded-full bg-white/10 px-4 py-1.5 text-[14px] font-semibold text-white/40 transition flex-shrink-0"
              >
                Post
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, scale: 0.985 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delayChildren: 0.05,
                    staggerChildren: 0.04,
                  }
                }
              }}
              className="flex flex-col gap-4 p-5"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-white/5 flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white leading-tight">
                    {user.displayName || "Builder"}
                  </span>
                  <span className="text-[13px] text-[#888]">
                    @{user.email?.split("@")[0] || "builder"}
                  </span>
                </div>
              </motion.div>

              {/* Textarea */}
              <motion.div variants={itemVariants}>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleInput}
                  placeholder="What are you building today?"
                  className="w-full resize-none bg-transparent border-none text-[16px] text-white placeholder:text-[#555] placeholder:transition-all placeholder:duration-[180ms] placeholder:ease-out focus:placeholder:opacity-50 focus:placeholder:-translate-y-[2px] outline-none leading-relaxed transition-all duration-[180ms] ease-out focus:shadow-[0_0_0_1px_rgba(255,255,255,.08),0_0_20px_rgba(255,255,255,.04)] focus:bg-white/[0.02] p-3 -mx-3 rounded-xl"
                  style={{
                    minHeight: "80px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                />
              </motion.div>

              {/* Tags Input */}
              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  value={stackTags}
                  onChange={(e) => setStackTags(e.target.value)}
                  placeholder="#react #typescript #firebase"
                  className="w-full text-[14px] text-[#4ea8ff] placeholder:text-[#444] bg-transparent border-none outline-none p-2 -mx-2 rounded-lg focus:bg-white/[0.02] transition-colors duration-[180ms]"
                />
              </motion.div>

              {/* Audio Preview */}
              {audioBlob && (
                <motion.div variants={itemVariants} className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-lg border border-white/10 w-fit">
                  <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 max-w-[200px]" />
                  <button onClick={() => setAudioBlob(null)} className="p-1.5 rounded-full text-[#777] hover:bg-white/10 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Mic Error Banner */}
              <AnimatePresence>
                {micError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-[#3b0f11] border border-[#7f1d1d] text-white text-[13px] px-4 py-3 rounded-xl flex flex-col gap-2 shadow-lg w-full"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 leading-relaxed text-left">
                        <div className="font-semibold flex items-center gap-1.5 text-red-200">
                          <span>🔒 Microphone is blocked by your browser. To fix:</span>
                        </div>
                        <ol className="list-decimal list-inside mt-2 space-y-1.5 text-white/90 font-normal">
                          <li>Click the lock 🔒 icon in the address bar</li>
                          <li>Go to Site Settings → Microphone → Allow</li>
                          <li>Refresh the page and try again</li>
                        </ol>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowInstructions(!showInstructions);
                          }}
                          className="text-red-200 hover:text-white text-[12px] font-semibold transition-colors underline bg-red-950/60 px-2 py-1 rounded border border-red-800/30"
                        >
                          How to fix →
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setMicError(null);
                          }}
                          className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {showInstructions && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[12px] text-white/80 bg-black/35 p-3 rounded-lg border border-[#7f1d1d]/40 mt-1 font-normal leading-relaxed text-left space-y-1"
                      >
                        <p className="font-semibold text-white">Browser Permission Troubleshooting:</p>
                        <p>• <strong>Chrome / Brave:</strong> Copy and open <code>chrome://settings/content/microphone</code> in a new tab, check that microphone access is enabled, and remove <code>localhost:3000</code> from the blocked list.</p>
                        <p>• <strong>Firefox:</strong> Click the microphone/lock icon in the address bar, click the 'X' next to Blocked Temporarily, and refresh.</p>
                        <p>• <strong>Safari:</strong> Go to Safari Settings → Websites → Microphone, and select Allow for this website.</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Toolbar */}
              <motion.div variants={itemVariants} className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                <div className="flex items-center gap-1 -ml-2">
                  <button className="p-2 rounded-full text-[#00b0f0] hover:bg-[#00b0f0]/10 transition group" title="Image">
                    <Image className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      collapse();
                    }}
                    className="text-[14px] font-medium text-[#777] hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleRecording(); }}
                    className={`p-2 rounded-full transition group relative flex items-center gap-2 ${isRecording ? 'text-red-500 bg-red-500/10' : 'text-[#00b0f0] hover:bg-[#00b0f0]/10'}`} 
                    title={isRecording ? "Stop Recording" : "Voice"}
                  >
                    <Mic className={`w-[18px] h-[18px] transition-transform ${isRecording ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    {isRecording && (
                      <span className="text-red-500 text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap pr-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={springTransition}
                    onClick={(e) => {
                      e.stopPropagation();
                      submitPost();
                    }}
                    disabled={!hasContent || isPosting}
                    className={`rounded-full px-5 py-1.5 text-[14px] font-bold transition-colors ${
                      hasContent && !isPosting
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-white/20 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}



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
    <article ref={ref} className="group relative bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03] sm:rounded-[24px] mb-5 p-6 backdrop-blur-[12px] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
      {/* Subtle top glare */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex gap-4 relative z-10">
        {/* Avatar Column */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10 shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
            <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-bold text-white hover:underline cursor-pointer truncate">
                {post.author_username}
              </span>
              <span className="text-[#555]">·</span>
              <span className="text-[#A8A8A8] whitespace-nowrap hover:underline cursor-pointer">
                {timeAgo(post.created_at)}
              </span>
            </div>
            <button className="text-[#555] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Post Text */}
          <p className="text-[15px] leading-[1.6] text-white/90 whitespace-pre-wrap break-words mt-1 mb-3">
            {displayContent}
            {isTruncated && !isExpanded && (
              <button onClick={() => setIsExpanded(true)} className="text-blue-400 hover:text-blue-300 ml-1 font-medium">more</button>
            )}
          </p>

          {/* Actions Bar */}
          <div className="flex items-center gap-6 mt-4">
            <ClickSpark
              sparkColor='#FF3040'
              sparkSize={5}
              sparkRadius={10}
              sparkCount={5}
              duration={400}
            >
              <button onClick={() => handleLikeClick(post.id)} className={`group/btn flex items-center gap-2 text-[13px] font-medium transition-colors ${isLiked ? 'text-[#FF3040]' : 'text-[#777] hover:text-[#FF3040]'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isLiked ? 'bg-[#FF3040]/10' : 'group-hover/btn:bg-[#FF3040]/10'}`}>
                  <Heart className={`w-[18px] h-[18px] ${isLiked ? 'scale-110' : ''} transition-transform`} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                </div>
                {likesCount > 0 && likesCount}
              </button>
            </ClickSpark>

            <button onClick={handleFetchComments} className="group/btn flex items-center gap-2 text-[13px] font-medium text-[#777] hover:text-blue-400 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full transition-colors group-hover/btn:bg-blue-400/10">
                <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
              {post.comments_count > 0 && post.comments_count}
            </button>

            <button className="group/btn flex items-center gap-2 text-[13px] font-medium text-[#777] hover:text-green-400 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full transition-colors group-hover/btn:bg-green-400/10">
                <Send className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>

            <button className="group/btn ml-auto flex items-center gap-2 text-[13px] font-medium text-[#777] hover:text-yellow-400 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full transition-colors group-hover/btn:bg-yellow-400/10">
                <Bookmark className="w-[18px] h-[18px]" strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Comments Preview */}
          {(post.comments_count > 0 || comments.length > 0) && (
            <button onClick={handleFetchComments} className="text-[13px] text-[#555] mt-2 hover:text-white transition-colors font-medium">
              {showComments ? "Hide replies" : `Show replies (${Math.max(post.comments_count || 0, comments.length)})`}
            </button>
          )}

          {/* Render Comments */}
          {showComments && comments.length > 0 && (
            <div className="mt-4 space-y-4 pl-3 border-l-2 border-white/[0.05]">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group/comment">
                  <img src={comment.author_avatar} alt={comment.author_name} className="w-7 h-7 rounded-full object-cover bg-white/5 flex-shrink-0 border border-white/5" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-bold text-white hover:underline cursor-pointer truncate">{comment.author_username}</span>
                      <span className="text-[#A8A8A8] text-[12px]">{timeAgo(comment.created_at || new Date().toISOString())}</span>
                    </div>
                    <p className="text-[14px] text-white/90 mt-0.5 break-words whitespace-pre-wrap leading-[1.5]">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inline Add Comment */}
          <div className="mt-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden border border-white/10 flex-shrink-0">
              <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="" className="w-full h-full object-cover" />
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Reply to this post..."
              className="flex-1 bg-white/[0.02] border border-white/[0.08] rounded-full px-4 py-2 text-[13px] text-white placeholder-[#777] focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
            />
            <button
              onClick={submitComment}
              disabled={!newComment.trim() || isCommenting}
              className="text-white/40 hover:text-white font-medium text-[13px] disabled:opacity-50 transition-colors px-2"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    // Fetch Posts
    const qPosts = query(collection(db, "posts"), orderBy("created_at", "desc"), limit(50));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(list);
    });

    // Fetch Stories (mocking with real user profiles)
    const qUsers = query(collection(db, "builder_profiles"), limit(8));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const list = snapshot.docs.map((doc, idx) => ({
        id: doc.id,
        username: doc.data().username || doc.data().email?.split('@')[0] || "builder",
        avatar: doc.data().avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + doc.id,
        hasUnseen: idx % 2 === 0 // mock unseen state for styling
      }));
      setStories(list.filter(u => u.id !== user?.uid)); // don't show self in this mock
    });

    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, [user]);

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
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#0095F6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-blue-500/30 selection:text-white">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0,transparent_50%)] blur-[80px]" />
        <div className="absolute bottom-[10%] right-[30%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0,transparent_50%)] blur-[80px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20" />
      </div>

      <LeftSidebar isSidebarOpen={false} setIsSidebarOpen={() => { }} />

      {/* Main Feed Area */}
      <main className="flex-1 flex justify-center h-full overflow-y-auto no-scrollbar relative z-10 lg:pl-[72px] xl:pr-[340px]">
        <div className="w-full max-w-[680px] flex flex-col pt-8 pb-24 mx-auto px-4">
          {/* Stories Reel Mock */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 px-2 sm:px-0">
            {stories.map((story, i) => (
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

      {/* Fixed bottom composer bar + slide-up drawer */}
      <BottomComposerBar user={user} onPostCreated={() => { }} />
    </div>
  );
}