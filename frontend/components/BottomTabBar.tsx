"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Telescope, Pencil, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomTabBar() {
  const pathname = usePathname();
  
  // Hide the tab bar on auth pages and the pre-register landing page
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/pre-register";
  if (isAuthPage) return null;

  const tabs = [
    { href: "/dashboard/home", icon: LayoutDashboard, label: "Home" },
    { href: "/explore", icon: Telescope, label: "Explore" },
    { href: "/dashboard/home?compose=true", icon: Pencil, label: "Post" },
    { href: "/messages", icon: MessageSquare, label: "Chat" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex md:hidden w-[90vw] max-w-[360px] justify-center pointer-events-none">
      <div className="flex items-center justify-between w-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-1 rounded-full shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
        {tabs.map((tab) => {
          const isHomeTab = tab.href === "/dashboard/home";
          // We need a slightly smarter check for the "Post" tab which has query params
          const isPostTab = tab.href.includes("?compose=true");
          // But since Next.js router doesn't always expose query params in pathname directly, 
          // we simplify: if we're active, we're active. Note: for real query matching, we'd use useSearchParams.
          // For now, let's keep the standard matching, but note that Post tab might not stay "active" 
          // because it usually opens a modal and keeps you on the home page.
          
          let isActive = false;
          if (isHomeTab) {
            isActive = pathname === "/dashboard/home";
          } else if (isPostTab) {
            isActive = false; // Post is usually an action, not a dedicated page view
          } else {
            isActive = pathname.startsWith(tab.href);
          }

          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.href} 
              href={tab.href}
              className="relative flex flex-col items-center justify-center flex-1 h-[48px] rounded-full z-10 group touch-manipulation"
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white dark:bg-black/10 dark:bg-white/15 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30 
                  }}
                />
              )}
              <Icon 
                size={20} 
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-black dark:text-white" : "text-black/50 dark:text-white/40 group-hover:text-black dark:group-hover:text-white/70"
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {/* Labels removed for a cleaner, modern app feel (like X, Threads) */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
