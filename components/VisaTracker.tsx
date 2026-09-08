"use client";

import React, { useState } from "react";
import {
  Plane,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building,
  FileText,
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Lock
} from "lucide-react";
import { countryVisaDatabase, CountryVisaInfo } from "@/lib/visa-data";

export default function VisaTracker() {
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>("Germany");
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiVisaData, setAiVisaData] = useState<any>(null);

  const currentInfo: CountryVisaInfo = countryVisaDatabase[selectedCountryKey] || countryVisaDatabase["Germany"];

  const handleRunAiVisaCheck = async () => {
    setIsAiChecking(true);
    setAiVisaData(null);
    try {
      const res = await fetch("/api/ai/check-visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountryKey })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiVisaData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Pakistani Passport Immigration Hub
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Study Visa & Blocked Account Requirements
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Verified financial proofs, Embassy appointment queues in Islamabad/Lahore/Karachi, blocked account procedures, and post-study work permits.
          </p>
        </div>

        <button
          onClick={handleRunAiVisaCheck}
          disabled={isAiChecking}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
        >
          {isAiChecking ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>Live AI Visa Policy Audit ({selectedCountryKey})</span>
        </button>
      </div>

      {/* Country Selector Tabs */}
      <div className="bg-white rounded-2xl p-4 hairline-border editorial-shadow overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          {Object.keys(countryVisaDatabase).map((countryKey) => {
            const isSelected = selectedCountryKey === countryKey;
            const info = countryVisaDatabase[countryKey];
            return (
              <button
                key={countryKey}
                onClick={() => {
                  setSelectedCountryKey(countryKey);
                  setAiVisaData(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#2D5A43] text-white font-bold shadow-xs"
                    : "bg-[#FAF8F5] text-[#5C626A] hover:bg-[#F3F0EB] hairline-border"
                }`}
              >
                <span>{info.flagEmoji}</span>
                <span>{countryKey}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Visa Info Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
              <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                Financial Proof / Blocked Account
              </span>
              <p className="text-xs font-bold text-[#1C1E21] leading-snug">
                {currentInfo.financialProofRequired}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
              <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                Post-Study Work Permit
              </span>
              <p className="text-xs font-bold text-[#2D5A43] leading-snug">
                {currentInfo.postStudyWorkPermit}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl hairline-border editorial-shadow space-y-1">
              <span className="text-[11px] font-bold text-[#8A919A] uppercase tracking-wider block">
                Part-Time Work Allowance
              </span>
              <p className="text-xs font-bold text-[#1C1E21] leading-snug">
                {currentInfo.partTimeWorkAllowance}
              </p>
            </div>
          </div>

          {/* Blocked Account & Financial Details */}
          {currentInfo.blockedAccountDetails && (
            <div className="bg-[#EBF2EE] p-5 rounded-2xl border border-[#2D5A43]/20 space-y-2">
              <h3 className="text-xs font-bold text-[#2D5A43] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Blocked Account / Deposit Setup
              </h3>
              <p className="text-xs text-[#1C1E21] leading-relaxed font-medium">
                {currentInfo.blockedAccountDetails}
              </p>
            </div>
          )}

          {/* Embassy Queue & Appointment Situation for Pakistanis */}
          <div className="bg-white p-6 rounded-2xl hairline-border editorial-shadow space-y-3">
            <h3 className="font-serif-editorial text-lg font-bold text-[#1C1E21] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#2D5A43]" />
              <span>Pakistani Embassy & VFS Appointment Queue</span>
            </h3>

            <div className="bg-[#FAF8F5] p-4 rounded-xl hairline-border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#5C626A]">Official Appointment Portal:</span>
                <span className="font-medium text-[#1C1E21]">{currentInfo.embassyAppointmentPortal}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2">
                <span className="font-semibold text-[#5C626A]">Estimated Wait Time:</span>
                <span className="font-bold text-[#C86248]">{currentInfo.pakistanWaitTime}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-2">
                <span className="font-semibold text-[#5C626A]">Historic Success Rate for Pakistanis:</span>
                <span className="font-bold text-[#2D5A43]">{currentInfo.visaSuccessRatePakistan}</span>
              </div>
            </div>
          </div>

          {/* Step by Step Visa Execution for Pakistani Applicants */}
          <div className="bg-white p-6 rounded-2xl hairline-border editorial-shadow space-y-3">
            <h3 className="font-serif-editorial text-lg font-bold text-[#1C1E21] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
              <span>Step-by-Step Visa Execution Checklist</span>
            </h3>

            <div className="space-y-2">
              {currentInfo.keyStepsPakistani.map((step, idx) => (
                <div key={idx} className="p-3 bg-[#FAF8F5] rounded-xl hairline-border text-xs text-[#1C1E21]">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Live Audit or Warnings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Important Warnings */}
          <div className="bg-[#FAF0EE] p-5 rounded-2xl border border-[#C86248]/20 space-y-3">
            <h3 className="text-xs font-bold text-[#C86248] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Crucial Warnings for Pakistani Applicants
            </h3>
            <ul className="text-xs text-[#1C1E21] space-y-2 leading-relaxed">
              {currentInfo.importantWarnings.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C86248] font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Live Visa Policy Audit Box */}
          {aiVisaData && (
            <div className="bg-white p-5 rounded-2xl hairline-border editorial-shadow space-y-3 border-l-4 border-l-[#2D5A43]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Live Visa Audit Result
                </span>
                <span className="text-[10px] text-stone-400">Refreshed</span>
              </div>

              <div className="text-xs space-y-2 text-[#1C1E21]">
                <p><strong>Appointment Queue:</strong> {aiVisaData.appointmentWaitTimePakistan}</p>
                <p><strong>PR Pathway:</strong> {aiVisaData.prPathwayDetails}</p>
                <div className="pt-2">
                  <strong className="block text-[#C86248] mb-1">Refusal Prevention Tips:</strong>
                  <ul className="list-disc list-inside text-[#5C626A] space-y-1">
                    {aiVisaData.refusalPreventionTips?.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
