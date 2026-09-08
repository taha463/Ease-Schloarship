"use client";

import React, { useState } from "react";
import {
  Compass,
  Search,
  Mail,
  Building,
  Sparkles,
  ExternalLink,
  BookOpen,
  Award,
  Globe,
  CheckCircle2,
  Copy,
  Linkedin,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Target,
  Zap
} from "lucide-react";

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
  openingsStatus: "Actively Recruiting MS/PhD" | "Contact for MS Thesis" | "Scholarship Required";
  recommendedAddressing: string; // e.g. "Dear Prof. Dr. Nießner,"
  persuasionStrategy: {
    keyPaperToCite: string;
    taicOverlapHook: string; // How Taha's Aegis/FEHM.AI/PyTorch aligns with prof's work
    recommendedOffer: string; // What to offer (e.g. 10-min demo of Aegis AI flood model or custom benchmark)
  };
}

export const initialProfessors: ProfessorRecord[] = [
  {
    id: "prof-1",
    name: "Prof. Dr. Matthias Nießner",
    university: "Technical University of Munich (TUM)",
    country: "Germany",
    labName: "Visual Computing & AI Lab",
    researchFocus: ["3D AI", "Computer Vision", "Generative Neural Networks"],
    email: "niessner@tum.de",
    website: "https://www.niessnerlab.org/",
    linkedinUrl: "https://www.linkedin.com/in/matthias-niessner-59918a15/",
    scholarUrl: "https://scholar.google.com/citations?user=X6oA_a4AAAAJ",
    openingsStatus: "Contact for MS Thesis",
    recommendedAddressing: "Dear Prof. Dr. Nießner,",
    persuasionStrategy: {
      keyPaperToCite: "3D Gaussian Splatting for Real-Time Radiance Field Rendering (2023/2024)",
      taicOverlapHook: "Highlight your Aegis AI flood prediction system's real-time spatial rendering & GEOGloWS integration built in PyTorch.",
      recommendedOffer: "Offer to send a 2-minute video walkthrough of your spatial neural network demo."
    }
  },
  {
    id: "prof-2",
    name: "Prof. Dr. Danica Kragic",
    university: "KTH Royal Institute of Technology",
    country: "Sweden",
    labName: "Robotics, Perception & Learning (RPL)",
    researchFocus: ["Multi-Agent Systems", "Robotic Learning", "Computer Vision"],
    email: "dani@kth.se",
    website: "https://www.kth.se/profile/dani",
    linkedinUrl: "https://www.linkedin.com/in/danica-kragic-4a4a15/",
    scholarUrl: "https://scholar.google.com/citations?user=7JzM6q4AAAAJ",
    openingsStatus: "Actively Recruiting MS/PhD",
    recommendedAddressing: "Dear Professor Kragic,",
    persuasionStrategy: {
      keyPaperToCite: "Multi-Agent Representation Learning in Complex Environments",
      taicOverlapHook: "Connect FEHM.AI (Socratic Multi-Agent Learning) with RPL's multi-agent decision dynamics.",
      recommendedOffer: "Offer to benchmark your PyTorch multi-agent communication protocol on KTH simulation environments."
    }
  },
  {
    id: "prof-3",
    name: "Prof. Juho Kannala",
    university: "Aalto University",
    country: "Finland",
    labName: "Aalto Vision & Learning Group",
    researchFocus: ["Deep Learning", "Spatial AI", "Explainable AI"],
    email: "juho.kannala@aalto.fi",
    website: "https://research.aalto.fi/en/persons/juho-kannala",
    linkedinUrl: "https://www.linkedin.com/in/juho-kannala-484821/",
    scholarUrl: "https://scholar.google.com/citations?user=n6YxUvEAAAAJ",
    openingsStatus: "Contact for MS Thesis",
    recommendedAddressing: "Dear Professor Kannala,",
    persuasionStrategy: {
      keyPaperToCite: "Self-Supervised Learning for Monocular Depth Estimation",
      taicOverlapHook: "Show how your software engineering experience at Elevvo and Aegis spatial models apply to monocular vision.",
      recommendedOffer: "Propose a 10-minute Zoom demonstration of your PyTorch spatial inference pipeline."
    }
  },
  {
    id: "prof-4",
    name: "Prof. Dr. Sanja Fidler",
    university: "University of Toronto & Vector Institute",
    country: "Canada",
    labName: "Toronto AI Lab & Vector Institute",
    researchFocus: ["Multimodal AI", "LLMs", "Vision-Language Grounding"],
    email: "fidler@cs.toronto.edu",
    website: "https://www.cs.toronto.edu/~fidler/",
    linkedinUrl: "https://www.linkedin.com/in/sanja-fidler-873b313b/",
    scholarUrl: "https://scholar.google.com/citations?user=q3mN6-4AAAAJ",
    openingsStatus: "Scholarship Required",
    recommendedAddressing: "Dear Professor Fidler,",
    persuasionStrategy: {
      keyPaperToCite: "Neural Scene Graphs for Vision-Language Understanding",
      taicOverlapHook: "Cite Mizan (AI Legal Reasoning) & RAG pipeline optimization in FastAPI & Docker.",
      recommendedOffer: "State that you are applying for Vanier Canada / OGS and request research supervision endorsement."
    }
  },
  {
    id: "prof-5",
    name: "Prof. Marcus Hutter",
    university: "Australian National University (ANU)",
    country: "Australia",
    labName: "ANU AI & Cybernetics Group",
    researchFocus: ["Universal AI", "Reinforcement Learning", "Multi-Agent Dynamics"],
    email: "marcus.hutter@anu.edu.au",
    website: "http://www.hutter1.net/",
    linkedinUrl: "https://www.linkedin.com/in/marcus-hutter-ai/",
    scholarUrl: "https://scholar.google.com/citations?user=W4O6WBAAAAAJ",
    openingsStatus: "Actively Recruiting MS/PhD",
    recommendedAddressing: "Dear Professor Hutter,",
    persuasionStrategy: {
      keyPaperToCite: "Universal Artificial Intelligence & Algorithmic Information Theory",
      taicOverlapHook: "Discuss causal reasoning in Mizan & algorithmic bounds in multi-agent reinforcement learning.",
      recommendedOffer: "Request an RTP scholarship supervision acceptance letter for Australia intake."
    }
  },
  {
    id: "prof-6",
    name: "Prof. Dr. Alexandru Iosup",
    university: "VU Amsterdam / Delft University of Technology",
    country: "Netherlands",
    labName: "Massive-Scale Distributed Systems (MSDS)",
    researchFocus: ["Distributed Systems", "Cloud Computing", "AI Benchmarking"],
    email: "a.iosup@vu.nl",
    website: "http://atlarge-research.com/",
    linkedinUrl: "https://www.linkedin.com/in/alexandru-iosup-3b32014/",
    scholarUrl: "https://scholar.google.com/citations?user=tT1iWnMAAAAJ",
    openingsStatus: "Actively Recruiting MS/PhD",
    recommendedAddressing: "Dear Professor Iosup,",
    persuasionStrategy: {
      keyPaperToCite: "The SPEC ML Benchmark for Massively Distributed Training",
      taicOverlapHook: "Highlight your Docker & FastAPI multi-tier cloud backend deployment expertise from Elevvo.",
      recommendedOffer: "Offer to contribute to cloud workload benchmark suites for TU Delft / VU MS thesis."
    }
  },
  {
    id: "prof-7",
    name: "Prof. Michael Bowling",
    university: "University of Alberta",
    country: "Canada",
    labName: "Computer Poker & Reinforcement Learning Lab (AMII)",
    researchFocus: ["Reinforcement Learning", "Game Theory", "Multi-Agent Systems"],
    email: "mbowling@ualberta.ca",
    website: "https://webdocs.cs.ualberta.ca/~bowling/",
    linkedinUrl: "https://www.linkedin.com/in/michael-bowling-alberta/",
    scholarUrl: "https://scholar.google.com/citations?user=k35n3fQAAAAJ",
    openingsStatus: "Actively Recruiting MS/PhD",
    recommendedAddressing: "Dear Professor Bowling,",
    persuasionStrategy: {
      keyPaperToCite: "Deep Stack: Expert-Level Artificial Intelligence in Heads-Up No-Limit Poker",
      taicOverlapHook: "Connect FEHM.AI multi-agent reasoning with game-theoretic equilibrium bounds.",
      recommendedOffer: "Apply for Alberta Graduate Excellence Scholarship with his departmental endorsement."
    }
  },
  {
    id: "prof-8",
    name: "Prof. Gill Dobbie",
    university: "University of Auckland",
    country: "New Zealand",
    labName: "Auckland Data Science & AI Group",
    researchFocus: ["Data Science", "Machine Learning", "Software Engineering for AI"],
    email: "g.dobbie@auckland.ac.nz",
    website: "https://profiles.auckland.ac.nz/g-dobbie",
    linkedinUrl: "https://www.linkedin.com/in/gill-dobbie-46132712/",
    scholarUrl: "https://scholar.google.com/citations?user=0tWwW8cAAAAJ",
    openingsStatus: "Actively Recruiting MS/PhD",
    recommendedAddressing: "Dear Professor Dobbie,",
    persuasionStrategy: {
      keyPaperToCite: "Streaming Data Analytics & Real-Time Machine Learning Systems",
      taicOverlapHook: "Reference your Aegis flood stream forecasting API and Manaaki NZ scholarship alignment.",
      recommendedOffer: "Offer a short code review of your PyTorch geospatial data pipeline."
    }
  }
];

