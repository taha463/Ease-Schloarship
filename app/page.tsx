"use client";

import React, { useState } from "react";
import { useProfile } from "./context/ProfileContext";
import UserProfileModal from "@/components/UserProfileModal";

export default function HeaderProfileButton() {
  const { profile, loading, isNewUser, saveProfile } = useProfile();
  const [openModal, setOpenModal] = useState(false);

  const modalProfileData = {
    fullName: profile.name,
    degree: profile.degree,
    university: profile.university,
    graduationDate: profile.gradDate,
    cgpa: profile.cgpa,
    maxCgpa: profile.maxCgpa,
    location: profile.location,
    fieldOfStudy: profile.targetPreferences?.fieldOfStudy || [],
    targetCountries: profile.targetPreferences?.includedRegions || [],
    minFundingNeeded:
      profile.targetPreferences?.minFundingNeeded || "Fully Funded",
  };

  const handleSaveModal = async (updatedData: typeof modalProfileData) => {
    await saveProfile({
      ...profile,
      name: updatedData.fullName,
      degree: updatedData.degree,
      university: updatedData.university,
      gradDate: updatedData.graduationDate,
      cgpa: updatedData.cgpa,
      maxCgpa: updatedData.maxCgpa,
      location: updatedData.location,
      targetPreferences: {
        ...profile.targetPreferences,
        fieldOfStudy: updatedData.fieldOfStudy,
        includedRegions: updatedData.targetCountries,
        minFundingNeeded: updatedData.minFundingNeeded,
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800" />
        ) : (
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-200 hover:border-emerald-500/50 hover:bg-zinc-800 transition"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="text-left leading-tight">
              <p className="font-medium text-zinc-200">
                {profile.name || "Set Up Profile"}
              </p>
              <p className="text-[10px] text-zinc-400">
                {profile.cgpa
                  ? `CGPA ${profile.cgpa.toFixed(2)}`
                  : "Click to upload CV"}
              </p>
            </div>
          </button>
        )}
      </div>

      <UserProfileModal
        isOpen={openModal || (isNewUser && !profile.name)}
        onClose={() => setOpenModal(false)}
        currentProfile={modalProfileData}
        onSaveProfile={handleSaveModal}
      />
    </>
  );
}
