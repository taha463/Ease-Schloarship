export interface CandidateProfile {
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
  // Optional convenience aliases for UI components
  targetCountries?: string[];
  researchInterests?: string;
}

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
    minFundingNeeded: "Full Tuition Waiver or Fully Funded",
  },
};

export const defaultCandidate: CandidateProfile = {
  name: "Muhammad Taha",
  degree: "B.Sc. Software Engineering",
  university: "HITEC University, Taxila",
  gradDate: "Sep 2022 – Jul 2026",
  cgpa: 3.23,
  maxCgpa: 4.0,
  location: "Gujranwala, Pakistan",
  phone: "+92 306 8074624",
  email: "muhammadtaha0154@gmail.com",
  github: "github.com/taha463",
  linkedin: "linkedin.com/in/muhammadtaha02",
  summary:
    "Software Engineering graduate specializing in AI-powered systems, LLMs, Multi-Agent Architectures, and Full-Stack Engineering. Experienced in building production RAG pipelines, evidence-grounded reasoning frameworks, and hydrological forecasting platforms.",
  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "SQL"],
    aiMl: [
      "PyTorch",
      "Hugging Face",
      "Transformers",
      "RAG",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "Unsloth",
      "Groq API",
    ],
    backend: [
      "FastAPI",
      "Firebase",
      "Redis",
      "Celery",
      "Docker",
      "Supabase",
      "Git",
    ],
    frontend: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Figma",
      "UX Research",
      "Wireframing",
    ],
  },
  experience: [
    {
      role: "AI Web Dev Intern",
      company: "Nexium",
      period: "Jul – Aug 2025",
      highlights: [
        "Collaborated in a 3-member Agile team to build a full-stack AI travel planning app with React, Node.js, and MongoDB.",
        "Built AI recommendation module by integrating Groq, OpenRouter, Tavily Search, and 3 external APIs for weather and dining.",
        "Developed a RAG-based visa verification workflow retrieving country-specific travel info to validate visa eligibility.",
      ],
    },
    {
      role: "Frontend Web Development Intern",
      company: "Elevvo Pathways",
      period: "May – Jun 2025",
      highlights: [
        "Developed responsive restaurant website using React, Next.js, and Tailwind CSS.",
        "Translated high-fidelity Figma designs into reusable UI components maintaining design system consistency.",
      ],
    },
  ],
  projects: [
    {
      name: "Aegis — AI Flood Prediction & Disaster Platform",
      tech: [
        "Python",
        "FastAPI",
        "React",
        "Firebase",
        "Groq API",
        "GEOGloWS V2",
        "NASA POWER",
      ],
      description:
        "End-to-end AI-powered disaster management platform integrating NASA POWER, GEOGloWS V2, and IRSA hydrological data.",
      highlights: [
        "Built real-time flood forecasting pipeline & automated evacuation mapping (8km danger zones, 25km safe zones).",
        "Developed bilingual LLM-powered emergency chatbot for real-time disaster guidance.",
      ],
    },
    {
      name: "FEHM.AI — Multi-Agent AI Learning Platform",
      tech: ["Python", "Redis", "Celery", "Multi-Agent Systems", "LLMs"],
      description:
        "AI tutoring platform with collaborative multi-agent workflow (Supervisor, Teacher, Critic, Librarian).",
      highlights: [
        "Adaptive Socratic teaching engine using Redis and Celery for async multi-agent coordination.",
        "Improves student conceptual retention through multi-turn evidence validation.",
      ],
    },
    {
      name: "Mizan — AI Legal Reasoning Framework",
      tech: [
        "Python",
        "PyTorch",
        "Transformers",
        "LLM Inference",
        "Causal Cross-Attention",
      ],
      description:
        "Evidence-grounded AI legal reasoning framework reducing hallucinated legal conclusions.",
      highlights: [
        "Designed evidence-verification pipeline using causal cross-attention gating mechanism against source statutes.",
        "Enforces strict citation grounding before outputting legal advice.",
      ],
    },
  ],
  certifications: [
    "Google UX Design Professional Certificate | Coursera (Aug 2025)",
  ],
  targetPreferences: {
    degreeGoal: "Master of Science (MS / M.Sc.)",
    fieldOfStudy: [
      "Artificial Intelligence",
      "Computer Science",
      "Software Engineering",
      "Data Science / Machine Learning",
    ],
    includedRegions: [
      "Germany",
      "Sweden",
      "Finland",
      "Netherlands",
      "France",
      "Italy",
      "Ireland",
      "Austria",
      "Poland",
      "Belgium",
      "Australia",
      "New Zealand",
      "Canada",
      "Japan",
    ],
    excludedRegions: [
      "USA",
      "UK",
      "Gulf Countries (UAE, KSA, Qatar, Oman, Kuwait, Bahrain)",
      "China",
      "South Asian Countries (except Pakistan origin)",
    ],
    minFundingNeeded: "Full Tuition Waiver or Fully Funded (Stipend + Tuition)",
  },
};
