"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CandidateSummaryModal from "../components/CandidateSummaryModal";
import DeploymentModal from "../components/DeploymentModal";
import ScholarshipFinder from "../components/ScholarshipFinder";
import DocumentGenerator from "../components/DocumentGenerator";
import VisaTracker from "../components/VisaTracker";
import ExamPlanner from "../components/ExamPlanner";
import ApplicationTracker from "../components/ApplicationTracker";
import CountryComparer from "../components/CountryComparer";
import ConnectStudentForum from "../components/ConnectStudentForum";
import RealityCheck from "../components/RealityCheck";
import ProfessorFinder from "../components/ProfessorFinder";
import AiDeepResearcher from "../components/AiDeepResearcher";

import { defaultCandidate, CandidateProfile } from "../lib/candidate-data";
import { initialScholarships, refreshDeadlineCounters, ScholarshipItem } from "../lib/scholarship-database";

export default function Home() {
  const [candidate, setCandidate] = useState<CandidateProfile>(defaultCandidate);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCandidate = window.localStorage.getItem("ease-scholarship:candidate");
      if (savedCandidate) {
        try {
          setCandidate(JSON.parse(savedCandidate) as CandidateProfile);
        } catch {
          window.localStorage.removeItem("ease-scholarship:candidate");
        }
      }
      setIsHydrated(true);
    }
  }, []);

  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() =>
    refreshDeadlineCounters(initialScholarships)
  );
  const [activeTab, setActiveTab] = useState<string>("scholarships");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  const refreshLiveScholarships = async () => {
    try {
      const response = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCountry: "Germany Sweden Finland Netherlands Canada Australia New Zealand",
          researchTopic: "Artificial Intelligence, Computer Science, Software Engineering",
          degreeLevel: "Master's (MS)"
        })
      });
      const result = (await response.json()) as {
        success?: boolean;
        data?: { opportunities?: Array<Record<string, unknown>> };
      };
      if (!response.ok || !result.success) {
        throw new Error("Live scholarship refresh failed.");
      }

      const liveItems = (result.data?.opportunities || [])
        .map((opportunity, index): ScholarshipItem | null => {
          const deadline = typeof opportunity.estimatedDeadline === "string"
            ? opportunity.estimatedDeadline.match(/\d{4}-\d{2}-\d{2}/)?.[0]
            : undefined;
          const country = typeof opportunity.country === "string" ? opportunity.country : "";
          const region: ScholarshipItem["region"] =
            country === "Australia" ? "Australia" :
            country === "New Zealand" ? "New Zealand" :
            country === "Canada" ? "Canada" : "Europe";
          if (!deadline || Number.isNaN(new Date(`${deadline}T00:00:00`).getTime())) return null;
          return {
            id: `live-${Date.now()}-${index}`,
            title: String(opportunity.title || "Live scholarship opportunity"),
            provider: String(opportunity.universityOrProvider || "Provider not confirmed"),
            country,
            region,
            fundingType: (["Fully Funded", "Full Tuition Waiver", "Partial Funding"].includes(String(opportunity.fundingType))
              ? String(opportunity.fundingType)
              : "Partial Funding") as ScholarshipItem["fundingType"],
            matchRating: (["Strong Match", "Possible Match", "Not Eligible"].includes(String(opportunity.matchRating))
              ? String(opportunity.matchRating)
              : "Possible Match") as ScholarshipItem["matchRating"],
            matchScore: Number(opportunity.matchScore) || 0,
            matchReason: String(opportunity.matchReason || "Review the official source before applying."),
            admissionSequence: "Direct Scholarship Portal" as const,
            openingDate: new Date().toISOString().slice(0, 10),
            deadline,
            daysRemaining: 0,
            stipendBenefits: String(opportunity.stipendDetails || "Not confirmed"),
            academicRequirements: {
              minCgpa: 3.2,
              ieltsMin: 0,
              greRequired: false,
              nationalityEligible: true
            },
            requiredDocuments: Array.isArray(opportunity.keyRequirements) ? opportunity.keyRequirements.map(String) : [],
            reminderScheduleDays: [30, 14, 7],
            professorContactNeeded: false,
            officialUrl: String(opportunity.officialPortalLink || ""),
            studyFields: ["Artificial Intelligence", "Computer Science", "Software Engineering"]
          };
        })
        .filter((item): item is ScholarshipItem => item !== null);

      if (liveItems.length > 0) {
        setScholarships((current) => refreshDeadlineCounters([...liveItems, ...current]));
      }
    } catch (error) {
      console.error("Live scholarship refresh failed:", error);
    }
  };

  useEffect(() => {
    const refresh = () => setScholarships((current) => refreshDeadlineCounters(current));
    const timer = window.setInterval(refresh, 60 * 60 * 1000);

    void refreshLiveScholarships();
    const liveTimer = window.setInterval(() => void refreshLiveScholarships(), 4 * 60 * 60 * 1000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(liveTimer);
    };
  }, []);

  const handleUpdateCandidate = (updated: CandidateProfile) => {
    setCandidate(updated);
    window.localStorage.setItem("ease-scholarship:candidate", JSON.stringify(updated));
  };

  const [docGenDefaults, setDocGenDefaults] = useState<{
    university?: string;
    scholarship?: string;
  }>({});

  const handleSelectScholarshipForSop = (item: ScholarshipItem) => {
    setDocGenDefaults({
      university: item.provider,
      scholarship: item.title
    });
    setActiveTab("doc-generator");
  };

  const handleDraftColdEmailForProf = (prof: any) => {
    setDocGenDefaults({
      university: prof.university,
      scholarship: `Research Assistantship under ${prof.name}`
    });
    setActiveTab("doc-generator");
  };

  const handleAddCustomScholarship = (newScholarship: ScholarshipItem) => {
    setScholarships((prev) => [newScholarship, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] text-[#1A1A1A] font-sans flex flex-col">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateName={candidate.name}
        cgpa={candidate.cgpa}
        totalScholarships={scholarships.length}
        activeApplicationsCount={4}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={activeTab} className="transition-all duration-300 ease-in-out">
          {activeTab === "scholarships" && (
            <ScholarshipFinder
              scholarships={scholarships}
              candidateCgpa={candidate.cgpa}
              candidateNationality={candidate.location}
              onSelectScholarshipForSop={handleSelectScholarshipForSop}
              onAddCustomScholarship={handleAddCustomScholarship}
              onOpenAiResearch={() => setActiveTab("ai-research")}
              onRefreshLiveScholarships={refreshLiveScholarships}
            />
          )}

          {activeTab === "ai-research" && (
            <AiDeepResearcher
              onAddScholarshipToTracker={handleAddCustomScholarship}
            />
          )}

          {activeTab === "doc-generator" && (
            <DocumentGenerator
              candidateName={candidate.name}
              defaultUniversity={docGenDefaults.university}
              defaultScholarship={docGenDefaults.scholarship}
            />
          )}

          {activeTab === "professors" && (
            <ProfessorFinder onDraftColdEmail={handleDraftColdEmailForProf} />
          )}

          {activeTab === "visa-hub" && <VisaTracker />}

          {activeTab === "applications" && <ApplicationTracker />}

          {activeTab === "exam-planner" && <ExamPlanner />}

          {activeTab === "country-compare" && <CountryComparer />}

          {activeTab === "connect-forum" && <ConnectStudentForum candidate={candidate} />}

          {activeTab === "reality-check" && <RealityCheck />}
        </div>
      </main>

      {/* Candidate Profile Modal */}
      <CandidateSummaryModal
        key={`${candidate.name}-${candidate.cgpa}-${candidate.location}`}
        candidate={candidate}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateCandidate={handleUpdateCandidate}
      />

      {/* Vercel Deployment Modal */}
      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-6 mt-12 text-xs text-[#5C626A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <span className="font-semibold text-[#1A1A1A]">Ease Scholarship</span>
            <span>•</span>
            <span>Tailored for {candidate.name} (HITEC SE &apos;26)</span>
          </div>

          <p className="text-gray-400 text-[11px]">
            Strict Destination Policy Enforced: Europe, Australia, NZ & Canada.
          </p>
        </div>
      </footer>
    </div>
  );
}