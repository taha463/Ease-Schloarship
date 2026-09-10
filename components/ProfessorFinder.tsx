"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  Mail,
  Sparkles,
  ExternalLink,
  Globe,
  Copy,
  Linkedin,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Target,
  Loader2,
  RefreshCw,
  Building,
} from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";

export interface ProfessorRecord {
  id: string;
  name: string;
  university: string;
  country: string;
  labName: string;
  researchFocus: string[];
  email: string;
  website: string;
  linkedinUrl: string;
  scholarUrl: string;
  openingsStatus:
    | "Actively Recruiting MS/PhD"
    | "Contact for MS Thesis"
    | "Scholarship Required";
  recommendedAddressing: string;
  persuasionStrategy: {
    keyPaperToCite: string;
    taicOverlapHook: string;
    recommendedOffer: string;
  };
}

interface ProfessorFinderProps {
  onDraftColdEmail: (prof: ProfessorRecord) => void;
}

export default function ProfessorFinder({
  onDraftColdEmail,
}: ProfessorFinderProps) {
  const { profile } = useProfile();

  // Search input controls
  const [targetUni, setTargetUni] = useState(
    "Technical University of Munich (TUM)",
  );
  const [targetDomain, setTargetDomain] = useState(
    profile.targetPreferences?.fieldOfStudy?.[0] || "Artificial Intelligence",
  );
  const [targetCountry, setTargetCountry] = useState(
    profile.targetPreferences?.includedRegions?.[0] || "Germany",
  );

  const [professors, setProfessors] = useState<ProfessorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("");
  const [expandedProfId, setExpandedProfId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  // Sync initial target domain if profile loads dynamically
  useEffect(() => {
    if (profile.targetPreferences?.fieldOfStudy?.length) {
      setTargetDomain(profile.targetPreferences.fieldOfStudy[0]);
    }
    if (profile.targetPreferences?.includedRegions?.length) {
      setTargetCountry(profile.targetPreferences.includedRegions[0]);
    }
  }, [profile]);

  const handleSearchProfessors = async () => {
    if (!targetUni.trim() || !targetDomain.trim()) return;
    setLoading(true);
    setExpandedProfId(null);

    try {
      const res = await fetch("/api/ai/find-professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: targetUni,
          researchDomain: targetDomain,
          country: targetCountry,
          candidate: profile,
        }),
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProfessors(json.data);
        setDataSource(json.source || "live_ai");
        if (json.data.length > 0) {
          setExpandedProfId(json.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to query professors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial search once mounted
  useEffect(() => {
    handleSearchProfessors();
  }, []);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const getGmailDraftUrl = (prof: ProfessorRecord) => {
    const studentName = profile.name || "Prospective Student";
    const studentDegree = profile.degree || "Bachelor of Science";
    const studentUni = profile.university ? `from ${profile.university}` : "";
    const studentCgpa = profile.cgpa ? `(CGPA ${profile.cgpa.toFixed(2)})` : "";

    const subject = encodeURIComponent(
      `Prospective MS Research Student - ${prof.researchFocus[0] || targetDomain} (${studentName})`,
    );
    const body = encodeURIComponent(
      `${prof.recommendedAddressing || `Dear Professor ${prof.name},`}

I hope this email finds you well.

My name is ${studentName}, a ${studentDegree} graduate ${studentUni} ${studentCgpa}. I have been following your lab's work at ${prof.university}, particularly regarding "${prof.persuasionStrategy?.keyPaperToCite || prof.labName}".

${prof.persuasionStrategy?.taicOverlapHook || `My academic background aligns directly with your lab's active research in ${prof.researchFocus?.join(", ")}.`}

I am preparing my application for Master's studies and target scholarship funding. ${prof.persuasionStrategy?.recommendedOffer || "I would appreciate the chance to discuss potential research alignment."}

Would you be open to a brief 10-minute introductory conversation or reviewing my academic CV?

Sincerely,
${studentName}
${profile.location ? `${profile.location} | ` : ""}${profile.email || ""}`,
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(prof.email)}&su=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              AI Faculty & Research Supervisor Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Live University Faculty & Lab Discovery
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-3xl leading-relaxed">
            Enter any target university and research topic. AI scans official
            faculty directories via Tavily, extracts verified emails, and
            generates tailored persuasion hooks grounded in your profile.
          </p>
        </div>
      </div>

      {/* Dynamic Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Target University
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={targetUni}
                onChange={(e) => setTargetUni(e.target.value)}
                placeholder="e.g. Technical University of Munich"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Research Domain / Subfield
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="e.g. Multi-Agent Systems, Robotics, Computer Vision"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Country
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              placeholder="e.g. Germany, Sweden, Canada"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]/80">
          <div className="text-[11px] text-zinc-500">
            {dataSource && (
              <span>
                Status:{" "}
                <strong className="text-emerald-700">
                  {dataSource === "supabase_cache"
                    ? "Supabase Cache (0 Cost)"
                    : "Live AI Indexed"}
                </strong>
              </span>
            )}
          </div>
          <button
            onClick={handleSearchProfessors}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching University Faculty...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Find Active Professors</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Discovered Professors */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="font-semibold text-sm text-[#1A1A1A]">
            Scanning {targetUni} Department Directories...
          </p>
          <p className="text-xs text-gray-400">
            Extracting verified lab links, publications, and matching against
            your project stack.
          </p>
        </div>
      ) : professors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-2">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            No professors indexed for this query
          </p>
          <p className="text-xs text-[#5C626A]">
            Adjust your target university or broaden the research domain to
            search again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {professors.map((prof) => {
            const isExpanded = expandedProfId === prof.id;

            return (
              <div
                key={prof.id}
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-emerald-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                      📍 {prof.country}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {prof.openingsStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] hover:text-emerald-700 transition-colors">
                      {prof.name}
                    </h2>
                    <p className="text-xs text-[#5C626A] mt-0.5">
                      <strong className="text-[#1A1A1A]">
                        {prof.university}
                      </strong>{" "}
                      • {prof.labName}
                    </p>
                  </div>

                  {/* Profile Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {prof.linkedinUrl && (
                      <a
                        href={prof.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-semibold border border-blue-200 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </a>
                    )}

                    {prof.scholarUrl && (
                      <a
                        href={prof.scholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-[11px] font-semibold border border-amber-200 transition-colors"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                        <span>Google Scholar</span>
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                      </a>
                    )}

                    {prof.website && (
                      <a
                        href={prof.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-[11px] font-semibold border border-stone-200 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Lab Web</span>
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                      </a>
                    )}
                  </div>

                  {/* Email Box & Pre-filled Gmail Action */}
                  <div className="bg-[#F9FAF8] p-3.5 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Official Email: {prof.email}
                      </span>
                      <button
                        onClick={() => handleCopyEmail(prof.email, prof.id)}
                        className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>
                          {copiedEmailId === prof.id
                            ? "Copied! ✓"
                            : "Copy Email"}
                        </span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={getGmailDraftUrl(prof)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all text-center"
                      >
                        <Mail className="w-4 h-4 text-emerald-200" />
                        <span>Gmail Pre-Filled Draft</span>
                      </a>

                      <button
                        onClick={() => onDraftColdEmail(prof)}
                        className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Refine in SOP Tool</span>
                      </button>
                    </div>
                  </div>

                  {/* Research Focus tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prof.researchFocus?.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-stone-100 text-[#1A1A1A] text-[10px] rounded-md font-medium border border-stone-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Persuasion Strategy Toggle */}
                  <button
                    onClick={() =>
                      setExpandedProfId(isExpanded ? null : prof.id)
                    }
                    className="w-full flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" /> Tailored
                      Persuasion Strategy
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expanded Persuasion Card */}
                  {isExpanded && prof.persuasionStrategy && (
                    <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 to-stone-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                          1. Key Paper / Lab Initiative:
                        </span>
                        <p className="text-[#5C626A] font-serif italic text-xs">
                          &quot;{prof.persuasionStrategy.keyPaperToCite}&quot;
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                          2. Your Profile Overlap Hook:
                        </span>
                        <p className="text-[#5C626A] leading-relaxed">
                          {prof.persuasionStrategy.taicOverlapHook}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                          3. Winning Outreach Offer:
                        </span>
                        <p className="text-[#5C626A] font-semibold text-emerald-950">
                          {prof.persuasionStrategy.recommendedOffer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
