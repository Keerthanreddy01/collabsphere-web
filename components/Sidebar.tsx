"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  MessageSquare,
  Globe2,
  Users,
  Image as ImageIcon,
  Settings,
  BadgeCheck,
  PenSquare,
  MessageCircle,
  UploadCloud,
  UserPlus,
  Apple,
  PlaySquare,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "@/lib/auth";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  showCreateSpaceModal?: boolean;
  setShowCreateSpaceModal?: (show: boolean) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);

  // Listen to profile updates
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "builder_profiles", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  const currentUser = useMemo(() => {
    return {
      fullName: profile?.full_name || user?.displayName || user?.email?.split('@')[0] || "Bogdan Nikitin",
      username: profile?.username || user?.email?.split("@")[0] || "nikitinteam",
      email: profile?.email || user?.email || "",
      imageUrl:
        profile?.avatar_url ||
        user?.photoURL ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    };
  }, [user, profile]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const navItems = [
    { key: "home", label: "Feed", icon: Home, route: "/dashboard/home" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages", badge: "3" },
    { key: "communities", label: "Communities", icon: Globe2, route: "/forums" },
    { key: "friends", label: "Friends", icon: Users, route: "/friends", badge: "12" },
    { key: "media", label: "Media", icon: ImageIcon, route: "/media" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  const quickActions = [
    { label: "Create Post", icon: PenSquare },
    { label: "Start Discussion", icon: MessageCircle },
    { label: "Upload Media", icon: UploadCloud },
    { label: "Invite Friends", icon: UserPlus },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 lg:inset-y-0 lg:left-0 lg:z-auto lg:h-screen lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 bg-white/80 backdrop-blur-2xl shadow-2xl" : "-translate-x-full"}`}
    >
      {/* Premium Glassmorphism & Noise Overlay Background */}
      <div className="absolute inset-0 bg-[#FAFAFC]/80 backdrop-blur-3xl -z-10 overflow-hidden">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        {/* Floating gradient orbs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#06B6D4]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-[90px] pointer-events-none"></div>
      </div>

      <div className="flex flex-col h-full w-full py-6 px-5 overflow-y-auto no-scrollbar">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8 shrink-0 cursor-pointer group" onClick={() => router.push('/dashboard/home')}>
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            {/* Soft gradient glow behind avatar */}
            <div className="absolute inset-[-8px] bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
            
            <img
              src={currentUser.imageUrl}
              alt={currentUser.fullName}
              referrerPolicy="no-referrer"
              className="relative w-20 h-20 rounded-full object-cover border-[3px] border-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] z-10"
            />
            
            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#10B981] rounded-full border-[3px] border-white shadow-sm z-20"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[17px] font-bold text-[#0F172A] tracking-tight">{currentUser.fullName}</h2>
              <BadgeCheck className="w-4 h-4 text-[#06B6D4]" fill="currentColor" stroke="white" />
            </div>
            <p className="text-[13px] font-medium text-[#64748B] mt-0.5">@{currentUser.username}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 mb-8 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Hardcoding 'home' to be active as per screenshot, or match route
            const isActive = item.key === "home" || pathname === item.route;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  router.push(item.route);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[18px] text-[14px] font-semibold transition-all duration-300 group relative overflow-hidden ${isActive
                    ? "text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_24px_rgba(99,102,241,0.35)]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60 hover:shadow-sm"
                  }`}
              >
                {/* Active Gradient Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] -z-10"></div>
                )}
                
                {/* Hover Glass Effect for inactive */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}

                <span className="flex items-center gap-3.5 relative z-10">
                  <Icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-[#64748B] group-hover:text-[#6366F1]"}`}
                  />
                  {item.label}
                </span>
                
                {item.badge && (
                  <span
                    className={`flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-bold shadow-sm relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive 
                      ? "bg-white/20 text-white backdrop-blur-md" 
                      : "bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] text-white"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions Section */}
        <div className="mb-auto shrink-0 flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-white/50 hover:bg-white border border-white rounded-[16px] transition-all duration-300 shadow-[0_2px_10px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAFAFC] flex items-center justify-center group-hover:bg-[#6366F1]/10 transition-colors duration-300">
                    <ActionIcon className="w-4 h-4 text-[#64748B] group-hover:text-[#6366F1] transition-colors duration-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F172A] leading-tight text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Download App Card */}
        <div className="mt-8 w-full shrink-0 relative group" onClick={handleLogout}>
          <div className="relative w-full overflow-hidden rounded-[24px] p-5 border border-white/40 shadow-[0_12px_32px_rgba(99,102,241,0.15)] transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer">
            
            {/* Animated Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] opacity-90 -z-20"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay -z-10"></div>
            
            {/* Animated Glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#06B6D4]/40 rounded-full blur-xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-[16px] border border-white/30 flex items-center justify-center mb-3 shadow-inner">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[15px] font-bold text-white leading-tight mb-1">Get CollabSphere App</h3>
              <p className="text-[11px] font-medium text-white/80 mb-4 px-2 leading-snug">
                Connect, build, and ship faster on the go.
              </p>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/40 rounded-[14px] py-2.5 transition-all duration-300">
                <div className="flex gap-1.5 opacity-90">
                  <Apple className="w-[14px] h-[14px] fill-white text-white" />
                  <PlaySquare className="w-[14px] h-[14px] fill-white text-white" />
                </div>
                <span className="text-[12px] font-bold text-white">Download Now</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
