"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckSquare,
  BarChart,
  BookOpen,
  Award,
  Clock,
  Plus,
  AlertTriangle,
  ExternalLink,
  Target
} from "lucide-react";
import { initialIeltsPlan, ExamModule, StudyScheduleDay } from "@/lib/exam-planner-data";

export default function ExamPlanner() {
  const [examState, setExamState] = useState(initialIeltsPlan);
  const [schedule, setSchedule] = useState<StudyScheduleDay[]>(initialIeltsPlan.sample60DaySchedule);

  const toggleDayCompleted = (dayNumber: number) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.dayNumber === dayNumber ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Backward Study Planner & Requirements
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            IELTS Academic & Entrance Exam Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Target Score: <strong>7.5 Overall</strong> (no band below 6.5). Aligned with European & Australian master&apos;s application windows.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-3.5 rounded-xl hairline-border text-xs text-right">
          <span className="text-[#8A919A] block">Target Test Date</span>
          <span className="font-bold text-[#1C1E21] text-sm">{examState.examDate}</span>
          <span className="text-[#C86248] block text-[11px] font-medium mt-0.5">
            Registration Deadline: {examState.registrationDeadline}
          </span>
        </div>
      </div>

      {/* Module Breakdown & Mock Score Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {examState.modules.map((mod, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 hairline-border editorial-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
              <span className="font-serif-editorial font-bold text-lg text-[#1C1E21]">{mod.name}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full">
                Target: {mod.targetScore}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-[#5C626A]">Latest Mock Score:</span>
              <span className="font-bold text-[#1C1E21] ml-2 text-sm">{mod.currentMockScore}</span>
            </div>

            {/* Weak Areas */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#C86248] uppercase tracking-wider block">
                Weak Areas & Focus Points
              </span>
              <ul className="text-[11px] text-[#5C626A] space-y-1 list-disc list-inside">
                {mod.weakAreas.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="pt-2 border-t border-[#E5E0D8] space-y-1">
              <span className="text-[10px] text-[#8A919A] uppercase tracking-wider block">Official Resources</span>
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
          </div>
        ))}
      </div>

      {/* Backward Study Schedule */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
          <h2 className="font-serif-editorial text-lg font-bold text-[#1C1E21]">
            Backward Study Schedule (60-Day Execution Plan)
          </h2>
          <span className="text-xs text-[#5C626A]">
            Completed: {schedule.filter((s) => s.completed).length} / {schedule.length} tasks
          </span>
        </div>

        <div className="space-y-2">
          {schedule.map((item) => (
            <div
              key={item.dayNumber}
              onClick={() => toggleDayCompleted(item.dayNumber)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-xs ${
                item.completed
                  ? "bg-[#EBF2EE]/60 border-[#2D5A43]/30 text-[#2D5A43]"
                  : "bg-[#FAF8F5] border-[#E5E0D8] text-[#1C1E21] hover:border-[#2D5A43]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-[#2D5A43] accent-[#2D5A43]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1C1E21]">Day {item.dayNumber} (Week {item.week}):</span>
                    <span className="font-semibold">{item.topic}</span>
                  </div>
                  <p className="text-[11px] text-[#5C626A] mt-0.5">
                    {item.actionItems.join(" • ")}
                  </p>
                </div>
              </div>

              <span className="text-[11px] px-2.5 py-0.5 bg-white rounded-full hairline-border text-[#5C626A] font-medium shrink-0">
                {item.focusArea}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