interface ProfessorFinderProps {
  onDraftColdEmail: (prof: ProfessorRecord) => void;
}

export default function ProfessorFinder({ onDraftColdEmail }: ProfessorFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [expandedProfId, setExpandedProfId] = useState<string | null>(initialProfessors[0].id);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const filtered = initialProfessors.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.researchFocus.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCountry = selectedCountry === "All" || p.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const getGmailDraftUrl = (prof: ProfessorRecord) => {
    const subject = encodeURIComponent(`Prospective MS Research Student - ${prof.researchFocus[0]} (${prof.name})`);
    const body = encodeURIComponent(
`${prof.recommendedAddressing}

I hope this email finds you well.

My name is Muhammad Taha, a B.Sc. Software Engineering graduate from HITEC University, Pakistan (CGPA 3.20/4.00). I have been following your lab's work at ${prof.university}, particularly your research on "${prof.persuasionStrategy.keyPaperToCite}".

In my recent project Aegis (AI Flood Prediction using PyTorch & GEOGloWS) and FEHM.AI (Socratic Multi-Agent Systems), I focused on spatial neural networks and agentic decision models. I found strong alignment with your lab's focus on ${prof.researchFocus.join(", ")}.

${prof.persuasionStrategy.taicOverlapHook}

I am preparing my application for Master's studies and fully funding opportunities. ${prof.persuasionStrategy.recommendedOffer}

Would you be open to a brief 10-minute conversation or reviewing my CV?

Sincerely,
Muhammad Taha
Software Engineer | Islamabad/Taxila, Pakistan
GitHub: github.com/muhammadtaha
Portfolio & Codebase Attached`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${prof.email}&su=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Faculty & Research Supervisor Intelligence (Detailed Profiles)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            AI & Software Research Professors Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-3xl leading-relaxed">
            Direct faculty research leads across Germany, Sweden, Finland, Netherlands, Canada, Australia, and New Zealand. Includes LinkedIn, Google Scholar, Gmail draft links, and AI persuasion strategy guides.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search professor name, university, or research topic (e.g. Vision, Multi-Agent)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] text-[#1A1A1A]"
        >
          <option value="All">All Target Countries</option>
          <option value="Germany">Germany</option>
          <option value="Sweden">Sweden</option>
          <option value="Finland">Finland</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="New Zealand">New Zealand</option>
        </select>
      </div>

      {/* Grid of Professors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((prof) => {
          const isExpanded = expandedProfId === prof.id;

          return (
            <div
              key={prof.id}
              className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-emerald-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                    📍 {prof.country}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {prof.openingsStatus}
                  </span>
                </div>

                {/* Prof Name & Uni */}
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] hover:text-emerald-700 transition-colors">
                    {prof.name}
                  </h2>
                  <p className="text-xs text-[#5C626A] mt-0.5">
                    <strong className="text-[#1A1A1A]">{prof.university}</strong> • {prof.labName}
                  </p>
                </div>

                {/* Direct Profile Links: LinkedIn & Google Scholar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* LinkedIn Link */}
                  <a
                    href={prof.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-semibold border border-blue-200 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 text-blue-500" />
                  </a>

                  {/* Google Scholar Link */}
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

                  {/* Lab Website */}
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
                </div>

                {/* Email Box & "Gmail Him" Button */}
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
                      <span>{copiedEmailId === prof.id ? "Copied! ✓" : "Copy Email"}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {/* Direct Gmail Him Button */}
                    <a
                      href={getGmailDraftUrl(prof)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all text-center"
                    >
                      <Mail className="w-4 h-4 text-emerald-200" />
                      <span>Gmail Him (Pre-Filled)</span>
                    </a>

                    {/* Standard SOP/Email Generator tab switch */}
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
                  {prof.researchFocus.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-stone-100 text-[#1A1A1A] text-[10px] rounded-md font-medium border border-stone-200">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Persuasion Strategy Toggle */}
                <button
                  onClick={() => setExpandedProfId(isExpanded ? null : prof.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600" /> What we need to convince him to take us
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Expanded Persuasion & Outreach Strategy Card */}
                {isExpanded && (
                  <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 to-stone-50 rounded-xl border border-emerald-200 text-xs space-y-2 animate-fadeIn">
                    <div>
                      <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                        1. Key Paper to Cite:
                      </span>
                      <p className="text-[#5C626A] font-serif italic text-xs">&quot;{prof.persuasionStrategy.keyPaperToCite}&quot;</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                        2. Portfolio Overlap Hook (Aegis & PyTorch):
                      </span>
                      <p className="text-[#5C626A] leading-relaxed">{prof.persuasionStrategy.taicOverlapHook}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider text-emerald-900">
                        3. Winning Outreach Offer:
                      </span>
                      <p className="text-[#5C626A] font-semibold text-emerald-950">{prof.persuasionStrategy.recommendedOffer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
