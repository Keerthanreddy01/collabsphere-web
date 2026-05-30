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
    { key: "home", icon: Home, route: "/dashboard/home" },
    { key: "search", icon: Search, route: "/search" },
    { key: "explore", icon: Compass, route: "/explore" },
    { key: "reels", icon: PlaySquare, route: "/reels" },
    { key: "messages", icon: MessageCircle, route: "/messages" },
    { key: "notifications", icon: Heart, route: "/notifications" },
    { key: "create", icon: PlusSquare, route: "/create" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Instagram-style Narrow Dark Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-50 w-[72px] bg-black border-r border-[#262626] flex flex-col items-center py-6 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Top Logo */}
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="w-12 h-12 flex items-center justify-center mb-8 hover:bg-[#1A1A1A] rounded-lg transition-colors group"
        >
          <Activity className="w-6 h-6 text-white group-hover:scale-105 transition-transform" strokeWidth={2} />
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
                className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-all group"
              >
                <Icon 
                  className={`w-6 h-6 transition-transform group-hover:scale-105 ${isActive ? "text-white fill-white" : "text-white"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill={isActive ? "currentColor" : "none"}
                />
              </button>
            );
          })}

          {/* Profile Icon */}
          <button
            onClick={() => router.push('/profile')}
            className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-all"
          >
            <img src={currentUser.imageUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
          </button>
        </nav>

        {/* Bottom Menu Icon */}
        <div className="mt-auto w-full px-2">
          <button className="w-12 h-12 mx-auto flex items-center justify-center rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <Menu className="w-6 h-6 text-white group-hover:scale-105 transition-transform" strokeWidth={2} />
          </button>
        </div>

      </aside>
    </>
  );
}
