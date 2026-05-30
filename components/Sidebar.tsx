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
  Moon,
  ChevronRight,
  Download,
  Apple,
  PlaySquare,
  Sparkles
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
    fullName: profile?.full_name || user?.displayName || user?.email?.split('@')[0] || "Keerthan Reddy",
    username: profile?.username || user?.email?.split("@")[0] || "keerthanreddy1706",
    imageUrl: profile?.avatar_url || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=keerthan",
  }), [user, profile]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const navItems = [
    { key: "home", label: "Feed", icon: Home, route: "/dashboard/home" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages", badge: "6" },
    { key: "communities", label: "Communities", icon: Globe2, route: "/forums" },
    { key: "friends", label: "Friends", icon: Users, route: "/friends", badge: "3" },
    { key: "media", label: "Media", icon: ImageIcon, route: "/media" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  const quickActions = [
    { label: "Create Post", icon: PenSquare, color: "text-indigo-600" },
    { label: "Start Discussion", icon: MessageCircle, color: "text-blue-600" },
    { label: "Upload Media", icon: UploadCloud, color: "text-purple-600" },
    { label: "Invite Friends", icon: UserPlus, color: "text-orange-600" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Clean White Sidebar without muddy blurred blobs */}
      <aside className={`fixed left-4 top-4 bottom-4 z-50 w-[280px] bg-white rounded-[24px] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-y-auto no-scrollbar flex flex-col p-5 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}`}>
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-2 mb-8 cursor-pointer group" onClick={() => router.push('/dashboard/home')}>
          <div className="relative w-20 h-20 mb-3">
            <img src={currentUser.imageUrl} alt={currentUser.fullName} className="relative w-full h-full rounded-full object-cover border border-gray-100 shadow-sm" />
            <div className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm z-10"></div>
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{currentUser.fullName}</h2>
            <BadgeCheck className="w-4 h-4 text-blue-500" fill="currentColor" stroke="white" />
          </div>
          <p className="text-[13px] font-medium text-gray-500 mb-3">@{currentUser.username}</p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-semibold text-gray-600">Building, Learning, Sharing.</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 mb-8">
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-[14px] font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`min-w-[20px] h-[20px] flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions (Cleaned up) */}
        <div className="mb-8">
          <span className="text-[12px] font-bold text-gray-900 px-1 mb-3 block">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button key={idx} className="flex flex-col items-start gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-[12px] transition-colors">
                  <ActionIcon className={`w-4 h-4 ${action.color}`} strokeWidth={2.5} />
                  <span className="text-[11px] font-semibold text-gray-700 text-left leading-tight">
                    {action.label.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Download Card (Refined) */}
        <div className="relative overflow-hidden rounded-[16px] p-5 mb-4 bg-gray-900 text-white shadow-lg mt-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-80 -z-10"></div>
          
          <h3 className="text-[15px] font-bold leading-tight mb-1.5">CollabSphere App</h3>
          <p className="text-[11px] font-medium text-gray-400 mb-4 pr-4">Stay connected anytime, anywhere.</p>
          
          <button className="flex items-center justify-center gap-1.5 w-full bg-white text-black hover:bg-gray-100 rounded-full py-2 mb-4 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Download Now</span>
          </button>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1 border border-white/5">
              <Apple className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="flex-1 bg-white/10 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1 border border-white/5">
              <PlaySquare className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>
        </div>

        {/* Bottom Switch Account */}
        <div className="shrink-0 bg-white rounded-full p-2 flex items-center justify-between border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleLogout}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[13px]">
              {currentUser.fullName.charAt(0)}
            </div>
            <span className="text-[12px] font-semibold text-gray-700">Switch Account</span>
          </div>
          <div className="flex items-center gap-2 pr-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200 bg-white">
              <Moon className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
