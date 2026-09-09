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

export const countryComparisonData: CountryComparisonMetric[] = [
  {
    country: "Germany",
    flag: "🇩🇪",
    avgTuitionFeeUsdYear: 500, // Mostly tuition-free at public universities (€150-350 semester fee)
    avgLivingCostUsdYear: 12800, // ~€11,904 blocked account
    tuitionWaiverAvailabilityScore: 98,
    postStudyWorkPermitMonths: 18,
    prPathwayScore: 92,
    aiTechJobMarketScore: 95,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Munich", "Berlin", "Aachen", "Karlsruhe", "Stuttgart"]
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    avgTuitionFeeUsdYear: 14500, // SEK 140k/yr, fully covered by SI or University Scholarship
    avgLivingCostUsdYear: 11800,
    tuitionWaiverAvailabilityScore: 90,
    postStudyWorkPermitMonths: 12,
    prPathwayScore: 88,
    aiTechJobMarketScore: 91,
    partTimeWorkHoursWeek: 25,
    keyTechHubs: ["Stockholm", "Gothenburg", "Lund/Malmö"]
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    avgTuitionFeeUsdYear: 12000, // 100% tuition waiver via Finland Fellowship/Aalto/Oulu
    avgLivingCostUsdYear: 8000, // ~€6,720/yr
    tuitionWaiverAvailabilityScore: 95,
    postStudyWorkPermitMonths: 24,
    prPathwayScore: 94,
    aiTechJobMarketScore: 88,
    partTimeWorkHoursWeek: 30,
    keyTechHubs: ["Helsinki/Espoo (Aalto)", "Oulu", "Tampere"]
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    avgTuitionFeeUsdYear: 1000, // €150 - €3000 max, 0€ with DSU regional grant
    avgLivingCostUsdYear: 8500,
    tuitionWaiverAvailabilityScore: 96,
    postStudyWorkPermitMonths: 12,
    prPathwayScore: 78,
    aiTechJobMarketScore: 82,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Milan (PoliMi)", "Turin", "Bologna", "Rome"]
  },
  {
    country: "Ireland",
    flag: "🇮🇪",
    avgTuitionFeeUsdYear: 16000, // GOI-IES covers full tuition
    avgLivingCostUsdYear: 12500,
    tuitionWaiverAvailabilityScore: 82,
    postStudyWorkPermitMonths: 24,
    prPathwayScore: 90,
    aiTechJobMarketScore: 96,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Dublin", "Cork", "Galway"]
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    avgTuitionFeeUsdYear: 26000, // Covered 100% by RTP / Melbourne / ANU Research Grants
    avgLivingCostUsdYear: 18500,
    tuitionWaiverAvailabilityScore: 85,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 86,
    aiTechJobMarketScore: 92,
    partTimeWorkHoursWeek: 24,
    keyTechHubs: ["Melbourne", "Sydney", "Canberra", "Brisbane"]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    avgTuitionFeeUsdYear: 18000, // Waived / offset by GRA & TA stipends at UBC, Waterloo, McMaster
    avgLivingCostUsdYear: 15000,
    tuitionWaiverAvailabilityScore: 84,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 89,
    aiTechJobMarketScore: 94,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Toronto/Waterloo", "Vancouver", "Montreal (MILA)"]
  },
  {
    country: "New Zealand",
    flag: "🇳🇿",
    avgTuitionFeeUsdYear: 20000, // Manaaki NZ covers 100%
    avgLivingCostUsdYear: 14000,
    tuitionWaiverAvailabilityScore: 88,
    postStudyWorkPermitMonths: 36,
    prPathwayScore: 87,
    aiTechJobMarketScore: 80,
    partTimeWorkHoursWeek: 20,
    keyTechHubs: ["Auckland", "Wellington", "Christchurch"]
  }
];
