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
    { label: "Create Post", icon: PenSquare, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Start Discussion", icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Upload Media", icon: UploadCloud, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Invite Friends", icon: UserPlus, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      <aside className={`fixed left-4 top-4 bottom-4 z-50 w-[280px] bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-y-auto no-scrollbar flex flex-col p-4 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}`}>
        
        {/* Ambient Gradients inside Sidebar */}
        <div className="absolute top-0 left-0 w-full h-48 overflow-hidden rounded-t-[32px] pointer-events-none -z-10">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-2 mb-6 cursor-pointer group" onClick={() => router.push('/dashboard/home')}>
          <div className="relative w-20 h-20 mb-3">
            <div className="absolute inset-[-4px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity duration-300"></div>
            <img src={currentUser.imageUrl} alt={currentUser.fullName} className="relative w-full h-full rounded-full object-cover border-[3px] border-white shadow-sm" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white shadow-sm z-10"></div>
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">{currentUser.fullName}</h2>
            <BadgeCheck className="w-4 h-4 text-blue-500" fill="currentColor" stroke="white" />
          </div>
          <p className="text-[12px] font-medium text-gray-400 mb-3">@{currentUser.username}</p>
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span className="text-[11px] font-semibold text-gray-500">Building, Learning, Sharing.</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 mb-6">
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-[16px] text-[14px] font-bold transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? "text-white shadow-lg shadow-purple-500/25" 
                    : "text-gray-600 bg-white hover:bg-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 -z-10"></div>
                )}
                {isActive && (
                  <Sparkles className="absolute right-4 top-2 w-3 h-3 text-white/50 opacity-50" />
                )}

                <span className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-indigo-600"}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`min-w-[20px] h-[20px] flex items-center justify-center px-1.5 rounded-full text-[10px] font-black relative z-10 ${
                    isActive ? "bg-white/20 text-white" : "bg-pink-100 text-pink-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-gray-800 px-2 mb-3 block">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button key={idx} className={`flex flex-col items-start gap-2 p-3 ${action.bg} rounded-[14px] transition-transform hover:-translate-y-0.5`}>
                  <ActionIcon className={`w-4 h-4 ${action.color}`} strokeWidth={2.5} />
                  <span className={`text-[11px] font-bold ${action.color} text-left leading-tight`}>
                    {action.label.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Download Card */}
        <div className="relative overflow-hidden rounded-[20px] p-5 mb-4 shadow-xl shadow-blue-500/20 group cursor-pointer mt-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 -z-20"></div>
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-400/40 rounded-full blur-xl -z-10"></div>
          
          <h3 className="text-[16px] font-bold text-white leading-tight mb-2">Get the<br/>CollabSphere<br/>App</h3>
          <p className="text-[10px] font-medium text-white/80 mb-4 pr-10">Stay connected anytime, anywhere.</p>
          
          <button className="flex items-center justify-center gap-1.5 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full py-2 mb-4 transition-colors">
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="text-[11px] font-bold text-white">Download Now</span>
          </button>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-black rounded-lg py-1.5 px-2 flex items-center justify-center gap-1">
              <Apple className="w-3.5 h-3.5 fill-white text-white" />
              <div className="flex flex-col items-start">
                <span className="text-[5px] text-white/70 leading-none mb-0.5">Download on the</span>
                <span className="text-[7px] text-white font-bold leading-none">App Store</span>
              </div>
            </div>
            <div className="flex-1 bg-black rounded-lg py-1.5 px-2 flex items-center justify-center gap-1">
              <PlaySquare className="w-3.5 h-3.5 fill-white text-white" />
              <div className="flex flex-col items-start">
                <span className="text-[5px] text-white/70 leading-none mb-0.5">GET IT ON</span>
                <span className="text-[7px] text-white font-bold leading-none">Google Play</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Switch Account */}
        <div className="shrink-0 bg-white rounded-full p-2 flex items-center justify-between border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleLogout}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center text-white font-bold text-[13px]">
              {currentUser.fullName.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-gray-500">Switch Account</span>
          </div>
          <div className="flex items-center gap-2 pr-1">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200">
              <Moon className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
