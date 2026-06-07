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
  MessageSquare, User
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
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour ago`;
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
    return <div className="flex h-screen bg-[#050505]" />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex h-full overflow-hidden relative z-10 md:pl-[72px] bg-[#050505]">
        
        {/* COLUMN 1: INBOXES (240px) */}
        <div className="w-[220px] bg-[#090909] border-r border-white/5 flex flex-col h-full shrink-0">
          <div className="p-5 pb-2">
            <h2 className="text-[22px] font-bold text-white tracking-tight mb-6">Conversations</h2>
            
            <div className="flex flex-col gap-1 text-[13px] font-semibold text-white/60">
              <div className="flex items-center justify-between px-3 py-2 bg-white/[0.04] text-white rounded-lg cursor-pointer border border-white/5">
                <div className="flex items-center gap-3">
                  <UserCircle2 className="w-4 h-4 text-violet-400" />
                  <span>Assigned to me</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
                  8
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Transfers</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-white/[0.06] text-white/60 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
              </div>
              <div className="flex items-center px-3 py-2 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 px-5">
            <h3 className="text-[14px] font-bold text-white mb-2">Inboxes</h3>
            <div className="flex flex-col gap-0.5 text-[13px] text-white/50 font-medium">
              <div className="flex items-center justify-between py-1.5 px-3 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer group">
                <span>Head Office</span>
                <span className="w-2 h-2 rounded-full bg-violet-500 group-hover:scale-110 transition-transform"></span>
              </div>
              <div className="flex items-center py-1.5 px-3 relative cursor-pointer text-white">
                <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-violet-500 rounded-r-md"></div>
                <span>New Phone</span>
              </div>
              <div className="flex items-center py-1.5 px-3 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer">
                <span>Trade-ins</span>
              </div>
              <div className="flex items-center py-1.5 px-3 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer">
                <span>Repair</span>
              </div>
              
              <div className="flex items-center justify-between py-1.5 px-3 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer mt-2">
                <span>Crowfoot Terrace</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 hover:bg-white/[0.03] hover:text-white rounded-lg cursor-pointer">
                <span>Deerfoot City</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CHAT LIST (340px) */}
        <div className="w-[340px] bg-[#090909] border-r border-white/5 flex flex-col h-full shrink-0">
          <div className="p-5 border-b border-white/5">
            {/* Top Stats */}
            <div className="flex items-center justify-between text-[9px] text-white/40 font-bold uppercase tracking-wider mb-5">
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-white">24</span>
                <span>In Progress</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-white">7</span>
                <span>Waiting</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] text-white">97</span>
                <span>CSAT</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-md py-2 pl-9 pr-3 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                />
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 text-white/60 hover:text-white transition-colors bg-white/[0.03] rounded-md border border-white/10">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button className="p-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
            {filteredChats.map(chat => {
              const otherUid = chat.participants.find((p: string) => p !== currentUid);
              const otherProfile = profiles[otherUid] || { username: "Builder" };
              const isActive = activeChatId === chat.id;
              
              // Simulate random statuses for UI mockup
              const needsAccept = chat.id.charCodeAt(0) % 3 === 0 && !isActive;

              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex flex-col gap-2 p-3 rounded-xl cursor-pointer transition-colors border ${
                    isActive 
                      ? 'bg-white/[0.06] border-white/10' 
                      : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`} 
                        className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white/5" 
                        alt="" 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#090909]"></div>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[14px] font-bold text-white truncate">
                        {otherProfile.full_name || otherProfile.username}
                      </span>
                      <span className="text-[11px] text-violet-400 font-medium mt-0.5">
                        {formatMessageTime(chat.lastMessageTime)}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[12px] leading-snug truncate ${needsAccept ? 'text-white' : 'text-white/40'}`}>
                    {chat.lastMessage || "Started a new conversation..."}
                  </span>

                  {needsAccept && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[12px] font-bold transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[12px] font-bold transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: ACTIVE CHAT (flex-1) */}
        <div className="flex-1 flex flex-col h-full bg-[#050505] relative z-0">
          {!activeRecipientProfile ? (
            <div className="flex-1 flex items-center justify-center text-white/30">
              <p>Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="h-[72px] border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#090909]/60 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={activeRecipientProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipientProfile.id}`}
                      className="w-9 h-9 rounded-full object-cover border border-white/10 bg-white/5"
                      alt=""
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#090909]"></div>
                  </div>
                  <span className="text-[16px] font-bold text-white tracking-tight">
                    {activeRecipientProfile.full_name || activeRecipientProfile.username}
                  </span>
                  <button className="p-1 text-white/40 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-white/40">
                  <button className="p-2 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Subheader Notice */}
              <div className="bg-white/[0.01] border-b border-white/5 py-2 px-6 text-center text-[11px] text-white/40 font-medium shrink-0">
                Live Chat Conversation with <span className="text-white">Jean Talis, Ahmed Dinejad, Soka Bjanci</span> | April 18, 03:31 PM
              </div>

              {/* Background texture matching mockup */}
              <div className="absolute inset-0 z-[-1] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/notebook-dark.png')]" />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex justify-center mb-4">
                  <span className="text-[11px] text-white/45 font-medium">Live Chat Conversation with <span className="text-white">You</span> - Today, 23:36</span>
                </div>

                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUid;
                  const timeStr = formatMessageTime(msg.timestamp);

                  return (
                    <div key={msg.id || i} className={`flex max-w-[85%] ${isMe ? 'self-end' : 'self-start'} gap-3`}>
                      {!isMe && (
                        <img 
                          src={activeRecipientProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipientProfile.id}`} 
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-white/10" 
                          alt="" 
                        />
                      )}
                      
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1.5 text-[11px] text-white/40">
                          {isMe ? (
                            <>
                              <span>Sent by Live Chat • {timeStr} • seen <strong className="text-white/80">You</strong></span>
                            </>
                          ) : (
                            <>
                              <strong className="text-white font-bold text-[13px]">{activeRecipientProfile.full_name || activeRecipientProfile.username}</strong>
                              <span>Sent by Live Chat</span>
                              <MessageSquare className="w-3 h-3 text-white/40" />
                              <span>{timeStr}</span>
                            </>
                          )}
                        </div>

                        <div className={`px-4 py-3 rounded-xl text-[13.5px] leading-relaxed max-w-full break-words border ${
                          isMe 
                            ? 'bg-violet-600/10 text-white border-violet-500/20' 
                            : 'bg-[#121212] border-white/5 text-white/90'
                        }`}>
                          {msg.content}
                        </div>
                      </div>

                      {isMe && (
                        <img 
                          src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUid}`} 
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-white/10" 
                          alt="" 
                        />
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-4 bg-[#090909]/60 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-4 mb-3 border-b border-white/5 pb-3 text-[12px] font-semibold text-white/40">
                  <button className="flex items-center gap-1.5 text-white bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-md">
                    <MessageSquare className="w-4 h-4 text-violet-400" /> Live Chat <ChevronDown className="w-3 h-3" />
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" /> Create Task
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <span>Private Note</span>
                    <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/45 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <div className="flex-1 bg-transparent flex flex-col">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Send a message ..."
                      className="w-full bg-transparent text-[14px] text-white placeholder-white/30 outline-none py-2"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-white/30">
                        <button type="button" className="hover:text-white transition-colors"><Paperclip className="w-4 h-4" /></button>
                        <button type="button" className="hover:text-white transition-colors">@</button>
                        <button type="button" className="hover:text-white transition-colors"><Smile className="w-4 h-4" /></button>
                        <button type="button" className="hover:text-white transition-colors"><Mic className="w-4 h-4" /></button>
                      </div>
                      
                      <div className="flex items-center">
                        <button type="button" className="p-2 text-violet-400 hover:bg-white/[0.05] rounded-md transition-colors mr-2">
                          <Zap className="w-4 h-4" />
                        </button>
                        <div className="flex items-center">
                          <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="bg-violet-600 text-white text-[13px] font-bold px-4 py-2 rounded-l-md hover:bg-violet-500 disabled:opacity-30 transition-colors"
                          >
                            Send
                          </button>
                          <button type="button" className="bg-violet-700 text-white px-2 py-2 rounded-r-md hover:bg-violet-600 border-l border-violet-500/30 transition-colors">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* COLUMN 4: PROFILE DETAILS (280px) */}
        <div className="w-[280px] bg-[#090909] border-l border-white/5 flex flex-col h-full shrink-0">
          {activeRecipientProfile ? (
            <>
              <div className="h-[72px] border-b border-white/5 flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeRecipientProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipientProfile.id}`}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                    alt=""
                  />
                  <span className="text-[15px] font-bold text-white tracking-tight">
                    {activeRecipientProfile.full_name || activeRecipientProfile.username}
                  </span>
                </div>
                <button className="text-white/40 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-5">
                
                {/* Recent Conversation */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[14px] font-bold text-white mb-3">
                    <span>Recent Conversation</span>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="flex flex-col gap-3 text-[12px]">
                    <div>
                      <div className="flex items-center gap-1.5 text-white font-semibold mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-violet-400" /> Chat • Active with You <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                      </div>
                      <div className="flex justify-between text-white/45">
                        <span className="truncate pr-2">Hello, I need help on my custo...</span>
                        <span>1d</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-white/40 font-semibold mb-1">
                        <Phone className="w-3.5 h-3.5" /> SMS • Closed by Laura Bischoff <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <div className="flex justify-between text-white/35">
                        <span className="truncate pr-2">Okay, Laura. Will do the advis...</span>
                        <span>2d</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-white/40 font-semibold mb-1">
                        <Mail className="w-3.5 h-3.5" /> Email • Closed by Jean Talis <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <div className="flex justify-between text-white/35">
                        <span className="truncate pr-2">Nevermind, Adam. Thank you!...</span>
                        <span>1w</span>
                      </div>
                    </div>
                    <button className="text-violet-400 font-medium text-left mt-1 hover:underline">Show more</button>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5 mb-6"></div>

                {/* Profile */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[14px] font-bold text-white mb-4">
                    <span>Profile</span>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </div>
                  
                  <div className="flex flex-col gap-3 text-[12px]">
                    <div className="flex gap-2">
                      <Phone className="w-4 h-4 text-white/40 shrink-0" />
                      <div className="flex flex-col gap-1.5 w-full text-white/60">
                        <div className="flex justify-between"><span>Phone</span> <span className="text-white/30">Add</span></div>
                        <div className="flex justify-between text-white"><span>Whatsapp</span> <span>650-513-0514 <Star className="w-3 h-3 inline text-violet-400" /></span></div>
                        <div className="flex justify-between text-white"><span>Home</span> <span>613-555-0168 <XCircle className="w-3 h-3 inline text-red-500" /></span></div>
                        <div className="flex justify-between text-white"><span>Office/Wor...</span> <span>613-555-0145</span></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Mail className="w-4 h-4 text-white/40 shrink-0" />
                      <div className="flex flex-col gap-1.5 w-full text-white/60">
                        <div className="flex justify-between"><span>Email</span> <span className="text-white/30">Add</span></div>
                        <div className="flex justify-between text-white"><span>Work</span> <span className="truncate max-w-[120px]">robertfox@startrek.com</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/60 mt-2">
                      <User className="w-4 h-4 text-white/40 shrink-0" />
                      <span className="flex-1">Assigned to</span>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nida" className="w-4 h-4 rounded-full" alt=""/>
                      <span className="text-white truncate max-w-[80px]">Nida Hanin Dary</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/60">
                      <div className="w-4 flex justify-center"><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                      <span className="flex-1">Status</span>
                      <span className="text-white">Online</span>
                    </div>

                    <div className="flex gap-2 text-white/60">
                      <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                      <span className="w-20 shrink-0">Location</span>
                      <span className="text-white text-right leading-tight">51th street avenue, Adelaide, Australia. 35129</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5 mb-6"></div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between text-[14px] font-bold text-white mb-4">
                    <span>Tags</span>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type to search or add new tag ..." 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-md py-2 pl-8 pr-3 text-[12px] text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-all"
                    />
                    <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-2.5" />
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="p-5 text-center text-white/30 text-sm mt-10">
              Select a conversation to view profile details.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
