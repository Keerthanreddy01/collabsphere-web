"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Sidebar from "@/components/Sidebar";
import { LogOut, Settings, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-[#FF512F] selection:text-white font-inter overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-[72px] h-screen overflow-y-auto no-scrollbar relative">
        <div className="max-w-4xl mx-auto px-4 py-12 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-bold">Profile</h1>
            <button 
              onClick={() => router.push("/settings")}
              className="p-3 bg-[#1A1A1A] hover:bg-[#262626] rounded-full transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#FF512F] to-[#F09819] opacity-20"></div>
            
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-black overflow-hidden shrink-0 mt-4 md:mt-12 shadow-2xl">
              <img 
                src={profile?.avatar_url || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
                alt="Avatar" 
                className="w-full h-full object-cover bg-[#1A1A1A]"
              />
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left mt-0 md:mt-12">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold">{profile?.display_name || user.displayName || "Builder"}</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors">
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
              
              <p className="text-[#A8A8A8] text-lg mb-6 max-w-2xl">
                {profile?.bio || "No bio added yet. Tell the community about yourself!"}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-[#262626] pt-6">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-[#A8A8A8]">Projects</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-[#A8A8A8]">Followers</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-[#A8A8A8]">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Account Actions</h3>
              <p className="text-sm text-[#A8A8A8]">Log out of your CollabSphere account on this device.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
