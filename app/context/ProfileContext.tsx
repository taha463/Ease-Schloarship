"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CandidateProfile, emptyCandidate } from "@/lib/candidate-data";
import { supabase } from "@/lib/supabase";

interface ProfileContextType {
  profile: CandidateProfile;
  loading: boolean;
  isNewUser: boolean;
  saveProfile: (updated: CandidateProfile) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CandidateProfile>(emptyCandidate);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Not logged in: start with empty template
        setProfile(emptyCandidate);
        setIsNewUser(true);
        setLoading(false);
        return;
      }

      // Fetch from Supabase profiles table
      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setProfile({
          id: d.id,
          name: d.full_name || "",
          degree: d.degree || "",
          university: d.university || "",
          gradDate: d.graduation_date || "",
          cgpa: d.cgpa ? parseFloat(d.cgpa) : 0,
          maxCgpa: d.max_cgpa ? parseFloat(d.max_cgpa) : 4.0,
          location: d.location || "",
          phone: d.phone || "",
          email: session.user.email || "",
          github: "",
          linkedin: "",
          summary: d.summary || "",
          skills: d.skills || {
            languages: [],
            aiMl: [],
            backend: [],
            frontend: [],
          },
          experience: d.experience || [],
          projects: d.projects || [],
          certifications: d.certifications || [],
          targetPreferences:
            d.target_preferences || emptyCandidate.targetPreferences,
        });
        setIsNewUser(false);
      } else {
        // Logged in, but hasn't created a profile row yet
        setIsNewUser(true);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updated: CandidateProfile): Promise<boolean> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        // Fallback for demo/guest mode without auth
        setProfile(updated);
        setIsNewUser(false);
        return true;
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName: updated.name,
          degree: updated.degree,
          university: updated.university,
          graduationDate: updated.gradDate,
          cgpa: updated.cgpa,
          maxCgpa: updated.maxCgpa,
          location: updated.location,
          phone: updated.phone,
          summary: updated.summary,
          skills: updated.skills,
          experience: updated.experience,
          projects: updated.projects,
          certifications: updated.certifications,
          targetPreferences: updated.targetPreferences,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);

      setProfile(updated);
      setIsNewUser(false);
      return true;
    } catch (err) {
      console.error("Failed to save profile:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        isNewUser,
        saveProfile,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
