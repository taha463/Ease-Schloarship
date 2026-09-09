export interface CountryVisaInfo {
  country: string;
  flagEmoji: string;
  visaType: string;
  financialProofRequired: string;
  blockedAccountDetails?: string;
  postStudyWorkPermit: string;
  partTimeWorkAllowance: string;
  prPathwayEase: 'High' | 'Moderate' | 'Selective';
  embassyAppointmentPortal: string;
  pakistanWaitTime: string;
  keyStepsPakistani: string[];
  visaSuccessRatePakistan: string;
  importantWarnings: string[];
  sourceUrls?: string[];
  lastUpdated?: string;
  dataStatus?: "live" | "fallback";
}

export const countryVisaDatabase: Record<string, CountryVisaInfo> = {
  "Germany": {
    country: "Germany",
    flagEmoji: "🇩🇪",
    visaType: "National Visa for Study (Category D)",
    financialProofRequired: "€11,904 / year in a German Blocked Account (Sperrkonto)",
    blockedAccountDetails: "Must open Blocked Account via Expatrio, Fintiba, or Coracle. Deposit €11,904 (€992/month release). Fee ~€89.",
    postStudyWorkPermit: "18 Months Job Seeker Visa (Aufenthaltserlaubnis zur Arbeitsplatzsuche). PR option after 21 months of Blue Card employment.",
    partTimeWorkAllowance: "140 full days or 280 half days per calendar year (approx. 20 hours/week during semester).",
    prPathwayEase: "High",
    embassyAppointmentPortal: "German Embassy Islamabad / Consulate General Karachi (CSP / RK-Termin portal & VFS Global)",
    pakistanWaitTime: "Cat-A (Masters with stipend/scholarship): 2-4 weeks wait time. Cat-B (Standard admission): 4-8 months wait list.",
    keyStepsPakistani: [
      "1. Get Admission / Scholarship confirmation letter.",
      "2. Get APS Certificate (Academic Evaluation Centre) or submit HEC attested degree.",
      "3. Open German Blocked Account (€11,904) and transfer funds from Pakistan via legal banking channels.",
      "4. Book Visa Appointment on German Embassy Portal under Master Category.",
      "5. Get Travel Health Insurance (Incoming Insurance + TK/AOK public insurance for matriculation).",
      "6. Attend Visa Interview at German Embassy Islamabad / Consulate Karachi."
    ],
    visaSuccessRatePakistan: "94% for Master's students with verified Blocked Account and HEC attested degrees.",
    importantWarnings: [
      "APS Certificate is mandatory for Pakistani applicants graduating after 2023.",
      "Do NOT use unauthorized money changers for blocked account deposits."
    ]
  },
  "Sweden": {
    country: "Sweden",
    flagEmoji: "🇸🇪",
    visaType: "Residence Permit for Higher Education Studies",
    financialProofRequired: "SEK 10,314 / month (approx. SEK 103,140 for 10 months / year)",
    blockedAccountDetails: "Bank statement in applicant's own name showing minimum SEK 103,140 for 1st year living cost + 1st tuition installment receipt.",
    postStudyWorkPermit: "12 Months Residence Permit to Seek Employment or Start a Business after graduation.",
    partTimeWorkAllowance: "No upper limit on hours during studies (though full-time study load of 30 ECTS/semester is mandatory).",
    prPathwayEase: "High",
    embassyAppointmentPortal: "Swedish Migration Agency (Migrationsverket) Online Application Portal + Embassy of Sweden Islamabad",
    pakistanWaitTime: "Digital processing takes 4-8 weeks after online submission and biometrics.",
    keyStepsPakistani: [
      "1. Receive University Admissions Sweden Notification of Results.",
      "2. Pay 1st tuition fee installment (waived if SI Scholar).",
      "3. Submit online application on Migrationsverket portal.",
      "4. Upload bank statement in candidate's name showing required SEK balance.",
      "5. Book Biometric Appointment at Embassy of Sweden Islamabad for Residence Permit Card (UT-kort)."
    ],
    visaSuccessRatePakistan: "91% for admitted master's candidates.",
    importantWarnings: [
      "Bank statement MUST be strictly in the student's personal bank account (not sponsor/parents) unless accompanied by affidavit."
    ]
  },
  "Finland": {
    country: "Finland",
    flagEmoji: "🇫🇮",
    visaType: "Continuous Residence Permit (Type A) for Studies",
    financialProofRequired: "€6,720 / year (€560 / month in personal account)",
    blockedAccountDetails: "Bank statement showing €6,720 in student's account + proof of tuition payment or 100% waiver certificate.",
    postStudyWorkPermit: "2 Years Post-Study Work Residence Permit (can be used in parts over 5 years). Fast-track to Permanent Residency in 4 years.",
    partTimeWorkAllowance: "30 hours / week average during term time.",
    prPathwayEase: "High",
    embassyAppointmentPortal: "Enter Finland Online Service + VFS Global Finland Center Islamabad",
    pakistanWaitTime: "Fast-track processing: 2-3 weeks for Master's students.",
    keyStepsPakistani: [
      "1. Accept study place in Studyinfo.fi portal.",
      "2. Fill Enter Finland digital application.",
      "3. Show €6,720 in personal bank account.",
      "4. Book VFS Global Islamabad appointment for identity verification & biometrics.",
      "5. Receive Finnish Residence Permit Card."
    ],
    visaSuccessRatePakistan: "96% (Finland offers one of the highest approval rates for international tech students).",
    importantWarnings: [
      "Students receive continuous Type A permit covering the full duration of 2-year Master's degree upfront!"
    ]
  },
  "Canada": {
    country: "Canada",
    flagEmoji: "🇨🇦",
    visaType: "Study Permit",
    financialProofRequired: "CAD $20,635 / year (GIC) + 1st Year Tuition Fee",
    blockedAccountDetails: "Guaranteed Investment Certificate (GIC) of CAD $20,635 with Scotiabank, CIBC, or SBI Canada + paid 1st year tuition receipt.",
    postStudyWorkPermit: "Post-Graduation Work Permit (PGWP) up to 3 Years (unrestricted open work permit). Express Entry / PNP Points boost for Canadian MS.",
    partTimeWorkAllowance: "20 hours / week off-campus during academic terms; full-time during official scheduled breaks.",
    prPathwayEase: "High",
    embassyAppointmentPortal: "IRCC Portal / GCKey + VFS Global Canada Visa Application Centre (VAC) Islamabad/Lahore/Karachi",
    pakistanWaitTime: "6-12 weeks under Non-SDS stream (or Student Direct Stream if SDS active).",
    keyStepsPakistani: [
      "1. Obtain DLI Unconditional Acceptance Letter from Canadian University.",
      "2. Purchase CAD $20,635 GIC from Canadian bank.",
      "3. Pay 1st year tuition fee.",
      "4. Submit IRCC Online Study Permit Application.",
      "5. Complete Upfront Medical Exam with Panel Physician in Pakistan.",
      "6. Complete Biometrics at VFS Global VAC."
    ],
    visaSuccessRatePakistan: "78% for Master's candidates with GIC + clear study intent.",
    importantWarnings: [
      "Strong Statement of Purpose (SOP/LOE) explaining tie to home country is critical for Canadian IRCC officers."
    ]
  },
  "Australia": {
    country: "Australia",
    flagEmoji: "🇦🇺",
    visaType: "Student Visa (Subclass 500)",
    financialProofRequired: "AUD $29,710 / year living cost + 1st Year Tuition + OSHC Health Cover",
    blockedAccountDetails: "Bank statement showing AUD $29,710 + 1yr tuition held for at least 3 months, or official government scholarship letter (RTP / Australia Awards).",
    postStudyWorkPermit: "Temporary Graduate Visa (Subclass 485) — 2 to 4 Years depending on qualification & regional campus incentives.",
    partTimeWorkAllowance: "48 hours per fortnight during study sessions; unlimited during study breaks.",
    prPathwayEase: "Moderate",
    embassyAppointmentPortal: "ImmiAccount (Department of Home Affairs) + VFS Global Australia Islamabad/Lahore/Karachi for Biometrics",
    pakistanWaitTime: "2-6 weeks for Higher Education sector.",
    keyStepsPakistani: [
      "1. Receive Electronic Confirmation of Enrolment (eCoE) from Australian University.",
      "2. Fulfill Genuine Student (GS) assessment criteria.",
      "3. Purchase Overseas Student Health Cover (OSHC).",
      "4. Submit Subclass 500 Visa on ImmiAccount portal.",
      "5. Complete Medical Assessment (eMedical) and Biometrics at VFS Global."
    ],
    visaSuccessRatePakistan: "85% for Master's degree applicants at Level 1 universities (Melbourne, ANU, Sydney).",
    importantWarnings: [
      "The Genuine Student (GS) requirement replaces the old GTE statement and focuses strictly on academic intent and career alignment."
    ]
  },
  "New Zealand": {
    country: "New Zealand",
    flagEmoji: "🇳🇿",
    visaType: "Fee Paying Student Visa",
    financialProofRequired: "NZD $20,000 / year living cost + Tuition Fee Receipt",
    blockedAccountDetails: "Bank statement showing NZD $20,000 or Manaaki NZ Scholarship guarantee letter.",
    postStudyWorkPermit: "Post-Study Work Visa (PSWV) for 3 Years after completing Master's degree.",
    partTimeWorkAllowance: "20 hours / week during study term; full-time during scheduled holidays.",
    prPathwayEase: "High",
    embassyAppointmentPortal: "Immigration New Zealand (INZ) Online Portal",
    pakistanWaitTime: "4-8 weeks.",
    keyStepsPakistani: [
      "1. Secure Offer of Place from New Zealand University.",
      "2. Show NZD $20,000 living funds or Manaaki award.",
      "3. Submit online application on INZ portal.",
      "4. Complete chest X-ray / medical examination if requested."
    ],
    visaSuccessRatePakistan: "88% for Master's degree students.",
    importantWarnings: [
      "Master's degree graduates in NZ enjoy open work rights for spouse/partner as well!"
    ]
  },
  "Ireland": {
    country: "Ireland",
    flagEmoji: "🇮🇪",
    visaType: "Degree Programme Student Visa (Stamp 2)",
    financialProofRequired: "€10,000 / year living cost + Tuition Fee Receipt",
    blockedAccountDetails: "Bank statement showing €10,000 or GOI-IES scholarship award letter.",
    postStudyWorkPermit: "Third Level Graduate Scheme (Stamp 1G) for 2 Years after MS graduation.",
    partTimeWorkAllowance: "20 hours / week during semester; 40 hours / week during June-September & Christmas holidays.",
    prPathwayEase: "High",
    embassyAppointmentPortal: "AVATS Online Visa Application + VFS Global Ireland Islamabad/Lahore",
    pakistanWaitTime: "4-6 weeks.",
    keyStepsPakistani: [
      "1. AVATS online application.",
      "2. Pay university fee deposit (€6,000+).",
      "3. Submit original educational documents & bank statement at VFS Global.",
      "4. Travel to Ireland and register for IRP (Irish Residence Permit)."
    ],
    visaSuccessRatePakistan: "89% for tech master's candidates.",
    importantWarnings: [
      "Ireland is a major tech hub with high demand for AI, Cloud & Software Engineers."
    ]
  }
};
