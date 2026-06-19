"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Telescope, Rocket, MessageSquare, Bell, User, Menu, LogOut, Settings, Zap, MoreHorizontal, Pencil, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, onMobileCreateClick }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
        setIsMobile(window.innerWidth < 768);
      } else {
        setIsExpanded(true);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    { key: "home", label: "Home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Explore", icon: Telescope, route: "/explore" },
    { key: "notifications", label: "Notifications", icon: Bell, route: "/notifications" },
    { key: "connect", label: "Connect", icon: Rocket, route: "/connect" },
    { key: "messages", label: "Chat", icon: MessageSquare, route: "/messages" },
    { key: "profile", label: "Profile", icon: User, route: "/profile" },
    { key: "more", label: "More", icon: Menu, route: "/settings" }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isExpanded ? 260 : (isMobile ? 70 : 80),
        height: "100dvh",
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 0,
      }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      className={`hidden md:flex sticky left-0 top-0 z-50 flex-col bg-[#000000] shrink-0 border-[#2f3336] border-r overflow-visible`}
    >
      {/* Unique Vertical Toggle Button (Hidden on Mobile) */}
      {!isMobile && (
        <div className="absolute -right-3 top-0 bottom-0 w-6 flex items-center justify-center pointer-events-none z-50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="pointer-events-auto h-24 w-1.5 bg-white/10 hover:w-5 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group/toggle cursor-pointer border border-white/5 shadow-xl backdrop-blur-md"
            title="Toggle Sidebar"
          >
            <div className="opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-300 text-white/80 shrink-0">
              {isExpanded ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            </div>
          </button>
        </div>
      )}

      {/* Top Logo */}
      <div className={`flex items-center mt-6 mb-8 w-full ${isExpanded ? 'px-6' : 'justify-center px-0'}`}>
        <Link
          href="/dashboard/home"
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none outline-none"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center"
              >
                <img src="/logocs.png" alt="CollabSphere Logo" className="w-9 h-9 mr-3 rounded-full" />
                <span className="text-[24px] font-extrabold text-white whitespace-nowrap overflow-hidden tracking-tight">
                  CollabSphere
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <img src="/logocs.png" alt="CollabSphere Logo" className="w-10 h-10 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-2 w-full px-3 relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

          return (
            <div key={item.key} className={`relative group/navitem w-full flex ${isExpanded ? 'justify-start px-2' : 'justify-center'}`}>
              <Link
                href={item.route}
                className={`
                  relative h-[50px] flex items-center rounded-full transition-all duration-300 overflow-hidden cursor-pointer hover:bg-[#181818]
                  ${isExpanded ? 'px-4 justify-start w-fit' : 'justify-center w-[50px] px-0'}
                `}
              >
                <Icon
                  className={`shrink-0 transition-all duration-300 ${isActive ? "text-white" : "text-[#71767b] group-hover/navitem:text-white"}`}
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? "currentColor" : "none"}
                />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`ml-4 text-[17px] whitespace-nowrap overflow-hidden ${isActive ? "font-bold text-white" : "font-medium text-[#71767b] group-hover/navitem:text-white"}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && !isMobile && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2f3336] text-white text-sm font-bold rounded-lg opacity-0 pointer-events-none group-hover/navitem:opacity-100 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap transition-all duration-200 shadow-xl">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Share CTA */}
      <div className="w-full px-3 my-4">
        <button
          onClick={() => {
            if (pathname === "/messages") {
              window.dispatchEvent(new CustomEvent("open-compose"));
            } else {
              router.push("/dashboard/home?compose=true");
            }
          }}
          className={`
            flex items-center justify-center transition-all duration-200 mx-auto shrink-0 select-none cursor-pointer text-black hover:bg-[#e6e6e6] hover:-translate-y-[1px] active:translate-y-0 bg-white
            ${isExpanded ? 'w-[90%] h-[52px] rounded-full' : 'w-[50px] h-[50px] rounded-full'}
          `}
          title="Share"
        >
          <Pencil className={`shrink-0 ${isExpanded ? 'w-[20px] h-[20px]' : 'w-[20px] h-[20px] fill-current'}`} fill="currentColor" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-2 font-bold text-[17px] whitespace-nowrap overflow-hidden"
              >
                Share
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* User Profile */}
      <div className="w-full px-3 mb-6 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className={`
                flex items-center transition-all duration-300 bg-transparent hover:bg-[#181818] outline-none group/user cursor-pointer rounded-full
                ${isExpanded ? 'w-[95%] mx-auto p-3 justify-start' : 'w-[50px] h-[50px] justify-center mx-auto p-0'}
              `}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <img 
                  src={currentUser.imageUrl} 
                  alt="Profile" 
                  className={`rounded-full object-cover shrink-0 relative z-10 ${isExpanded ? 'w-10 h-10' : 'w-[42px] h-[42px]'}`} 
                  referrerPolicy="no-referrer"
                />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-left flex flex-col min-w-0 flex-1 ml-3 overflow-hidden"
                  >
                    <div className="text-[15px] font-bold text-white truncate leading-tight group-hover/user:text-blue-400 transition-colors">{profile?.full_name || user?.displayName || "Builder"}</div>
                    <div className="text-[13px] text-[#71767b] truncate mt-0.5">@{profile?.username || user?.email?.split('@')[0] || "builder"}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              {isExpanded && (
                <MoreHorizontal className="w-5 h-5 text-[#71767b] group-hover/user:text-white shrink-0 transition-colors mr-1" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[260px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.1] text-white p-2 rounded-2xl mb-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100]"
          >
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-xl p-3 flex items-center transition-colors" onClick={() => router.push('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile Info
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-xl p-3 flex items-center transition-colors" onClick={() => router.push('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2f3336] my-1" />
            <DropdownMenuItem className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer rounded-xl p-3 flex items-center text-red-500 transition-colors" onClick={async () => { await signOut(auth); router.push('/'); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </motion.aside>
  );
}
