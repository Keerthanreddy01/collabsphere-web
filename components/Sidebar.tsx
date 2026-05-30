"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  MessageSquare,
  Users,
  Compass,
  Folder,
  Settings,
  LogOut,
  Download
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
  activeTab,
  setActiveTab,
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
      fullName: profile?.full_name || user?.displayName || user?.email?.split('@')[0] || "Builder",
      username: profile?.username || user?.email?.split("@")[0] || "builder",
      imageUrl:
        profile?.avatar_url ||
        user?.photoURL ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    };
  }, [user, profile]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const navItems = [
    { key: "home", label: "News Feed", icon: Home, route: "/dashboard/home" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages", badge: "6" },
    { key: "projects", label: "Projects", icon: Folder, route: "/projects" },
    { key: "builders", label: "Friends", icon: Users, route: "/builders", badge: "3" },
    { key: "teams", label: "Teams", icon: Compass, route: "/teams" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  return (
    <aside
      className={`fixed inset-0 z-50 w-[280px] transform overflow-y-auto bg-transparent p-6 transition-transform duration-300 lg:relative lg:inset-auto lg:h-full lg:max-h-full lg:translate-x-0 lg:overflow-visible lg:p-0 shrink-0 ${
        isSidebarOpen ? "translate-x-0 bg-white/90 backdrop-blur-md" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full bg-white rounded-[32px] p-6 shadow-sm relative">
        
        {/* Top Profile Section */}
        <div className="flex flex-col items-center mb-8 mt-2 cursor-pointer group">
          <div className="relative w-24 h-24 mb-4">
            {/* Colorful organic blob background behind avatar */}
            <div className="absolute inset-[-10px] bg-gradient-to-tr from-pink-300 via-purple-300 to-blue-300 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-60 blur-sm group-hover:rotate-12 transition-all duration-500" />
            <img
              src={currentUser.imageUrl}
              alt={currentUser.fullName}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.onerror = null
                target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
              }}
            />
            {/* Online badge */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm" />
          </div>
          <h2 className="text-base font-black text-[#121315] tracking-tight text-center">
            {currentUser.fullName}
          </h2>
          <p className="text-xs font-medium text-gray-400 text-center">
            @{currentUser.username}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.route;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  if (item.key === "home" && setActiveTab) setActiveTab("for-you");
                  router.push(item.route);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-[20px] text-[13px] font-bold transition-all group ${
                  isActive
                    ? "bg-[#121315] text-white shadow-lg shadow-black/10"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#121315]"
                }`}
              >
                <span className="flex items-center gap-4">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom App Download Card */}
        <div className="mt-6 mb-2">
          <div className="relative overflow-hidden rounded-[24px] border border-dashed border-gray-200 bg-white p-5 flex flex-col items-center justify-center text-center cursor-pointer group hover:border-gray-300 transition-colors">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-50 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative w-12 h-12 mb-3 bg-gradient-to-tr from-[#7A5BFF] via-[#EC4899] to-[#FF9D42] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Download className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-[#121315]">Download the App</span>
          </div>
        </div>

        {/* Subtle Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>

      </div>
    </aside>
  );
}
