"use client";

import React, { useState } from "react";
import {
  Globe,
  Server,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Terminal,
  ShieldCheck
} from "lucide-react";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeploymentModal({ isOpen, onClose }: DeploymentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vercelCliCmd = "npx vercel --prod";

  const handleCopy = () => {
    navigator.clipboard.writeText(vercelCliCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden space-y-0 text-[#1A1A1A]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A1A1A] via-[#1E2923] to-[#0F172A] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Vercel One-Click Live Deployment</h2>
              <p className="text-xs text-emerald-300">Automated Serverless Host & Scheduled Vercel Cron</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-[#5C626A] leading-relaxed">
          {/* Architecture Summary */}
          <div className="bg-[#F9FAF8] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
            <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" /> Vercel Live Production Architecture
            </h3>
            <p>
              Your app includes a pre-configured <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">vercel.json</code> file with Next.js serverless functions and an automated daily cron job <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">/api/cron/scan-scholarships</code>.
            </p>
          </div>

          {/* Deployment Options */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">
              2 Ways to Deploy Immediately:
            </h4>

            {/* Option A: Vercel CLI */}
            <div className="bg-stone-900 p-4 rounded-2xl text-white space-y-3 font-mono border border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 text-xs font-bold font-sans flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Option 1: Vercel Command Line (Instant)
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-sans font-semibold transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3 text-emerald-300" />
                  <span>{copied ? "Copied! ✓" : "Copy Command"}</span>
                </button>
              </div>

              <div className="bg-black/60 p-3 rounded-xl border border-white/10 text-emerald-300 text-xs">
                {vercelCliCmd}
              </div>

              <p className="text-[11px] text-stone-400 font-sans leading-normal">
                Run this command directly in your workspace terminal. It prompts for your Vercel account and deploys the production build in under 60 seconds.
              </p>
            </div>

            {/* Option B: Vercel Dashboard */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A1A] text-xs flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-600" /> Option 2: Connect GitHub Repository to Vercel
                </span>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold underline text-xs"
                >
                  <span>Vercel Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[#5C626A]">
                <li>Push this workspace to your GitHub account (<code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">git push origin main</code>).</li>
                <li>Go to <strong>vercel.com/new</strong> and select this repository.</li>
                <li>Add Environment Variable: <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.</li>
                <li>Click <strong>Deploy</strong>. Vercel automatically activates the daily cron schedule!</li>
              </ol>
            </div>
          </div>

          {/* Key Security Note */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero hardcoding: Environment variable <code className="font-mono font-bold">GEMINI_API_KEY</code> powers all live scholarship searches and AI review engines.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F9FAF8] px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
          >
            Got It! Proceed to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
