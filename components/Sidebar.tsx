"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Search,
  Compass,
  PlaySquare,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Activity
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "builder_profiles", user.uid), (docSnap) => {
      if (docSnap.exists()) setProfile(docSnap.data());
    });
    return () => unsubscribe();
  }, [user]);

  const currentUser = useMemo(() => ({
    imageUrl: profile?.avatar_url || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=keerthan",
  }), [user, profile]);

  const navItems = [
    { key: "home", label: "Home", icon: Home, route: "/dashboard/home" },
    { key: "search", label: "Search", icon: Search, route: "/search" },
    { key: "explore", label: "Explore", icon: Compass, route: "/explore" },
    { key: "reels", label: "Reels", icon: PlaySquare, route: "/reels" },
    { key: "messages", label: "Messages", icon: MessageCircle, route: "/messages" },
    { key: "notifications", label: "Notifications", icon: Heart, route: "/notifications" },
    { key: "create", label: "Create", icon: PlusSquare, route: "/create" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Instagram-style Narrow Dark Sidebar (Expands on Hover) */}
      <aside className={`group fixed left-0 top-0 bottom-0 z-50 w-[72px] hover:w-[244px] bg-black border-r border-[#262626] flex flex-col py-6 transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Top Logo */}
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="w-12 h-12 hover:w-[220px] mx-auto group-hover:mx-3 flex items-center justify-center group-hover:justify-start px-0 group-hover:px-4 mb-8 hover:bg-[#1A1A1A] rounded-lg transition-all group/btn"
        >
          <Activity className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
          <span className="ml-4 text-[18px] font-bold text-white whitespace-nowrap opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300">
            CollabSphere
          </span>
        </button>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className="w-12 h-12 group-hover:w-full mx-auto flex items-center justify-center group-hover:justify-start px-0 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all group/btn"
              >
                <Icon 
                  className={`w-6 h-6 transition-transform group-hover/btn:scale-105 shrink-0 ${isActive ? "text-white fill-white" : "text-white"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className={`ml-4 text-[15px] whitespace-nowrap opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300 ${isActive ? "font-bold text-white" : "font-medium text-white"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Profile Icon */}
          <button
            onClick={() => router.push('/profile')}
            className="w-12 h-12 group-hover:w-full mx-auto flex items-center justify-center group-hover:justify-start px-0 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all"
          >
            <img src={currentUser.imageUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300">
              Profile
            </span>
          </button>
        </nav>

        {/* Bottom Menu Icon */}
        <div className="mt-auto w-full px-2">
          <button className="w-12 h-12 group-hover:w-full mx-auto flex items-center justify-center group-hover:justify-start px-0 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all group/btn">
            <Menu className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
            <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300">
              More
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}
