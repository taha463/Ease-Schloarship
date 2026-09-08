"use client";

import React, { useState } from "react";
import { X, Check, FileText, Code2, GraduationCap, MapPin, Award, CheckCircle } from "lucide-react";
import { CandidateProfile, emptyCandidate } from "@/lib/candidate-data";

interface Props {
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCandidate: (updated: CandidateProfile) => void;
}

export default function CandidateSummaryModal({
  candidate,
  isOpen,
  onClose,
  onUpdateCandidate
}: Props) {
  const [editableCandidate, setEditableCandidate] = useState<CandidateProfile>(candidate);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateCandidate(editableCandidate);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setEditableCandidate(emptyCandidate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl border border-[#E5E0D8] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1C1E21] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D5A43] text-white flex items-center justify-center font-serif-editorial font-bold text-lg">
              MT
            </div>
            <div>
              <h2 className="font-serif-editorial text-xl font-semibold tracking-tight">
                {editableCandidate.name}
              </h2>
              <p className="text-xs text-stone-300">
                {editableCandidate.degree} • {editableCandidate.university}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Quick Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl hairline-border">
            <div>
              <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">
                CGPA (out of 4.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={editableCandidate.cgpa}
                onChange={(e) =>
                  setEditableCandidate({ ...editableCandidate, cgpa: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-[#FAF8F5] hairline-border font-medium text-[#1C1E21]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">
                Nationality / Passport
              </label>
              <input
                type="text"
                value={editableCandidate.location}
                onChange={(e) =>
                  setEditableCandidate({ ...editableCandidate, location: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-[#FAF8F5] hairline-border font-medium text-[#1C1E21]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C626A] uppercase mb-1">
                Degree Goal
              </label>
              <input
                type="text"
                value={editableCandidate.targetPreferences.degreeGoal}
                onChange={(e) =>
                  setEditableCandidate({
                    ...editableCandidate,
                    targetPreferences: { ...editableCandidate.targetPreferences, degreeGoal: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-[#FAF8F5] hairline-border font-medium text-[#1C1E21]"
              />
            </div>
          </div>

          {/* Region Inclusions & Exclusions */}
          <div className="space-y-3 bg-white p-4 rounded-xl hairline-border">
            <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2D5A43]" /> Target Destination Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#EBF2EE] p-3 rounded-lg border border-[#2D5A43]/20">
                <span className="font-semibold text-[#2D5A43] block mb-1">✓ INCLUDED DESTINATIONS</span>
                <p className="text-[#1C1E21] leading-relaxed">
                  {editableCandidate.targetPreferences.includedRegions.join(", ")}
                </p>
              </div>

              <div className="bg-[#FAF0EE] p-3 rounded-lg border border-[#C86248]/20">
                <span className="font-semibold text-[#C86248] block mb-1">✕ STRICTLY EXCLUDED (BAN LIST)</span>
                <p className="text-[#1C1E21] leading-relaxed">
                  {editableCandidate.targetPreferences.excludedRegions.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Key Projects & Codebase Experience */}
          <div className="space-y-3 bg-white p-4 rounded-xl hairline-border">
            <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#2D5A43]" /> Key AI & Software Projects
            </h3>
            <div className="space-y-3">
              {editableCandidate.projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E5E0D8] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1C1E21] text-sm">{proj.name}</span>
                    <div className="flex gap-1 flex-wrap">
                      {proj.tech.slice(0, 4).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#E5E0D8] text-[#1C1E21] rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#5C626A]">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl hairline-border text-xs space-y-2">
              <span className="font-bold text-[#1C1E21] block uppercase tracking-wider">Certifications</span>
              <ul className="list-disc list-inside text-[#5C626A] space-y-1">
                {editableCandidate.certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl hairline-border text-xs space-y-2">
              <span className="font-bold text-[#1C1E21] block uppercase tracking-wider">AI & Backend Skills</span>
              <p className="text-[#5C626A] leading-relaxed">
                {editableCandidate.skills.aiMl.join(", ")}, {editableCandidate.skills.backend.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F3F0EB] px-6 py-4 border-t border-[#E5E0D8] flex items-center justify-between">
          <span className="text-xs text-[#5C626A]">
            Candidate profile automatically used in AI research & SOP generation.
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-[#C86248] hover:bg-[#C86248]/10 rounded-lg transition-colors"
            >
              Reset to Blank
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5C626A] hover:text-[#1C1E21] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold bg-[#2D5A43] text-white rounded-lg hover:bg-[#234735] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" /> Saved!
                </>
              ) : (
                "Save Profile Updates"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
