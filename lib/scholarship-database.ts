export interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  country: string;
  region: 'Europe' | 'Australia' | 'New Zealand' | 'Canada';
  fundingType: 'Fully Funded' | 'Full Tuition Waiver' | 'Partial Funding';
  matchRating: 'Strong Match' | 'Possible Match' | 'Not Eligible';
  matchScore: number; // e.g. 94
  matchReason: string;
  admissionSequence: 'University Admission First' | 'Integrated Application' | 'Direct Scholarship Portal' | 'University Nomination';
  openingDate: string; // e.g., '2026-08-01'
  deadline: string; // e.g., '2026-11-15'
  daysRemaining: number;
  stipendBenefits: string;
  academicRequirements: {
    minCgpa: number;
    ieltsMin: number;
    greRequired: boolean;
    ageLimit?: string;
    nationalityEligible: boolean;
  };
  requiredDocuments: string[];
  reminderScheduleDays: number[];
  professorContactNeeded: boolean;
  officialUrl: string;
  studyFields: string[];
}

export function refreshDeadlineCounters(items: ScholarshipItem[], now = new Date()): ScholarshipItem[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return items.map((item) => {
    const deadline = new Date(`${item.deadline}T00:00:00`).getTime();
    return {
      ...item,
      daysRemaining: Math.max(0, Math.ceil((deadline - today) / 86400000))
    };
  });
}

