"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { subscribeToChats, subscribeToMessages, sendMessage, createChat } from "@/lib/chats";
import { Send, MessageSquare, Search, Plus, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { collection, query, getDocs } from "firebase/firestore";
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
  const [users, setUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToChats(user.uid, (data) => setChats(data));
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!activeChatId) return;
    const unsub = subscribeToMessages(activeChatId, (data) => setMessages(data));
    return () => unsub();
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    setIsSearching(true);
    try {
      const q = query(collection(db, "builder_profiles"));
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.id !== user.uid && 
          ((u as any).username?.includes(searchQuery) || (u as any).full_name?.includes(searchQuery)));
      setUsers(results);
    } catch (e) {}
    setIsSearching(false);
  };

  const startChat = async (targetUserId: string) => {
    if (!user) return;
    // Check if chat already exists
    const existingChat = chats.find(c => c.participants.includes(targetUserId) && c.participants.includes(user.uid));
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setSearchQuery("");
      setUsers([]);
      return;
    }
    // Create new
    const { data } = await createChat([user.uid, targetUserId]);
    if (data) {
      setActiveChatId(data);
      setSearchQuery("");
      setUsers([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId || !user) return;
    
    const content = newMessage.trim();
    setNewMessage(""); // optimistic clear
    
    await sendMessage({
      chatId: activeChatId,
      senderId: user.uid,
      senderName: user.displayName || user.email?.split("@")[0] || "Builder",
      senderAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      content
    });
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
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 flex h-full overflow-hidden relative z-10 lg:pl-[72px]">
        {/* Chat List Pane */}
        <div className="w-full md:w-[350px] border-r border-white/5 flex flex-col h-full bg-[#050505] shrink-0">
          <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-bold tracking-tight text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Discussions
            </h1>
            
            {/* Search / New Chat */}
            <div className="relative">
              <input
                type="text"
                placeholder="Find a builder to chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
            {users.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider px-3 mb-2">Search Results</h3>
                {users.map(u => (
                  <div key={u.id} onClick={() => startChat(u.id)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors">
                    <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-10 h-10 rounded-full bg-white/10" alt="" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{u.username || "Builder"}</span>
                      <span className="text-xs text-white/40">Start a discussion</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider px-3 mb-2 mt-2">Active Discussions</h3>
            {chats.length === 0 ? (
              <div className="p-4 text-center text-white/30 text-sm">No discussions yet.</div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-white truncate">Discussion Room</span>
                    </div>
                    <span className="text-xs text-white/50 truncate">{chat.lastMessage || "Started a new discussion"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Chat Pane */}
        <div className={`flex-1 flex flex-col h-full bg-[#080808] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {!activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a discussion or start a new one.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] border-b border-white/5 flex items-center px-6 shrink-0 bg-[#0A0A0A]">
                <h2 className="text-base font-bold text-white">Discussion Room</h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-6">
                {messages.length === 0 ? (
                  <div className="text-center text-white/30 text-sm my-auto">No messages yet. Say hello!</div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id || i} 
                        className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                      >
                        {!isMe && (
                          <img src={msg.senderAvatar} className="w-8 h-8 rounded-full shrink-0 border border-white/5" alt="" />
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && <span className="text-[11px] text-white/40 mb-1 ml-1">{msg.senderName}</span>}
                          <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                            isMe 
                              ? 'bg-white text-black rounded-tr-sm' 
                              : 'bg-white/[0.05] text-white/90 border border-white/5 rounded-tl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-[#0A0A0A] border-t border-white/5 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all focus:bg-white/[0.05]"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
