"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Plane,
  AlertCircle,
  CheckCircle2,
  Building,
  Sparkles,
  Loader2,
  ExternalLink,
  Lock,
} from "lucide-react";
import { SUPPORTED_COUNTRIES, CountryVisaInfo } from "@/lib/visa-data";

export default function VisaTracker() {
  const [selectedCountry, setSelectedCountry] = useState<string>("Germany");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visaData, setVisaData] = useState<CountryVisaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveVisaPolicy = useCallback(async (countryName: string) => {
    setIsLoading(true);
    setError(null);

    // 1. Check in-session cache first to prevent redundant API queries
    const cacheKey = `visa_live_${countryName.toLowerCase()}`;
    const cached =
      typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      try {
        setVisaData(JSON.parse(cached));
        setIsLoading(false);
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    // 2. Fetch live data via Tavily + Gemini
    try {
      const res = await fetch("/api/ai/check-visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch live visa policy");
      }

      setVisaData(json.data);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch live data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLiveVisaPolicy(selectedCountry);
  }, [selectedCountry, fetchLiveVisaPolicy]);

  const handleForceRefresh = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`visa_live_${selectedCountry.toLowerCase()}`);
    }
    void fetchLiveVisaPolicy(selectedCountry);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Live Visa Policy Intelligence
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Study Visa & Proof of Funds Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Real-time requirements queried directly from official embassy
            portals using Tavily Web Search.
          </p>
        </div>

        <button
          onClick={handleForceRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>
            {isLoading ? "Fetching Tavily Sources..." : "Force Live Re-scan"}
          </span>
        </button>
      </div>

      {/* Country Tabs */}
      <div className="bg-white rounded-2xl p-3 hairline-border editorial-shadow overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          {SUPPORTED_COUNTRIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCountry(c.name)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCountry === c.name
                  ? "bg-[#2D5A43] text-white font-bold shadow-xs"
                  : "bg-[#FAF8F5] text-[#5C626A] hover:bg-[#F3F0EB] hairline-border"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-stone-200 rounded-xl" />
              <div className="h-24 bg-stone-200 rounded-xl" />
              <div className="h-24 bg-stone-200 rounded-xl" />
            </div>
            <div className="h-32 bg-stone-200 rounded-2xl" />
            <div className="h-48 bg-stone-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-48 bg-stone-200 rounded-2xl" />
            <div className="h-36 bg-stone-200 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic Data Display */}
      {!isLoading && visaData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
                <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                  Proof of Funds
                </span>
                <p className="text-xs font-bold text-[#1C1E21] leading-snug">
                  {visaData.financialProofRequired}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
                <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                  Post-Study Work
                </span>
                <p className="text-xs font-bold text-[#2D5A43] leading-snug">
                  {visaData.postStudyWorkPermit}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
                <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                  Part-Time Rights
                </span>
                <p className="text-xs font-bold text-[#1C1E21] leading-snug">
                  {visaData.partTimeWorkAllowance}
                </p>
              </div>
            </div>

            {/* Blocked Account / Bank Account Specifics */}
            {visaData.blockedAccountDetails && (
              <div className="bg-[#EBF2EE] p-5 rounded-2xl border border-[#2D5A43]/20 space-y-2">
                <h3 className="text-xs font-bold text-[#2D5A43] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> Bank Account / Deposit Protocol
                </h3>
                <p className="text-xs text-[#1C1E21] leading-relaxed font-medium">
                  {visaData.blockedAccountDetails}
                </p>
              </div>
            )}

            {/* Appointment & Processing Queues */}
            <div className="bg-white p-6 rounded-2xl hairline-border editorial-shadow space-y-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#1C1E21] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#2D5A43]" />
                <span>Embassy / VFS Global Submission Queue</span>
              </h3>
              <div className="bg-[#FAF8F5] p-4 rounded-xl hairline-border text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#5C626A]">
                    Application Portal:
                  </span>
                  <span className="font-medium text-[#1C1E21]">
                    {visaData.embassyAppointmentPortal}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2">
                  <span className="font-semibold text-[#5C626A]">
                    Estimated Wait Time:
                  </span>
                  <span className="font-bold text-[#C86248]">
                    {visaData.pakistanWaitTime}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2">
                  <span className="font-semibold text-[#5C626A]">
                    PR Pathway Ease:
                  </span>
                  <span className="font-bold text-[#2D5A43]">
                    {visaData.prPathwayEase}
                  </span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Execution */}
            <div className="bg-white p-6 rounded-2xl hairline-border editorial-shadow space-y-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#1C1E21] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
                <span>Verified Step-by-Step Procedure</span>
              </h3>
              <div className="space-y-2">
                {visaData.keyStepsPakistani.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF8F5] rounded-xl hairline-border text-xs text-[#1C1E21]"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Live Warnings & Evidence Sources */}
          <div className="lg:col-span-4 space-y-6">
            {/* Warnings */}
            <div className="bg-[#FAF0EE] p-5 rounded-2xl border border-[#C86248]/20 space-y-3">
              <h3 className="text-xs font-bold text-[#C86248] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Crucial Policy Warnings
              </h3>
              <ul className="text-xs text-[#1C1E21] space-y-2 leading-relaxed">
                {visaData.importantWarnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C86248] font-bold">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Sources */}
            <div className="bg-white p-5 rounded-2xl hairline-border editorial-shadow space-y-3 border-l-4 border-l-[#2D5A43]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tavily
                  Verified Sources
                </span>
                <span className="text-[10px] text-stone-400">
                  {visaData.lastUpdated}
                </span>
              </div>
              <ul className="space-y-1.5 pt-1">
                {visaData.sourceUrls?.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#2D5A43] hover:underline break-all"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{new URL(url).hostname}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
