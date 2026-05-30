"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  MessageCircle,
  CalendarDays,
  PieChart,
  LayoutGrid,
  Bell,
  Hexagon
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
    { key: "calendar", icon: CalendarDays, route: "/events" },
    { key: "messages", icon: MessageCircle, route: "/messages" },
    { key: "analytics", icon: PieChart, route: "/analytics" },
    { key: "grid", icon: LayoutGrid, route: "/media" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Fully transparent wrapper - buttons float directly on the background */}
      <aside className={`fixed left-6 top-6 bottom-6 z-50 w-[80px] bg-transparent flex flex-col items-center pt-2 pb-6 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0"}`}>
        
        {/* Top Logo Button - Abstract Hexagon to match the 'P' logo style */}
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-12 hover:scale-105 transition-transform"
        >
          <Hexagon className="w-5 h-5 text-black" strokeWidth={1.5} />
        </button>

        {/* Navigation Icons Stack */}
        <nav className="flex flex-col gap-5">
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
                className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-[#111111] text-white shadow-xl shadow-black/20 scale-105" 
                    : "bg-white text-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:scale-105"
                }`}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2 : 1.5} />
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col items-center gap-6">
          <button 
            onClick={() => router.push('/settings')}
            className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:scale-105 transition-all group"
          >
            <Bell className="w-[22px] h-[22px] text-[#111111] group-hover:fill-[#111111]/10" strokeWidth={1.5} />
          </button>

          <button 
            onClick={handleLogout}
            className="w-[52px] h-[52px] rounded-full overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all ring-2 ring-white"
          >
            <img src={currentUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>

      </aside>
    </>
  );
}
