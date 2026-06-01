"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Account", icon: Settings },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-white font-inter overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-[72px] h-screen overflow-y-auto no-scrollbar relative">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
            <p className="text-[#A8A8A8] text-[15px]">Manage your account settings and preferences.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-64 shrink-0 space-y-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                      activeTab === tab.name 
                        ? "bg-white/[0.08] text-white" 
                        : "text-[#888] hover:bg-white/[0.04] hover:text-[#ddd]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => router.push("/api/auth/logout")} // Handle actual logout logic here if needed
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-6 md:p-8 backdrop-blur-[20px]"
            >
              <h2 className="text-xl font-bold text-white mb-6">{activeTab} Settings</h2>
              
              <div className="text-[#777] text-[14px]">
                {activeTab} content will be implemented here.
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
