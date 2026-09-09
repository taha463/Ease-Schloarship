import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { country = "Germany" } = await req.json();
    const currentYear = new Date().getFullYear();

    // 1. Broad, natural web query - searches the entire web without restricting to rigid site: filters
    const primaryQuery = `${country} international student visa proof of funds financial requirement blocked account post study work permit ${currentYear}`;

    let sources: any[] = [];
    try {
      sources = await searchWeb(primaryQuery, 6);
    } catch (err) {
      console.warn("Tavily search warning:", err);
    }

    // 2. Fallback secondary query if first query yielded minimal results
    if (!sources || sources.length === 0) {
      try {
        sources = await searchWeb(
          `${country} study visa living cost requirement rules for international students`,
          5,
        );
      } catch (err) {
        console.warn("Secondary search failed:", err);
      }
    }

    const searchContext = formatSearchContext(sources);
    const sourceUrls = sources
      .map((s: { url: string }) => s.url)
      .filter(Boolean);

    const prompt = `
You are an expert international student immigration specialist.
Target Destination: ${country}
Target Applicant: Master's degree student holding a Pakistani passport.

Web Research Snippets:
${searchContext}

INSTRUCTIONS:
1. Provide the exact, official statutory financial proof/blocked account/living fund figure (e.g., Finland: €800/month or €9,600/year; Germany: €11,904/year in Sperrkonto; Sweden: ~SEK 10,656/month; Canada: CAD $20,635 living cost GIC + tuition).
2. Detail the exact Post-Study Work Permit duration (e.g. 18 months for Germany, 2 years for Finland, 12 months for Sweden, up to 3 years for Canada/NZ).
3. State the permitted working hours (e.g. 30 hrs/week for Finland, 140 full/280 half days for Germany, 24-48 hrs per fortnight for Australia/Canada).
4. Provide realistic appointment wait time and procedures for Pakistani applicants applying at Islamabad, Lahore, or Karachi missions.
5. NEVER write "Not confirmed in latest sources" or return blank fields. If the web snippets lack a specific number, synthesize using official verified immigration statutory standards for ${country}.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Provide concrete, legally accurate immigration and financial requirement figures. Never output placeholder phrases like 'Not confirmed in latest sources'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            flagEmoji: { type: Type.STRING },
            visaType: { type: Type.STRING },
            financialProofRequired: {
              type: Type.STRING,
              description:
                "Exact monthly/yearly currency amount and approx PKR conversion",
            },
            blockedAccountDetails: {
              type: Type.STRING,
              description:
                "Specific provider (Expatrio/Fintiba/Coracle/GIC/Personal bank statement)",
            },
            postStudyWorkPermit: {
              type: Type.STRING,
              description: "Duration and conditions of job search/work visa",
            },
            partTimeWorkAllowance: {
              type: Type.STRING,
              description: "Hours allowed to work during semester and breaks",
            },
            prPathwayEase: {
              type: Type.STRING,
              enum: ["High", "Moderate", "Selective"],
            },
            embassyAppointmentPortal: { type: Type.STRING },
            pakistanWaitTime: {
              type: Type.STRING,
              description: "Embassy/VFS queue duration in Pakistan",
            },
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

    // Ensure source URLs fallback to Tavily's links if model omits them
    if (!data.sourceUrls || data.sourceUrls.length === 0) {
      data.sourceUrls = sourceUrls;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Visa Checker Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve visa data",
      },
      { status: 500 },
    );
  }
}
