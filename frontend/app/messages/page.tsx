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
  Search, Plus, Star, ArrowLeft, MoreHorizontal,
  Mail, MapPin, Paperclip, Smile, Mic, Zap, 
  ChevronDown, CheckCircle2, UserCircle2, MessageSquare, 
  Hash, Terminal, Cpu, Send, Info, Globe, Shield, Video, 
  User, Check, ChevronRight, X
} from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

// Mock Channels for CollabSphere community vibe
const mockChannels = [
  { id: "chan-general", name: "general", description: "General community chat for builders" },
  { id: "chan-hackathons", name: "hackathon-collab", description: "Find teammates and brainstorm ideas" },
  { id: "chan-agents", name: "agents-dev", description: "Discussion on autonomous agent architecture" },
  { id: "chan-infra", name: "infra-scaling", description: "Distributed node status and host updates" }
];

// Mock AI Agent workers
const mockAgents = [
  { 
    id: "agent-antigravity", 
    name: "Antigravity Bot", 
    status: "active", 
    role: "Code Synthesizer", 
    tagline: "Autonomous coding agent", 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=antigravity",
    bio: "An autonomous agent running on distributed WebAssembly sandboxes, specializing in code generation, diagnostics, and test writing.",
    node: "us-east-aws-4",
    cpu: "8%",
    memory: "124MB / 512MB",
    accuracy: "99.4%"
  },
  { 
    id: "agent-forge", 
    name: "CodeForge AI", 
    status: "idle", 
    role: "Smart Contract Audit", 
    tagline: "Security validation worker", 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=forge",
    bio: "Automated compiler analyzer checking Solidity, Rust, and Go files for security vulnerabilities and gas optimizations.",
    node: "eu-central-hetzner-12",
    cpu: "0%",
    memory: "68MB / 1024MB",
    accuracy: "99.9%"
  },
  { 
    id: "agent-scribe", 
    name: "ScribeAgent", 
    status: "offline", 
    role: "Docs & Readme Generator", 
    tagline: "Technical writing agent", 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=scribe",
    bio: "Parses AST and codebase changes to automatically draft comprehensive READMEs, setup tutorials, and API endpoints documentation.",
    node: "ap-south-gcp-1",
    cpu: "0%",
    memory: "0MB / 256MB",
    accuracy: "98.2%"
  }
];

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Real-time states
  const [chats, setChats] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<"channel" | "dm" | "agent">("channel");
  const [activeId, setActiveId] = useState<string>("chan-general");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  
  // UI states
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showDetailsPane, setShowDetailsPane] = useState(true);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [searchContactQuery, setSearchContactQuery] = useState("");

  // Simulated local state for Channels & Agents
  const [channelMessages, setChannelMessages] = useState<Record<string, any[]>>({
    "chan-general": [
      { id: "m1", senderName: "Amelia W", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amelia", content: "Just deployed a new multi-agent Swarm to index on-chain events. Super fast!", timestamp: new Date(Date.now() - 3600000) },
      { id: "m2", senderName: "Liam T", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam", content: "Nice! Are you using the custom WASM runner?", timestamp: new Date(Date.now() - 1800000) },
      { id: "m3", senderName: "Amelia W", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amelia", content: "Yes, latency dropped by 40% compared to standard Docker containers.", timestamp: new Date(Date.now() - 60000) }
    ],
    "chan-hackathons": [
      { id: "h1", senderName: "Max P", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max", content: "Looking for a frontend dev for a decentralized agent marketplace. PM me!", timestamp: new Date(Date.now() - 7200000) },
      { id: "h2", senderName: "Keerthan Reddy", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=keerthan", content: "Hey Max, interested. Let's discuss the stack.", timestamp: new Date(Date.now() - 5400000) }
    ],
    "chan-agents": [
      { id: "a1", senderName: "Syne K", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=syne", content: "Should we use reinforcement learning for agent orchestration or simple LLM-based logic trees?", timestamp: new Date(Date.now() - 4000000) }
    ],
    "chan-infra": [
      { id: "i1", senderName: "Liam T", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam", content: "We are seeing some container recycling on iad1 nodes. Investigating memory limits.", timestamp: new Date(Date.now() - 5000000) }
    ]
  });

  const [agentMessages, setAgentMessages] = useState<Record<string, any[]>>({
    "agent-antigravity": [
      { id: "ag1", senderId: "agent-antigravity", senderName: "Antigravity Bot", senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=antigravity", content: "Hello! I am Antigravity. Ready to synthesize code, run diagnostics, or review pull requests. What are we building today?", timestamp: new Date(Date.now() - 3600000) }
    ],
    "agent-forge": [
      { id: "f1", senderId: "agent-forge", senderName: "CodeForge AI", senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=forge", content: "Hey. Send me any Solidity or Rust source code, and I will audit it for vulnerability patterns.", timestamp: new Date(Date.now() - 7200000) }
    ],
    "agent-scribe": [
      { id: "s1", senderId: "agent-scribe", senderName: "ScribeAgent", senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=scribe", content: "I can draft comprehensive API documentations, user guides, or project READMEs. Upload a project description to begin.", timestamp: new Date(Date.now() - 8600000) }
    ]
  });

  const currentUid = user?.uid || "";

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // Load all user profiles from Firestore
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

  // Load user chats from Firestore
  useEffect(() => {
    if (!currentUid) return;
    const unsub = subscribeToChats(currentUid, (data) => setChats(data));
    return () => unsub();
  }, [currentUid]);

  // Subscribe to live Firestore messages if a DM is active
  useEffect(() => {
    if (activeType !== "dm" || !activeId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(activeId, (data) => {
      setMessages(data);
    });
    return () => unsub();
  }, [activeId, activeType]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, channelMessages, agentMessages, activeId, activeType, isAgentTyping]);

  // Mark conversations read in Firestore DMs
  useEffect(() => {
    if (activeType !== "dm" || !activeId || !currentUid) return;
    markConversationAsRead(activeId, currentUid);
  }, [activeId, activeType, messages, currentUid]);

  // Get agent replies dynamically
  const getAgentResponse = (agentId: string, userText: string) => {
    const text = userText.toLowerCase();
    if (agentId === "agent-antigravity") {
      if (text.includes("help") || text.includes("how")) {
        return "I can help you build web applications, write backend scripts, configure Docker files, or write unit tests. Just describe the features you need!";
      }
      if (text.includes("hello") || text.includes("hi")) {
        return "Hello builder! Ready to ship some code. What project are we cooking up today?";
      }
      return "Understood. I will analyze the codebase configuration and start synthesizing the changes. Would you like me to construct an implementation plan first?";
    } else if (agentId === "agent-forge") {
      if (text.includes("audit") || text.includes("contract") || text.includes("rust")) {
        return "Scanning source code for common reentrancy issues, integer overflows, and authorization flaws... I'll generate a complete report shortly.";
      }
      return "Please paste your smart contract code block, and I will analyze its gas efficiency and safety constraints.";
    } else { // agent-scribe
      return "Structure looks solid. I am generating the API endpoint documentation and installation walkthrough. Do you want it in markdown format?";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const content = newMessage.trim();
    setNewMessage("");

    if (activeType === "dm") {
      await sendMessage({
        chatId: activeId,
        senderId: currentUid,
        content
      });
    } else if (activeType === "channel") {
      // Add local message to simulated channel
      const updatedMessages = [...(channelMessages[activeId] || [])];
      updatedMessages.push({
        id: "local-" + Date.now(),
        senderName: user?.displayName || user?.email?.split("@")[0] || "You",
        senderAvatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUid}`,
        content,
        timestamp: new Date()
      });
      setChannelMessages({
        ...channelMessages,
        [activeId]: updatedMessages
      });
    } else if (activeType === "agent") {
      // Add local message to agent chat
      const updatedMessages = [...(agentMessages[activeId] || [])];
      updatedMessages.push({
        id: "local-" + Date.now(),
        senderId: currentUid,
        senderName: user?.displayName || user?.email?.split("@")[0] || "You",
        senderAvatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUid}`,
        content,
        timestamp: new Date()
      });
      setAgentMessages({
        ...agentMessages,
        [activeId]: updatedMessages
      });

      // Trigger agent automated response
      setIsAgentTyping(true);
      setTimeout(() => {
        setIsAgentTyping(false);
        const reply = getAgentResponse(activeId, content);
        const newBotMessage = {
          id: "bot-" + Date.now(),
          senderId: activeId,
          senderName: mockAgents.find(a => a.id === activeId)?.name || "Agent",
          senderAvatar: mockAgents.find(a => a.id === activeId)?.avatar || "",
          content: reply,
          timestamp: new Date()
        };
        setAgentMessages(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), newBotMessage]
        }));
      }, 1500);
    }
  };

  // Create new DM conversation with chosen builder
  const handleCreateOrOpenChat = async (builderId: string) => {
    setShowNewChatModal(false);
    
    // Check if DM conversation already exists
    const existingChat = chats.find(c => c.participants.includes(builderId));
    if (existingChat) {
      setActiveId(existingChat.id);
      setActiveType("dm");
      setShowChatMobile(true);
      return;
    }

    // Otherwise, create a new conversation document in Firestore
    const { data: newId, error } = await createChat([currentUid, builderId]);
    if (newId) {
      setActiveId(newId);
      setActiveType("dm");
      setShowChatMobile(true);
    } else {
      console.error("Failed to create conversation:", error);
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Filter Firestore DM chats by builder name
  const filteredDMs = chats.filter(chat => {
    const otherUid = chat.participants.find((p: string) => p !== currentUid);
    const otherProfile = profiles[otherUid] || {};
    const username = (otherProfile.username || "").toLowerCase();
    const fullName = (otherProfile.full_name || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return username.includes(q) || fullName.includes(q);
  });

  // Filter contact list in "New Chat" modal
  const filteredContacts = Object.values(profiles).filter((prof: any) => {
    if (prof.id === currentUid) return false;
    const name = (prof.full_name || prof.username || "").toLowerCase();
    const q = searchContactQuery.toLowerCase();
    return name.includes(q);
  });

  // Calculate current active recipient details
  let activeRecipientProfile: any = null;
  let activeRecipientMessages: any[] = [];
  let chatName = "";
  let chatDescription = "";

  if (activeType === "dm") {
    const activeChat = chats.find(c => c.id === activeId);
    if (activeChat) {
      const otherUid = activeChat.participants.find((p: string) => p !== currentUid);
      activeRecipientProfile = profiles[otherUid] || { id: otherUid, username: "Builder" };
      chatName = activeRecipientProfile.full_name || activeRecipientProfile.username;
      chatDescription = activeRecipientProfile.availability || "Building in public";
    }
    activeRecipientMessages = messages;
  } else if (activeType === "channel") {
    const channel = mockChannels.find(c => c.id === activeId);
    if (channel) {
      chatName = `#${channel.name}`;
      chatDescription = channel.description;
    }
    activeRecipientMessages = channelMessages[activeId] || [];
  } else if (activeType === "agent") {
    const agent = mockAgents.find(a => a.id === activeId);
    if (agent) {
      activeRecipientProfile = agent;
      chatName = agent.name;
      chatDescription = agent.tagline;
    }
    activeRecipientMessages = agentMessages[activeId] || [];
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden selection:bg-violet-500/20 selection:text-white relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
        <div className="absolute top-[10%] left-[25%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0,transparent_60%)] blur-[80px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0,transparent_60%)] blur-[80px]" />
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex h-screen overflow-hidden relative z-10 md:pl-[72px]">
        
        {/* ====================================================
            PANE 1: CONVERSATIONS LIST 
            ==================================================== */}
        <div className={`
          w-full md:w-[310px] bg-[#090909] border-r border-white/5 flex flex-col h-full shrink-0
          ${showChatMobile ? "hidden md:flex" : "flex"}
        `}>
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Discussions
              </h2>
            </div>
            
            {/* Search */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-[13px] text-white placeholder-white/35 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
              />
              <Search className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-6">
            
            {/* Section 1: Community Channels */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-black tracking-wider text-white/30 uppercase">Channels</span>
              </div>
              <div className="space-y-0.5">
                {mockChannels.map((channel) => {
                  const isActive = activeType === "channel" && activeId === channel.id;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => {
                        setActiveType("channel");
                        setActiveId(channel.id);
                        setShowChatMobile(true);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all border ${
                        isActive
                          ? "bg-violet-600/10 border-violet-500/20 text-white font-semibold"
                          : "bg-transparent border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <Hash className={`w-4 h-4 ${isActive ? "text-violet-400" : "text-white/30"}`} />
                      <span className="text-[13.5px] truncate">{channel.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-black tracking-wider text-white/30 uppercase">Direct Messages</span>
                <button 
                  onClick={() => setShowNewChatModal(true)}
                  className="p-1 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="New DM"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {filteredDMs.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-white/30 italic">No direct messages started.</div>
                ) : (
                  filteredDMs.map((chat) => {
                    const otherUid = chat.participants.find((p: string) => p !== currentUid);
                    const otherProfile = profiles[otherUid] || { username: "Builder" };
                    const isActive = activeType === "dm" && activeId === chat.id;
                    const unreadCount = chat.unreadCount?.[currentUid] || 0;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          setActiveType("dm");
                          setActiveId(chat.id);
                          setShowChatMobile(true);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                          isActive
                            ? "bg-violet-600/10 border-violet-500/20 text-white"
                            : "bg-transparent border-transparent hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={otherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUid}`}
                            className="w-8 h-8 rounded-full object-cover border border-white/10 bg-white/5"
                            alt=""
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090909]"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-1">
                            <span className="text-[13.5px] font-bold text-white truncate">
                              {otherProfile.full_name || otherProfile.username}
                            </span>
                            <span className="text-[10px] text-white/30 font-medium shrink-0">
                              {formatMessageTime(chat.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <span className={`text-[12px] truncate ${unreadCount > 0 ? "text-white font-semibold" : "text-white/40"}`}>
                              {chat.lastMessage || "Click to start chatting"}
                            </span>
                            {unreadCount > 0 && (
                              <span className="h-4 min-w-4 px-1 rounded-full bg-violet-600 text-white flex items-center justify-center text-[9px] font-black shrink-0 animate-pulse">
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

            {/* Section 3: AI Workers */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-black tracking-wider text-white/30 uppercase">AI Workers</span>
              </div>
              <div className="space-y-0.5">
                {mockAgents.map((agent) => {
                  const isActive = activeType === "agent" && activeId === agent.id;
                  const isOnline = agent.status === "active";
                  return (
                    <div
                      key={agent.id}
                      onClick={() => {
                        setActiveType("agent");
                        setActiveId(agent.id);
                        setShowChatMobile(true);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all border ${
                        isActive
                          ? "bg-violet-600/10 border-violet-500/20 text-white"
                          : "bg-transparent border-transparent hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={agent.avatar}
                          className="w-8 h-8 rounded-full object-cover border border-white/10 bg-white/5 p-0.5"
                          alt=""
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#090909] ${
                          isOnline ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" : "bg-white/20"
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-[13.5px] font-medium block truncate ${isActive ? "text-white font-semibold" : "text-white/70"}`}>
                          {agent.name}
                        </span>
                        <span className="text-[10.5px] text-cyan-400/70 block truncate tracking-wide">{agent.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ====================================================
            PANE 2: ACTIVE CHAT PANE
            ==================================================== */}
        <div className={`
          flex-1 flex flex-col h-full bg-[#050505] relative border-r border-white/5
          ${showChatMobile ? "flex" : "hidden md:flex"}
        `}>
          {/* Header */}
          <div className="h-[72px] border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#090909]/60 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              {/* Back button for mobile */}
              <button 
                onClick={() => setShowChatMobile(false)}
                className="md:hidden p-1.5 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                {activeType === "channel" ? (
                  <div className="w-9 h-9 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-violet-400" />
                  </div>
                ) : (
                  <>
                    <img 
                      src={activeRecipientProfile?.avatar_url || activeRecipientProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`}
                      className="w-9 h-9 rounded-full object-cover border border-white/10 bg-white/5"
                      alt=""
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#050505] ${
                      activeType === "agent" && activeRecipientProfile?.status !== "active" ? "bg-white/30" : "bg-emerald-500"
                    }`} />
                  </>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15.5px] font-bold text-white tracking-tight leading-none">
                    {chatName}
                  </span>
                </div>
                <span className="text-[11.5px] text-white/40 block truncate max-w-[200px] mt-0.5">
                  {chatDescription}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDetailsPane(!showDetailsPane)}
                className={`p-2 rounded-xl transition-all border ${
                  showDetailsPane 
                    ? "bg-violet-600/10 border-violet-500/20 text-violet-400" 
                    : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
                title="Info panel"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            
            <div className="flex justify-center mb-6">
              <span className="text-[11px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50">
                Beginning of message history
              </span>
            </div>

            {/* Render actual messages */}
            {activeRecipientMessages.map((msg, i) => {
              const isMe = activeType === "dm" ? msg.senderId === currentUid : msg.senderName === user?.displayName || msg.senderName === user?.email?.split("@")[0] || msg.senderName === "You";
              const senderAvatar = isMe ? (user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUid}`) : (msg.senderAvatar || activeRecipientProfile?.avatar_url || activeRecipientProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName || activeId}`);
              
              return (
                <div key={msg.id || i} className={`flex max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'} gap-3 items-start`}>
                  <img 
                    src={senderAvatar} 
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white/10 bg-white/5" 
                    alt="" 
                  />
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[12px] font-bold text-white/90">
                        {isMe ? "You" : (msg.senderName || chatName)}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>

                    <div className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed break-words border ${
                      isMe 
                        ? 'bg-violet-600/10 border-violet-500/20 text-white rounded-tr-none' 
                        : 'bg-white/[0.02] border-white/5 text-white/90 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Agent Typing Animation */}
            {isAgentTyping && (
              <div className="flex max-w-[85%] self-start gap-3 items-start">
                <img 
                  src={activeRecipientProfile?.avatar} 
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white/10 bg-white/5" 
                  alt="" 
                />
                <div className="flex flex-col items-start">
                  <span className="text-[12px] font-bold text-white/90 mb-1">{chatName}</span>
                  <div className="px-4 py-3 bg-white/[0.02] border border-white/5 text-white/90 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <div className="p-4 bg-[#090909]/40 backdrop-blur-md border-t border-white/5 shrink-0">
            <form onSubmit={handleSendMessage} className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 flex flex-col gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeType === "agent" ? `Ask ${chatName}...` : `Message ${chatName}...`}
                className="w-full bg-transparent text-[13.5px] text-white placeholder-white/30 outline-none py-1.5 px-3"
              />
              
              <div className="flex items-center justify-between border-t border-white/5 pt-2 px-1">
                {/* Tools */}
                <div className="flex items-center gap-1.5 text-white/40">
                  <button type="button" className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Smile className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Terminal className="w-4 h-4" /></button>
                </div>
                
                {/* Send action */}
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl h-9 px-4 text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ====================================================
            PANE 3: DETAILS SIDEBAR
            ==================================================== */}
        <AnimatePresence>
          {showDetailsPane && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="hidden xl:flex w-[300px] bg-[#070707] border-l border-white/5 flex-col h-full shrink-0 overflow-y-auto no-scrollbar"
            >
              {activeType === "channel" ? (
                // Channel Detail View
                <div className="p-6">
                  <h3 className="text-[11px] font-black tracking-widest text-white/35 uppercase mb-6">Channel Details</h3>
                  
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                    <Hash className="w-7 h-7 text-violet-400" />
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1">{chatName}</h4>
                  <p className="text-xs text-white/40 mb-6 font-medium">Public community channel</p>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-[11px] font-bold text-white/70 uppercase mb-2">Description</h5>
                      <p className="text-sm text-white/60 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        {chatDescription}
                      </p>
                    </div>

                    <div className="w-full h-px bg-white/5"></div>

                    <div>
                      <h5 className="text-[11px] font-bold text-white/70 uppercase mb-3">Online Builders</h5>
                      <div className="space-y-3">
                        {[
                          { name: "Amelia W", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amelia" },
                          { name: "Liam T", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam" },
                          { name: "Max P", status: "offline", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=max" }
                        ].map((m, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img src={m.avatar} className="w-6 h-6 rounded-full border border-white/10" alt="" />
                            <span className="text-sm text-white/80 font-medium">{m.name}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeType === "agent" ? (
                // AI Agent Detail View
                <div className="p-6">
                  <h3 className="text-[11px] font-black tracking-widest text-white/35 uppercase mb-6">Agent Node</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={activeRecipientProfile?.avatar} 
                      className="w-12 h-12 rounded-full border border-white/10 p-0.5 bg-white/5" 
                      alt="" 
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white leading-none mb-1">{chatName}</h4>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wide">
                        {activeRecipientProfile?.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="text-[11px] font-bold text-white/70 uppercase mb-2">Description</h5>
                      <p className="text-[12.5px] text-white/60 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        {activeRecipientProfile?.bio}
                      </p>
                    </div>

                    <div className="w-full h-px bg-white/5"></div>

                    <div>
                      <h5 className="text-[11px] font-bold text-white/70 uppercase mb-3">Node Metrics</h5>
                      <div className="space-y-3 font-mono text-xs text-white/60 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                        <div className="flex justify-between">
                          <span>HOST NODE:</span>
                          <span className="text-white">{activeRecipientProfile?.node}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CPU LOAD:</span>
                          <span className="text-cyan-400">{activeRecipientProfile?.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MEMORY:</span>
                          <span className="text-white">{activeRecipientProfile?.memory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ACCURACY:</span>
                          <span className="text-white">{activeRecipientProfile?.accuracy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Builder DM Detail View
                <div className="p-6">
                  <h3 className="text-[11px] font-black tracking-widest text-white/35 uppercase mb-6">Builder Profile</h3>
                  
                  <div className="flex flex-col items-center text-center mb-6">
                    <img 
                      src={activeRecipientProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeId}`} 
                      className="w-16 h-16 rounded-full border border-white/10 bg-white/5 object-cover mb-3" 
                      alt="" 
                    />
                    <h4 className="text-lg font-bold text-white leading-tight">
                      {activeRecipientProfile?.full_name || activeRecipientProfile?.username}
                    </h4>
                    <span className="text-xs text-violet-400 font-medium mt-1">
                      {activeRecipientProfile?.role || "Developer"}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {activeRecipientProfile?.bio && (
                      <div>
                        <h5 className="text-[11px] font-bold text-white/70 uppercase mb-2">Bio</h5>
                        <p className="text-[13px] text-white/60 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                          {activeRecipientProfile.bio}
                        </p>
                      </div>
                    )}

                    <div className="w-full h-px bg-white/5"></div>

                    <div className="space-y-3 text-xs text-white/70">
                      {activeRecipientProfile?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-white/30 shrink-0" />
                          <span className="text-white">{activeRecipientProfile.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-white/30 shrink-0" />
                        <span className="truncate text-white">{activeRecipientProfile?.email || activeRecipientProfile?.id + "@collabsphere.dev"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* ====================================================
          MODAL: START A NEW DM
          ==================================================== */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewChatModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Dialog Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090909] border border-white/10 w-full max-w-md rounded-[28px] overflow-hidden relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Start New Conversation</h3>
                <button 
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search contacts */}
              <div className="p-4 border-b border-white/5">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search by builder name..."
                    value={searchContactQuery}
                    onChange={(e) => setSearchContactQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-[13px] text-white placeholder-white/35 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                  />
                  <Search className="w-4 h-4 text-white/30 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Contacts List */}
              <div className="max-h-[300px] overflow-y-auto no-scrollbar p-3 space-y-1">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-10 text-xs text-white/30">No other builders found.</div>
                ) : (
                  filteredContacts.map((prof: any) => (
                    <div
                      key={prof.id}
                      onClick={() => handleCreateOrOpenChat(prof.id)}
                      className="flex items-center gap-3 p-2.5 hover:bg-white/[0.03] rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5"
                    >
                      <img 
                        src={prof.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prof.id}`}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                        alt="" 
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[13.5px] font-bold text-white block truncate">
                          {prof.full_name || prof.username}
                        </span>
                        <span className="text-[11px] text-white/40 block truncate">
                          {prof.role || "Builder"}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
