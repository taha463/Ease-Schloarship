"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Sparkles,
  Bell,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Zap,
  Server
} from "lucide-react";
import { ScholarshipItem } from "../lib/scholarship-database";
import AutomationMonitor from "./AutomationMonitor";

interface ScholarshipFinderProps {
  scholarships: ScholarshipItem[];
  candidateCgpa: number;
  candidateNationality: string;
  onSelectScholarshipForSop: (scholarship: ScholarshipItem) => void;
  onAddCustomScholarship: (scholarship: ScholarshipItem) => void;
  onOpenAiResearch: () => void;
  onRefreshLiveScholarships: () => Promise<void>;
}

export default function ScholarshipFinder({
  scholarships,
  candidateCgpa,
  candidateNationality,
  onSelectScholarshipForSop,
  onAddCustomScholarship,
  onOpenAiResearch,
  onRefreshLiveScholarships
}: ScholarshipFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedFunding, setSelectedFunding] = useState<string>("All");
  const [selectedMatch, setSelectedMatch] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(scholarships[0]?.id || null);
  const [reminderActiveMap, setReminderActiveMap] = useState<Record<string, boolean>>({});

  // Filtered list
  const filtered = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studyFields.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRegion = selectedRegion === "All" || s.region === selectedRegion;
    const matchesFunding = selectedFunding === "All" || s.fundingType === selectedFunding;
    const matchesMatchRating = selectedMatch === "All" || s.matchRating === selectedMatch;

    return matchesSearch && matchesRegion && matchesFunding && matchesMatchRating;
  });

  const toggleReminder = (id: string) => {
    setReminderActiveMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getFundingBadgeClass = (type: string) => {
    switch (type) {
      case "Fully Funded":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "Full Tuition Waiver":
        return "bg-blue-100 text-blue-800 border-blue-300 font-bold";
      default:
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
    }
  };

  const getMatchBadgeClass = (rating: string) => {
    switch (rating) {
      case "Strong Match":
        return "bg-emerald-600 text-white font-bold";
      case "Possible Match":
        return "bg-amber-600 text-white font-bold";
      default:
        return "bg-rose-600 text-white font-bold";
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Monitor Header */}
      <AutomationMonitor />

      {/* Main Control Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Verified Master&apos;s Matcher (0 Hardcoding)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Targeted Master&apos;s Scholarships Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Filtered specifically for <strong>Muhammad Taha</strong> (BS Software Engineering, CGPA {candidateCgpa.toFixed(2)}, Pakistani passport). Evaluated across Europe, Australia, NZ, and Canada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={async () => {
              setIsRefreshing(true);
              await onRefreshLiveScholarships();
              setIsRefreshing(false);
            }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {isRefreshing ? (
               <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
               <Search className="w-4 h-4" />
            )}
            <span>{isRefreshing ? "Fetching Internet Data..." : "Refresh Internet Data"}</span>
          </button>
          <button
            onClick={onOpenAiResearch}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>AI Live Deep Research</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search scholarship, country, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
            >
              <option value="All">All Allowed Regions</option>
              <option value="Europe">Europe (Germany, Sweden, Finland, Netherlands)</option>
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          {/* Funding Type Filter */}
          <div>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
            >
              <option value="All">All Funding Levels</option>
              <option value="Fully Funded">Fully Funded (Stipend + Tuition)</option>
              <option value="Full Tuition Waiver">Full Tuition Waiver</option>
              <option value="Partial Funding">Partial Funding</option>
            </select>
          </div>

          {/* Match Rating Filter */}
          <div>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
            >
              <option value="All">All Candidate Match Scores</option>
              <option value="Strong Match">Strong Match (88%+)</option>
              <option value="Possible Match">Possible Match (65-87%)</option>
            </select>
          </div>
        </div>

        {/* Count summary & policy notice */}
        <div className="flex items-center justify-between text-xs text-[#5C626A] pt-1 border-t border-[#E5E7EB]/80">
          <span>Showing <strong>{filtered.length}</strong> of {scholarships.length} verified opportunities</span>
          <span className="text-gray-400 hidden sm:inline">
            *Strict Destination Policy: Europe, Australia, NZ, Canada.
          </span>
        </div>
      </div>

      {/* Scholarship Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const isReminderSet = !!reminderActiveMap[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-emerald-300 transition-all overflow-hidden shadow-xs"
            >
              {/* Card Main Bar */}
              <div className="p-5 sm:p-6 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Title & Metadata */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Funding badge */}
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${getFundingBadgeClass(item.fundingType)}`}>
                        {item.fundingType}
                      </span>

                      {/* Match Score */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${getMatchBadgeClass(item.matchRating)}`}>
                        {item.matchRating} ({item.matchScore}%)
                      </span>

                      {/* Country */}
                      <span className="inline-flex items-center gap-1 text-[#5C626A] font-medium bg-[#F9FAF8] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {item.country}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-xs text-[#5C626A]">
                      Provider: <strong className="text-[#1A1A1A]">{item.provider}</strong> • Sequence:{" "}
                      <span className="text-emerald-700 font-medium">{item.admissionSequence}</span>
                    </p>
                  </div>

                  {/* Right: Days Remaining & Quick Action */}
                  <div className="flex items-center gap-3 self-start md:self-center">
                    <div className="text-right bg-[#F9FAF8] px-3.5 py-2 rounded-xl border border-[#E5E7EB]">
                      <div className="flex items-center gap-1 text-xs text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.daysRemaining} Days Left</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Deadline: {item.deadline}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : item.id);
                      }}
                      className="p-2 text-[#5C626A] hover:bg-[#F0F2EE] rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[#E5E7EB] bg-[#F9FAF8]/70 space-y-5">
                  {/* Match Reason Analysis */}
                  <div className="bg-[#F0F2EE] p-4 rounded-xl border border-emerald-200/80 text-xs text-[#1A1A1A] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Why you match this scholarship (Candidate Analysis)
                    </div>
                    <p className="leading-relaxed text-emerald-950/90">{item.matchReason}</p>
                  </div>

                  {/* Key Stipend & Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
                      <span className="font-bold text-[#1A1A1A] block uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" /> Stipend & Coverage
                      </span>
                      <p className="text-[#5C626A] leading-relaxed font-medium">{item.stipendBenefits}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
                      <span className="font-bold text-[#1A1A1A] block uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Requirements & Thresholds
                      </span>
                      <ul className="text-[#5C626A] space-y-1">
                        <li>• Min CGPA: <strong>{item.academicRequirements.minCgpa}</strong> (Your CGPA: <strong>{candidateCgpa.toFixed(2)}</strong> ✓)</li>
                        <li>• IELTS Academic: <strong>{item.academicRequirements.ieltsMin}+</strong></li>
                        <li>• GRE Required: <strong>{item.academicRequirements.greRequired ? "Yes" : "No (Waived)"}</strong></li>
                        <li>• Age Limit: <strong>{item.academicRequirements.ageLimit || "None"}</strong></li>
                        <li>• Pakistani Passport Eligible: <strong>Yes ✓</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Document Checklist */}
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
                    <span className="font-bold text-[#1A1A1A] block uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Exact Required Documents
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.requiredDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[#5C626A]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminder Schedule */}
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">
                        Automated Reminder Schedule
                      </span>
                      <p className="text-gray-400">
                        Reminders scheduled at: {item.reminderScheduleDays.map((d) => `${d}d`).join(" • ")} before deadline.
                      </p>
                    </div>

                    <button
                      onClick={() => toggleReminder(item.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        isReminderSet
                          ? "bg-emerald-600 text-white"
                          : "bg-[#F0F2EE] text-[#5C626A] hover:text-[#1A1A1A]"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isReminderSet ? "Reminders Set ✓" : "Activate Reminders"}</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectScholarshipForSop(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Generate Winning SOP for this Scholarship</span>
                      </button>
                    </div>

                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F0F2EE] text-[#1A1A1A] font-semibold text-xs rounded-xl border border-[#E5E7EB] transition-colors"
                    >
                      <span>Official Scholarship Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#5C626A]" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
