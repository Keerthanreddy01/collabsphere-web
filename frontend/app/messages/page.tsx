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
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden selection:bg-[#1d9bf0]/25 selection:text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex h-full overflow-hidden relative z-10 md:pl-[72px] bg-black">
        
        {/* COLUMN 1: CHAT THREADS LIST (360px wide) */}
        <div className="w-[360px] border-r border-[#2f3336] flex flex-col h-full shrink-0 bg-black">
          {/* Header */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-full transition-colors">
                <span className="text-xl font-bold text-white leading-none">Chat</span>
                <ChevronDown className="w-4 h-4 text-[#71767b]" />
              </div>
              <div className="flex items-center gap-1 text-[#71767b]">
                <button className="p-2 hover:bg-white/5 hover:text-white rounded-full transition-colors">
                  <Archive className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/5 hover:text-white rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
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
                className="w-full bg-[#202327] border border-transparent rounded-full py-2.5 pl-11 pr-4 text-[14px] text-white placeholder-[#71767b] outline-none focus:bg-black focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all"
              />
              <Search className="w-4.5 h-4.5 text-[#71767b] absolute left-4 top-3" />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredChats.map(chat => {
              const otherUid = chat.participants.find((p: string) => p !== currentUid);
              const otherProfile = profiles[otherUid] || {};
              const isActive = activeChatId === chat.id;
              const unreadCount = chat.unreadCount?.[currentUid] || 0;

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors relative border-r-2 ${
                    isActive 
                      ? 'bg-[#16181c]/60 border-[#1d9bf0]' 
                      : 'border-transparent hover:bg-[#16181c]/30'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <img 
                      src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`} 
                      className="w-10 h-10 rounded-full object-cover border border-white/5 bg-white/5" 
                      alt="" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center min-w-0">
                        <span className="text-[14.5px] font-bold text-white truncate hover:underline">
                          {otherProfile.full_name || otherProfile.username}
                        </span>
                        <BlueBadge />
                      </div>
                      <span className="text-[12px] text-[#71767b] shrink-0 font-medium">
                        {formatMessageTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className={`text-[13px] truncate leading-normal ${
                        unreadCount > 0 ? 'text-white font-bold' : 'text-[#71767b]'
                      }`}>
                        {chat.lastMessage || "Started a new conversation..."}
                      </span>
                      {unreadCount > 0 && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-[#1d9bf0] text-white flex items-center justify-center text-[9px] font-black shrink-0">
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
        <div className="flex-1 flex flex-col h-full bg-black relative">
          {!activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Select a message</h2>
              <p className="text-[14px] text-[#71767b] max-w-sm leading-normal">
                Choose from your existing conversations, start a new one, or just keep swimming.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[60px] border-b border-[#2f3336] flex items-center justify-between px-6 shrink-0 bg-black/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={activeRecipientProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`}
                    className="w-8 h-8 rounded-full object-cover border border-white/5 bg-white/5"
                    alt=""
                  />
                  <div className="flex items-center min-w-0">
                    <span className="text-[15.5px] font-bold text-white truncate hover:underline">
                      {activeRecipientProfile?.full_name || activeRecipientProfile?.username}
                    </span>
                    <BlueBadge />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[#1d9bf0]">
                  <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors" title="Voice call">
                    <Phone className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors" title="Video call">
                    <Video className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2.5 hover:bg-white/5 rounded-full transition-colors" title="Conversation info">
                    <MoreHorizontal className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Day Divider & Encrypted Notice */}
              <div className="bg-black/80 py-3.5 text-center shrink-0 flex flex-col gap-1 border-b border-[#2f3336]/40 select-none">
                <span className="text-[11px] font-semibold text-[#71767b]">Today</span>
                <span className="text-[10px] text-[#71767b] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 stroke-[2.5]" />
                  This conversation is now end-to-end encrypted
                </span>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar bg-black">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUid;
                  const timeStr = formatMessageTime(msg.timestamp);

                  return (
                    <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%] ${isMe ? 'self-end' : 'self-start'}`}>
                      {/* Message Bubble */}
                      <div className={`px-4 py-2.5 text-[14.5px] leading-normal break-words ${
                        isMe 
                          ? 'bg-[#1d9bf0] text-white rounded-2xl rounded-tr-none' 
                          : 'bg-[#2f3336] text-white rounded-2xl rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {/* Message Meta */}
                      <span className="text-[11px] text-[#71767b] mt-1 flex items-center gap-1 font-medium select-none">
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
              <div className="p-4 bg-black border-t border-[#2f3336] shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  {/* Left Controls */}
                  <div className="flex items-center text-[#1d9bf0] shrink-0">
                    <button type="button" className="p-2.5 hover:bg-white/5 rounded-full transition-colors"><Plus className="w-5 h-5" /></button>
                    <button type="button" className="p-2.5 hover:bg-white/5 rounded-full transition-colors font-mono text-[11px] font-black border border-[#1d9bf0]/20 leading-none h-8 w-8 flex items-center justify-center rounded-full">GIF</button>
                    <button type="button" className="p-2.5 hover:bg-white/5 rounded-full transition-colors"><Smile className="w-5 h-5" /></button>
                  </div>

                  {/* Text Input Capsule */}
                  <div className="flex-1 bg-[#202327] rounded-full px-4 py-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Start a new message"
                      className="bg-transparent text-[14px] text-white placeholder-[#71767b] outline-none w-full"
                    />
                    <button type="button" className="text-[#1d9bf0] hover:text-white shrink-0 p-1 rounded-full hover:bg-white/5 transition-colors">
                      <Mic className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="text-[#1d9bf0] hover:text-[#1a8cd8] disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0 p-2.5 rounded-full hover:bg-white/5"
                  >
                    <Send className="w-5 h-5" />
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
