"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, query, limit, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserProjects } from "@/lib/projects";
import { 
  Search, MoreHorizontal, Cpu, Flame, Users, Star, 
  Terminal, ArrowUpRight, Volume2, Zap, ArrowRight, ShieldCheck,
  Smartphone
} from "lucide-react";

type Builder = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  tagline: string;
  stack?: string[];
};

type Project = {
  id: string;
  name?: string;
  description?: string;
  tech_stack?: string[] | string;
  created_at?: string;
};

export default function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [suggestedUsers, setSuggestedUsers] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(247);

  useEffect(() => {
    if (!db) return;
    const coll = collection(db, "app_waitlist");
    const unsubscribe = onSnapshot(
      coll,
      (snapshot) => {
        setWaitlistCount(snapshot.size || 247);
      },
      (error) => {
        console.error("Error listening to waitlist:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "builder_profiles"), limit(5));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => {
          const data = doc.data();
          // Fallback mock stacks for visual aesthetic
          const mockStacks = [
            ["Rust", "WASM", "Go"],
            ["Next.js", "React", "TypeScript"],
            ["Python", "PyTorch", "MLOps"],
            ["Solidity", "Ethereum", "Ethers"],
            ["Docker", "K8s", "AWS"]
          ];
          const seedIdx = doc.id.charCodeAt(0) % mockStacks.length;
          return {
            id: doc.id,
            username: data.username || data.email?.split('@')[0] || "user",
            name: data.full_name || "Builder",
            avatar: data.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + doc.id,
            tagline: data.availability || "Building in public",
            stack: mockStacks[seedIdx]
          };
        });
        setSuggestedUsers(users.filter(u => u.id !== user?.uid));
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.uid) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      try {
        const { data } = await getUserProjects(user.uid);
        setProjects((data || []).slice(0, 3) as Project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Redesigned premium cards
  const glassCardStyle = "bg-gradient-to-br from-[#121417] to-[#0a0b0d] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 rounded-[20px] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]";

  return (
    <div className="hidden lg:flex w-[350px] min-w-[350px] flex-col h-full bg-transparent p-4 gap-5 overflow-y-auto no-scrollbar relative z-10">
      
      {/* 1. Neon Glow Search Bar */}
      <div className="relative group w-full">
        <input
          type="text"
          placeholder="Search projects, builders, agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[46px] pl-12 pr-4 text-[14px] text-white placeholder-white/30 bg-[#15171a] rounded-[16px] outline-none border border-white/[0.04] focus:bg-[#000] focus:border-[#4f46e5] focus:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all duration-300"
        />
        <Search className="w-4 h-4 text-white/40 absolute left-4.5 top-3.5 group-focus-within:text-[#6366f1] transition-colors" />
      </div>

      {/* Mobile App Pre-registration Card - Premium Redesign */}
      <section 
        className="relative overflow-hidden w-full shrink-0 group rounded-3xl p-[1px] cursor-pointer"
        onClick={() => window.open("/pre-register", "_blank")}
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        
        {/* Inner Content Container */}
        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl p-5 h-full border border-white/5 flex flex-col gap-3">
          
          {/* Animated Glow in background */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-700 pointer-events-none" />
          
          {/* Top Row: Badge & Icon */}
          <div className="flex justify-between items-center w-full relative z-10">
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-purple-300 text-[10px] font-bold uppercase tracking-wider">Mobile App</span>
            </div>
            <div className="p-1.5 bg-white/5 rounded-full text-white/50 group-hover:text-white transition-colors duration-300">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          {/* Heading */}
          <div className="relative z-10 mt-1">
            <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              CollabSphere Go
            </h3>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              Take your builder journey anywhere. Pre-register for early access.
            </p>
          </div>

          {/* Live counter & Progress */}
          <div className="relative z-10 mt-2 bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-purple-500/20 transition-colors duration-300">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-white/70 font-medium">Waitlist Goal</span>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                🔥 {waitlistCount}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full relative transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((waitlistCount / 500) * 100, 100)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
            <div className="text-[10px] text-white/40 mt-1.5 text-right font-medium tracking-wide">500 BUILDERS</div>
          </div>

          {/* Button */}
          <div
            className="relative z-10 w-full mt-2 bg-white text-black hover:bg-gray-100 text-sm rounded-xl py-2.5 font-bold transition-all duration-300 active:scale-[0.98] text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Pre-register Now
          </div>

          {/* Bottom text */}
          <p className="text-[10px] text-white/30 text-center relative z-10 mt-1">
            Available soon on iOS & Android
          </p>
        </div>
      </section>

      {/* 2. Premium upgrade card (Pro Builder Workspace) */}
      <section className={`${glassCardStyle} relative overflow-hidden shrink-0`}>
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_75%)] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#6366f1]/10 text-[#6366f1]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#6366f1] uppercase">PRO WORKSPACE</span>
        </div>

        <h2 className="text-[18px] font-extrabold text-[#e7e9ea] leading-tight mb-2">
          Upgrade to <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Pro Builder</span>
        </h2>
        <p className="text-[13px] text-white/60 leading-relaxed mb-4">
          Unlock unlimited AI co-pilots, custom domain deployment, and 24/7 worker uptime credits.
        </p>
        <button 
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-[13px] py-2.5 px-4 rounded-[12px] transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Claim Pro Access</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 3. AI Co-builder Matchmaker Card */}
      <section className={glassCardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h2 className="text-[15px] font-bold text-white tracking-tight">AI Co-builder Matches</h2>
          </div>
          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase animate-pulse">Matchmaking</span>
        </div>
        
        <div className="flex flex-col gap-4">
          {loadingUsers ? (
            <div className="text-[13px] text-white/40 font-mono py-2">Calculating matches...</div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.slice(0, 2).map((u) => (
              <div key={u.id} className="flex flex-col gap-2 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-2.5">
                  <img src={u.avatar} alt={u.username} className="h-9 w-9 rounded-full object-cover bg-neutral-800 flex-shrink-0" />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-[14px] font-bold text-[#e7e9ea] truncate hover:underline leading-tight flex items-center gap-1">
                      {u.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/10 shrink-0" />
                    </span>
                    <span className="text-[12px] text-white/40 truncate">@{u.username}</span>
                  </div>
                </div>
                
                <p className="text-[12px] text-white/60 line-clamp-1 leading-normal italic pl-1">
                  "{u.tagline}"
                </p>

                {/* Tech Match Stack */}
                <div className="flex flex-wrap gap-1 mt-1 pl-1">
                  {u.stack?.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/[0.06] text-white/50">
                      {s}
                    </span>
                  ))}
                </div>

                <button 
                  className="mt-2 w-full bg-white text-black hover:bg-neutral-200 font-bold text-[12px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Request Pairing</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-[13px] text-white/40">Searching for new builders...</div>
          )}
        </div>
      </section>

      {/* 4. Live Collab Rooms (Voice Pairing Rooms) */}
      <section className={glassCardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-[15px] font-bold text-white tracking-tight">Collab Live</h2>
          </div>
          <div className="flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-[#A8A8A8] font-mono font-medium">8 online</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] rounded-xl cursor-pointer transition-colors group">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[13px] font-bold text-[#e7e9ea] group-hover:text-[#6366f1] transition-colors truncate">Rust Agent Compiler pairing</span>
              <span className="text-[11px] text-white/40">3 builders · Live code session</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#6366f1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] rounded-xl cursor-pointer transition-colors group">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[13px] font-bold text-[#e7e9ea] group-hover:text-[#6366f1] transition-colors truncate">React 19 Server Actions Chat</span>
              <span className="text-[11px] text-white/40">2 builders · General Q&A</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#6366f1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </div>
      </section>

      {/* 5. Top Ships of the Week */}
      <section className={glassCardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-orange-500" />
          <h2 className="text-[15px] font-bold text-white tracking-tight">Top Ships of the Week</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-3 px-3 py-2 rounded-xl transition-colors group">
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-[#6366f1] font-bold">1 · SHIPPED</span>
              <div className="text-[14px] font-bold text-[#e7e9ea] mt-0.5 group-hover:underline leading-snug truncate">cyber-core-dashboard</div>
              <p className="text-[12px] text-white/50 truncate mt-0.5">Customizable dev dashboard client</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.05]">TypeScript</span>
                <span className="text-[11px] text-white/40 flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 184
                </span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-white/30 hover:text-white" />
          </div>

          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-3 px-3 py-2 rounded-xl transition-colors group">
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-[#10b981] font-bold">2 · LIVE</span>
              <div className="text-[14px] font-bold text-[#e7e9ea] mt-0.5 group-hover:underline leading-snug truncate">nova-protocol-api</div>
              <p className="text-[12px] text-white/50 truncate mt-0.5">Cross-chain network data broker</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.05]">Go</span>
                <span className="text-[11px] text-white/40 flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 122
                </span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-white/30 hover:text-white" />
          </div>

          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-3 px-3 py-2 rounded-xl transition-colors group">
            <div className="min-w-0">
              <span className="text-[11px] font-mono text-yellow-500 font-bold">3 · BETA</span>
              <div className="text-[14px] font-bold text-[#e7e9ea] mt-0.5 group-hover:underline leading-snug truncate">orbital-db-tracker</div>
              <p className="text-[12px] text-white/50 truncate mt-0.5">P2P database node sync client</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/[0.05]">Rust</span>
                <span className="text-[11px] text-white/40 flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 98
                </span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-white/30 hover:text-white" />
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="px-4 text-[12px] text-[#71767b] flex flex-wrap gap-x-3 gap-y-1.5 leading-normal select-none mb-6">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Cookie Policy</span>
        <span className="hover:underline cursor-pointer">Developer Rules</span>
        <span>© 2026 CollabSphere Corp.</span>
      </div>

    </div>
  );
}
