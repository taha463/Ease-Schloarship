"use client";

import React, { useState, useRef } from "react";

interface ProfileData {
  fullName: string;
  degree: string;
  university: string;
  graduationDate: string;
  cgpa: number;
  maxCgpa: number;
  location: string;
  fieldOfStudy: string[];
  targetCountries: string[];
  minFundingNeeded: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileData;
  onSaveProfile: (profile: ProfileData) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData>(currentProfile);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/parse-cv", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";

      // Handle HTML error pages safely without triggering JSON parsing syntax errors
      if (!contentType.includes("application/json")) {
        const textError = await res.text();
        console.error("Server returned non-JSON response:", textError);
        throw new Error(
          `Server error (${res.status}). Check server terminal logs for details.`,
        );
      }

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to parse CV");
      }

      const d = json.data;
      setProfile((prev) => ({
        ...prev,
        fullName: d.fullName || prev.fullName,
        degree: d.degree || prev.degree,
        university: d.university || prev.university,
        graduationDate: d.graduationDate || prev.graduationDate,
        cgpa: typeof d.cgpa === "number" ? d.cgpa : prev.cgpa,
        maxCgpa: typeof d.maxCgpa === "number" ? d.maxCgpa : prev.maxCgpa,
        location: d.location || prev.location,
        fieldOfStudy: d.targetPreferences?.fieldOfStudy || prev.fieldOfStudy,
        targetCountries:
          d.targetPreferences?.includedRegions || prev.targetCountries,
        minFundingNeeded:
          d.targetPreferences?.minFundingNeeded || prev.minFundingNeeded,
      }));
    } catch (err: any) {
      setParseError(err.message || "Failed to process resume");
    } finally {
      setIsParsing(false);
      // Reset input value so uploading the same file again triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Applicant Profile Setup
            </h2>
            <p className="text-xs text-zinc-400">
              Upload your CV or enter details manually to tailor scholarship
              matching and visa requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* CV Auto-Fill Dropzone */}
        <div className="mb-6 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/10 p-4 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition disabled:opacity-50 cursor-pointer"
          >
            {isParsing ? "Analyzing CV with AI..." : "Upload CV / Resume (PDF)"}
          </button>
          <p className="mt-1.5 text-xs text-zinc-400">
            Auto-extracts CGPA, field of study, degree, and skills instantly.
          </p>
          {parseError && (
            <p className="mt-2 text-xs text-rose-400">{parseError}</p>
          )}
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block mb-1 text-zinc-400">Full Legal Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. Ali Ahmed"
            />
          </div>

          <div>
            <label className="block mb-1 text-zinc-400">
              Current CGPA (Out of 4.0)
            </label>
            <input
              type="number"
              step="0.01"
              value={profile.cgpa}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  cgpa: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="3.50"
            />
          </div>

          <div>
            <label className="block mb-1 text-zinc-400">Degree & Major</label>
            <input
              type="text"
              value={profile.degree}
              onChange={(e) =>
                setProfile({ ...profile, degree: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="B.Sc. Software Engineering"
            />
          </div>

          <div>
            <label className="block mb-1 text-zinc-400">
              University / Institution
            </label>
            <input
              type="text"
              value={profile.university}
              onChange={(e) =>
                setProfile({ ...profile, university: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. NUST / FAST / HITEC"
            />
          </div>

          <div>
            <label className="block mb-1 text-zinc-400">
              Target Field of Study
            </label>
            <input
              type="text"
              value={profile.fieldOfStudy.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  fieldOfStudy: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="AI, Computer Science, Data Science"
            />
          </div>

          <div>
            <label className="block mb-1 text-zinc-400">Target Countries</label>
            <input
              type="text"
              value={profile.targetCountries.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  targetCountries: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none"
              placeholder="Germany, Sweden, Finland, Canada"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
