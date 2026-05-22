import { supabase } from "./supabase";

export async function getProfile(clerkUserId: string) {
  const { data, error } = await supabase
    .from("builder_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();
  return { data, error };
}

export async function createProfile(profile: {
  clerk_user_id: string;
  full_name?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from("builder_profiles")
    .insert([profile])
    .select()
    .single();
  return { data, error };
}

export async function updateProfile(
  clerkUserId: string,
  updates: Partial<{
    username: string;
    bio: string;
    location: string;
    website: string;
    github_url: string;
    twitter_url: string;
    skills: string[];
    stack: string[];
    looking_for: string[];
    availability: string;
    experience_level: string;
  }>
) {
  const { data, error } = await supabase
    .from("builder_profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();
  return { data, error };
}
