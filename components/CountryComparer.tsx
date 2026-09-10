"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Globe,
  RefreshCw,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CountryComparisonMetric,
  fallbackCountryComparisonData,
  fetchLiveCountryComparisons,
} from "@/lib/comparison-data";
import { useProfile } from "@/app/context/ProfileContext";

export default function CountryComparer() {
  const { profile } = useProfile();
  const [activeMetric, setActiveMetric] = useState<
    "tuitionVsLiving" | "postStudyAndPr" | "jobMarket"
  >("tuitionVsLiving");
  const [metricsData, setMetricsData] = useState<CountryComparisonMetric[]>(
    fallbackCountryComparisonData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("fallback");

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      // Prioritize target regions selected in candidate's profile
      const userCountries = profile.targetPreferences?.includedRegions?.length
        ? profile.targetPreferences.includedRegions
        : undefined;

      const data = await fetchLiveCountryComparisons(userCountries);
      if (data && data.length > 0) {
        setMetricsData(data);
        setDataSource(data[0].dataStatus || "live");
      }
    } catch (e) {
      console.error("Failed to fetch live comparison data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile.targetPreferences?.includedRegions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-[#2D5A43]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Side-by-Side Country Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1E21] tracking-tight">
            Destination Comparison & Career Forecast
          </h1>
          <p className="text-xs sm:text-sm text-[#5C626A] mt-1 max-w-2xl leading-relaxed">
            Live evaluation of tuition, living expenses, settlement pathways,
            and tech demand powered by web search and verified immigration
            databases.
          </p>
          <button
            onClick={() => loadData(true)}
            disabled={isLoading}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[#EBF2EE] text-[#2D5A43] hover:bg-[#D5E6DC] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-[#2D5A43] border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>
              {isLoading
                ? "Fetching Live Internet Data..."
                : "Sync Live Country Data"}
            </span>
          </button>
        </div>

        {/* Graph Metric Switcher */}
        <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#E5E7EB] text-xs font-medium self-start md:self-center">
          <button
            onClick={() => setActiveMetric("tuitionVsLiving")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === "tuitionVsLiving"
                ? "bg-[#2D5A43] text-white shadow-xs font-semibold"
                : "text-[#5C626A] hover:text-[#1C1E21]"
            }`}
          >
            Cost & Tuition
          </button>
          <button
            onClick={() => setActiveMetric("postStudyAndPr")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === "postStudyAndPr"
                ? "bg-[#2D5A43] text-white shadow-xs font-semibold"
                : "text-[#5C626A] hover:text-[#1C1E21]"
            }`}
          >
            Work Permit & PR
          </button>
          <button
            onClick={() => setActiveMetric("jobMarket")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === "jobMarket"
                ? "bg-[#2D5A43] text-white shadow-xs font-semibold"
                : "text-[#5C626A] hover:text-[#1C1E21]"
            }`}
          >
            AI Job Market
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="flex items-center justify-between gap-3 text-xs text-[#5C626A] px-1">
        <span className="inline-flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${dataSource === "live" ? "bg-emerald-600 animate-pulse" : "bg-amber-600"}`}
          />
          {dataSource === "live"
            ? `Verified Live Source · updated ${metricsData[0]?.lastUpdated || "today"}`
            : "Offline Reference Snapshot · click Sync to update via live search"}
        </span>
        <span className="text-gray-400 hidden sm:inline">
          Metrics calibrated for Master&apos;s applicants
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1C1E21]">
          {activeMetric === "tuitionVsLiving" &&
            "Average Annual Tuition vs. Living Cost (USD)"}
          {activeMetric === "postStudyAndPr" &&
            "Post-Study Work Permit Duration (Months) & PR Score (0-100)"}
          {activeMetric === "jobMarket" &&
            "AI & Software Engineering Job Market Index (0-100)"}
        </h2>

        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === "tuitionVsLiving" ? (
              <BarChart
                data={metricsData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1E21",
                    color: "#FFF",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="avgTuitionFeeUsdYear"
                  name="Avg Tuition / Year ($)"
                  fill="#C86248"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgLivingCostUsdYear"
                  name="Living Cost / Year ($)"
                  fill="#2D5A43"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : activeMetric === "postStudyAndPr" ? (
              <BarChart
                data={metricsData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1E21",
                    color: "#FFF",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="postStudyWorkPermitMonths"
                  name="Work Permit (Months)"
                  fill="#1E3A8A"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="prPathwayScore"
                  name="PR Pathway Score (100 Max)"
                  fill="#2D5A43"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <BarChart
                data={metricsData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="country" stroke="#5C626A" fontSize={11} />
                <YAxis stroke="#5C626A" fontSize={11} max={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1E21",
                    color: "#FFF",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="aiTechJobMarketScore"
                  name="AI/Software Market Index"
                  fill="#2D5A43"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="tuitionWaiverAvailabilityScore"
                  name="Scholarship Availability Index"
                  fill="#D97706"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Detailed Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <span className="font-bold text-base text-[#1C1E21] flex items-center gap-1.5">
                <span>{item.flag}</span>
                <span>{item.country}</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#EBF2EE] text-[#2D5A43] rounded-full">
                PR Score: {item.prPathwayScore}/100
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-[#5C626A]">
              <div>
                • Post-Study Work:{" "}
                <strong className="text-[#1C1E21]">
                  {item.postStudyWorkPermitMonths} Months
                </strong>
              </div>
              <div>
                • Part-Time Work:{" "}
                <strong className="text-[#1C1E21]">
                  {item.partTimeWorkHoursWeek} hrs/week
                </strong>
              </div>
              <div>
                • Tuition Waiver Score:{" "}
                <strong className="text-[#2D5A43]">
                  {item.tuitionWaiverAvailabilityScore}/100
                </strong>
              </div>
              <div>
                • Tech Hubs:{" "}
                <strong className="text-[#1C1E21]">
                  {item.keyTechHubs?.slice(0, 3).join(", ") ||
                    "Metropolitan hubs"}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
