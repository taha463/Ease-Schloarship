"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  BarChart2,
  DollarSign,
  Briefcase,
  Globe,
  Award,
  CheckCircle2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { countryComparisonData, CountryComparisonMetric } from "@/lib/comparison-data";

export default function CountryComparer() {
  const [activeMetric, setActiveMetric] = useState<"tuitionVsLiving" | "postStudyAndPr" | "jobMarket">(
    "tuitionVsLiving"
  );
  const [metricsData, setMetricsData] = useState<CountryComparisonMetric[]>(countryComparisonData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/country-metrics", { method: "POST" });
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        // preserve flags which might be lost by AI
        const enrichedData = result.data.map((d: any) => {
          const fallback = countryComparisonData.find(c => c.country.toLowerCase() === d.country.toLowerCase());
          return { ...d, flag: fallback ? fallback.flag : d.flag };
        });
        setMetricsData(enrichedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Side-by-Side Country Intelligence
            </span>
          </div>
          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Destination Comparison & Career Forecast
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Compares tuition fee waivers, monthly living costs, post-study work permits (18-36 months), PR pathway accessibility, and AI/Software tech hub density.
          </p>
          <button 
            onClick={fetchLiveData} 
            disabled={isLoading}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#EBF2EE] text-[#2D5A43] hover:bg-[#D5E6DC] transition-colors"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-[#2D5A43] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            {isLoading ? "Fetching Live Internet Data..." : "Fetch Live Real-Time Data"}
          </button>
        </div>

        {/* Graph Metric Switcher */}
        <div className="flex bg-[#FAF8F5] p-1 rounded-xl hairline-border text-xs font-medium">
          <button
            onClick={() => setActiveMetric("tuitionVsLiving")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "tuitionVsLiving" ? "bg-[#2D5A43] text-white shadow-xs font-semibold" : "text-[#5C626A]"
            }`}
          >
            Cost & Tuition
          </button>
          <button
            onClick={() => setActiveMetric("postStudyAndPr")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "postStudyAndPr" ? "bg-[#2D5A43] text-white shadow-xs font-semibold" : "text-[#5C626A]"
            }`}
          >
            Work Permit & PR
          </button>
          <button
            onClick={() => setActiveMetric("jobMarket")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "jobMarket" ? "bg-[#2D5A43] text-white shadow-xs font-semibold" : "text-[#5C626A]"
            }`}
          >
            AI Job Market
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="bg-white rounded-2xl p-6 hairline-border editorial-shadow space-y-4">
        <h2 className="font-serif-editorial text-lg font-bold text-[#1C1E21]">
          {activeMetric === "tuitionVsLiving" && "Average Annual Tuition vs. Living Cost (USD)"}
          {activeMetric === "postStudyAndPr" && "Post-Study Work Permit Duration (Months) & PR Score (0-100)"}
          {activeMetric === "jobMarket" && "AI & Software Engineering Job Market Index (0-100)"}
        </h2>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === "tuitionVsLiving" ? (
              <BarChart data={metricsData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1C1E21", color: "#FFF", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="avgTuitionFeeUsdYear" name="Avg Tuition / Year ($)" fill="#C86248" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgLivingCostUsdYear" name="Living Cost / Year ($)" fill="#2D5A43" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeMetric === "postStudyAndPr" ? (
              <BarChart data={metricsData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1C1E21", color: "#FFF", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="postStudyWorkPermitMonths" name="Work Permit (Months)" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prPathwayScore" name="PR Pathway Score (100 Max)" fill="#2D5A43" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={metricsData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D8" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} max={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1C1E21", color: "#FFF", borderRadius: "12px", border: "none", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="aiTechJobMarketScore" name="AI/Software Market Index" fill="#2D5A43" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tuitionWaiverAvailabilityScore" name="Scholarship Availability Index" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Detailed Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 hairline-border editorial-shadow space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
              <span className="font-serif-editorial font-bold text-lg text-[#1C1E21] flex items-center gap-1.5">
                <span>{item.flag}</span>
                <span>{item.country}</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full">
                PR Ease: {item.prPathwayScore}/100
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-[#5C626A]">
              <div>• Post-Study Work: <strong className="text-[#1C1E21]">{item.postStudyWorkPermitMonths} Months</strong></div>
              <div>• Part-Time Hours: <strong className="text-[#1C1E21]">{item.partTimeWorkHoursWeek} hrs/week</strong></div>
              <div>• Tuition Waiver Score: <strong className="text-[#2D5A43]">{item.tuitionWaiverAvailabilityScore}/100</strong></div>
              <div>• Key AI Tech Hubs: <strong className="text-[#1C1E21]">{item.keyTechHubs.slice(0, 3).join(", ")}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
