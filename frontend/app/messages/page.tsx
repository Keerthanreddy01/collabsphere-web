// Complete replacement for frontend/app/messages/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { 
  subscribeToChats, 
  subscribeToMessages, 
  sendMessage, 
  createChat, 
  markConversationAsRead
} from "@/lib/chats";
import { 
  Search, SlidersHorizontal, Plus, Star, ArrowLeft, MoreHorizontal,
  Phone, Mail, MapPin, Monitor, Paperclip, Smile, Mic, Zap, 
  ChevronDown, CheckCircle2, XCircle, UserCircle2, Clock, ChevronRight,
  MessageSquare, User, Send, Settings, Video, Archive, Check, Lock
} from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  
  const currentUid = user?.uid || "";

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "builder_profiles"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cache: Record<string, any> = {};
      snapshot.docs.forEach((doc) => {
        cache[doc.id] = { id: doc.id, ...doc.data() };
      });
      setProfiles(cache);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!currentUid) return;
    const unsub = subscribeToChats(currentUid, (data) => setChats(data));
    return () => unsub();
  }, [currentUid]);

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(activeChatId, (data) => setMessages(data));
    return () => unsub();
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeChatId || !currentUid) return;
    markConversationAsRead(activeChatId, currentUid);
  }, [activeChatId, messages, currentUid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUid || !activeChatId) return;
    
    const content = newMessage.trim();
    setNewMessage("");
    
    await sendMessage({
      chatId: activeChatId,
      senderId: currentUid,
      content
    });
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredChats = chats.filter(chat => {
    const otherUid = chat.participants.find((p: string) => p !== currentUid);
    const otherProfile = profiles[otherUid] || {};
    const username = (otherProfile.username || "").toLowerCase();
    const fullName = (otherProfile.full_name || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return username.includes(q) || fullName.includes(q);
  });

  let activeRecipientProfile: any = null;
  if (activeChatId) {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (activeChat) {
      const otherUid = activeChat.participants.find((p: string) => p !== currentUid);
      activeRecipientProfile = profiles[otherUid] || { id: otherUid, username: "Builder" };
    }
  }

  const BlueBadge = () => (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1d9bf0] text-white shrink-0 ml-1">
      <Check className="w-2.5 h-2.5 stroke-[4]" />
    </span>
  );

  if (loading || !user) {
    return <div className="flex h-screen bg-black" />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#1d9bf0]/25 selection:text-white relative">
      
      {/* Dynamic Background Glows for Glassmorphism transparency */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(29,155,240,0.06)_0,transparent_65%)] blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04)_0,transparent_60%)] blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex h-full overflow-hidden relative z-10 md:pl-[72px] bg-black/40 backdrop-blur-[5px]">
        
        {/* COLUMN 1: CHAT THREADS LIST (360px wide) */}
        <div className="w-[360px] border-r border-white/10 flex flex-col h-full shrink-0 bg-black/20 backdrop-blur-xl relative z-20">
          {/* Header */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 px-2.5 py-1.5 rounded-full transition-all bg-white/[0.03] border border-white/10">
                <span className="text-[14px] font-bold text-white leading-none">Chat</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#71767b]" />
              </div>
              <div className="flex items-center gap-2 text-[#71767b]">
                <button className="p-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-white rounded-full transition-all">
                  <Archive className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-white rounded-full transition-all">
                  <Settings className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Direct Messages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-[13.5px] text-white placeholder-white/20 outline-none focus:bg-black/60 focus:border-[#1d9bf0]/50 focus:ring-1 focus:ring-[#1d9bf0]/50 transition-all backdrop-blur-sm"
              />
              <Search className="w-4 h-4 text-white/30 absolute left-4.5 top-3.5" />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1 pb-6">
            {filteredChats.map(chat => {
              const otherUid = chat.participants.find((p: string) => p !== currentUid);
              const otherProfile = profiles[otherUid] || {};
              const isActive = activeChatId === chat.id;
              const unreadCount = chat.unreadCount?.[currentUid] || 0;

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isActive 
                      ? 'bg-white/[0.06] border-white/10 shadow-[0_4px_30px_rgba(255,255,255,0.02)] backdrop-blur-sm' 
                      : 'border-transparent hover:bg-white/[0.02] hover:border-white/5'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <img 
                      src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`} 
                      className="w-9 h-9 rounded-full object-cover border border-white/10 bg-white/5" 
                      alt="" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center min-w-0">
                        <span className="text-[14px] font-bold text-white truncate hover:underline">
                          {otherProfile.full_name || otherProfile.username}
                        </span>
                        <BlueBadge />
                      </div>
                      <span className="text-[11px] text-white/30 shrink-0 font-medium font-mono">
                        {formatMessageTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className={`text-[12.5px] truncate leading-normal ${
                        unreadCount > 0 ? 'text-white font-bold' : 'text-white/40'
                      }`}>
                        {chat.lastMessage || "Started a new conversation..."}
                      </span>
                      {unreadCount > 0 && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-[#1d9bf0] text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-[0_0_10px_rgba(29,155,240,0.4)]">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: ACTIVE CONVERSATION PANE (flex-1) */}
        <div className="flex-1 flex flex-col h-full bg-black/10 backdrop-blur-sm relative">
          {!activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none z-10">
              <MessageSquare className="w-10 h-10 text-white/10 mb-4 stroke-[1.25]" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Select a message</h2>
              <p className="text-[13.5px] text-white/30 max-w-sm leading-normal">
                Choose from your existing conversations, start a new one, or just keep swimming.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[60px] border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-black/40 backdrop-blur-xl z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={activeRecipientProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`}
                    className="w-8 h-8 rounded-full object-cover border border-white/10 bg-white/5"
                    alt=""
                  />
                  <div className="flex items-center min-w-0">
                    <span className="text-[15px] font-bold text-white truncate hover:underline">
                      {activeRecipientProfile?.full_name || activeRecipientProfile?.username}
                    </span>
                    <BlueBadge />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#1d9bf0]">
                  <button className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-white rounded-full transition-all" title="Voice call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-white rounded-full transition-all" title="Video call">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-white rounded-full transition-all" title="Conversation info">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Divider & Encrypted Notice */}
              <div className="bg-transparent py-4 text-center shrink-0 flex items-center justify-center select-none z-10">
                <span className="bg-white/[0.03] border border-white/5 backdrop-blur-md py-1 px-3.5 rounded-full text-[10px] text-white/40 flex items-center justify-center gap-1.5 font-mono uppercase tracking-wider">
                  <Lock className="w-3 h-3 stroke-[2.5]" />
                  Secure End-to-End Encryption
                </span>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar bg-transparent z-10 relative">
                
                {/* Visual grid texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvC3ZnPg==')] pointer-events-none select-none" />

                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUid;
                  const timeStr = formatMessageTime(msg.timestamp);

                  return (
                    <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%] ${isMe ? 'self-end' : 'self-start'}`}>
                      {/* Message Bubble */}
                      <div className={`px-4 py-2.5 text-[14.5px] leading-normal break-words border transition-all ${
                        isMe 
                          ? 'bg-[#1d9bf0]/15 text-white border-[#1d9bf0]/30 backdrop-blur-md rounded-2xl rounded-tr-none shadow-[0_8px_32px_rgba(29,155,240,0.1)]' 
                          : 'bg-white/[0.03] text-white border border-white/10 backdrop-blur-md rounded-2xl rounded-tl-none shadow-[0_8px_32px_rgba(255,255,255,0.02)]'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {/* Message Meta */}
                      <span className="text-[10px] text-white/30 mt-1 flex items-center gap-1 font-mono font-medium select-none uppercase">
                        {timeStr}
                        {isMe && (
                          <span className="text-[#1d9bf0] flex items-center font-bold">
                            • seen <Check className="w-3 h-3 ml-0.5 stroke-[3]" />
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/10 shrink-0 z-10">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  {/* Left Controls */}
                  <div className="flex items-center gap-1.5 text-white/40 shrink-0">
                    <button type="button" className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-[#1d9bf0] rounded-full transition-all"><Plus className="w-4 h-4" /></button>
                    <button type="button" className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-[#1d9bf0] font-mono text-[10px] font-black leading-none h-9 w-9 flex items-center justify-center rounded-full transition-all">GIF</button>
                    <button type="button" className="p-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:text-[#1d9bf0] rounded-full transition-all"><Smile className="w-4 h-4" /></button>
                  </div>

                  {/* Text Input Capsule */}
                  <div className="flex-1 bg-white/[0.02] border border-white/10 focus-within:border-white/20 focus-within:bg-white/[0.04] rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Start a new message"
                      className="bg-transparent text-[14px] text-white placeholder-white/20 outline-none w-full"
                    />
                    <button type="button" className="text-white/40 hover:text-white shrink-0 p-1 rounded-full hover:bg-white/5 transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="text-[#1d9bf0] hover:text-[#1a8cd8] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] p-2.5 rounded-full transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
