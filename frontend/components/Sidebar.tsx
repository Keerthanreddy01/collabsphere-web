"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Telescope, Rocket, MessageSquare, Bell, User, Settings, ChevronLeft, ChevronRight, Flame, TrendingUp, Users, Activity } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

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
        setIsExpanded(false);
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

  const navItems = [
    { key: "home", label: "Home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Discover", icon: Telescope, route: "/explore" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages" },
    { key: "notifications", label: "Notifications", icon: Bell, route: "/notifications" },
    { key: "connect", label: "Connect", icon: Rocket, route: "/connect" },
    { key: "profile", label: "Your Profile", icon: User, route: "/profile" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" }
  ];

  return (
    <div className="hidden md:flex sticky top-4 left-4 z-[60] h-[calc(100dvh-32px)] shrink-0 w-[80px]">
      <motion.aside 
        initial={false}
        animate={{ width: isExpanded ? 250 : 80 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
        className={`
          absolute top-0 left-0 flex flex-col shrink-0 h-full
          bg-white dark:bg-[#0c0c0e]
          border border-gray-200 dark:border-white/[0.08]
          rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden
        `}
      >
      <div className="flex flex-col h-full relative">
        {/* Top Header - Logo & Toggle */}
        <div className={`flex items-center pt-6 pb-4 ${isExpanded ? 'px-5 justify-between' : 'px-0 justify-center flex-col gap-4'}`}>
          <Link
            href="/dashboard/home"
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer outline-none shrink-0"
          >
            {isExpanded ? (
              <div className="flex items-center">
                <img src="/newlogo.png" alt="Logo" className="w-8 h-8 mr-3 rounded-xl drop-shadow-sm" />
                <span className="text-[19px] font-bold text-black dark:text-white tracking-tight">
                  CollabSphere
                </span>
              </div>
            ) : (
              <img src="/newlogo.png" alt="Logo" className="w-10 h-10 rounded-xl drop-shadow-sm" />
            )}
          </Link>


        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2.5 w-full px-3.5 mt-2 flex-1 overflow-y-auto no-scrollbar pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <Link
                key={item.key}
                href={item.route}
                className="group/nav relative block outline-none"
              >
                <div
                  className={`
                    relative flex items-center h-[52px] w-full px-4 rounded-[16px] transition-colors duration-200 cursor-pointer overflow-hidden
                    ${isActive 
                      ? 'bg-white dark:bg-black text-black dark:text-white dark:bg-gradient-to-b dark:from-white/[0.12] dark:to-transparent border border-transparent dark:border-white/[0.08] dark:border-t-white/[0.25] shadow-[0_4px_14px_rgba(0,0,0,0.2)] dark:shadow-inner' 
                      : 'bg-transparent border border-transparent hover:bg-gray-100 hover:border-transparent dark:hover:bg-white/[0.03] dark:hover:border-gray-200 dark:border-white/[0.05]'
                    }
                  `}
                >
                  {/* Subtle top inner glow for active state in dark mode */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/30 to-transparent opacity-50" />
                  )}

                  <div className="relative z-10 flex items-center w-full">
                    <Icon
                      className={`
                        shrink-0 transition-colors duration-200
                        ${isActive ? 'text-black dark:text-white drop-shadow-md dark:text-white' : 'text-gray-700 dark:text-neutral-400 group-hover/nav:text-white dark:text-black dark:group-hover/nav:text-neutral-200'}
                      `}
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2.2}
                    />
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className={`
                            ml-3 text-[15px] whitespace-nowrap
                            ${isActive ? "font-bold text-black dark:text-white" : "font-semibold text-gray-700 dark:text-neutral-300"}
                          `}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Tooltip for collapsed state */}
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-white text-black dark:text-white dark:text-black text-sm font-bold rounded-lg opacity-0 pointer-events-none group-hover/nav:opacity-100 whitespace-nowrap transition-all duration-200 shadow-xl z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

      </div>
    </motion.aside>
    </div>
  );
}
