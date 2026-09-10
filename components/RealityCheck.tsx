"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  ShieldAlert,
  Building,
  Briefcase,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";

interface RealityCheckResult {
  rankingTruth: string;
  jobAndPrReality: string;
  verdict: string;
  ratingOutOfTen: number;
  sourceUrls: string[];
  lastUpdated: string;
  source?: string;
}

export default function RealityCheck() {
  const { profile } = useProfile();

  const [university, setUniversity] = useState(
    "Technical University of Munich (TUM)",
  );
  const [scholarship, setScholarship] = useState("DAAD EPOS");
  const [country, setCountry] = useState(
    profile.targetPreferences?.includedRegions?.[0] || "Germany",
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    profile.targetPreferences?.fieldOfStudy?.[0] ||
      profile.degree ||
      "Software Engineering",
  );

  const [result, setResult] = useState<RealityCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("");

  // Sync initial inputs if candidate preferences load asynchronously
  useEffect(() => {
    if (profile.targetPreferences?.includedRegions?.[0]) {
      setCountry(profile.targetPreferences.includedRegions[0]);
    }
    if (profile.targetPreferences?.fieldOfStudy?.[0]) {
      setFieldOfStudy(profile.targetPreferences.fieldOfStudy[0]);
    }
  }, [profile]);

  const handleCheck = async () => {
    if (!university.trim() || !country.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university,
          scholarship,
          country,
          fieldOfStudy,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        setDataSource(json.source || "live_ai");
      }
    } catch (e) {
      console.error("Reality check error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5)
      return "border-emerald-600 text-emerald-700 bg-emerald-50";
    if (score >= 5.5) return "border-amber-500 text-amber-700 bg-amber-50";
    return "border-rose-600 text-rose-700 bg-rose-50";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#1A1A1A]">
      {/* Search & Configuration Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF0EE] flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#C86248]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1E21] tracking-tight">
              Ranking & Immigrant Reality Check
            </h1>
            <p className="text-xs text-[#5C626A]">
              Real-time deep web verification. Cuts through university marketing
              hype, exposing housing shortages, local language barriers, junior
              tech job hiring, and visa policies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target University
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#C86248] text-[#1C1E21]"
              placeholder="e.g., Technical University of Munich"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target Scholarship (Optional)
            </label>
            <input
              type="text"
              value={scholarship}
              onChange={(e) => setScholarship(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#C86248] text-[#1C1E21]"
              placeholder="e.g., DAAD EPOS or Tuition Waiver"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#C86248] text-[#1C1E21]"
              placeholder="e.g., Germany, Sweden, Canada, Finland"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Discipline / Specialization
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#C86248] text-[#1C1E21]"
              placeholder="e.g., Artificial Intelligence / Distributed Systems"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={isLoading || !university.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1C1E21] hover:bg-[#C86248] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
              <span>Scanning Web Evidence & Immigration Reports...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-amber-200" />
              <span>Run Deep Reality Check</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Loader2 className="w-8 h-8 text-[#C86248] animate-spin mx-auto" />
          <p className="font-semibold text-sm text-[#1C1E21]">
            Cross-Referencing {university} with Recent Immigration
            Intelligence...
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Checking local tech junior hiring sentiment, housing availability,
            local language job gating, and post-study settlement metrics in{" "}
            {country}.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Verdict Banner with Score */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row gap-6 items-center">
            <div
              className={`flex-shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(
                result.ratingOutOfTen,
              )}`}
            >
              <span className="text-3xl font-bold leading-none">
                {result.ratingOutOfTen}
              </span>
              <span className="text-[11px] font-bold mt-1 uppercase">
                ROI Score
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C86248]" />
                <h2 className="text-sm font-bold text-[#1C1E21] uppercase tracking-wider">
                  The Unfiltered Verdict
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5C626A] leading-relaxed">
                {result.verdict}
              </p>
              <div className="text-[11px] text-gray-400 pt-1">
                Data Status:{" "}
                <strong className="text-emerald-700">
                  {dataSource === "supabase_cache"
                    ? "Supabase Intelligence Cache"
                    : "Live Deep Web Analysis"}
                </strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic & University Reputation Truth */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#1C1E21] flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                <Building className="w-4 h-4 text-[#C86248]" />
                <span>Academic & Admissions Reality</span>
              </h3>
              <p className="text-xs text-[#5C626A] leading-relaxed whitespace-pre-wrap">
                {result.rankingTruth}
              </p>
            </div>

            {/* Employment, Language & Settlement Reality */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#1C1E21] flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
                <Briefcase className="w-4 h-4 text-[#C86248]" />
                <span>Jobs, Housing & PR Reality in {country}</span>
              </h3>
              <p className="text-xs text-[#5C626A] leading-relaxed whitespace-pre-wrap">
                {result.jobAndPrReality}
              </p>
            </div>
          </div>

          {/* Sources and Web Evidence References */}
          {result.sourceUrls?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs text-xs text-[#5C626A] space-y-2">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <strong className="text-xs text-[#1C1E21] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                  Verified Sources Examined
                </strong>
                <span className="text-[11px] text-gray-400">
                  Indexed: {result.lastUpdated}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                {result.sourceUrls.slice(0, 6).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline inline-flex items-center gap-1 max-w-[280px] truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
