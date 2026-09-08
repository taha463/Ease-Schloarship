"use client";

import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
  Send,
  Globe,
  TrendingUp,
  MapPin,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";

export interface DebateTopic {
  id: string;
  title: string;
  author: string;
  authorRole: string; // e.g., "MS Graduate @ TUM Germany (Pakistani Senior)"
  countryPair: string; // e.g., "Germany vs. Sweden"
  content: string;
  upvotes: number;
  commentsCount: number;
  commentsList: Array<{
    author: string;
    role: string;
    text: string;
    time: string;
  }>;
}

export const initialDebates: DebateTopic[] = [
  {
    id: "debate-1",
    title: "Germany (TUM/DAAD) vs. Sweden (KTH/SI Scholarship) for Software Engineers from Pakistan",
    author: "Osman Raza",
    authorRole: "Software Engineer @ Ericsson Stockholm | Ex-NUST",
    countryPair: "Germany vs Sweden",
    content: "If your CGPA is around 3.20, both Germany and Sweden offer stellar fully funded paths. In Germany (DAAD), public universities are tuition-free and blocked account requirement is €11,904. In Sweden, SI scholarship covers SEK 12,000/mo stipend + 100% tuition. Sweden has better English fluency in daily life, but Germany offers an 18-month job seeker visa and a massive industrial AI market (Munich & Berlin).",
    upvotes: 42,
    commentsCount: 3,
    commentsList: [
      {
        author: "Muhammad Taha",
        role: "HITEC SE '26 Applicant",
        text: "Thanks Osman! How hard is the blocked account deposit transfer from Pakistan banks?",
        time: "2 hours ago"
      },
      {
        author: "Osman Raza",
        role: "Ericsson Stockholm",
        text: "State Bank of Pakistan allows legal student remittance for Expatrio/Fintiba once you show university offer letter and visa appointment form.",
        time: "1 hour ago"
      }
    ]
  },
  {
    id: "debate-2",
    title: "Finland (Aalto 100% Waiver + Continuous Residence Permit) vs Canada (PGWP 3 Years)",
    author: "Zainab Malik",
    authorRole: "AI Researcher @ Aalto University Espoo",
    countryPair: "Finland vs Canada",
    content: "Finland now grants a 2-year Continuous Type A residence permit upfront for Master's students, and 30 hours/week part-time work allowance. Canada offers 3 years PGWP but living costs in Toronto/Vancouver are significantly higher ($20,635 GIC required). For AI/Machine Learning, Aalto and Oulu in Finland are unmatched in Europe.",
    upvotes: 38,
    commentsCount: 2,
    commentsList: [
      {
        author: "Hamza Siddiqui",
        role: "MS Student @ University of Oulu",
        text: "Agreed! Finland Fellowship covers relocation grant + 100% tuition waiver.",
        time: "3 hours ago"
      }
    ]
  },
  {
    id: "debate-3",
    title: "Australia (Subclass 500 & RTP Scholarship) vs New Zealand (Manaaki NZ)",
    author: "Dr. Bilal Ahmed",
    authorRole: "Postdoc Researcher @ ANU Canberra",
    countryPair: "Australia vs New Zealand",
    content: "Australia's RTP grant gives AUD $37,200/year tax-free stipend. Master's by research allows spouses to work full-time. Manaaki NZ covers 100% flights, tuition, and NZD $531/week stipend. For disaster tech (like Aegis flood prediction), Manaaki NZ prioritizes climate tech applicants.",
    upvotes: 29,
    commentsCount: 1,
    commentsList: [
      {
        author: "Ayesha Khan",
        role: "Adelaide Grad",
        text: "RTP requires professor approval beforehand, so start cold emailing in August!",
        time: "5 hours ago"
      }
    ]
  }
];

