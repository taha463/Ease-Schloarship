"use client";

import React, { useEffect, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/app/context/ProfileContext";

export interface ApplicationRecord {
  id: string;
  scholarship_name: string;
  university_provider: string;
  country: string;
  deadline: string | null;
  status: "Preparing" | "Applied" | "Result Awaited" | "Accepted" | "Rejected";
  notes?: string;
  documents?: {
    transcriptsAttested: boolean;
    sopCompleted: boolean;
    lorsObtained: boolean;
    ieltsUploaded: boolean;
    financialProofReady: boolean;
  };
}

export default function ApplicationTracker() {
  const { profile } = useProfile();
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newUni, setNewUni] = useState("");
  const [newScholarship, setNewScholarship] = useState("");
  const [newCountry, setNewCountry] = useState(
    profile.targetPreferences?.includedRegions?.[0] || "Germany",
  );
  const [newDeadline, setNewDeadline] = useState("");

  // 1. Fetch user applications from Supabase API
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch("/api/tracker", {
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Map database records and parse stored document states from notes if available
        const parsedApps: ApplicationRecord[] = json.data.map((item: any) => {
          let docs = {
            transcriptsAttested: false,
            sopCompleted: false,
            lorsObtained: false,
            ieltsUploaded: false,
            financialProofReady: false,
          };

          if (item.notes && item.notes.startsWith("{")) {
            try {
              const meta = JSON.parse(item.notes);
              if (meta.documents) docs = meta.documents;
            } catch (e) {
              // Plain text note fallback
            }
          }

          return {
            id: item.id,
            scholarship_name: item.scholarship_name,
            university_provider: item.university_provider,
            country: item.country,
            deadline: item.deadline,
            status: item.status || "Preparing",
            notes: item.notes,
            documents: docs,
          };
        });

        setApps(parsedApps);
      }
    } catch (err) {
      console.error("Failed to load tracked applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 2. Add application to Supabase
  const handleAddApplication = async () => {
    if (!newUni) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const initialDocs = {
        transcriptsAttested: true,
        sopCompleted: false,
        lorsObtained: false,
        ieltsUploaded: true,
        financialProofReady: false,
      };

      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          scholarshipName: newScholarship || newUni,
          universityProvider: newUni,
          country: newCountry,
          deadline: newDeadline || null,
          status: "Preparing",
          notes: JSON.stringify({ documents: initialDocs }),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        setNewUni("");
        setNewScholarship("");
        setNewDeadline("");
        await fetchApplications();
      }
    } catch (err) {
      console.error("Error creating tracked application:", err);
    }
  };

  // 3. Update status in Supabase
  const handleStatusChange = async (
    id: string,
    newStatus: ApplicationRecord["status"],
  ) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetch("/api/tracker", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to persist status change:", err);
    }
  };

  // 4. Toggle checklist document item and sync with database notes
  const toggleDocument = async (
    appId: string,
    docKey: keyof NonNullable<ApplicationRecord["documents"]>,
  ) => {
    const targetApp = apps.find((a) => a.id === appId);
    if (!targetApp) return;

    const currentDocs = targetApp.documents || {
      transcriptsAttested: false,
      sopCompleted: false,
      lorsObtained: false,
      ieltsUploaded: false,
      financialProofReady: false,
    };

    const updatedDocs = { ...currentDocs, [docKey]: !currentDocs[docKey] };

    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, documents: updatedDocs } : a)),
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetch("/api/tracker", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          id: appId,
          notes: JSON.stringify({ documents: updatedDocs }),
        }),
      });
    } catch (err) {
      console.error("Failed to update checklist item:", err);
    }
  };

  // 5. Delete application
  const handleDelete = async (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetch(`/api/tracker?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
      });
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  // Dynamic Deadline Conflict Detection (Detect deadlines within 5 days of each other)
  const conflictingDeadlines = apps.filter((app, index) => {
    if (!app.deadline) return false;
    const dateA = new Date(app.deadline).getTime();
    return apps.some((other, otherIndex) => {
      if (index === otherIndex || !other.deadline) return false;
      const dateB = new Date(other.deadline).getTime();
      const diffDays = Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);
      return diffDays <= 5;
    });
  });

  const getStatusBadge = (status: ApplicationRecord["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 font-bold border-emerald-300";
      case "Result Awaited":
        return "bg-amber-100 text-amber-800 font-bold border-amber-300";
      case "Applied":
        return "bg-blue-100 text-blue-800 font-bold border-blue-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 font-bold border-rose-300";
      default:
        return "bg-stone-200 text-stone-800 font-semibold border-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Application Pipeline Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Active Applications & Document Readiness
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            All records persist directly to your private database. Tracks
            required document preparation and highlights overlapping deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* Dynamic Overlapping Deadline Conflict Alert */}
      {conflictingDeadlines.length >= 2 && (
        <div className="bg-[#FAF0EE] p-4 rounded-xl border border-[#C86248]/30 flex items-start gap-3 text-xs text-[#1C1E21]">
          <AlertTriangle className="w-5 h-5 text-[#C86248] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#C86248] block font-semibold">
              Deadline Clustering Alert:
            </strong>
            <span>
              You have multiple target applications with submission deadlines
              within 5 days of each other. Request professor recommendation
              letters and finalize statement drafts ahead of time.
            </span>
          </div>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB]">
          Loading your application pipeline from database...
        </div>
      ) : apps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Bookmark className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-[#1A1A1A]">
            No applications tracked yet
          </p>
          <p className="text-xs text-[#5C626A]">
            Use the Scholarship Directory to add opportunities or click
            &quot;Add New Application&quot; above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const docs = app.documents || {
              transcriptsAttested: false,
              sopCompleted: false,
              lorsObtained: false,
              ieltsUploaded: false,
              financialProofReady: false,
            };
            const docCount = Object.values(docs).filter(Boolean).length;
            const totalDocs = Object.keys(docs).length;
            const progressPct = Math.round((docCount / totalDocs) * 100);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] hover:border-emerald-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-[#FAF8F5] text-[#5C626A] rounded-full text-[11px] font-medium border border-[#E5E0D8]">
                        {app.scholarship_name}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full text-[11px] font-bold">
                        {app.country}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#1C1E21]">
                      {app.university_provider}
                    </h2>
                  </div>

                  {/* Status & Deadline Selector */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-[#8A919A] block uppercase">
                        Target Deadline
                      </span>
                      <span className="font-bold text-xs text-[#C86248]">
                        {app.deadline || "Rolling / Open"}
                      </span>
                    </div>

                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value as any)
                      }
                      className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none cursor-pointer ${getStatusBadge(app.status)}`}
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="Applied">Applied</option>
                      <option value="Result Awaited">Result Awaited</option>
                      <option value="Accepted">Accepted ✓</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress & Document Checklist Grid */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1E21]">
                      Document Readiness: {docCount}/{totalDocs} Completed (
                      {progressPct}%)
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Click any document to toggle readiness
                    </span>
                  </div>

                  <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2D5A43] h-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Interactive Document checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        toggleDocument(app.id, "transcriptsAttested")
                      }
                      className={`flex items-center gap-1.5 cursor-pointer text-left transition-colors ${
                        docs.transcriptsAttested
                          ? "text-[#2D5A43] font-semibold"
                          : "text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Transcripts Attested</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDocument(app.id, "sopCompleted")}
                      className={`flex items-center gap-1.5 cursor-pointer text-left transition-colors ${
                        docs.sopCompleted
                          ? "text-[#2D5A43] font-semibold"
                          : "text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Custom SOP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDocument(app.id, "lorsObtained")}
                      className={`flex items-center gap-1.5 cursor-pointer text-left transition-colors ${
                        docs.lorsObtained
                          ? "text-[#2D5A43] font-semibold"
                          : "text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Academic LORs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDocument(app.id, "ieltsUploaded")}
                      className={`flex items-center gap-1.5 cursor-pointer text-left transition-colors ${
                        docs.ieltsUploaded
                          ? "text-[#2D5A43] font-semibold"
                          : "text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>IELTS / Language</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleDocument(app.id, "financialProofReady")
                      }
                      className={`flex items-center gap-1.5 cursor-pointer text-left transition-colors ${
                        docs.financialProofReady
                          ? "text-[#2D5A43] font-semibold"
                          : "text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Financial Proof</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#1C1E21]">
              Add New Application Tracker
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                University or Organization Name
              </label>
              <input
                type="text"
                value={newUni}
                onChange={(e) => setNewUni(e.target.value)}
                placeholder="e.g. Technical University of Munich"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                Scholarship / Degree Program
              </label>
              <input
                type="text"
                value={newScholarship}
                onChange={(e) => setNewScholarship(e.target.value)}
                placeholder="e.g. DAAD EPOS or M.Sc. Computer Science"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43]"
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
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5E7EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#5C626A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApplication}
                className="px-4 py-2 text-xs font-semibold bg-[#2D5A43] hover:bg-[#234735] text-white rounded-xl shadow-xs cursor-pointer"
              >
                Save to Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
