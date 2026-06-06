"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { Settings, MapPin, Briefcase, Rocket, Edit3, Share, Plus } from "lucide-react";
import { motion } from "framer-motion";

const tabs = ["Posts", "Projects", "Showcases", "Activity"];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "builder_profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      };
      fetchProfile();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  const containerVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-white font-inter overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-[72px] h-screen overflow-y-auto no-scrollbar relative">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 pb-32">
          
          {/* Top Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-end mb-6"
          >
            <button 
              onClick={() => router.push("/settings")}
              className="p-2.5 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] rounded-full transition-colors text-white/70 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {/* Profile Cover & Header */}
            <motion.div variants={itemVariants} className="relative rounded-[24px] bg-white/[0.02] border border-white/[0.06] backdrop-blur-[20px] overflow-hidden">
              
              {/* Premium Banner */}
              <div className="absolute top-0 left-0 right-0 h-[160px] overflow-hidden">
                <div className="absolute inset-0 bg-[#090909]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.25),transparent_40%)]" />
                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
                {/* Fade to content */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              {/* Profile Content */}
              <div className="relative pt-[100px] px-6 pb-6 md:px-10 md:pb-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                  {/* Avatar */}
                  <div className="w-[120px] h-[120px] rounded-full border-4 border-[#0a0a0a] overflow-hidden bg-[#111] shadow-xl shrink-0 relative z-10">
                    <img 
                      src={profile?.avatar_url || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 self-start md:self-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] rounded-[12px] text-[13px] font-semibold transition-all">
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-[12px] text-[13px] font-bold transition-all">
                      <Share className="w-4 h-4" /> Share Profile
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-8">
                  <h1 className="text-[28px] font-bold tracking-tight text-white flex items-center gap-2 mb-1">
                    {profile?.display_name || user.displayName || "Builder"}
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </h1>
                  <p className="text-[#A8A8A8] text-[15px] mb-4">
                    @{user.email?.split('@')[0] || "builder"}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[14px] text-white/90">
                      <span className="w-5 text-center">🚀</span>
                      <span>Building <span className="font-semibold text-white">CollabSphere</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-white/90">
                      <span className="w-5 text-center text-[#777]"><Briefcase className="w-4 h-4 inline-block" /></span>
                      <span>{profile?.role || "Full Stack Developer"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px] text-white/90">
                      <span className="w-5 text-center text-[#777]"><MapPin className="w-4 h-4 inline-block" /></span>
                      <span>{profile?.location || "Hyderabad, India"}</span>
                    </div>
                  </div>

                  <p className="text-[15px] leading-relaxed text-white/80 max-w-2xl">
                    {profile?.bio || "No bio yet — tell builders what you're working on."}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 border-t border-white/[0.08] pt-6">
                  {[
                    { label: "Projects", value: profile?.projects_count || 12 },
                    { label: "Followers", value: profile?.followers_count || 234 },
                    { label: "Following", value: profile?.following_count || 89 }
                  ].map((stat, i) => (
                    <div key={i} className="flex-1 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all rounded-[16px] p-4 cursor-pointer group">
                      <div className="text-[24px] font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{stat.value}</div>
                      <div className="text-[13px] font-medium text-[#A8A8A8]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="mt-8 mb-6 border-b border-white/[0.08] flex items-center gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-4 text-[14px] font-semibold transition-colors ${
                    activeTab === tab ? "text-white" : "text-[#777] hover:text-[#A8A8A8]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="profileTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Content Area */}
            <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-12 backdrop-blur-[20px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🚀 Start building</h3>
              <p className="text-[#A8A8A8] text-[14px] leading-relaxed max-w-sm mb-6">
                Share your first project, post an update, or showcase your work to the community.
              </p>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[14px] font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Plus className="w-4 h-4" /> Create New
              </button>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
