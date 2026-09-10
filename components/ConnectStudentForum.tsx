"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Linkedin,
  MessageSquare,
  Globe,
  Loader2,
  Copy,
  Check,
  Building,
  Sparkles,
} from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
interface Ambassador {
  name: string;
  currentRole: string;
  linkedinUrl: string;
  matchReason: string;
  adviceToAsk: string;
}

export default function ConnectStudentForum() {
  const { profile } = useProfile();

  const [targetCountry, setTargetCountry] = useState(
    profile.targetPreferences?.includedRegions?.[0] || "Germany",
  );
  const [university, setUniversity] = useState(
    "Technical University of Munich",
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    profile.targetPreferences?.fieldOfStudy?.[0] ||
      profile.degree ||
      "Software Engineering",
  );
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  useEffect(() => {
    if (profile.targetPreferences?.includedRegions?.[0]) {
      setTargetCountry(profile.targetPreferences.includedRegions[0]);
    }
    if (profile.targetPreferences?.fieldOfStudy?.[0]) {
      setFieldOfStudy(profile.targetPreferences.fieldOfStudy[0]);
    }
  }, [profile]);

  const fetchAmbassadors = async () => {
    if (!targetCountry.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCountry,
          university,
          candidateNationality: profile.location || "Pakistani",
          fieldOfStudy,
        }),
      });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setAmbassadors(result.data);
        setDataSource(result.source || "live_ai");
      } else {
        setAmbassadors([]);
      }
    } catch (e) {
      console.error("Failed to query student ambassadors:", e);
      setAmbassadors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#1A1A1A]">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EBF2EE] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2D5A43]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1E21] tracking-tight">
              Connect Student & Alumni Forum
            </h1>
            <p className="text-xs text-[#5C626A]">
              Live LinkedIn indexing. Discover current international students
              and alumni from your home country who made it to your target
              universities.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target Country
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
              placeholder="e.g., Germany, Sweden, Canada"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target University (Optional)
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
              placeholder="e.g., Technical University of Munich"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Field of Study
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
              placeholder="e.g., Software Engineering"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
          <span className="text-[11px] text-gray-400">
            {dataSource && (
              <>
                Status:{" "}
                <strong className="text-emerald-700">
                  {dataSource === "supabase_cache"
                    ? "Supabase Intelligence Cache"
                    : "Live Web Discovery"}
                </strong>
              </>
            )}
          </span>

          <button
            onClick={fetchAmbassadors}
            disabled={isLoading || !targetCountry.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1C1E21] hover:bg-[#2D5A43] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Searching Alumni Profiles...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Student Ambassadors</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Loader2 className="w-8 h-8 text-[#2D5A43] animate-spin mx-auto" />
          <p className="font-semibold text-sm text-[#1C1E21]">
            Scanning LinkedIn & University Portals in {targetCountry}...
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Locating students from {profile.location || "your region"} enrolled
            in {fieldOfStudy} at {university || targetCountry}.
          </p>
        </div>
      )}

      {/* Ambassadors List */}
      {!isLoading && ambassadors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#1C1E21] uppercase tracking-wider">
              Discovered Ambassadors ({ambassadors.length})
            </h2>
            <span className="text-[11px] text-gray-400">
              Direct profiles & suggested cold outreach
            </span>
          </div>

          {ambassadors.map((amb, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] hover:border-emerald-300 transition-all shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#1C1E21]">
                    {amb.name}
                  </h3>
                  <p className="text-xs text-[#5C626A] mt-0.5">
                    {amb.currentRole}
                  </p>
                </div>

                {amb.linkedinUrl && amb.linkedinUrl !== "Not available" && (
                  <a
                    href={
                      amb.linkedinUrl.startsWith("http")
                        ? amb.linkedinUrl
                        : `https://${amb.linkedinUrl}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EDF3F8] text-[#0077b5] text-xs font-semibold rounded-xl hover:bg-[#E1E9EE] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>View LinkedIn</span>
                  </a>
                )}
              </div>

              {/* Match Reason */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5E7EB] text-xs space-y-1">
                <span className="font-bold text-[#1C1E21] block">
                  Why connect with them:
                </span>
                <p className="text-[#5C626A] leading-relaxed">
                  {amb.matchReason}
                </p>
              </div>

              {/* Suggested Cold Message with One-Click Copy */}
              <div className="bg-[#EBF2EE]/70 p-4 rounded-xl border border-[#2D5A43]/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2D5A43] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Suggested Outreach Template
                  </span>

                  <button
                    onClick={() => handleCopyMessage(amb.adviceToAsk, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43] hover:underline cursor-pointer"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-zinc-700 italic leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#2D5A43]/10">
                  &quot;{amb.adviceToAsk}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && ambassadors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] space-y-2">
          <Globe className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-[#1C1E21]">
            No ambassadors indexed yet
          </p>
          <p className="text-xs text-[#5C626A]">
            Enter a country and optional university above, then click &quot;Find
            Student Ambassadors&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
