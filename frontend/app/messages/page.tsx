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
  MessageSquare, User, Send, Hash, Info
} from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const inboxFilters = [
  { id: "assigned", label: "Assigned (8)" },
  { id: "transfers", label: "Transfers (3)" },
  { id: "inboxes", label: "Inboxes" },
  { id: "offline", label: "Offline" }
];

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
  const [activeFilter, setActiveFilter] = useState("assigned");
  const [showDetails, setShowDetails] = useState(true);
  
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
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
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

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 animate-spin rounded-full border border-violet-500/30 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden selection:bg-violet-500/20 selection:text-white relative">
      {/* Subtle background ambient details */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0,transparent_60%)] blur-[100px]" />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex h-full overflow-hidden relative z-10 md:pl-[72px] bg-[#050505]">
        
        {/* ====================================================
            COLUMN 1: DISCUSSIONS & CHAT LIST (320px)
            ==================================================== */}
        <div className="w-[320px] bg-[#050505] border-r border-white/[0.06] flex flex-col h-full shrink-0 relative z-20">
          
          {/* Header */}
          <div className="p-6 pb-4 flex flex-col">
            <h1 className="font-display text-4xl font-light text-white tracking-tight mb-6 select-none">
              Inbox
            </h1>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-white/5 mb-4 text-[11px] font-mono tracking-wider text-white/40">
              {inboxFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded-full transition-all shrink-0 uppercase ${
                    activeFilter === f.id
                      ? "text-white bg-white/5 border border-white/10 font-bold"
                      : "hover:text-white border border-transparent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search and Action bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all"
                />
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversations Cards List */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1.5 pb-8">
            {filteredChats.map(chat => {
              const otherUid = chat.participants.find((p: string) => p !== currentUid);
              const otherProfile = profiles[otherUid] || {};
              const isActive = activeChatId === chat.id;
              const needsAccept = chat.id.charCodeAt(0) % 3 === 0 && !isActive;

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex flex-col gap-2.5 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive 
                      ? 'bg-white/[0.04] border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.02)]' 
                      : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`} 
                        className="w-8 h-8 rounded-full object-cover border border-white/10" 
                        alt="" 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#050505]"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-[13.5px] font-bold text-white truncate">
                          {otherProfile.full_name || otherProfile.username}
                        </span>
                        <span className="text-[10px] text-white/30 font-medium">
                          {formatMessageTime(chat.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[12px] truncate leading-normal block ${needsAccept ? 'text-white font-medium' : 'text-white/40'}`}>
                    {chat.lastMessage || "Started a new conversation..."}
                  </span>

                  {needsAccept && (
                    <div className="flex items-center gap-2 mt-1">
                      <button className="flex-1 py-1 flex items-center justify-center gap-1 rounded-full border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 text-[11px] font-mono tracking-wider uppercase transition-colors">
                        Accept
                      </button>
                      <button className="flex-1 py-1 flex items-center justify-center gap-1 rounded-full border border-white/10 text-white/40 hover:bg-white/5 text-[11px] font-mono tracking-wider uppercase transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            COLUMN 2: ACTIVE CHAT PANE (flex-1)
            ==================================================== */}
        <div className="flex-1 flex flex-col h-full bg-[#050505] relative z-10">
          {!activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <MessageSquare className="w-10 h-10 text-white/10 mb-4 stroke-[1.25]" />
              <h2 className="font-display text-2xl font-light text-white mb-1">Select a Conversation</h2>
              <p className="text-sm text-white/30 max-w-xs leading-relaxed">Choose a direct thread from your inbox to review logs or send messages.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[76px] border-b border-white/[0.06] flex items-center justify-between px-8 shrink-0 bg-[#050505]/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={activeRecipientProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                      alt=""
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#050505]"></div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-light text-white tracking-tight leading-tight">
                      {activeRecipientProfile?.full_name || activeRecipientProfile?.username}
                    </h2>
                    <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest block mt-0.5">
                      Live Conversation Thread
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className={`p-2 rounded-xl transition-all border ${
                      showDetails 
                        ? "bg-white/5 border-white/10 text-white" 
                        : "bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Subheader Notice */}
              <div className="bg-white/[0.01] border-b border-white/5 py-2 px-8 text-[11px] text-white/35 font-mono uppercase tracking-wider shrink-0 flex items-center justify-between">
                <span>Jean Talis, Ahmed Dinejad, Soka Bjanci</span>
                <span className="text-white/20">April 18, 03:31 PM</span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 no-scrollbar relative">
                
                {/* Beautiful grid overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvC3ZnPg==')] pointer-events-none select-none" />
                
                <div className="flex justify-center mb-4 z-10">
                  <span className="text-[10px] font-mono tracking-widest bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full text-white/40 uppercase">
                    Today
                  </span>
                </div>

                <div className="space-y-6 z-10 flex flex-col">
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUid;
                    const timeStr = formatMessageTime(msg.timestamp);

                    return (
                      <div key={msg.id || i} className={`flex max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'} gap-3.5 items-start`}>
                        <img 
                          src={isMe ? (user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUid}`) : (activeRecipientProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`)} 
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10 mt-0.5" 
                          alt="" 
                        />
                        
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono tracking-wider text-white/30 uppercase">
                              {isMe ? "You" : (activeRecipientProfile?.full_name || activeRecipientProfile?.username)}
                            </span>
                            <span className="text-[9px] font-mono text-white/20">
                              {timeStr}
                            </span>
                          </div>

                          <div className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed max-w-full break-words transition-all border ${
                            isMe 
                              ? 'bg-violet-600/10 text-white border-violet-500/20 rounded-tr-none shadow-[0_4px_20px_rgba(139,92,246,0.05)]' 
                              : 'bg-white/[0.02] border-white/5 text-white/90 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-6 bg-[#050505] border-t border-white/[0.06] shrink-0">
                <form onSubmit={handleSendMessage} className="bg-white/[0.02] border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-all flex flex-col gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Write a message to ${activeRecipientProfile?.full_name || activeRecipientProfile?.username}...`}
                    className="w-full bg-transparent text-[13.5px] text-white placeholder-white/20 outline-none py-2 px-3"
                  />
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 px-2">
                    <div className="flex items-center gap-2 text-white/30">
                      <button type="button" className="p-2 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><Paperclip className="w-4 h-4" /></button>
                      <button type="button" className="p-2 hover:text-white hover:bg-white/5 rounded-xl transition-colors"><Smile className="w-4 h-4" /></button>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* ====================================================
            COLUMN 3: PROFILE DETAILS (300px)
            ==================================================== */}
        {showDetails && activeChatId && activeRecipientProfile && (
          <div className="w-[300px] bg-[#050505] border-l border-white/[0.06] flex flex-col h-full shrink-0 overflow-y-auto no-scrollbar relative z-20">
            <div className="p-6">
              <h3 className="text-[10px] font-mono tracking-widest text-white/35 uppercase mb-6">Profile Info</h3>
              
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src={activeRecipientProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipientProfile.id}`}
                  className="w-16 h-16 rounded-full object-cover border border-white/10 bg-white/5 mb-3"
                  alt=""
                />
                <h4 className="font-display text-xl font-light text-white tracking-tight leading-tight">
                  {activeRecipientProfile.full_name || activeRecipientProfile.username}
                </h4>
                <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest mt-1 block">
                  Active Builder
                </span>
              </div>

              <div className="space-y-6">
                
                {/* Recent Conversation */}
                <div>
                  <h5 className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-3">Recent Interaction</h5>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2.5 font-mono text-[11px] text-white/50">
                    <div>
                      <div className="text-white font-bold mb-0.5">Chat Session</div>
                      <div className="text-[10px] text-white/30">Active with You • 1d ago</div>
                    </div>
                    <div className="w-full h-px bg-white/5"></div>
                    <div>
                      <div className="text-white/40 mb-0.5">SMS Message</div>
                      <div className="text-[10px] text-white/30">Closed by Laura • 2d ago</div>
                    </div>
                    <div className="w-full h-px bg-white/5"></div>
                    <div>
                      <div className="text-white/40 mb-0.5">Email Channel</div>
                      <div className="text-[10px] text-white/30">Closed by Jean • 1w ago</div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5"></div>

                {/* Profile Details List */}
                <div>
                  <h5 className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-3">Contact Metadata</h5>
                  <div className="space-y-4 font-mono text-[10px] text-white/35">
                    
                    <div className="space-y-1">
                      <span className="block tracking-wider uppercase text-white/20">Email Address</span>
                      <span className="text-white font-sans text-xs font-medium block truncate hover:underline cursor-pointer">
                        {activeRecipientProfile.email || "robertfox@startrek.com"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block tracking-wider uppercase text-white/20">Whatsapp</span>
                      <span className="text-white text-[12px] font-sans font-medium block">
                        650-513-0514
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block tracking-wider uppercase text-white/20">Assigned Node Owner</span>
                      <span className="text-white/70 text-xs font-sans font-medium block">
                        Nida Hanin
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block tracking-wider uppercase text-white/20">Geographical Location</span>
                      <span className="text-white/70 text-xs font-sans font-medium block leading-normal">
                        Adelaide, Australia
                      </span>
                    </div>

                  </div>
                </div>

                <div className="w-full h-px bg-white/5"></div>

                {/* Tags */}
                <div>
                  <h5 className="text-[9px] font-mono tracking-widest text-white/30 uppercase mb-3">Categorization Tags</h5>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 border border-white/10 bg-white/[0.02] text-white/50 text-[10px] rounded-md font-mono uppercase">Developer</span>
                    <span className="px-2 py-0.5 border border-white/10 bg-white/[0.02] text-white/50 text-[10px] rounded-md font-mono uppercase">VIP</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Add tag..." 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2 pl-7 pr-3 text-[11px] text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all font-mono"
                    />
                    <Search className="w-3.5 h-3.5 text-white/20 absolute left-2.5 top-2.5" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
