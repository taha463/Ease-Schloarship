import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { searchWeb, formatSearchContext } from "@/lib/tavily";

// Regulatory statutory baselines by country (fallback benchmarks)
const STATUTORY_BASELINES: Record<
  string,
  {
    maintenance: string;
    depositType: string;
    postStudy: string;
    workHours: string;
    portal: string;
    searchQuery: string;
  }
> = {
  Finland: {
    maintenance:
      "€800 / month (€9,600 / year in student's personal bank account)",
    depositType:
      "Personal bank account statement under applicant's sole name (deposit must be available for withdrawal, no blocked account required).",
    postStudy:
      "2 Years Post-Study Work Residence Permit (can be split over 5 years).",
    workHours:
      "30 hours / week average during term time; unlimited during holiday periods.",
    portal:
      "Enter Finland Online Service + VFS Global (Islamabad / regional hub)",
    searchQuery:
      "Finland student residence permit income requirement 800 euros per month 9600 migri",
  },
  Germany: {
    maintenance:
      "€11,904 / year (€992 / month in a German Blocked Account / Sperrkonto)",
    depositType:
      "Mandatory Blocked Account (Sperrkonto) via Expatrio, Coracle, or Fintiba.",
    postStudy:
      "18-month Job Seeker Visa (Aufenthaltserlaubnis zur Arbeitsplatzsuche). PR possible after 21-27 months under EU Blue Card.",
    workHours:
      "140 full days or 280 half days per calendar year (approx. 20 hours/week during semester).",
    portal:
      "German Embassy Islamabad / Consulate Karachi (RK-Termin / CSP portal)",
    searchQuery:
      "Germany student visa blocked account Sperrkonto 11904 992 euros",
  },
  Sweden: {
    maintenance: "SEK 10,656 / month (SEK 106,560 for 10-month academic year)",
    depositType:
      "Personal bank account statement solely in the student's name showing required SEK balance.",
    postStudy:
      "12-month Residence Permit to seek employment or explore business opportunities.",
    workHours:
      "A maximum of 15 hours per week during semesters (unrestricted in June, July, August).",
    portal: "Migrationsverket Online Portal + Embassy of Sweden Islamabad",
    searchQuery:
      "Sweden residence permit higher education maintenance requirement SEK Migrationsverket",
  },
  Canada: {
    maintenance: "CAD $20,635 / year (GIC requirement) + 1st Year Tuition Fee",
    depositType:
      "Guaranteed Investment Certificate (GIC) from an approved Canadian financial institution (Scotiabank, CIBC, ICICI).",
    postStudy: "Post-Graduation Work Permit (PGWP) up to 3 years.",
    workHours:
      "24 hours / week off-campus during academic terms; full-time during official scheduled breaks.",
    portal:
      "IRCC Portal / GCKey + VFS Global VAC (Islamabad / Lahore / Karachi)",
    searchQuery:
      "Canada study permit financial support GIC living expenses 20635",
  },
  Australia: {
    maintenance: "AUD $29,710 / year living costs + 1st Year Tuition + OSHC",
    depositType:
      "Bank statement held for 3 months or approved financial institution student education loan.",
    postStudy:
      "Temporary Graduate Visa (Subclass 485): 2 to 3 years for Master's graduates.",
    workHours:
      "48 hours per fortnight during semester; unrestricted during breaks.",
    portal: "ImmiAccount (Department of Home Affairs) + VFS Global Biometrics",
    searchQuery:
      "Australia student visa subclass 500 financial capacity living cost 29710",
  },
  "New Zealand": {
    maintenance: "NZD $20,000 / year + tuition fee receipt",
    depositType:
      "Funds Transfer Scheme (FTS) via ANZ Bank or verified bank statement held for 6 months.",
    postStudy:
      "Post-Study Work Visa (PSWV) for 3 years following a Master's degree.",
    workHours: "20 hours / week during semester; full-time during vacations.",
    portal: "Immigration New Zealand (INZ) Online",
    searchQuery:
      "New Zealand student visa living funds NZD 20000 post study work",
  },
  Ireland: {
    maintenance: "€10,000 / year living costs + proof of course fee payment",
    depositType:
      "Education Bond or verifiable bank statement showing 6-month transaction history.",
    postStudy:
      "Third Level Graduate Scheme (Stamp 1G) for 24 months (2 years).",
    workHours:
      "20 hours / week during semester; 40 hours / week during scheduled holidays.",
    portal: "AVATS Online Visa Application + VFS Global Ireland",
    searchQuery:
      "Ireland student visa financial proof living costs Stamp 1G 10000 euros",
  },
  Netherlands: {
    maintenance: "€1,250 / month (approx. €15,000 / year)",
    depositType:
      "Direct institutional bank transfer to university escrow or approved bank statement.",
    postStudy:
      "Orientation Year (Zoekjaar) visa for 1 year for highly educated graduates.",
    workHours:
      "16 hours / week during semester, or full-time during June, July, and August (work permit required).",
    portal: "IND (Immigration and Naturalisation Service) via Host University",
    searchQuery:
      "Netherlands IND student residence permit study income requirement 2026",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { country = "Germany" } = await req.json();
    const baseline =
      STATUTORY_BASELINES[country] || STATUTORY_BASELINES["Germany"];

    // 1. Run live Tavily search
    let searchContext = "";
    let sourceUrls: string[] = [];

    try {
      const sources = await searchWeb(baseline.searchQuery, 4);
      if (sources && sources.length > 0) {
        searchContext = formatSearchContext(sources);
        sourceUrls = sources.map((s: { url: string }) => s.url).filter(Boolean);
      }
    } catch (searchError) {
      console.warn("Tavily search bypass:", searchError);
    }

    // 2. Synthesize using official statutory baseline + live search snippets
    const ai = getGeminiClient();
    const prompt = `
You are a senior immigration intelligence officer.
Target Destination: ${country}
Target Applicant: Pakistani citizen applying for a Master's (MS/M.Sc.) degree.

Official Statutory Baseline:
- Maintenance / Proof of Funds: ${baseline.maintenance}
- Deposit Protocol: ${baseline.depositType}
- Post-Study Work: ${baseline.postStudy}
- Part-Time Rights: ${baseline.workHours}
- Official Portal: ${baseline.portal}

Live Web Search Context:
${searchContext || "No live snippets retrieved. Use the official statutory baseline above."}

INSTRUCTIONS:
1. Return concrete, accurate figures and policies.
2. Under NO circumstances output phrases like "Not confirmed in latest sources", "Not confirmed", or empty placeholders.
3. If live search results confirm changes, use them; otherwise, apply the statutory baseline values provided above.
4. Detail appointment conditions for Pakistani applicants (Islamabad/Karachi missions, VFS, or embassy queues).
5. Outline a step-by-step checklist and actionable refusal-prevention warnings tailored to Pakistani applicants.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an immigration authority. Provide concrete figures and details. Never return placeholder phrases like 'Not confirmed in latest sources'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            flagEmoji: { type: Type.STRING },
            visaType: { type: Type.STRING },
            financialProofRequired: { type: Type.STRING },
            blockedAccountDetails: { type: Type.STRING },
            postStudyWorkPermit: { type: Type.STRING },
            partTimeWorkAllowance: { type: Type.STRING },
            prPathwayEase: {
              type: Type.STRING,
              enum: ["High", "Moderate", "Selective"],
            },
            embassyAppointmentPortal: { type: Type.STRING },
            pakistanWaitTime: { type: Type.STRING },
            keyStepsPakistani: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            importantWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sourceUrls: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            lastUpdated: { type: Type.STRING },
          },
          required: [
            "country",
            "flagEmoji",
            "visaType",
            "financialProofRequired",
            "blockedAccountDetails",
            "postStudyWorkPermit",
            "partTimeWorkAllowance",
            "prPathwayEase",
            "embassyAppointmentPortal",
            "pakistanWaitTime",
            "keyStepsPakistani",
            "importantWarnings",
            "sourceUrls",
            "lastUpdated",
          ],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    // Fallback source URLs if the model omitted them
    if (!data.sourceUrls || data.sourceUrls.length === 0) {
      data.sourceUrls =
        sourceUrls.length > 0
          ? sourceUrls
          : ["https://migri.fi", "https://make-it-in-germany.com"];
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Visa Checker Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process visa intelligence",
      },
      { status: 500 },
    );
  }
}
