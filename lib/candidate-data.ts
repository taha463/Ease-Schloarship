export interface CandidateProfile {
  id?: string;
  name: string;
  degree: string;
  university: string;
  gradDate: string;
  cgpa: number;
  maxCgpa: number;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: {
    languages: string[];
    aiMl: string[];
    backend: string[];
    frontend: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    tech: string[];
    description: string;
    highlights: string[];
  }>;
  certifications: string[];
  targetPreferences: {
    degreeGoal: string;
    fieldOfStudy: string[];
    includedRegions: string[];
    excludedRegions: string[];
    minFundingNeeded: string;
  };
  targetCountries?: string[];
  researchInterests?: string;
}

// Clean initial state for new users (Zero hardcoded personal data)
export const emptyCandidate: CandidateProfile = {
  name: "",
  degree: "",
  university: "",
  gradDate: "",
  cgpa: 0.0,
  maxCgpa: 4.0,
  location: "",
  phone: "",
  email: "",
  github: "",
  linkedin: "",
  summary: "",
  skills: { languages: [], aiMl: [], backend: [], frontend: [] },
  experience: [],
  projects: [],
  certifications: [],
  targetPreferences: {
    degreeGoal: "Master of Science (MS / M.Sc.)",
    fieldOfStudy: [],
    includedRegions: [],
    excludedRegions: [],
    minFundingNeeded: "Fully Funded or Tuition Waiver",
  },
};
