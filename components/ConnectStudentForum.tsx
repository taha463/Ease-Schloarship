"use client";

import React, { useState } from "react";
import { Users, Search, Linkedin, MessageSquare, Globe } from "lucide-react";
import { CandidateProfile } from "@/lib/candidate-data";

interface Ambassador {
  name: string;
  currentRole: string;
  linkedinUrl: string;
  matchReason: string;
  adviceToAsk: string;
}

interface ConnectStudentForumProps {
  candidate: CandidateProfile;
}

export default function ConnectStudentForum({
  candidate,
}: ConnectStudentForumProps) {
  const [targetCountry, setTargetCountry] = useState("Germany");
  const [university, setUniversity] = useState("");
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAmbassadors = async () => {
    setIsLoading(true);
    try {
      const fieldOfStudy =
        candidate.targetPreferences?.fieldOfStudy?.[0] ||
        "Software Engineering";
      const res = await fetch("/api/ai/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCountry,
          university,
          candidateNationality: candidate.location || "Pakistani",
          fieldOfStudy,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setAmbassadors(result.data);
      } else {
        setAmbassadors([]);
      }
    } catch (e) {
      console.error(e);
      setAmbassadors([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 hairline-border shadow-xs editorial-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#EBF2EE] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2D5A43]" />
          </div>
          <div>
            <h1 className="font-serif-editorial text-2xl font-bold text-[#1C1E21]">
              Connect Student Forum
            </h1>
            <p className="text-xs text-[#5C626A]">
              Find alumni and student ambassadors from your country to ask for
              guidance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">
              Target Country
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#2D5A43]"
              placeholder="e.g., Germany, Australia"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">
              Target University (Optional)
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#F9FAF8] border border-[#E5E0D8] focus:outline-none focus:border-[#2D5A43]"
              placeholder="e.g., Technical University Munich"
            />
          </div>
        </div>

        <button
          onClick={fetchAmbassadors}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1C1E21] hover:bg-[#2D5A43] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>
            {isLoading
              ? "Searching LinkedIn & University Portals..."
              : "Find Ambassadors"}
          </span>
        </button>
      </div>

      {ambassadors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-serif-editorial font-semibold text-[#1C1E21]">
            Found {ambassadors.length} Ambassadors
          </h2>
          {ambassadors.map((amb, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-[#E5E0D8] hover:border-[#2D5A43] transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C1E21]">
                    {amb.name}
                  </h3>
                  <p className="text-sm text-[#5C626A]">{amb.currentRole}</p>
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
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF3F8] text-[#0077b5] text-xs font-semibold rounded-lg hover:bg-[#E1E9EE] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </a>
                )}
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#E5E0D8] text-xs space-y-2 mb-3">
                <p>
                  <strong className="text-[#1C1E21]">Why contact them:</strong>{" "}
                  {amb.matchReason}
                </p>
              </div>
              <div className="flex gap-2 items-start text-xs text-[#2D5A43] bg-[#EBF2EE] p-3 rounded-lg border border-[#2D5A43]/20">
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-1">
                    Suggested Cold Message/Questions:
                  </strong>
                  <p>{amb.adviceToAsk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && ambassadors.length === 0 && targetCountry && (
        <div className="text-center py-10 bg-white rounded-2xl border border-[#E5E0D8]">
          <Globe className="w-8 h-8 text-[#E5E0D8] mx-auto mb-3" />
          <p className="text-sm text-[#5C626A]">
            Search for a country and university to find alumni networks.
          </p>
        </div>
      )}
    </div>
  );
}
