export interface CountryComparisonMetric {
  country: string;
  flag: string;
  avgTuitionFeeUsdYear: number;
  avgLivingCostUsdYear: number;
  tuitionWaiverAvailabilityScore: number; // 1-100
  postStudyWorkPermitMonths: number;
  prPathwayScore: number; // 1-100
  aiTechJobMarketScore: number; // 1-100
  partTimeWorkHoursWeek: number;
  keyTechHubs: string[];
  sourceUrls?: string[];
  lastUpdated?: string;
  dataStatus?: "live" | "fallback";
}

// Fallback baseline metrics used only when offline or prior to first AI search
export const fallbackCountryComparisonData: CountryComparisonMetric[] = [
  {
    country: "Germany",
    flag: "🇩🇪",
    avgTuitionFeeUsdYear: 500,
    avgLivingCostUsdYear: 12800,
    tuitionWaiverAvailabilityScore: 98,
    postStudyWorkPermitMonths: 18,
    prPathwayScore: 92,
    aiTechJobMarketScore: 95,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Munich", "Berlin", "Aachen", "Karlsruhe", "Stuttgart"],
    dataStatus: "fallback",
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    avgTuitionFeeUsdYear: 14500,
    avgLivingCostUsdYear: 11800,
    tuitionWaiverAvailabilityScore: 90,
    postStudyWorkPermitMonths: 12,
    prPathwayScore: 88,
    aiTechJobMarketScore: 91,
    partTimeWorkHoursWeek: 25,
    keyTechHubs: ["Stockholm", "Gothenburg", "Lund/Malmö"],
    dataStatus: "fallback",
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    avgTuitionFeeUsdYear: 12000,
    avgLivingCostUsdYear: 8000,
    tuitionWaiverAvailabilityScore: 95,
    postStudyWorkPermitMonths: 24,
    prPathwayScore: 94,
    aiTechJobMarketScore: 88,
    partTimeWorkHoursWeek: 30,
    keyTechHubs: ["Helsinki/Espoo", "Oulu", "Tampere"],
    dataStatus: "fallback",
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    avgTuitionFeeUsdYear: 1000,
    avgLivingCostUsdYear: 8500,
    tuitionWaiverAvailabilityScore: 96,
    postStudyWorkPermitMonths: 12,
    prPathwayScore: 78,
    aiTechJobMarketScore: 82,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Milan", "Turin", "Bologna", "Rome"],
    dataStatus: "fallback",
  },
  {
    country: "Ireland",
    flag: "🇮🇪",
    avgTuitionFeeUsdYear: 16000,
    avgLivingCostUsdYear: 12500,
    tuitionWaiverAvailabilityScore: 82,
    postStudyWorkPermitMonths: 24,
    prPathwayScore: 90,
    aiTechJobMarketScore: 96,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Dublin", "Cork", "Galway"],
    dataStatus: "fallback",
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    avgTuitionFeeUsdYear: 26000,
    avgLivingCostUsdYear: 18500,
    tuitionWaiverAvailabilityScore: 85,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 86,
    aiTechJobMarketScore: 92,
    partTimeWorkHoursWeek: 24,
    keyTechHubs: ["Melbourne", "Sydney", "Canberra", "Brisbane"],
    dataStatus: "fallback",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    avgTuitionFeeUsdYear: 18000,
    avgLivingCostUsdYear: 15000,
    tuitionWaiverAvailabilityScore: 84,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 89,
    aiTechJobMarketScore: 94,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Toronto/Waterloo", "Vancouver", "Montreal"],
    dataStatus: "fallback",
  },
  {
    country: "New Zealand",
    flag: "🇳🇿",
    avgTuitionFeeUsdYear: 20000,
    avgLivingCostUsdYear: 14000,
    tuitionWaiverAvailabilityScore: 88,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 87,
    aiTechJobMarketScore: 80,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Auckland", "Wellington", "Christchurch"],
    dataStatus: "fallback",
  },
];

// Backwards-compatibility export for existing components
export const countryComparisonData = fallbackCountryComparisonData;

// Dynamic AI fetcher connecting to /api/ai/compare-countries
export async function fetchLiveCountryComparisons(
  countries?: string[],
): Promise<CountryComparisonMetric[]> {
  try {
    const res = await fetch("/api/ai/compare-countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countries }),
    });

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {
    console.error("Failed to load live country data, using fallback:", err);
  }

  return fallbackCountryComparisonData;
}
