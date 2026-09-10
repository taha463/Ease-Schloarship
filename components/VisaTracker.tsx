"use client";

import React, { useState, useEffect } from "react";
import {
  Globe2,
  Clock,
  Banknote,
  Briefcase,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";

interface VisaData {
  country: string;
  flagEmoji: string;
  visaType: string;
  financialProofRequired: string;
  blockedAccountDetails: string;
  postStudyWorkPermit: string;
  partTimeWorkAllowance: string;
  prPathwayEase: "High" | "Moderate" | "Selective";
  embassyAppointmentPortal: string;
  pakistanWaitTime: string;
  keyStepsPakistani: string[];
  importantWarnings: string[];
  sourceUrls: string[];
  lastUpdated: string;
}

const SUPPORTED_COUNTRIES = [
  "Germany",
  "Sweden",
  "Finland",
  "Netherlands",
  "France",
  "Italy",
  "Ireland",
  "Canada",
  "Australia",
];

export default function VisaIntelligence() {
  const { profile } = useProfile();

  // Default to candidate's first preferred country or Germany
  const initialCountry =
    profile.targetPreferences?.includedRegions?.[0] || "Germany";
  const [selectedCountry, setSelectedCountry] =
    useState<string>(initialCountry);
  const [visaData, setVisaData] = useState<VisaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("");

  const fetchVisaIntelligence = async (country: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/check-visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setVisaData(json.data);
        setDataSource(json.source || "live_ai");
      }
    } catch (err) {
      console.error("Failed to load visa intelligence:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaIntelligence(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Header & Country Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Immigration & Student Visa Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Pakistani Passport Visa Check & Blocked Accounts
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl">
            Live regulatory requirements, appointment waiting queues in
            Islamabad/Karachi, and blocked account limits.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            {SUPPORTED_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchVisaIntelligence(selectedCountry)}
            disabled={loading}
            className="p-2 border border-[#E5E7EB] rounded-xl hover:bg-zinc-100 transition disabled:opacity-50"
            title="Refresh latest data"
          >
            <RefreshCw
              className={`w-4 h-4 text-zinc-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Visa Intelligence Cards */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB]">
          Querying Supabase cache and immigration database...
        </div>
      ) : visaData ? (
        <div className="space-y-6">
          {/* Data Source & Timestamp Banner */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-2">
            <span>
              Cache Status:{" "}
              <strong className="text-emerald-700">
                {dataSource === "supabase_cache"
                  ? "Supabase Global Cache (0 API Cost)"
                  : "Live AI Grounded"}
              </strong>
            </span>
            <span>Last Updated: {visaData.lastUpdated}</span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Proof of
                Funds
              </span>
              <p className="text-base font-bold text-[#1A1A1A]">
                {visaData.financialProofRequired}
              </p>
              <p className="text-[11px] text-[#5C626A]">
                {visaData.blockedAccountDetails}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pakistan
                Embassy Wait
              </span>
              <p className="text-base font-bold text-[#1A1A1A]">
                {visaData.pakistanWaitTime}
              </p>
              <p className="text-[11px] text-[#5C626A]">
                VFS / Embassy Portal Queue
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Work Rights
              </span>
              <p className="text-base font-bold text-[#1A1A1A]">
                {visaData.partTimeWorkAllowance}
              </p>
              <p className="text-[11px] text-[#5C626A]">
                During Semester Study
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-purple-600" /> Post-Study
                Permit
              </span>
              <p className="text-base font-bold text-[#1A1A1A]">
                {visaData.postStudyWorkPermit}
              </p>
              <p className="text-[11px] text-[#5C626A]">
                PR Pathway: {visaData.prPathwayEase}
              </p>
            </div>
          </div>

          {/* Detailed Roadmap and Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step-by-Step for Pakistani Applicants */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Step-by-Step Roadmap (Pakistani Passport)
              </h3>
              <div className="space-y-2.5">
                {visaData.keyStepsPakistani.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#5C626A]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refusal Prevention Warnings */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Refusal Prevention & Strict Protocols
              </h3>
              <div className="space-y-2.5">
                {visaData.importantWarnings.map((warn, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-rose-950/80 bg-rose-50/50 p-3 rounded-xl border border-rose-100"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{warn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
