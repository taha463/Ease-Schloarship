"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Loader2,
  Award,
  Plus,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ScholarshipItem } from "@/lib/scholarship-database";

interface AiDeepResearcherProps {
  onAddScholarshipToTracker: (item: ScholarshipItem) => void;
}

export default function AiDeepResearcher({ onAddScholarshipToTracker }: AiDeepResearcherProps) {
  const [targetCountry, setTargetCountry] = useState("Germany, Sweden, Finland");
  const [researchTopic, setResearchTopic] = useState("Multi-Agent Systems, RAG, Software Engineering");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleRunSearch = async () => {
    setIsSearching(true);
    setResults([]);
    try {
      const res = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCountry,
          researchTopic,
          degreeLevel: "Master's (MS)"
        })
      });

      const data = await res.json();
      if (data.success && data.data?.opportunities) {
        setResults(data.data.opportunities);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = (opp: any, idx: number) => {
    const slug = (opp.title || "opp").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const newItem: ScholarshipItem = {
      id: `ai-disc-${idx}-${slug}`,
      title: opp.title,
      provider: opp.universityOrProvider,
      country: opp.country,
      region: "Europe",
      fundingType: opp.fundingType as any || "Fully Funded",
      matchRating: opp.matchRating as any || "Strong Match",
      matchScore: opp.matchScore || 90,
      matchReason: opp.matchReason || "AI Agent evaluated high candidate fit based on BS SE & AI projects.",
      admissionSequence: "Integrated Application",
      openingDate: "2026-09-01",
      deadline: opp.estimatedDeadline || "2026-11-30",
      daysRemaining: 120,
      stipendBenefits: opp.stipendDetails || "Full Coverage",
      academicRequirements: {
        minCgpa: 3.0,
        ieltsMin: 6.5,
        greRequired: false,
        nationalityEligible: true
      },
      requiredDocuments: opp.keyRequirements || ["SOP", "Transcripts", "2 LORs"],
      reminderScheduleDays: [60, 30, 14, 7, 3],
      professorContactNeeded: false,
      officialUrl: opp.officialPortalLink || "https://www.daad.de",
      studyFields: [researchTopic]
    };

    onAddScholarshipToTracker(newItem);
    setAddedMap((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Automated AI Agent Deep Research Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Live Scholarship & Research Assistantship Agent
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Runs Gemini AI searches dynamically to find new university grants, government scholarships, and research assistantships matching Muhammad Taha&apos;s profile.
          </p>
        </div>
      </div>

      {/* Query Search Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#5C626A] uppercase mb-1">
              Target Destinations (Allowed Regions Only)
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              placeholder="e.g. Germany, Sweden, Finland, Australia, Canada, NZ"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#5C626A] uppercase mb-1">
              Research Focus / Sub-field
            </label>
            <input
              type="text"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              placeholder="e.g. Multi-Agent Systems, RAG, Flood Disaster AI, PyTorch"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>
        </div>

        <button
          onClick={handleRunSearch}
          disabled={isSearching}
          className="w-full py-3 bg-[#2D5A43] hover:bg-[#234735] text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Scanning European & Global University Portals...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-amber-300" />
              <span>Execute Real AI Scholarship Scan</span>
            </>
          )}
        </button>
      </div>

      {/* AI Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif-editorial text-xl font-bold text-[#1C1E21]">
            AI Agent Discovered Opportunities ({results.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((opp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 hairline-border editorial-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#EBF2EE] text-[#2D5A43] text-[10px] font-bold rounded-full">
                      {opp.fundingType}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#2D5A43] text-white text-[10px] font-bold rounded-full">
                      Match: {opp.matchScore}%
                    </span>
                  </div>

                  <h3 className="font-serif-editorial font-bold text-base text-[#1C1E21]">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-[#5C626A]">
                    <strong className="text-[#1C1E21]">{opp.universityOrProvider}</strong> • {opp.country}
                  </p>

                  <div className="bg-[#FAF8F5] p-3 rounded-xl hairline-border text-xs text-[#1C1E21] space-y-1">
                    <span className="font-bold text-[#2D5A43] block">Match Reasoning:</span>
                    <p className="text-[#5C626A]">{opp.matchReason}</p>
                    <span className="font-bold text-[#1C1E21] block pt-1">Stipend: {opp.stipendDetails}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8]">
                  <a
                    href={opp.officialPortalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#5C626A] hover:text-[#1C1E21] flex items-center gap-1 font-medium"
                  >
                    <span>Portal Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleAdd(opp, idx)}
                    disabled={!!addedMap[idx]}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                      addedMap[idx]
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#2D5A43] text-white hover:bg-[#234735]"
                    }`}
                  >
                    {addedMap[idx] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Added to Tracker
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Track Opportunity
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
