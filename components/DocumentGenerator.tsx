"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Send,
  Loader2,
  Bookmark,
  GraduationCap,
  Award,
  RefreshCw,
  UserCheck,
  Layers
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DocumentGeneratorProps {
  candidateName: string;
  defaultUniversity?: string;
  defaultScholarship?: string;
}

export default function DocumentGenerator({
  candidateName,
  defaultUniversity = "Technical University of Munich (TUM)",
  defaultScholarship = "DAAD EPOS / Fully Funded Excellence Scholarship"
}: DocumentGeneratorProps) {
  const [docType, setDocType] = useState<"SOP" | "LOR" | "ColdEmail" | "MotivationLetter">("SOP");
  const [targetUniversity, setTargetUniversity] = useState(defaultUniversity);
  const [scholarshipName, setScholarshipName] = useState(defaultScholarship);
  const [targetProgram, setTargetProgram] = useState("Master of Science in Artificial Intelligence");
  const [professorName, setProfessorName] = useState("Prof. Dr. Matthias Nießner");
  const [researchDomain, setResearchDomain] = useState("Multi-Agent Learning Systems & Explainable AI");
  const [customNote, setCustomNote] = useState("Emphasize Aegis disaster prediction platform & FEHM.AI multi-agent framework.");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedDoc("");
    try {
      const res = await fetch("/api/ai/generate-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          targetUniversity,
          scholarshipName,
          targetProgram,
          professorName,
          researchDomain,
          customNote
        })
      });

      const data = await res.json();
      if (data.success && data.documentText) {
        setGeneratedDoc(data.documentText);
      } else {
        setGeneratedDoc("Error generating document: " + (data.error || "Unknown server error"));
      }
    } catch (err: any) {
      setGeneratedDoc("Network error generating document: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    const element = document.createElement("a");
    const file = new Blob([generatedDoc], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${docType}_Muhammad_Taha_${targetUniversity.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
            Context Humanizer Engine
          </span>
        </div>
        <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
          Award-Winning Academic SOP, LOR & Email Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-3xl leading-relaxed">
          Crafts 100% human-sounding, rigorous academic documents for <strong>Muhammad Taha</strong>. Grounded in your actual PyTorch, Multi-Agent (FEHM.AI), RAG (Nexium), and Disaster AI (Aegis) experience — strictly avoiding AI clichés.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 hairline-border editorial-shadow space-y-4">
          <h2 className="font-serif-editorial text-lg font-bold text-[#1C1E21] border-b border-[#E5E0D8] pb-3">
            Document Setup
          </h2>

          {/* Doc Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1.5">
              Select Document Type
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "SOP", label: "Statement of Purpose (SOP)" },
                { id: "LOR", label: "Letter of Rec (LOR)" },
                { id: "ColdEmail", label: "Cold Email to Professor" },
                { id: "MotivationLetter", label: "Scholarship Motivation" }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDocType(item.id as any)}
                  className={`px-3 py-2.5 rounded-xl font-medium text-left transition-all ${
                    docType === item.id
                      ? "bg-[#2D5A43] text-white shadow-xs font-semibold"
                      : "bg-[#FAF8F5] text-[#5C626A] hover:bg-[#F3F0EB] hairline-border"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target University */}
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Target University
            </label>
            <input
              type="text"
              value={targetUniversity}
              onChange={(e) => setTargetUniversity(e.target.value)}
              placeholder="e.g. Technical University of Munich / KTH Sweden"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          {/* Target Scholarship */}
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Scholarship / Grant Name
            </label>
            <input
              type="text"
              value={scholarshipName}
              onChange={(e) => setScholarshipName(e.target.value)}
              placeholder="e.g. DAAD EPOS / Swedish Institute SISGP"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          {/* Program & Research Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                Target Degree
              </label>
              <input
                type="text"
                value={targetProgram}
                onChange={(e) => setTargetProgram(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
                Professor (Optional)
              </label>
              <input
                type="text"
                value={professorName}
                onChange={(e) => setProfessorName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
              />
            </div>
          </div>

          {/* Specific Research Domain */}
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Research / Academic Domain Focus
            </label>
            <input
              type="text"
              value={researchDomain}
              onChange={(e) => setResearchDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          {/* Custom Prompt Context */}
          <div>
            <label className="block text-xs font-bold text-[#5C626A] uppercase mb-1">
              Custom Angle / Instructions
            </label>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] hairline-border focus:outline-none focus:ring-1 focus:ring-[#2D5A43] text-[#1C1E21]"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-[#2D5A43] hover:bg-[#234735] text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Humanizing Academic Narrative...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Award-Winning {docType}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col min-h-[500px]">
          {/* Output Toolbar */}
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4 mb-4">
            <h2 className="font-serif-editorial text-lg font-bold text-[#1C1E21] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2D5A43]" />
              <span>Document Workspace</span>
            </h2>

            {generatedDoc && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#FAF8F5] hover:bg-[#F3F0EB] text-[#1C1E21] hairline-border flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5C626A]" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2D5A43] hover:bg-[#234735] text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download .md</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Content View */}
          <div className="flex-1 bg-[#FAF8F5] rounded-xl p-5 hairline-border overflow-y-auto max-h-[600px] text-xs leading-relaxed">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <Loader2 className="w-8 h-8 text-[#2D5A43] animate-spin" />
                <p className="font-medium text-[#1C1E21] text-sm">
                  Applying Humanizer Protocol & Synthesizing Candidate Profile...
                </p>
                <p className="text-stone-500 text-xs max-w-md">
                  Infusing Aegis flood forecasting, FEHM.AI multi-agent socratic workflows, and Mizan legal reasoning framework.
                </p>
              </div>
            ) : generatedDoc ? (
              <div className="prose prose-xs max-w-none text-[#1C1E21] space-y-3 font-sans">
                <ReactMarkdown>{generatedDoc}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8A919A] space-y-3">
                <FileText className="w-10 h-10 text-stone-300" />
                <p className="text-xs">
                  Configure target university and click <strong>&quot;Generate Award-Winning {docType}&quot;</strong> to craft your custom document.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
