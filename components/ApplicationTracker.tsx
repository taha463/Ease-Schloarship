"use client";

import React, { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  Building,
  Sparkles,
  ExternalLink
} from "lucide-react";

export interface ApplicationRecord {
  id: string;
  universityOrScholarship: string;
  type: "University Admission" | "Scholarship Grant";
  country: string;
  program: string;
  deadline: string;
  status: "Preparing" | "Applied" | "Result Awaited" | "Accepted" | "Rejected";
  applicationFee: string;
  feeWaiverAvailable: boolean;
  documents: {
    transcriptsAttested: boolean;
    sopCompleted: boolean;
    lorsObtained: boolean;
    ieltsUploaded: boolean;
    financialProofReady: boolean;
  };
}

export const initialApplications: ApplicationRecord[] = [
  {
    id: "app-tum-germany",
    universityOrScholarship: "Technical University of Munich (TUM)",
    type: "University Admission",
    country: "Germany",
    program: "M.Sc. Robotics, Cognition, Intelligence",
    deadline: "2026-11-30",
    status: "Preparing",
    applicationFee: "€75 (uni-assist)",
    feeWaiverAvailable: false,
    documents: {
      transcriptsAttested: true,
      sopCompleted: true,
      lorsObtained: true,
      ieltsUploaded: true,
      financialProofReady: false
    }
  },
  {
    id: "app-daad-epos",
    universityOrScholarship: "DAAD EPOS Germany Fully Funded Scholarship",
    type: "Scholarship Grant",
    country: "Germany",
    program: "DAAD EPOS Tech Master's",
    deadline: "2026-10-15",
    status: "Preparing",
    applicationFee: "0€ (Free)",
    feeWaiverAvailable: true,
    documents: {
      transcriptsAttested: true,
      sopCompleted: true,
      lorsObtained: false,
      ieltsUploaded: true,
      financialProofReady: true
    }
  },
  {
    id: "app-kth-sweden",
    universityOrScholarship: "KTH Royal Institute of Technology",
    type: "University Admission",
    country: "Sweden",
    program: "M.Sc. Software Engineering of Distributed Systems",
    deadline: "2027-01-15",
    status: "Preparing",
    applicationFee: "SEK 900 (University Admissions Sweden)",
    feeWaiverAvailable: false,
    documents: {
      transcriptsAttested: true,
      sopCompleted: false,
      lorsObtained: true,
      ieltsUploaded: true,
      financialProofReady: true
    }
  },
  {
    id: "app-si-scholarship",
    universityOrScholarship: "Swedish Institute SISGP Scholarship",
    type: "Scholarship Grant",
    country: "Sweden",
    program: "SI Master's Full Funding",
    deadline: "2027-02-15",
    status: "Preparing",
    applicationFee: "0€ (Free)",
    feeWaiverAvailable: true,
    documents: {
      transcriptsAttested: true,
      sopCompleted: false,
      lorsObtained: false,
      ieltsUploaded: true,
      financialProofReady: true
    }
  }
];

