"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Telescope, Pencil, MessageSquare, User } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  const tabs = [
    { href: "/dashboard/home", icon: LayoutDashboard, label: "Home" },
    { href: "/explore", icon: Telescope, label: "Explore" },
    { href: "/dashboard/home?compose=true", icon: Pencil, label: "Post", isCenter: true },
    { href: "/messages", icon: MessageSquare, label: "Chat" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] 
                    flex md:hidden 
                    bg-black/90 backdrop-blur-xl
                    border-t border-white/10
                    h-16 px-2
                    justify-around items-center">
      {tabs.map((tab) => {
        const isHomeTab = tab.href === "/dashboard/home";
        const isActive = isHomeTab 
          ? pathname === "/dashboard/home" 
          : pathname.startsWith(tab.href.split('?')[0]);
        const Icon = tab.icon;
        
        if (tab.isCenter) return (
          <Link key={tab.href} href={tab.href}
            className="flex items-center justify-center
                       w-12 h-12 rounded-full
                       bg-white text-black
                       -mt-4 shadow-lg">
            <Icon size={20} />
          </Link>
        );
        
        return (
          <Link key={tab.href} href={tab.href}
            className="flex flex-col items-center 
                       gap-0.5 px-3 py-1">
            <Icon size={20} 
              className={isActive ? 
                "text-white" : "text-gray-600"} />
            <span className={`text-[10px] 
              ${isActive ? 
                "text-white" : "text-gray-600"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