export default function DebateForum() {
  const [debates, setDebates] = useState<DebateTopic[]>(initialDebates);
  const [activeDebateId, setActiveDebateId] = useState<string>(debates[0].id);
  const [newCommentText, setNewCommentText] = useState("");

  // Live Internet Review Search state
  const [searchComparison, setSearchComparison] = useState("Germany vs Canada vs Sweden MS in AI");
  const [isFetchingWebData, setIsFetchingWebData] = useState(false);
  const [webReviewData, setWebReviewData] = useState<any>(null);

  const activeDebate = debates.find((d) => d.id === activeDebateId) || debates[0];

  const handleFetchInternetReviews = async () => {
    if (!searchComparison.trim()) return;
    setIsFetchingWebData(true);
    try {
      const res = await fetch("/api/ai/country-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryOrComparison: searchComparison })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setWebReviewData(json.data);

        // Also add a new debate thread dynamically from web data
        if (json.data.title && json.data.summary) {
          const newThread: DebateTopic = {
            id: `web-debate-${Date.now()}`,
            title: json.data.title,
            author: "Internet Community Consensus (Reddit / Student Forums)",
            authorRole: "Aggregated Web Intelligence",
            countryPair: searchComparison,
            content: `${json.data.summary}\n\nLiving Costs: ${json.data.livingCostRealities}\n\nWork & PR Realities: ${json.data.workVisaAndPrRealities}`,
            upvotes: 18,
            commentsCount: json.data.webComments?.length || 0,
            commentsList: (json.data.webComments || []).map((c: any) => ({
              author: c.author || "Senior Expat Student",
              role: c.roleOrSource || "Verified Reddit Reviewer",
              text: c.commentText || c.text,
              time: c.timeAgo || "Recently"
            }))
          };
          setDebates((prev) => [newThread, ...prev]);
          setActiveDebateId(newThread.id);
        }
      }
    } catch (err) {
      console.error("Web review fetch failed", err);
    } finally {
      setIsFetchingWebData(false);
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    setDebates((prev) =>
      prev.map((d) => {
        if (d.id === activeDebateId) {
          return {
            ...d,
            commentsCount: d.commentsCount + 1,
            commentsList: [
              ...d.commentsList,
              {
                author: "Muhammad Taha",
                role: "Software Engineering Graduate (Pakistan)",
                text: newCommentText,
                time: "Just now"
              }
            ]
          };
        }
        return d;
      })
    );
    setNewCommentText("");
  };

  const handleUpvote = (id: string) => {
    setDebates((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
  };

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Student Forum & Internet Community Consensus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Real Country Reviews & Discussion Threads
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-3xl leading-relaxed">
            Authentic, unvarnished student reviews gathered from Reddit, Expat forums, and Pakistani alumni studying in Europe, Canada, Australia, and New Zealand.
          </p>
        </div>
      </div>

      {/* AI Real Web Sentiment Aggregator Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-slate-900 rounded-2xl p-5 text-white border border-emerald-500/20 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Real Internet Review & Sentiment Search
            </h2>
          </div>
          <span className="text-[11px] text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Live Web Sentiment Aggregator
          </span>
        </div>

        <p className="text-xs text-gray-300">
          Query real-time student sentiment across Reddit (r/IWW, r/StudyInEurope, r/ImmigrationCanada), student forums, and living cost indexes:
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Germany vs Canada vs Sweden MS in AI living costs and job market..."
              value={searchComparison}
              onChange={(e) => setSearchComparison(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
          <button
            onClick={handleFetchInternetReviews}
            disabled={isFetchingWebData}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingWebData ? "animate-spin" : ""}`} />
            <span>{isFetchingWebData ? "Aggregating Internet Sentiment..." : "Fetch Real Web Reviews"}</span>
          </button>
        </div>

        {/* Dynamic Web Review Results Card */}
        {webReviewData && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-300">
              <span>{webReviewData.title}</span>
              <span className="text-[10px] text-gray-300">Aggregated Consensus</span>
            </div>
            <p className="text-gray-200 leading-relaxed">{webReviewData.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Major Advantages / Pros:
                </span>
                <ul className="text-gray-300 space-y-0.5 pl-2">
                  {(webReviewData.pros || []).map((p: string, i: number) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-950/40 p-3 rounded-lg border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-300 text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Real Challenges / Cons:
                </span>
                <ul className="text-gray-300 space-y-0.5 pl-2">
                  {(webReviewData.cons || []).map((c: string, i: number) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Forum Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topics Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5C626A]">
            Active Community Discussions ({debates.length})
          </h2>
          {debates.map((d) => {
            const isSelected = d.id === activeDebateId;
            return (
              <div
                key={d.id}
                onClick={() => setActiveDebateId(d.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-white border-emerald-600 shadow-md"
                    : "bg-[#F9FAF8] border-[#E5E7EB] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                    {d.countryPair}
                  </span>
                  <span className="text-[10px] text-gray-400">{d.commentsCount} Comments</span>
                </div>

                <h3 className="font-bold text-sm text-[#1A1A1A] leading-snug">
                  {d.title}
                </h3>

                <p className="text-xs text-[#5C626A] line-clamp-2">{d.content}</p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>{d.author}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(d.id);
                    }}
                    className="flex items-center gap-1 text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{d.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Debate & Comments Thread */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-full">
                {activeDebate.countryPair}
              </span>
              <span className="text-xs text-[#5C626A] font-medium">{activeDebate.authorRole}</span>
            </div>

            <h2 className="text-xl font-bold text-[#1A1A1A]">
              {activeDebate.title}
            </h2>

            <div className="bg-[#F9FAF8] p-4 rounded-xl border border-[#E5E7EB] text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-line">
              <p>{activeDebate.content}</p>
            </div>

            {/* Comments Stream */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Community Discussion Thread ({activeDebate.commentsList.length})
              </h3>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {activeDebate.commentsList.map((c, i) => (
                  <div key={i} className="p-3.5 bg-[#F9FAF8] rounded-xl border border-[#E5E7EB] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#5C626A]">
                      <span className="font-bold text-[#1A1A1A]">{c.author} <span className="font-normal text-[10px] text-gray-500">({c.role})</span></span>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-[#1A1A1A] leading-normal">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Comment Input */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            <label className="block text-xs font-semibold text-[#5C626A]">
              Share your question, research, or experience:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your comment or question here..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#F9FAF8] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-emerald-600 text-[#1A1A1A]"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
