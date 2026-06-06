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
import { Send, MessageSquare, Search, Hash, X, Image, SquarePen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  
  // Sidebar Search
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cache of all profiles
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  
  // Compose New Chat Modal
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [pendingRecipient, setPendingRecipient] = useState<any | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentUid = user?.uid || "";

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Subscribe to all profiles for real-time username & avatar mapping
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

  // Subscribe to active chats/conversations
  useEffect(() => {
    if (!currentUid) return;
    const unsub = subscribeToChats(currentUid, (data) => setChats(data));
    return () => unsub();
  }, [currentUid]);

  // Subscribe to messages in current active conversation
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(activeChatId, (data) => setMessages(data));
    return () => unsub();
  }, [activeChatId]);

  // Scroll to bottom on message list update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark conversation as read on load or on new incoming messages
  useEffect(() => {
    if (!activeChatId || !currentUid) return;
    markConversationAsRead(activeChatId, currentUid);
  }, [activeChatId, messages, currentUid]);

  const handleSelectUser = (targetUser: any) => {
    // Check if conversation already exists in chats list
    const existingChat = chats.find(c => c.participants.includes(targetUser.id));
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setPendingRecipient(null);
    } else {
      setActiveChatId(null);
      setPendingRecipient(targetUser);
    }
    setIsNewChatModalOpen(false);
    setModalSearchQuery("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUid) return;
    
    const content = newMessage.trim();
    setNewMessage(""); // optimistic clear
    
    let chatId = activeChatId;
    if (!chatId) {
      if (!pendingRecipient) return;
      // First message creates the conversation in Firestore
      const res = await createChat([currentUid, pendingRecipient.id]);
      if (res.data) {
        chatId = res.data;
        setActiveChatId(chatId);
        setPendingRecipient(null);
      } else {
        console.error("Error creating chat:", res.error);
        return;
      }
    }
    
    await sendMessage({
      chatId: chatId,
      senderId: currentUid,
      content
    });
  };

  // Helper formats
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filtering active discussions list
  const filteredChats = chats.filter(chat => {
    const otherUid = chat.participants.find((p: string) => p !== currentUid);
    const otherProfile = profiles[otherUid] || {};
    const username = (otherProfile.username || "").toLowerCase();
    const fullName = (otherProfile.full_name || "").toLowerCase();
    const lastMsg = (chat.lastMessage || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return username.includes(q) || fullName.includes(q) || lastMsg.includes(q);
  });

  const modalUsersSuggestions = Object.values(profiles).filter((u: any) => u.id !== currentUid);
  const filteredModalUsers = modalUsersSuggestions.filter((u: any) => {
    const q = modalSearchQuery.toLowerCase();
    return (
      (u.username || "").toLowerCase().includes(q) ||
      (u.full_name || "").toLowerCase().includes(q)
    );
  });

  // Active recipient profile mapping
  let activeRecipientProfile: any = null;
  if (activeChatId) {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (activeChat) {
      const otherUid = activeChat.participants.find((p: string) => p !== currentUid);
      activeRecipientProfile = profiles[otherUid] || { id: otherUid, username: "Builder" };
    }
  } else if (pendingRecipient) {
    activeRecipientProfile = pendingRecipient;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-[#0095F6] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-blue-500/30 selection:text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 flex h-full overflow-hidden relative z-10 lg:pl-[72px]">
        {/* Left Sidebar Pane */}
        <div className="w-full md:w-[350px] border-r border-white/5 flex flex-col h-full bg-[#050505] shrink-0">
          <div className="p-6 border-b border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Discussions
              </h1>
              <button 
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors border border-white/5 shadow-md bg-white/[0.02]"
                title="New Message"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Find a builder to chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Active Discussions List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider px-3 mb-2 mt-2">Active Discussions</h3>
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-white/30 text-sm">No discussions yet.</div>
            ) : (
              filteredChats.map(chat => {
                const otherUid = chat.participants.find((p: string) => p !== currentUid);
                const otherProfile = profiles[otherUid] || {
                  username: "Builder",
                  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`,
                  full_name: "Builder"
                };
                const unreadCount = chat.unreadCount?.[currentUid] || 0;
                
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setPendingRecipient(null);
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                      activeChatId === chat.id 
                        ? 'bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`} 
                        className="w-11 h-11 rounded-full object-cover border border-white/5" 
                        alt="" 
                      />
                      {otherProfile.availability === 'open' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-bold text-white truncate">
                          {otherProfile.full_name || otherProfile.username}
                        </span>
                        <span className="text-[11px] text-white/40 shrink-0">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-xs truncate flex-1 ${unreadCount > 0 ? 'text-white font-semibold' : 'text-white/50'}`}>
                          {chat.lastMessage || "Started a new discussion"}
                        </span>
                        {unreadCount > 0 && (
                          <span className="bg-[#ff3040] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className={`flex-1 flex flex-col h-full bg-[#080808] ${!activeRecipientProfile ? 'hidden md:flex' : 'flex'}`}>
          {!activeRecipientProfile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30 bg-[#080808]">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50 text-white/20" />
              <p className="text-sm">Select a discussion or start a new one.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0A0A0A]">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeRecipientProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipientProfile.id}`} 
                    className="w-10 h-10 rounded-full object-cover border border-white/5" 
                    alt="" 
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-tight">
                      {activeRecipientProfile.full_name || activeRecipientProfile.username}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${activeRecipientProfile.availability === 'open' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                      <span className="text-[11px] text-white/40 font-medium">
                        {activeRecipientProfile.availability === 'open' ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center text-white/30 text-sm my-auto">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUid;
                    const msgTime = formatMessageTime(msg.timestamp);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id || i} 
                        className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div className="flex items-end gap-2">
                          <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : 'bg-white/[0.06] text-white/95 border border-white/5 rounded-bl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                        {msgTime && (
                          <span className="text-[10px] text-white/30 mt-1 px-1">
                            {msgTime}
                          </span>
                        )}
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Footer */}
              <div className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                  <button 
                    type="button" 
                    className="p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors shrink-0" 
                    title="Attach Image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all focus:bg-white/[0.05]"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="absolute right-2 p-2 bg-white text-black rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>

      {/* New Message Composer Modal */}
      <AnimatePresence>
        {isNewChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0d0d0d]">
                <h3 className="text-base font-bold text-white">New Message</h3>
                <button 
                  onClick={() => {
                    setIsNewChatModalOpen(false);
                    setModalSearchQuery("");
                  }}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username or name..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[350px] no-scrollbar">
                {modalSearchQuery.trim() === "" ? (
                  modalUsersSuggestions.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => handleSelectUser(u)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <img 
                        src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} 
                        className="w-10 h-10 rounded-full bg-white/10 object-cover border border-white/5" 
                        alt="" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{u.full_name || u.username || "Builder"}</span>
                        <span className="text-xs text-white/40">@{u.username || "builder"}</span>
                      </div>
                    </div>
                  ))
                ) : filteredModalUsers.length > 0 ? (
                  filteredModalUsers.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => handleSelectUser(u)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <img 
                        src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} 
                        className="w-10 h-10 rounded-full bg-white/10 object-cover border border-white/5" 
                        alt="" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{u.full_name || u.username || "Builder"}</span>
                        <span className="text-xs text-white/40">@{u.username || "builder"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/30 text-sm">No builders found.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
