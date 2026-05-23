"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Home,
  Bell,
  Bookmark,
  ChevronDown,
  Compass,
  Folder,
  FileText,
  Users,
  Trophy,
  MessageSquare,
  Plus,
  Search,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Mic,
  Play,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type FeedTabKey = "for-you" | "updates" | "teammates" | "logs";

// Mock trending builders matching visual indicators
const trendingBuilders = [
  { name: "Riya Sharma", username: "riya_codes", role: "AI Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Dev Patel", username: "dev.builds", role: "Full Stack", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "João Silva", username: "joaodev", role: "Web3 Dev", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Anika Lee", username: "anikalee", role: "Product Dev", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Sam Williams", username: "sam.codes", role: "Mobile Dev", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80" },
];

const fallbackHackathons = [
  { id: 1, name: "AI Startup Sprint", date: "Apr 20 - Apr 27", builders: "1.2K", color: "bg-[#7A5BFF]" },
  { id: 2, name: "Build for India", date: "May 5 - May 11", builders: "856", color: "bg-[#A3E635]" },
  { id: 3, name: "Web3 Builders", date: "May 12 - May 18", builders: "732", color: "bg-[#7A5BFF]" },
];

export default function DashboardHomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<FeedTabKey>("for-you");
  const [isTeamMode, setIsTeamMode] = useState(true);
  const [builders, setBuilders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSetupDismissed, setIsSetupDismissed] = useState(false);
  const [setupDone, setSetupDone] = useState<Record<string, boolean>>({});

  // Auth redirect — if not signed in, go to landing page
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Mark a setup step as done inline
  const markSetupDone = (key: string) => {
    setSetupDone((prev) => ({ ...prev, [key]: true }));
  };

  // Load team builders from Supabase
  useEffect(() => {
    const loadBuilders = async () => {
      try {
        const { data, error } = await supabase
          .from("builder_profiles")
          .select("full_name, username, avatar_url")
          .limit(5);

        if (!error && data && data.length > 0) {
          const merged = trendingBuilders.map((tb, idx) => {
            if (data[idx]) {
              return {
                name: data[idx].full_name || tb.name,
                username: data[idx].username || tb.username,
                role: tb.role,
                avatar: data[idx].avatar_url || tb.avatar,
              };
            }
            return tb;
          });
          setBuilders(merged);
        } else {
          setBuilders(trendingBuilders);
        }
      } catch (err) {
        setBuilders(trendingBuilders);
      }
    };
    loadBuilders();
  }, []);

  // Logged-in user dynamically greeting the builder
  const greetingName = useMemo(() => {
    if (!user) return "Keerthan";
    return user.firstName || user.fullName || "Keerthan";
  }, [user]);

  const userAvatar = useMemo(() => {
    return user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
  }, [user]);

  const currentUser = useMemo(() => {
    return {
      fullName: user?.fullName || "Keerthan Reddy",
      username: user?.username || "keerthan_codes",
      imageUrl: userAvatar,
    };
  }, [user, userAvatar]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E5EEFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A5BFF] border-t-transparent" />
          <p className="text-sm font-semibold text-[#7A5BFF]/70">Entering Collabsphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3FF] via-[#F4F7FF] to-[#FCFDFF] text-[#1D1E22] antialiased font-sans relative pb-12 lg:pb-16 overflow-x-hidden">
      
      {/* Waveform Soundwave & Orbit Glow CSS Keyframes */}
      <style jsx global>{`
        @keyframes pulseWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.35); }
        }
        .animate-wave-1 { animation: pulseWave 1.1s ease-in-out infinite; }
        .animate-wave-2 { animation: pulseWave 0.8s ease-in-out infinite 0.15s; }
        .animate-wave-3 { animation: pulseWave 1.4s ease-in-out infinite 0.3s; }
        .animate-wave-4 { animation: pulseWave 0.9s ease-in-out infinite 0.05s; }
        .animate-wave-5 { animation: pulseWave 1.2s ease-in-out infinite 0.25s; }
        .animate-wave-6 { animation: pulseWave 0.7s ease-in-out infinite 0.4s; }
        .animate-wave-7 { animation: pulseWave 1.3s ease-in-out infinite 0.1s; }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.25; }
        }
        .animate-glow { animation: pulseGlow 4s ease-in-out infinite; }
      `}</style>

      {/* Premium subtle dot grid texture background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(#7A5BFF 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft ambient purple/blue blur glows (Options 1 & 3) */}
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#7A5BFF]/6 blur-[120px] pointer-events-none z-0 animate-glow" />
      <div className="absolute top-[40%] right-[5%] w-[700px] h-[700px] rounded-full bg-[#3B82F6]/6 blur-[140px] pointer-events-none z-0 animate-glow" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#C4B5FD]/5 blur-[110px] pointer-events-none z-0 animate-glow" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 py-6 lg:pl-[304px]">
        
        {/* ==================== MAIN CONTENT + RIGHT WIDGETS GRID ==================== */}
        <div className="grid items-start grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8">

          {/* ==================== LEFT SIDEBAR ==================== */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] transform overflow-y-auto bg-white/80 p-6 backdrop-blur-2xl transition-transform duration-300 border-r border-white/50 lg:inset-y-6 lg:left-6 lg:z-auto lg:h-[calc(100vh-48px)] lg:max-h-[calc(100vh-48px)] lg:translate-x-0 lg:overflow-hidden lg:border-none lg:bg-transparent lg:p-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

            <div className="flex flex-col justify-between h-full bg-white/70 border border-white/50 rounded-[32px] p-5 shadow-[0_12px_40px_rgba(31,38,135,0.02)] backdrop-blur-xl">

              <div>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6 group cursor-pointer" onClick={() => router.push("/dashboard/home")}>
                  <div className="flex items-center justify-center w-5.5 h-5.5 rounded-[7px] bg-[#121315] text-[#F3F7FF] font-black text-xs select-none transition-transform group-hover:rotate-[30deg]">
                    <span className="leading-none select-none font-bold text-sm">*</span>
                  </div>
                  <span className="text-base font-black tracking-tight text-[#121315] font-sans">collabsphere</span>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EAEBF4]/40 hover:bg-[#EAEBF4]/60 focus:bg-white focus:ring-2 focus:ring-[#7A5BFF]/30 border border-transparent focus:border-[#7A5BFF]/40 pl-9 pr-12 py-2.5 rounded-2xl text-xs placeholder-gray-400 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm text-[9px] font-bold text-gray-400 select-none">
                    <span>⌘</span><span>K</span>
                  </div>
                </div>

                {/* Nav */}
                <nav className="space-y-1 mb-6">
                  {[
                    { key: "home", label: "Home", icon: Home, active: true },
                    { key: "builders", label: "Discover Builders", icon: Compass },
                    { key: "projects", label: "Projects", icon: Folder },
                    { key: "logs", label: "Build Log", icon: FileText },
                    { key: "teams", label: "Teams", icon: Users },
                    { key: "hackathons", label: "Hackathons", icon: Trophy },
                    { key: "messages", label: "Messages", icon: MessageSquare, badge: "12" },
                    { key: "notifications", label: "Notifications", icon: Bell, badge: "8" },
                    { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                          item.active
                            ? "bg-[#E9E7FF] text-[#7A5BFF]"
                            : "text-[#62636C] hover:bg-gray-100/50 hover:text-black"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.active ? "text-[#7A5BFF]" : "text-[#7B7C85]"}`} />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            item.active ? "bg-[#7A5BFF] text-white" : "bg-[#E9E7FF] text-[#7A5BFF]"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Your Spaces */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-[#9EA0A8] tracking-widest uppercase block pl-3 text-left">Your Spaces</span>
                  <div className="space-y-1">
                    {[
                      { label: "AI Side Project", dotColor: "bg-[#CDFF3D]" },
                      { label: "SaaS Founders", dotColor: "bg-[#B69DFF]" },
                      { label: "Indie Hackers", dotColor: "bg-[#FF9D42]" },
                      { label: "Web3 Creators", dotColor: "bg-[#42EFFF]" },
                    ].map((space, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold text-[#62636C] hover:bg-gray-100/50 hover:text-black transition-all"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full ${space.dotColor} shadow-sm shrink-0`} />
                          <span className="truncate">{space.label}</span>
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold bg-white/50 border border-white/80 px-1.5 py-0.5 rounded-md">85%</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#7A5BFF] hover:bg-[#E9E7FF]/40 transition-all text-left"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#7A5BFF]" />
                      <span>Create New Space</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile card */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between p-1.5 rounded-2xl hover:bg-gray-100/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={currentUser.imageUrl}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-white/50 shadow-sm"
                    />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold truncate text-black">{currentUser.fullName}</p>
                      <p className="text-[10px] text-[#8A8B94] truncate">@{currentUser.username}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A8B94] shrink-0" />
                </div>
              </div>

            </div>
          </aside>

          {/* Mobile sidebar backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* ==================== MAIN FEED COLUMN ==================== */}
          <main className="min-w-0 space-y-3.5">

            {/* Mobile header */}
            <div className="flex items-center justify-between bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm backdrop-blur-md lg:hidden z-15 relative">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-black select-none leading-none">*</span>
                <span className="font-bold text-black text-sm">collabsphere</span>
              </div>
              <img src={currentUser.imageUrl} alt="user" className="w-8 h-8 rounded-full border shadow-sm" />
            </div>

            {/* Editorial Greeting Header Row (CLEAN AND DE-CLUTTERED, NO DUPLICATE AVATAR STACK OR TEXT LABELS) */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 pt-2.5 pb-2 md:pt-4 md:pb-2.5 z-10 relative">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.imageUrl}
                  alt={greetingName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
                />
                <h2 
                  className="text-3xl italic text-[#121315] select-none leading-none"
                  style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
                >
                  Hi, {greetingName}!
                </h2>
              </div>

              {/* Toggle switch integrated beautifully inline (Screenshot 2 concept) */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/40 p-1 rounded-full flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.03)] select-none shrink-0 self-start sm:self-auto gap-0.5 z-10 relative">
                <button
                  type="button"
                  onClick={() => setIsTeamMode(false)}
                  className={`px-4.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                    !isTeamMode ? "bg-[#121315] text-white shadow-sm" : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                  }`}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeamMode(true)}
                  className={`px-4.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                    isTeamMode ? "bg-[#121315] text-white shadow-sm" : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                  }`}
                >
                  Community
                </button>
              </div>
            </section>

            {/* ==================== HERO BANNER ==================== */}
            <section className="relative overflow-hidden bg-white border border-white/60 rounded-[28px] pt-4.5 pb-3 px-4.5 sm:pt-5 sm:pb-3 sm:px-5 md:pt-5 md:pb-3 md:px-5.5 shadow-[0_10px_28px_rgba(31,38,135,0.012)] backdrop-blur-xl group z-10">
              
              {/* Floating Translucent 3D Glass Waterdrop (Screenshot 1) */}
              <div className="absolute top-[-35px] right-[8%] w-[90px] h-[110px] pointer-events-none select-none z-10 transition-transform duration-500 group-hover:scale-105">
                <svg className="w-full h-full text-blue-200/50" viewBox="0 0 100 120" fill="none">
                  <defs>
                    <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#EEF2F6" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50,10 Q20,60 20,85 A30,30 0 0,0 80,85 Q80,60 50,10 Z"
                    fill="url(#dropGrad)"
                    filter="drop-shadow(0 15px 25px rgba(139, 92, 246, 0.12))"
                  />
                </svg>
              </div>

              {/* Rotated green code card `</>` repositioned to left of Active Builders card to avoid overlap clash */}
              <div className="absolute bottom-[16px] right-[24%] bg-[#CDFF3D] border border-[#BDE82F] rounded-lg shadow-[0_6px_20px_rgba(205,255,61,0.25)] w-9.5 h-9.5 flex items-center justify-center select-none rotate-[15deg] pointer-events-none text-black z-10 transition-transform duration-500 group-hover:rotate-[25deg]">
                <span className="font-mono text-sm font-bold leading-none">&lt;/&gt;</span>
              </div>

              {/* Banner Text Contents */}
              <div className="max-w-[75%] text-left space-y-1.5 sm:space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-[1.1] font-sans">
                  Build together.<br />
                  <span className="relative inline-block px-4.5 py-0.5 mx-0.5 bg-[#D8F5A2] rounded-full border border-black rotate-[-2deg] font-bold text-black shadow-sm text-[0.85em]">
                    Ship
                  </span>{" "}
                  further.
                </h1>
                <p className="text-xs sm:text-sm text-[#6E7079] leading-relaxed font-medium">
                  Where developers find teammates, build projects, and grow together.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-[#0B0C10] hover:bg-black text-white px-5 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 group"
                  >
                    <span>Find Teammates</span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    type="button"
                    className="text-[#7A5BFF] hover:text-[#5232FF] font-bold text-xs px-3 py-1.5 transition-all hover:underline"
                  >
                    Post a Project
                  </button>
                </div>
              </div>

              {/* Banner Statistics & Teammates Row */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-2">
                
                {/* Overlapping active builders and v1 pill */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center">
                    <div className="flex -space-x-1">
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 1"
                      />
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 2"
                      />
                      <img
                        className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                        alt="Teammate 3"
                      />
                    </div>
                    <button
                      type="button"
                      className="ml-1.5 flex items-center justify-center w-5.5 h-5.5 rounded-full bg-gray-100 border border-gray-200/50 text-gray-500 hover:bg-gray-200 transition-all"
                    >
                      <span className="text-[9px] font-bold">→</span>
                    </button>
                  </div>

                  {/* Just Shipped Pill */}
                  <div className="px-2 py-1 rounded-lg bg-gray-50/80 border border-gray-100/50 text-[9px] font-extrabold text-gray-500 flex items-center gap-1 shadow-sm select-none">
                    <span>Just shipped</span>
                    <span className="px-1 py-0.5 rounded-md bg-gray-200/50 font-mono text-[8px]">v1.0</span>
                    <span>🚀</span>
                  </div>
                </div>

                {/* Active Builders Sparkline Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-1.5 px-2.5 shadow-sm flex items-center gap-2.5 min-w-[155px] group/card">
                  <div>
                    <span className="text-[8px] font-extrabold text-[#9EA0A8] uppercase tracking-wider block text-left">Active Builders</span>
                    <span className="text-lg font-black tracking-tight text-black block mt-0.5 text-left">8.2K</span>
                    <span className="text-[8px] font-black text-[#A3E635] flex items-center gap-0.5 mt-0.5">
                      <span>↗</span><span>+20% this week</span>
                    </span>
                  </div>
                  
                  {/* Purple Sparkline SVG path */}
                  <div className="shrink-0 flex items-center justify-center">
                    <svg className="w-[56px] h-[22px] text-[#7A5BFF] transition-all group-hover/card:scale-105 duration-300" viewBox="0 0 100 35" fill="none">
                      <path
                        d="M0,25 Q12,28 24,18 T48,15 T72,8 T100,2"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>

            </section>

            {/* ==================== CONTENT FILTER TABS ==================== */}
            <div className="flex flex-wrap items-center justify-between gap-4 -mt-2 sm:-mt-2.5 mb-2 z-10 relative">
              <div className="flex flex-wrap items-center bg-white/50 backdrop-blur-xl p-1 rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] gap-0.5">
                {[
                  { key: "for-you", label: "For You" },
                  { key: "updates", label: "Project Updates" },
                  { key: "teammates", label: "Looking for Teammates" },
                  { key: "logs", label: "Build Logs" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as FeedTabKey)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-[#121315] text-white shadow-[0_4px_12px_rgba(18,19,21,0.06)]"
                        : "text-[#62636C] hover:text-[#121315] hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ==================== INLINE PROGRESSIVE SETUP PROMPTS ==================== */}
            {!isSetupDismissed && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[24px] p-4 shadow-[0_8px_24px_rgba(122,91,255,0.04)] z-10 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7A5BFF] animate-pulse" />
                    <span className="text-xs font-extrabold text-[#121315] tracking-tight">Get started</span>
                    <span className="text-[10px] text-[#9EA0A8] font-medium">· Complete your builder profile</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSetupDismissed(true)}
                    className="text-[10px] text-[#9EA0A8] hover:text-[#121315] font-bold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Add your stack */}
                  <div className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 cursor-pointer group ${
                    setupDone["stack"]
                      ? "border-[#A3E635]/40 bg-[#F5FEE9]"
                      : "border-white/80 bg-white hover:border-[#7A5BFF]/30 hover:shadow-[0_4px_16px_rgba(122,91,255,0.06)]"
                  }`}
                    onClick={() => markSetupDone("stack")}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-all ${
                      setupDone["stack"] ? "bg-[#CDFF3D]/40" : "bg-[#E9E7FF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["stack"] ? "✓" : "⚡"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-black tracking-tight truncate ${
                        setupDone["stack"] ? "text-[#4B7A12] line-through opacity-60" : "text-black"
                      }`}>Add your stack</p>
                      <p className="text-[10px] text-[#9EA0A8] font-medium mt-0.5">React, Supabase, Next.js…</p>
                    </div>
                    {!setupDone["stack"] && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#7A5BFF] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    )}
                  </div>

                  {/* Ship your first project */}
                  <div className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 cursor-pointer group ${
                    setupDone["project"]
                      ? "border-[#A3E635]/40 bg-[#F5FEE9]"
                      : "border-white/80 bg-white hover:border-[#7A5BFF]/30 hover:shadow-[0_4px_16px_rgba(122,91,255,0.06)]"
                  }`}
                    onClick={() => markSetupDone("project")}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-all ${
                      setupDone["project"] ? "bg-[#CDFF3D]/40" : "bg-[#E9E7FF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["project"] ? "✓" : "🚀"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-black tracking-tight truncate ${
                        setupDone["project"] ? "text-[#4B7A12] line-through opacity-60" : "text-black"
                      }`}>Ship your first project</p>
                      <p className="text-[10px] text-[#9EA0A8] font-medium mt-0.5">Post what you're building</p>
                    </div>
                    {!setupDone["project"] && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#7A5BFF] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    )}
                  </div>

                  {/* Complete builder profile */}
                  <div className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 cursor-pointer group ${
                    setupDone["profile"]
                      ? "border-[#A3E635]/40 bg-[#F5FEE9]"
                      : "border-white/80 bg-white hover:border-[#7A5BFF]/30 hover:shadow-[0_4px_16px_rgba(122,91,255,0.06)]"
                  }`}
                    onClick={() => markSetupDone("profile")}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-all ${
                      setupDone["profile"] ? "bg-[#CDFF3D]/40" : "bg-[#E9E7FF] group-hover:bg-[#D1CBFF]"
                    }`}>
                      {setupDone["profile"] ? "✓" : "👤"}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-xs font-black tracking-tight truncate ${
                        setupDone["profile"] ? "text-[#4B7A12] line-through opacity-60" : "text-black"
                      }`}>Complete builder profile</p>
                      <p className="text-[10px] text-[#9EA0A8] font-medium mt-0.5">Bio, links, availability</p>
                    </div>
                    {!setupDone["profile"] && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#7A5BFF] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    )}
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 mt-3 pl-1">
                  {["stack", "project", "profile"].map((key) => (
                    <div
                      key={key}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        setupDone[key] ? "w-6 bg-[#7A5BFF]" : "w-3 bg-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-[#9EA0A8] font-bold ml-1">
                    {Object.values(setupDone).filter(Boolean).length}/3 done
                  </span>
                </div>
              </div>
            )}

            {/* ==================== CENTRAL FEED TACTILE SKEUOMORPHIC FEEDS ==================== */}
            <div className="space-y-5 z-10 relative">
              
              {/* Card 1: Habit Tracker live builder telemetry stream */}
              <div className="bg-white border border-white/50 rounded-[28px] p-5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] text-left flex flex-col md:flex-row md:items-stretch gap-5 hover:shadow-md transition duration-300 group relative">
                
                {/* Left side: Terminal live matching logs */}
                <div className="flex-1 bg-[#121318] text-[#E0E2EC] rounded-2xl p-4 font-mono text-[10px] space-y-1.5 shadow-inner border border-black/80 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                      <span className="text-gray-400 font-extrabold text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CDFF3D] animate-pulse" />
                        Live Pipeline: habit-tracker / nextjs
                      </span>
                      <span className="text-[9px] text-[#7A5BFF] font-bold">active: 2m</span>
                    </div>
                    <div className="text-gray-400">$ collabsphere match-builder --workspace="habit-tracker"</div>
                    <div className="text-white font-semibold">[SYSTEM] Found active slots: full-stack=Dev, ai-engineer=Riya</div>
                    <div className="text-[#CDFF3D]">[ALERT] Slot frontend-nextjs is currently OPEN</div>
                    <div className="text-gray-500 animate-pulse">[WAIT] Awaiting node connection...</div>
                  </div>
                  
                  {/* Status indicators */}
                  <div className="flex items-center gap-4 text-[9px] text-gray-500 border-t border-white/10 pt-2 mt-2">
                    <span>slots: 2/3</span>
                    <span>host: traceflow.git</span>
                    <span className="text-[#CDFF3D]">ready_slots: 66%</span>
                  </div>
                </div>

                {/* Right side: Node connection actions and details */}
                <div className="md:w-60 flex flex-col justify-between bg-gray-50/50 border border-gray-100 rounded-2xl p-3.5 relative overflow-hidden shrink-0">
                  <div className="space-y-3.5 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[8.5px] font-extrabold text-[#7A5BFF] bg-[#E9E7FF] uppercase tracking-wide">
                        MATCH SPACE
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold">ping: 14ms</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-black text-black tracking-tight font-sans">AI Habit Tracker</h4>
                      <p className="text-[11px] text-[#6E7079] leading-relaxed mt-1">
                        Building a skeuomorphic autonomous habit companion.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
                      <div className="flex -space-x-1.5">
                        <img className="w-5.5 h-5.5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="avatar" />
                        <img className="w-5.5 h-5.5 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="avatar" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-400">Next.js, Tailwind, TS</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full mt-3 bg-[#121315] hover:bg-black text-[#CDFF3D] font-mono text-[10px] font-black py-2.5 rounded-xl shadow-md active:scale-95 transition-all text-center tracking-wider block"
                  >
                    CONNECT_NODE_
                  </button>
                </div>
              </div>

              {/* Card 2: MVP is live! Feedback? (THE TILTED CARD WITH GRADIENT PRODUCT PREVIEW PANEL) */}
              <div className="bg-white border border-white/60 rounded-[28px] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.03)] text-left flex flex-col md:flex-row md:items-stretch justify-between gap-6 relative group rotate-[-1deg] sm:rotate-[-1.5deg] transition-all duration-300 hover:rotate-0 hover:scale-[1.01] hover:shadow-lg">
                
                {/* Left details */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header row */}
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="w-5.5 h-5.5 rounded-lg bg-[#F5FEE9] border border-[#A3E635]/15 flex items-center justify-center text-[#A3E635]">
                        <span className="text-[9px] font-extrabold select-none leading-none">•</span>
                      </div>
                      <h4 className="text-base font-black text-black tracking-tight font-sans">DEPLOYMENT SUCCESS: traceflow-mvp</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white bg-[#34C759] uppercase tracking-wide ml-1 select-none">
                        SHIPPED
                      </span>
                    </div>

                    {/* Details row */}
                    <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                      <div>
                        <span className="text-[#8E8F97] font-medium block">Repository:</span>
                        <span className="text-black font-extrabold mt-0.5 block truncate">collabsphere/traceflow</span>
                      </div>
                      <div>
                        <span className="text-[#8E8F97] font-medium block">Momentum:</span>
                        <span className="text-black font-extrabold mt-0.5 block truncate">20+ active logs</span>
                      </div>
                      <div>
                        <span className="text-[#8E8F97] font-medium block">Build Latency:</span>
                        <span className="text-black font-extrabold mt-0.5 block">4.1s (successful)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom actions row */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100/50">
                    <button
                      type="button"
                      className="bg-[#121315] hover:bg-black text-white text-xs font-black px-4.5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition group/btn"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#CDFF3D] group-hover/btn:rotate-90 transition-transform duration-300" />
                      <span>ASK_AI_AGENT_FEEDBACK</span>
                    </button>
                    
                    {/* Performers avatar queue */}
                    <div className="flex items-center gap-1.5 pl-1.5">
                      <span className="text-[9px] text-[#8E8F97] font-bold">Shipped by:</span>
                      <div className="flex -space-x-1">
                        {builders.slice(0, 2).map((b, idx) => (
                          <img
                            key={idx}
                            className="w-5 h-5 rounded-full border border-white object-cover shadow-sm"
                            src={b.avatar}
                            alt="shipper"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Gradient TraceFlow Visual box matching screenshot perfectly */}
                <div className="md:w-48 h-36 bg-gradient-to-tr from-[#DEE2FF] via-[#E8EAFF] to-[#FFE5F1] border border-white/60 rounded-2xl p-4 flex flex-col justify-between shrink-0 relative overflow-hidden shadow-sm select-none group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-3 right-3 w-5.5 h-5.5 rounded-full bg-white/60 border border-white/80 flex items-center justify-center shadow-sm text-black">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h5 className="text-base font-black tracking-tight text-black flex items-center justify-center gap-1 font-sans">
                        <span>traceflow</span>
                      </h5>
                      <div className="flex items-center justify-center gap-1 mt-1.5 opacity-80">
                        <span className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center shadow-sm text-[8px] font-bold">⌨</span>
                        <span className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center shadow-sm text-[8px] font-bold">⚙</span>
                        <span className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center shadow-sm text-[8px] font-bold">❂</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hand-drawn cursor hover mockup */}
                <div className="absolute right-[22%] bottom-[10%] pointer-events-none select-none translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <svg className="w-5 h-5 drop-shadow-md text-[#C4B5FD]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,2 L20,10 L12,13 L4,2 Z" />
                  </svg>
                </div>

              </div>

              {/* Card 3: live grid of system slots showing fintech UI team composition */}
              <div className="bg-white border border-white/50 rounded-[28px] p-5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] text-left flex flex-col sm:flex-row gap-5 hover:shadow-md transition duration-300 group">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-lg bg-[#E9E7FF] border border-[#7A5BFF]/10 flex items-center justify-center text-[#7A5BFF]">
                      <span className="text-[9px] font-extrabold select-none leading-none">*</span>
                    </div>
                    <h4 className="text-base font-black text-black tracking-tight font-sans">MATCH SPACE: fintech-dashboard</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold text-[#7A5BFF] bg-[#E9E7FF] uppercase tracking-wide ml-1 select-none">
                      OPEN_NODE
                    </span>
                  </div>

                  {/* Tactile slot grid representation */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <span className="text-[#8E8F97] font-medium">Slot [1]: Full Stack</span>
                      <span className="text-black font-extrabold flex items-center gap-1.5">
                        <img className="w-4.5 h-4.5 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" alt="avatar" />
                        João S.
                      </span>
                    </div>
                    <div className="bg-[#E9E7FF]/20 border border-dashed border-[#7A5BFF]/30 rounded-xl p-2.5 flex items-center justify-between text-xs relative overflow-hidden group/slot animate-pulse">
                      <span className="text-[#7A5BFF] font-bold">Slot [2]: UI/UX</span>
                      <span className="text-[#7A5BFF] font-extrabold text-[9px] uppercase tracking-widest bg-[#E9E7FF] px-1.5 py-0.5 rounded-md">
                        SEEKING MATCH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0 flex items-center">
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[#EAEBF4]/60 hover:bg-[#EAEBF4] text-[#121315] hover:text-black text-xs font-mono font-black px-5 py-3 rounded-xl transition active:scale-95 shadow-sm"
                  >
                    CONNECT_SLOT_
                  </button>
                </div>
              </div>

            </div>

          </main>

          {/* ==================== RIGHT COLUMN: WIDGETS, PLANET GLOW & WAVE ACTIONS ==================== */}
          <aside className="min-w-0 self-start space-y-6">
            
            {/* Action Header row (Screenshot 1) */}
            <div className="bg-white/80 border border-white/50 rounded-[28px] p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] backdrop-blur-xl flex items-center justify-between gap-4 z-10 relative">
              {/* Avatars pile */}
              <div className="flex items-center pl-1.5">
                <div className="flex -space-x-1.5">
                  <img
                    className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="builder"
                  />
                  <img
                    className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="builder"
                  />
                </div>
                <span className="text-[9px] font-black text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/50 shadow-sm">+23</span>
              </div>

              {/* Notification & New Post button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-[#121315] hover:bg-black text-[#F3F7FF] px-4.5 py-2.5 rounded-full text-xs font-black shadow-sm inline-flex items-center gap-1.5 active:scale-95 transition-all"
                  onClick={() => markSetupDone("post")}
                >
                  <Plus className="w-3.5 h-3.5 text-white font-black" />
                  <span>New Post</span>
                </button>
              </div>
            </div>

            {/* The Dark Glass planet card (Screenshot 1) */}
            <div className="bg-[#121318] text-white rounded-[36px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[280px] z-10 group">
              
              {/* Planetary green glowing space orb with orbits SVG */}
              <div className="absolute right-[-25px] bottom-[-20px] pointer-events-none select-none transition-transform duration-[4000ms] group-hover:scale-105 group-hover:rotate-12">
                <svg className="w-[190px] h-[190px]" viewBox="0 0 200 200" fill="none">
                  <defs>
                    <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#CDFF3D" />
                      <stop offset="40%" stopColor="#A3E635" />
                      <stop offset="100%" stopColor="#1B4D08" />
                    </radialGradient>
                  </defs>
                  
                  {/* Orbits */}
                  <ellipse cx="100" cy="100" rx="90" ry="24" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" transform="rotate(-15 100 100)" />
                  <ellipse cx="100" cy="100" rx="68" ry="16" stroke="rgba(255,255,255,0.15)" strokeWidth="1" transform="rotate(-15 100 100)" />
                  
                  {/* Planet sphere */}
                  <circle cx="100" cy="100" r="26" fill="url(#sphereGrad)" filter="drop-shadow(0 0 20px rgba(163,230,53,0.35))" />
                  
                  {/* Front ring section (overlapping planet) */}
                  <path d="M 33 113 A 90 25 0 0 0 167 67" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-15 100 100)" />
                  
                  {/* Small stars */}
                  <path d="M40,55 L42,57 L40,59 L38,57 Z" fill="#CDFF3D" opacity="0.7" />
                  <path d="M150,150 L152,152 L150,154 L148,152 Z" fill="#CDFF3D" opacity="0.6" />
                  <path d="M165,30 L166.5,31.5 L165,33 L163.5,31.5 Z" fill="#fff" opacity="0.8" />
                </svg>
              </div>

              {/* Text Blocks */}
              <div className="space-y-4 max-w-[80%] text-left">
                <h3 className="text-2xl font-bold leading-snug tracking-tight text-white font-sans">
                  You don't<br />have to<br />build alone.
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Collabsphere connects you with verified builders through real project history, not LinkedIn fluff.
                </p>
              </div>

              {/* CTA Button pill */}
              <div className="z-10 mt-6 text-left">
                <button
                  type="button"
                  className="bg-[#CDFF3D] hover:bg-[#B5E82F] text-black text-xs font-extrabold px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all group/cta"
                >
                  <span>Join the Movement</span>
                  <span className="text-sm leading-none group-hover/cta:translate-x-1 transition-transform">→</span>
                </button>
              </div>

            </div>

            {/* Trending Builders Widget with Green Arrows (Screenshot 1) */}
            <div className="bg-white border border-white/60 rounded-[32px] p-5 shadow-[0_12px_30px_rgba(31,38,135,0.01)] backdrop-blur-xl space-y-4 z-10 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black tracking-tight font-sans">Trending Builders</span>
                <button
                  type="button"
                  onClick={() => router.push("/builders")}
                  className="text-xs font-bold text-[#7A5BFF] hover:underline"
                >
                  View all
                </button>
              </div>

              {/* Builders List */}
              <div className="space-y-3">
                {builders.slice(0, 5).map((builder, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer" onClick={() => router.push(`/builders`)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={builder.avatar}
                        alt={builder.name}
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-sm shrink-0"
                      />
                      <div className="text-left min-w-0">
                        <p className="text-sm font-bold text-black group-hover:text-[#7A5BFF] transition-colors leading-none truncate">{builder.name}</p>
                        <p className="text-xs text-[#8A8B94] mt-1.5 truncate">@{builder.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">{builder.role}</span>
                      <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#E9E7FF] flex items-center justify-center transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7A5BFF] transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Hackathons Trophy Widget (Screenshot 1) */}
            <div className="bg-white border border-white/60 rounded-[32px] p-5 shadow-[0_12px_30px_rgba(31,38,135,0.01)] backdrop-blur-xl space-y-4 z-10 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black tracking-tight font-sans">Active Hackathons</span>
                <button
                  type="button"
                  onClick={() => router.push("/hackathons")}
                  className="text-xs font-bold text-[#7A5BFF] hover:underline"
                >
                  View all
                </button>
              </div>

              {/* Hackathons List */}
              <div className="space-y-3">
                {fallbackHackathons.map((hackathon) => (
                  <div key={hackathon.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50/60 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl ${hackathon.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                        <Trophy className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-black leading-none">{hackathon.name}</p>
                        <p className="text-[10px] text-[#8A8B94] mt-1.5 font-medium">{hackathon.date}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-[#7A5BFF] bg-[#E9E7FF] px-2 py-0.5 rounded-lg">{hackathon.builders} builders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Actions Wave Assistant at bottom right (Screenshot 2) */}
            <div className="bg-white border border-white/50 rounded-[28px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.01)] text-left flex flex-col justify-between h-[160px] z-10 relative">
              
              {/* Audio soundwave waveform header */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold text-[#7A5BFF] bg-[#E9E7FF] uppercase tracking-wide select-none">
                    Voice Actions
                  </span>
                  <h4 
                    className="text-lg italic tracking-tight text-black leading-snug"
                    style={{ fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif" }}
                  >
                    Say something<br />to Collabsphere!
                  </h4>
                </div>

                {/* Pulsing soundwave bars */}
                <div className="flex items-center gap-[3px] h-9 px-3 shrink-0 bg-[#E3EFFF] rounded-2xl border border-white/40">
                  <div className="w-[2.5px] h-5 bg-[#7A5BFF]/80 rounded-full animate-wave-1" />
                  <div className="w-[2.5px] h-3 bg-[#7A5BFF]/80 rounded-full animate-wave-2" />
                  <div className="w-[2.5px] h-7 bg-[#7A5BFF]/80 rounded-full animate-wave-3" />
                  <div className="w-[2.5px] h-4 bg-[#7A5BFF]/80 rounded-full animate-wave-4" />
                  <div className="w-[2.5px] h-6 bg-[#7A5BFF]/80 rounded-full animate-wave-5" />
                  <div className="w-[2.5px] h-3 bg-[#7A5BFF]/80 rounded-full animate-wave-6" />
                  <div className="w-[2.5px] h-5 bg-[#7A5BFF]/80 rounded-full animate-wave-7" />
                </div>
              </div>

              {/* mic button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#121315] hover:bg-black text-[#F3F7FF] flex items-center justify-center shadow-md border border-white/50 hover:scale-105 active:scale-95 transition-all animate-pulse"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}