export const initialScholarships: ScholarshipItem[] = [
  {
    id: "daad-epos-germany",
    title: "DAAD EPOS / Postgraduate Courses for Developing Countries",
    provider: "German Academic Exchange Service (DAAD)",
    country: "Germany",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 94,
    matchReason: "Pakistan is on DAC list. CGPA 3.20 easily satisfies 2.5 German grade equivalent. Software Engineering background aligns with IT & Data tracks.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-08-01",
    deadline: "2026-10-15",
    daysRemaining: 78,
    stipendBenefits: "€934/month stipend + Full Tuition Waiver + Health Insurance + Travel Allowance (€1,050) + Family allowance",
    academicRequirements: {
      minCgpa: 2.8,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit (Degree within last 6 years)",
      nationalityEligible: true
    },
    requiredDocuments: [
      "DAAD Application Form signed",
      "Hand-signed CV (Europass format)",
      "Hand-signed Letter of Motivation (SOP)",
      "University Transcripts & Degree (HEC Attested)",
      "2 Academic/Professional Recommendation Letters",
      "IELTS Academic Certificate (6.5+)",
      "Proof of professional/internship experience"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    studyFields: ["Software Engineering", "Artificial Intelligence", "Computer Science", "Information Systems"]
  },
  {
    id: "si-scholarship-sweden",
    title: "Swedish Institute Scholarship for Global Professionals (SISGP)",
    provider: "Swedish Institute (SI)",
    country: "Sweden",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 91,
    matchReason: "Targeted at software engineers and leaders from Pakistan. CGPA 3.20 + proven leadership in flood disaster AI aligns with SI criteria.",
    admissionSequence: "University Admission First",
    openingDate: "2026-10-15",
    deadline: "2027-02-15",
    daysRemaining: 201,
    stipendBenefits: "Full Tuition Fee Waiver paid directly + SEK 12,000/month living allowance + SEK 15,000 travel grant + SI Network Membership",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "SI Curriculum Vitae (official template)",
      "SI Proof of Work & Leadership Experience form",
      "2 Reference Letters on SI official templates",
      "Copy of valid Pakistani Passport",
      "University Admissions Sweden application confirmation"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
    studyFields: ["AI and Machine Learning", "Software Engineering", "Cybersecurity", "Data Science"]
  },
  {
    id: "finland-fellowship-aalto",
    title: "Finland Fellowship & Aalto University 100% Tuition Waiver",
    provider: "Ministry of Education & Culture Finland / Aalto University",
    country: "Finland",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 89,
    matchReason: "Aalto Computer Science MS matches CGPA 3.20 threshold. Top 5% applicants receive additional €5,000 relocation bonus.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-12-01",
    deadline: "2027-01-15",
    daysRemaining: 170,
    stipendBenefits: "100% Tuition Waiver + €5,000 relocation grant + priority student housing in Espoo/Helsinki",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Online Studyinfo.fi application form",
      "Degree Certificate & Official Transcripts",
      "Statement of Purpose (SOP)",
      "IELTS / TOEFL certificate",
      "CV listing Software & AI projects"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.aalto.fi/en/study-at-aalto/scholarships-and-tuition-fees",
    studyFields: ["Computer Science", "Machine Learning, Data Science & AI", "Software Engineering"]
  },
  {
    id: "tu-delft-justus-louise",
    title: "TU Delft Justus & Louise van Effen Excellence Scholarship",
    provider: "TU Delft Excellence Trust Fund",
    country: "Netherlands",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 88,
    matchReason: "Covers full tuition for MSc Computer Science / Software Technology + €11,500/year living allowance.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-10-01",
    deadline: "2026-12-01",
    daysRemaining: 124,
    stipendBenefits: "Full tuition waiver (€19,600/yr) + €11,500/year living expenses + membership in Delft Scholars Club",
    academicRequirements: {
      minCgpa: 3.2,
      ieltsMin: 7.0,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "MSc Application to TU Delft",
      "Scholarship Essay (2 pages detailing research ambition)",
      "Curriculum Vitae",
      "2 Academic Reference Letters",
      "IELTS 7.0 (Min 6.5 per subscore)"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.tudelft.nl/en/education/practical-matters/scholarships/justus-louise-van-effen-excellence-scholarships",
    studyFields: ["Software Technology", "Computer Science", "Data Science & AI"]
  },
  {
    id: "vanier-canada-scholarship",
    title: "Vanier Canada Graduate Scholarships (CGS)",
    provider: "Government of Canada (NSERC)",
    country: "Canada",
    region: "Canada",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 87,
    matchReason: "CAD $50,000/year for top international computer science and software engineering applicants.",
    admissionSequence: "University Nomination",
    openingDate: "2026-07-01",
    deadline: "2026-11-01",
    daysRemaining: 94,
    stipendBenefits: "CAD $50,000 per year tax-free stipend + full university tuition waiver",
    academicRequirements: {
      minCgpa: 3.2,
      ieltsMin: 7.0,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Research Proposal (2 pages)",
      "Leadership Statement",
      "3 Referee Assessments",
      "Official University Transcripts",
      "University Nomination Form"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: true,
    officialUrl: "https://vanier.gc.ca/en/home-accueil.html",
    studyFields: ["Software Engineering", "Artificial Intelligence", "Computer Science"]
  },
  {
    id: "australia-rtp-grant",
    title: "Australian Government Research Training Program (RTP)",
    provider: "Department of Education Australia / ANU, Melbourne, Sydney",
    country: "Australia",
    region: "Australia",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 92,
    matchReason: "Tax-free stipend AUD $37,200/yr + 100% tuition waiver + Overseas Student Health Cover (OSHC).",
    admissionSequence: "Direct Scholarship Portal",
    openingDate: "2026-06-01",
    deadline: "2026-08-31",
    daysRemaining: 32,
    stipendBenefits: "AUD $37,200/year living stipend + Full Tuition Fee Offset + Health Cover + Relocation Allowance",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "RTP Application Form",
      "Research Proposal endorsed by prospective supervisor",
      "2 Referee Reports",
      "CV & Publications/Projects Portfolio"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: true,
    officialUrl: "https://www.education.gov.au/research-block-grants/research-training-program",
    studyFields: ["Artificial Intelligence", "Software Systems", "Robotics & Computer Vision"]
  },
  {
    id: "manaaki-new-zealand-scholarship",
    title: "Manaaki New Zealand Scholarships for International Students",
    provider: "New Zealand Ministry of Foreign Affairs and Trade (MFAT)",
    country: "New Zealand",
    region: "New Zealand",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 90,
    matchReason: "Pakistani citizens fully eligible for climate tech & software applications.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-02-01",
    deadline: "2026-02-28",
    daysRemaining: 213,
    stipendBenefits: "Full Tuition + NZD $531/week living allowance + NZD $3,000 establishment grant + Return economy airfare",
    academicRequirements: {
      minCgpa: 2.8,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "Must be 18 or older",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Manaaki NZ Online Application",
      "SOP focused on development impact in Pakistan",
      "HEC Attested Transcripts",
      "IELTS Certificate 6.5+"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.nzscholarships.govt.nz/",
    studyFields: ["Software Engineering", "Environmental Informatics & AI", "Data Analytics"]
  },
  {
    id: "sbw-berlin-scholarship",
    title: "SBW Berlin Scholarship for Young Professionals",
    provider: "SBW Berlin Non-Profit Foundation",
    country: "Germany",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 88,
    matchReason: "Fully funds international Master's students in Berlin with social commitment (like Aegis flood AI).",
    admissionSequence: "Direct Scholarship Portal",
    openingDate: "2026-05-15",
    deadline: "2026-12-31",
    daysRemaining: 154,
    stipendBenefits: "100% Tuition Waiver + Free Student Apartment in Berlin + €550/month pocket money",
    academicRequirements: {
      minCgpa: 2.8,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "Under 30 years old",
      nationalityEligible: true
    },
    requiredDocuments: [
      "SBW Application Form",
      "Letter of Motivation",
      "Proof of Social/Community Project (Aegis AI)",
      "University Offer Letter from Berlin/Potsdam university"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://sbw.berlin/en/sbw-berlin-scholarship/",
    studyFields: ["Computer Science", "Software Engineering", "AI for Social Good"]
  },
  {
    id: "kth-tuition-waiver-sweden",
    title: "KTH Scholarship (Royal Institute of Technology)",
    provider: "KTH Royal Institute of Technology Stockholm",
    country: "Sweden",
    region: "Europe",
    fundingType: "Full Tuition Waiver",
    matchRating: "Strong Match",
    matchScore: 89,
    matchReason: "Covers full tuition for MSc Computer Science and Software Engineering at KTH.",
    admissionSequence: "University Admission First",
    openingDate: "2026-10-15",
    deadline: "2027-01-15",
    daysRemaining: 170,
    stipendBenefits: "Full tuition waiver (SEK 320,000 total for 2-year program)",
    academicRequirements: {
      minCgpa: 3.1,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "KTH Scholarship Application",
      "Motivational essay focusing on academic achievements",
      "Transcripts & Degree"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.kth.se/en/studies/master/kth-scholarship-1.72827",
    studyFields: ["Software Engineering", "Machine Learning", "Cybersecurity"]
  },
  {
    id: "ontario-graduate-scholarship",
    title: "Ontario Graduate Scholarship (OGS)",
    provider: "Government of Ontario & Partner Universities (Toronto, Waterloo, McMaster)",
    country: "Canada",
    region: "Canada",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 86,
    matchReason: "CAD $15,000/year merit scholarship for Master's students in Ontario.",
    admissionSequence: "University Admission First",
    openingDate: "2026-10-01",
    deadline: "2027-01-31",
    daysRemaining: 185,
    stipendBenefits: "CAD $15,000 per year + matching institutional departmental teaching assistantships",
    academicRequirements: {
      minCgpa: 3.2,
      ieltsMin: 7.0,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "OGS Application via University Portal",
      "2 Academic Reference Letters",
      "Transcripts",
      "Statement of Interest"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://osap.gov.on.ca/OSAPPortal/en/A-ZListofScholarships/PRDR019245.html",
    studyFields: ["Computer Science", "Software Engineering", "Artificial Intelligence"]
  },
  {
    id: "melbourne-research-scholarship",
    title: "Melbourne Research Scholarship (MRS)",
    provider: "University of Melbourne",
    country: "Australia",
    region: "Australia",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 91,
    matchReason: "Full fee offset + AUD $34,500/year living allowance + relocation grant for international research students.",
    admissionSequence: "Direct Scholarship Portal",
    openingDate: "2026-06-01",
    deadline: "2026-10-31",
    daysRemaining: 94,
    stipendBenefits: "AUD $34,500 per year tax-free stipend + 100% Tuition Waiver + AUD $3,000 relocation grant",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Application for Admission & Scholarship",
      "CV & List of Publications/Software projects",
      "2 Academic Referees"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: true,
    officialUrl: "https://scholarships.unimelb.edu.au/awards/melbourne-research-scholarship",
    studyFields: ["Information Technology", "Computer Science", "Artificial Intelligence"]
  },
  {
    id: "chalmers-ipoet-sweden",
    title: "Chalmers IPOET Scholarship",
    provider: "Chalmers University of Technology Gothenburg",
    country: "Sweden",
    region: "Europe",
    fundingType: "Full Tuition Waiver",
    matchRating: "Strong Match",
    matchScore: 88,
    matchReason: "75% to 100% tuition waiver for international Master's applicants in Software Engineering.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-10-15",
    deadline: "2027-01-15",
    daysRemaining: 170,
    stipendBenefits: "75% - 100% Tuition Waiver reduction",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Scholarship Application via Chalmers Portal",
      "CV & SOP",
      "Transcripts"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.chalmers.se/en/education/application-and-admission/scholarships/ipoet-scholarships/",
    studyFields: ["Software Engineering", "Computer Systems", "Data Science"]
  },
  {
    id: "oulu-tuition-waiver-finland",
    title: "University of Oulu International Scholarship",
    provider: "University of Oulu",
    country: "Finland",
    region: "Europe",
    fundingType: "Full Tuition Waiver",
    matchRating: "Strong Match",
    matchScore: 89,
    matchReason: "100% tuition fee waiver for MS in Computer Science & Engineering.",
    admissionSequence: "Integrated Application",
    openingDate: "2027-01-04",
    deadline: "2027-01-18",
    daysRemaining: 173,
    stipendBenefits: "100% Tuition Waiver (€10,000/year)",
    academicRequirements: {
      minCgpa: 2.9,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Studyinfo.fi Application Form",
      "Degree Certificate",
      "Motivation Video/Text"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.oulu.fi/en/apply/scholarships",
    studyFields: ["Computer Science and Engineering", "Wireless Communications", "Software Systems"]
  },
  {
    id: "friedrich-ebert-germany",
    title: "Friedrich Ebert Stiftung (FES) Scholarship",
    provider: "Friedrich Ebert Foundation",
    country: "Germany",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 90,
    matchReason: "€934/month stipend + health insurance + family allowance for outstanding international students.",
    admissionSequence: "Direct Scholarship Portal",
    openingDate: "2026-06-01",
    deadline: "2026-11-30",
    daysRemaining: 123,
    stipendBenefits: "€934/month + Health insurance (€120/mo) + Books allowance (€300/yr)",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "FES Online Application",
      "2 Academic Recommendations",
      "Proof of German/English proficiency",
      "SOP focusing on civic engagement"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.fes.de/en/stiftung/international-scholarships",
    studyFields: ["Software Engineering", "AI", "Public Systems"]
  },
  {
    id: "heinrich-boll-germany",
    title: "Heinrich Böll Foundation Scholarship",
    provider: "Heinrich Böll Foundation",
    country: "Germany",
    region: "Europe",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 89,
    matchReason: "€934/month + living allowance for STEM international students exhibiting social responsibility.",
    admissionSequence: "Direct Scholarship Portal",
    openingDate: "2026-07-01",
    deadline: "2026-09-01",
    daysRemaining: 33,
    stipendBenefits: "€934/month stipend + tuition coverage + individual support workshops",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Online Application Form",
      "CV & Proof of civic engagement",
      "2 Recommendations"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.boell.de/en/scholarships",
    studyFields: ["AI & Data Science", "Software Engineering", "Renewable Energy Tech"]
  },
  {
    id: "alberta-graduate-excellence",
    title: "Alberta Graduate Excellence Scholarship (AGES)",
    provider: "Government of Alberta & University of Alberta / Calgary",
    country: "Canada",
    region: "Canada",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 87,
    matchReason: "CAD $12,000 to CAD $15,000 merit award for master's students in Alberta.",
    admissionSequence: "University Admission First",
    openingDate: "2026-09-01",
    deadline: "2026-12-15",
    daysRemaining: 138,
    stipendBenefits: "CAD $12,000 - $15,000 tax-free grant",
    academicRequirements: {
      minCgpa: 3.2,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Graduate Admission Application to UAlberta or UCalgary",
      "Departmental Nomination"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.ualberta.ca/graduate-studies/awards-and-funding/scholarships-and-awards/alberta-graduate-excellence-scholarship.html",
    studyFields: ["Computing Science", "Software Engineering", "AI"]
  },
  {
    id: "sydney-international-research",
    title: "Sydney International Research Scholarship (SIRS)",
    provider: "University of Sydney",
    country: "Australia",
    region: "Australia",
    fundingType: "Fully Funded",
    matchRating: "Strong Match",
    matchScore: 90,
    matchReason: "AUD $37,200/yr living stipend + 100% tuition coverage for international research candidates.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-06-01",
    deadline: "2026-09-15",
    daysRemaining: 47,
    stipendBenefits: "AUD $37,200/year living allowance + 100% Tuition Waiver + Overseas Health Cover",
    academicRequirements: {
      minCgpa: 3.1,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Research Supervisor Acceptance Letter",
      "Research Proposal",
      "Official Transcripts & CV"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: true,
    officialUrl: "https://www.sydney.edu.au/scholarships/e/university-of-sydney-international-research-scholarship.html",
    studyFields: ["Computer Science", "Machine Learning", "Software Engineering"]
  },
  {
    id: "deutschlandstipendium-tum",
    title: "Deutschlandstipendium at Technical University of Munich (TUM)",
    provider: "German Federal Government & Private Donors",
    country: "Germany",
    region: "Europe",
    fundingType: "Partial Funding",
    matchRating: "Strong Match",
    matchScore: 89,
    matchReason: "€300/month merit stipend on top of tuition-free education at TUM.",
    admissionSequence: "University Admission First",
    openingDate: "2026-06-15",
    deadline: "2026-07-31",
    daysRemaining: 1,
    stipendBenefits: "€300/month (€3,600/year) + tuition-free studies + network with German tech firms",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "TUM Enrolment/Offer Confirmation",
      "Motivational Essay",
      "CV"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.tum.de/en/studies/fees-and-financial/scholarships/deutschlandstipendium",
    studyFields: ["Software Engineering", "Informatics", "Data Engineering"]
  },
  {
    id: "tampere-fellowship-finland",
    title: "Tampere University Tuition Fee Scholarship",
    provider: "Tampere University",
    country: "Finland",
    region: "Europe",
    fundingType: "Full Tuition Waiver",
    matchRating: "Strong Match",
    matchScore: 88,
    matchReason: "100% tuition waiver for international Master's applicants in Computing Sciences.",
    admissionSequence: "Integrated Application",
    openingDate: "2026-12-01",
    deadline: "2027-01-13",
    daysRemaining: 168,
    stipendBenefits: "100% Tuition Waiver (€12,000/year)",
    academicRequirements: {
      minCgpa: 2.9,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "Studyinfo.fi Application",
      "Academic Transcripts",
      "Motivation Letter"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.tuni.fi/en/study-with-us/how-to-apply/scholarships",
    studyFields: ["Software, Web & Cloud", "Data Science", "Signal Processing & AI"]
  },
  {
    id: "holland-scholarship-nl",
    title: "NL Scholarship (Formerly Holland Scholarship)",
    provider: "Dutch Ministry of Education & Dutch Research Universities",
    country: "Netherlands",
    region: "Europe",
    fundingType: "Partial Funding",
    matchRating: "Strong Match",
    matchScore: 86,
    matchReason: "€5,000 grant awarded to non-EEA students in their first year of MSc.",
    admissionSequence: "University Admission First",
    openingDate: "2026-10-01",
    deadline: "2027-02-01",
    daysRemaining: 186,
    stipendBenefits: "€5,000 cash grant awarded in the first year of Master's study",
    academicRequirements: {
      minCgpa: 3.0,
      ieltsMin: 6.5,
      greRequired: false,
      ageLimit: "No age limit",
      nationalityEligible: true
    },
    requiredDocuments: [
      "University Offer Letter (TU Eindhoven, Twente, Delft, Leiden)",
      "Scholarship Motivation Essay"
    ],
    reminderScheduleDays: [60, 30, 14, 7, 3],
    professorContactNeeded: false,
    officialUrl: "https://www.studyinnl.org/finances/nl-scholarship",
    studyFields: ["Computer Science", "Software Technology", "Artificial Intelligence"]
  }
];