export default function ApplicationTracker() {
  const [apps, setApps] = useState<ApplicationRecord[]>(initialApplications);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUni, setNewUni] = useState("");
  const [newCountry, setNewCountry] = useState("Germany");
  const [newType, setNewType] = useState<"University Admission" | "Scholarship Grant">("University Admission");
  const [newProgram, setNewProgram] = useState("M.Sc. Computer Science / AI");
  const [newDeadline, setNewDeadline] = useState("2026-11-15");

  const handleAddApplication = () => {
    if (!newUni) return;
    const newRecord: ApplicationRecord = {
      id: "app-" + Date.now(),
      universityOrScholarship: newUni,
      type: newType,
      country: newCountry,
      program: newProgram,
      deadline: newDeadline,
      status: "Preparing",
      applicationFee: "Free",
      feeWaiverAvailable: true,
      documents: {
        transcriptsAttested: true,
        sopCompleted: false,
        lorsObtained: false,
        ieltsUploaded: true,
        financialProofReady: false
      }
    };
    setApps([newRecord, ...apps]);
    setShowAddModal(false);
    setNewUni("");
  };

  const handleStatusChange = (id: string, newStatus: ApplicationRecord["status"]) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const getStatusBadge = (status: ApplicationRecord["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 font-bold";
      case "Result Awaited":
        return "bg-amber-100 text-amber-800 font-bold";
      case "Applied":
        return "bg-blue-100 text-blue-800 font-bold";
      default:
        return "bg-stone-200 text-stone-800 font-semibold";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Application Pipeline Manager
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Active Applications & Document Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Separates university admissions from scholarship applications. Monitors missing transcripts, SOPs, LORs, and flags deadline clashes before they pile up.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* Overlapping Deadline Alert Check */}
      <div className="bg-[#FAF0EE] p-4 rounded-xl border border-[#C86248]/20 flex items-start gap-3 text-xs text-[#1C1E21]">
        <AlertTriangle className="w-5 h-5 text-[#C86248] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#C86248] block font-semibold">Deadline Conflict Warning:</strong>
          <span>
            You have 2 applications due within 3 days in November 2026 (DAAD EPOS & TUM Germany). Ensure your recommendation letters are requested from HITEC University professors 30 days prior.
          </span>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {apps.map((app) => {
          const docCount = Object.values(app.documents).filter(Boolean).length;
          const totalDocs = Object.keys(app.documents).length;
          const progressPct = Math.round((docCount / totalDocs) * 100);

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 sm:p-6 hairline-border editorial-shadow space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-[#FAF8F5] text-[#5C626A] rounded-full text-[11px] font-medium border border-[#E5E0D8]">
                      {app.type}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full text-[11px] font-bold">
                      {app.country}
                    </span>
                  </div>

                  <h2 className="font-serif-editorial text-lg font-bold text-[#1C1E21]">
                    {app.universityOrScholarship}
                  </h2>
                  <p className="text-xs text-[#5C626A] mt-0.5">{app.program}</p>
                </div>

                {/* Status & Deadline Selector */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A919A] block uppercase">Deadline</span>
                    <span className="font-bold text-xs text-[#C86248]">{app.deadline}</span>
                  </div>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                    className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${getStatusBadge(app.status)}`}
                  >
                    <option value="Preparing">Preparing</option>
                    <option value="Applied">Applied</option>
                    <option value="Result Awaited">Result Awaited</option>
                    <option value="Accepted">Accepted ✓</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Document Checklist Grid */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl hairline-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C1E21]">
                    Document Readiness: {docCount}/{totalDocs} Completed ({progressPct}%)
                  </span>
                  <span className="text-[#8A919A]">Fee: {app.applicationFee}</span>
                </div>

                <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D5A43] h-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Document checklist icons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                  <div className={`flex items-center gap-1.5 ${app.documents.transcriptsAttested ? "text-[#2D5A43] font-medium" : "text-stone-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HEC Transcripts</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${app.documents.sopCompleted ? "text-[#2D5A43] font-medium" : "text-stone-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Custom SOP</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${app.documents.lorsObtained ? "text-[#2D5A43] font-medium" : "text-stone-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>2 Academic LORs</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${app.documents.ieltsUploaded ? "text-[#2D5A43] font-medium" : "text-stone-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>IELTS Report</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${app.documents.financialProofReady ? "text-[#2D5A43] font-medium" : "text-stone-400"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Financial Proof</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border hairline-border shadow-2xl space-y-4">
            <h3 className="font-serif-editorial text-lg font-bold text-[#1C1E21]">
              Add New Application Tracker
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                University or Scholarship Name
              </label>
              <input
                type="text"
                value={newUni}
                onChange={(e) => setNewUni(e.target.value)}
                placeholder="e.g. Aalto University Finland"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border"
                >
                  <option value="University Admission">University Admission</option>
                  <option value="Scholarship Grant">Scholarship Grant</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#5C626A]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApplication}
                className="px-4 py-2 text-xs font-semibold bg-[#2D5A43] text-white rounded-xl shadow-xs"
              >
                Add Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
