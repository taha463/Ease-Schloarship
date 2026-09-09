"use client";

import React, { useState } from "react";
import { Scale, Search, ShieldAlert, GraduationCap, Building, Briefcase, ChevronRight, AlertTriangle } from "lucide-react";
import { CandidateProfile } from "@/lib/candidate-data";

interface RealityCheckResult {
  rankingTruth: string;
  jobAndPrReality: string;
  verdict: string;
  ratingOutOfTen: number;
}

export default function RealityCheck() {
  const [university, setUniversity] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [country, setCountry] = useState("Germany");
  const [fieldOfStudy, setFieldOfStudy] = useState("Software Engineering");
  const [result, setResult] = useState<RealityCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!university || !country) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university, scholarship, country, fieldOfStudy })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 hairline-border shadow-xs editorial-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF0EE] flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#C86248]" />
          </div>
          <div>
            <h1 className="font-serif-editorial text-2xl font-bold text-[#1C1E21]">Ranking & Reality Check</h1>
            <p className="text-xs text-[#5C626A]">Brutally honest AI mentor using live internet facts. No sugar-coating.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">Target University</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#C86248]"
              placeholder="e.g., Technical University Munich"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">Scholarship (Optional)</label>
            <input
              type="text"
              value={scholarship}
              onChange={(e) => setScholarship(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#C86248]"
              placeholder="e.g., DAAD EPOS"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#C86248]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">Field of Study</label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#C86248]"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={isLoading || !university}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1C1E21] hover:bg-[#C86248] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ShieldAlert className="w-4 h-4" />
          )}
          <span>{isLoading ? "Analyzing internet realities..." : "Get Reality Check"}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Verdict & Rating */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E5E0D8] flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 border-[#C86248] bg-white text-[#C86248]">
              <span className="text-3xl font-bold font-serif-editorial leading-none">{result.ratingOutOfTen}</span>
              <span className="text-xs font-bold mt-1">/10</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1E21] mb-2 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#C86248]" /> The Verdict
              </h2>
              <p className="text-sm text-[#5C626A] leading-relaxed">{result.verdict}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* University & Scholarship Truth */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] hover:border-[#C86248]/50 transition-colors">
              <h3 className="font-bold text-[#1C1E21] flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-[#C86248]" /> University & Scholarship Truth
              </h3>
              <p className="text-sm text-[#5C626A] leading-relaxed whitespace-pre-wrap">
                {result.rankingTruth}
              </p>
            </div>

            {/* Life, Jobs & PR Reality */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] hover:border-[#C86248]/50 transition-colors">
              <h3 className="font-bold text-[#1C1E21] flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-[#C86248]" /> Life, Jobs & PR Reality
              </h3>
              <p className="text-sm text-[#5C626A] leading-relaxed whitespace-pre-wrap">
                {result.jobAndPrReality}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
