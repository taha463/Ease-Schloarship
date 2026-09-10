"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { ExamPlan, fetchLiveExamPlan } from "@/lib/exam-planner-data";
import { useProfile } from "@/app/context/ProfileContext";

export default function ExamPlanner() {
  const { profile } = useProfile();

  // User test inputs
  const [selectedExam, setSelectedExam] = useState("IELTS Academic");
  const [targetScore, setTargetScore] = useState("7.5");
  const [currentScore, setCurrentScore] = useState("6.5");
  const [examDate, setExamDate] = useState("");
  const [weaknessNotes, setWeaknessNotes] = useState("");

  const [plan, setPlan] = useState<ExamPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const generated = await fetchLiveExamPlan({
        examName: selectedExam,
        targetScore,
        currentMockScore: currentScore,
        examDate,
        weaknesses: weaknessNotes,
        candidate: profile,
      });
      if (generated) {
        setPlan(generated);
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGeneratePlan();
  }, [selectedExam]);

  const toggleDayCompleted = (dayNumber: number) => {
    if (!plan) return;
    setPlan({
      ...plan,
      studySchedule: plan.studySchedule.map((item) =>
        item.dayNumber === dayNumber
          ? { ...item, completed: !item.completed }
          : item,
      ),
    });
  };

  const completedCount =
    plan?.studySchedule?.filter((s) => s.completed).length || 0;
  const totalTasks = plan?.studySchedule?.length || 0;

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Top Banner & Exam Configuration Controls */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-[#2D5A43]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
                Adaptive Exam Diagnostic & Study Planner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
              Standardized Admissions Test Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
              AI personalizes your diagnostic gap analysis, official preparation
              materials, and daily sprint schedule based on your target degree
              and timeline.
            </p>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-200" />
            )}
            <span>
              {loading ? "Synthesizing AI Plan..." : "Regenerate Study Plan"}
            </span>
          </button>
        </div>

        {/* Dynamic Inputs Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#E5E7EB]">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Target Test
            </label>
            <select
              value={selectedExam}
              onChange={(e) => {
                const exam = e.target.value;
                setSelectedExam(exam);
                if (exam === "GRE General") {
                  setTargetScore("325");
                  setCurrentScore("310");
                } else if (exam === "TOEFL iBT") {
                  setTargetScore("105");
                  setCurrentScore("90");
                } else {
                  setTargetScore("7.5");
                  setCurrentScore("6.5");
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            >
              <option value="IELTS Academic">IELTS Academic</option>
              <option value="TOEFL iBT">TOEFL iBT</option>
              <option value="GRE General">GRE General Test</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Current Diagnostic / Mock
            </label>
            <input
              type="text"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
              placeholder="e.g. 6.5 or 310"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Target Score Goal
            </label>
            <input
              type="text"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="e.g. 7.5 or 325"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#E5E7EB] space-y-3">
          <Loader2 className="w-8 h-8 text-[#2D5A43] animate-spin mx-auto" />
          <p className="font-semibold text-sm text-[#1A1A1A]">
            Synthesizing Adaptive {selectedExam} Roadmap...
          </p>
          <p className="text-xs text-gray-400">
            Calibrating daily drills from baseline {currentScore} to target
            score {targetScore}.
          </p>
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {/* Module Breakdown & Diagnostic Scoring Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.modules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="font-bold text-base text-[#1C1E21]">
                    {mod.name}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full border border-emerald-200">
                    Goal: {mod.targetScore}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-[#5C626A]">Diagnostic Baseline:</span>
                  <span className="font-bold text-[#1C1E21] ml-2 text-sm">
                    {mod.currentMockScore}
                  </span>
                </div>

                {/* Targeted Weak Areas */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#C86248] uppercase tracking-wider block">
                    Priority Focus Areas
                  </span>
                  <ul className="text-[11px] text-[#5C626A] space-y-1 list-disc list-inside">
                    {mod.weakAreas.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                {/* Official Resources */}
                {mod.recommendedResources?.length > 0 && (
                  <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                    <span className="text-[10px] text-[#8A919A] uppercase tracking-wider block">
                      Recommended Sources
                    </span>
                    {mod.recommendedResources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2D5A43] hover:underline flex items-center justify-between"
                      >
                        <span className="truncate">{res.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Daily Study Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#1C1E21]">
                  Adaptive Study Schedule & Milestone Drills
                </h2>
                <p className="text-xs text-[#5C626A]">
                  Click tasks as you finish them to track your preparation
                  velocity.
                </p>
              </div>
              <span className="text-xs text-[#5C626A] font-semibold bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
                Completed: {completedCount} / {totalTasks} drills
              </span>
            </div>

            <div className="space-y-2.5">
              {plan.studySchedule.map((item) => (
                <div
                  key={item.dayNumber}
                  onClick={() => toggleDayCompleted(item.dayNumber)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-xs ${
                    item.completed
                      ? "bg-[#EBF2EE]/60 border-[#2D5A43]/40 text-[#2D5A43]"
                      : "bg-[#FAF8F5] border-[#E5E7EB] text-[#1C1E21] hover:border-[#2D5A43]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#2D5A43] accent-[#2D5A43] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1C1E21]">
                          Day {item.dayNumber} (Week {item.week}):
                        </span>
                        <span className="font-semibold">{item.topic}</span>
                      </div>
                      <p className="text-[11px] text-[#5C626A] mt-0.5">
                        {item.actionItems.join(" • ")}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] px-2.5 py-0.5 bg-white rounded-full border border-[#E5E7EB] text-[#5C626A] font-medium shrink-0">
                    {item.focusArea}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
