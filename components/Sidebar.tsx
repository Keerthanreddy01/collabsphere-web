"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  FolderOpen,
  MessageSquare,
  Users,
  Calendar,
  PieChart,
  Settings,
  Mic,
  Play,
  Paperclip,
  Smile,
  Mic2
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

  const navItems = [
    { key: "home", label: "Home", icon: Home, route: "/dashboard/home" },
    { key: "projects", label: "Projects", icon: FolderOpen, route: "/projects" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages" },
    { key: "team", label: "Team", icon: Users, route: "/friends" },
    { key: "analytics", label: "Analytics", icon: PieChart, route: "/analytics" },
    { key: "calendar", label: "Calendar", icon: Calendar, route: "/events" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Flat Light Gray Sidebar matching TaskLab reference */}
      <aside className={`fixed left-0 top-0 bottom-0 z-50 w-[270px] bg-[#F4F5F7] overflow-y-auto no-scrollbar flex flex-col px-5 py-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Top Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push('/dashboard/home')}>
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center transform rotate-45">
            <div className="w-3 h-3 bg-white rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-[19px] font-black tracking-tight text-black">CollabSphere</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Force "Team" or "Home" active for demo based on route, but let's make it dynamic
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[24px] text-[15px] font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-[#111111] text-white shadow-lg shadow-black/10" 
                    : "text-[#5A5C60] hover:text-black hover:bg-black/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#5A5C60]"}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* App Download Banner */}
        <div className="mt-auto bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-[#F4F5F7] rounded-full flex items-center justify-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
          </div>
          <h3 className="text-[15px] font-bold text-gray-900">Get the App</h3>
          <p className="text-[11px] font-medium text-gray-500 leading-relaxed mb-1">
            Experience CollabSphere on your mobile device.
          </p>
          <button className="w-full bg-[#111111] text-white text-[13px] font-bold py-2.5 rounded-full hover:bg-black/80 transition-colors">
            Download
          </button>
        </div>

      </aside>
    </>
  );
}
