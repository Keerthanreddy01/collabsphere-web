"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  MessageSquare,
  Globe2,
  Users,
  Image as ImageIcon,
  Settings,
  Bell,
  Activity
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "@/lib/auth";

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

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const navItems = [
    { key: "home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "messages", icon: MessageSquare, route: "/messages" },
    { key: "communities", icon: Globe2, route: "/forums" },
    { key: "friends", icon: Users, route: "/friends" },
    { key: "media", icon: ImageIcon, route: "/media" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Floating Glassmorphic Dock */}
      <aside className={`fixed left-6 top-6 bottom-6 z-50 w-[80px] bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center py-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0"}`}>
        
        {/* Top Logo Button */}
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-10 hover:scale-105 transition-transform"
        >
          <Activity className="w-5 h-5 text-black" strokeWidth={2} />
        </button>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home" || pathname === item.route;

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-black text-white shadow-lg shadow-black/20 scale-105" 
                    : "bg-white text-black shadow-sm hover:shadow-md hover:scale-105"
                }`}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col items-center gap-6">
          <button 
            onClick={() => router.push('/settings')}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all"
          >
            <Bell className="w-5 h-5 text-black" strokeWidth={2} />
          </button>

          <button 
            onClick={handleLogout}
            className="w-12 h-12 rounded-full overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all border-2 border-white"
          >
            <img src={currentUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>

      </aside>
    </>
  );
}
