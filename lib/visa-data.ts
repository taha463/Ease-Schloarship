export interface CountryVisaInfo {
  country: string;
  flagEmoji: string;
  visaType: string;
  financialProofRequired: string;
  blockedAccountDetails?: string;
  postStudyWorkPermit: string;
  partTimeWorkAllowance: string;
  prPathwayEase: "High" | "Moderate" | "Selective";
  embassyAppointmentPortal: string;
  pakistanWaitTime: string;
  keyStepsPakistani: string[];
  visaSuccessRatePakistan?: string;
  importantWarnings: string[];
  sourceUrls: string[];
  lastUpdated: string;
}

export const SUPPORTED_COUNTRIES = [
  { name: "Germany", flag: "🇩🇪" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Netherlands", flag: "🇳🇱" },
];
