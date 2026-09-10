"use client";

import React from "react";
import Image from "next/image";
import {
  GraduationCap,
  Sparkles,
  Bookmark,
  FileText,
  Compass,
  Plane,
  Award,
  Users,
  Search,
  Calendar,
  Server,
  Scale,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  candidateName: string;
  cgpa: number;
  totalScholarships: number;
  activeApplicationsCount: number;
  onOpenProfile: () => void;
  onOpenDeployModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  candidateName,
  cgpa,
  totalScholarships,
  activeApplicationsCount,
  onOpenProfile,
  onOpenDeployModal,
}: NavbarProps) {
  const tabs = [
    { id: "scholarships", label: "Scholarships & Automation", icon: Award },
    { id: "ai-research", label: "AI Deep Researcher", icon: Search },
    { id: "doc-generator", label: "Humanized SOP & Emails", icon: FileText },
    { id: "professors", label: "Professor Finder", icon: Compass },
    { id: "visa-hub", label: "Pakistani Visa Hub", icon: Plane },
    { id: "applications", label: "Application Tracker", icon: Bookmark },
    { id: "exam-planner", label: "IELTS & Exams", icon: Calendar },
    { id: "country-compare", label: "Country Matrix", icon: GraduationCap },
    { id: "connect-forum", label: "Connect Student Forum", icon: Users },
    { id: "reality-check", label: "Ranking & Reality Check", icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-40 border-b">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="shrink-0 w-10 h-10 relative">
            <Image
              src="/ease-scholarship-mark.svg"
              alt="Ease Scholarship Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif-editorial font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2">
                Ease
              </h1>
              <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded-full bg-[#EBF2EE] text-emerald-900 border border-emerald-900/10">
                Scholarship intelligence
              </span>
            </div>
            <p className="text-xs text-[#5C626A] flex items-center gap-1.5 mt-1">
              <span>
                Candidate:{" "}
                <strong className="text-[#1A1A1A]">{candidateName}</strong>
              </span>
              <span>•</span>
              <span>CGPA {cgpa.toFixed(2)} | SE Graduate</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Deploy Pill */}
        <div className="flex items-center gap-2.5">
          {/* Vercel Deploy Button */}
          <button
            onClick={onOpenDeployModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
          ></button>

          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-emerald-600 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Profile & CV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar border-t border-[#E5E7EB]/80">
        <nav className="flex gap-1 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F0F2EE] text-emerald-900 font-semibold border border-emerald-200/50 shadow-2xs"
                    : "text-gray-600 hover:text-[#1A1A1A] hover:bg-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-gray-400"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
