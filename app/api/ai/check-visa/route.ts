import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

// Country-specific official immigration authority domains
const OFFICIAL_DOMAINS: Record<string, string> = {
  Germany:
    "site:make-it-in-germany.com OR site:auswaertiges-amt.de OR site:pakistan.diplo.de",
  Finland: "site:migri.fi OR site:finlandabroad.fi OR site:studyinfinland.fi",
  Sweden:
    "site:migrationsverket.se OR site:studyinsweden.se OR site:swedenabroad.se",
  Netherlands:
    "site:ind.nl OR site:studyinnl.org OR site:netherlandsworldwide.nl",
  Canada: "site:canada.ca",
  Australia: "site:immi.homeaffairs.gov.au OR site:studyaustralia.gov.au",
  "New Zealand": "site:immigration.govt.nz OR site:studywithnewzealand.govt.nz",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country = "Germany" } = body;

    const ai = getGeminiClient();
    const year = new Date().getFullYear();
    const domainFilter = OFFICIAL_DOMAINS[country] || "";

    // Search specifically for latest living costs, bank balance/blocked account, and appointments
    const query =
      `${domainFilter} "${country}" student visa international students financial requirements living expenses blocked account Pakistan appointment ${year}`.trim();

    const sources = await searchWeb(query, 6);

    const prompt = `
You are an immigration specialist. Based ONLY on the real-time search context below, extract current immigration requirements for a Master's degree student from Pakistan going to ${country}.

Search Context:
${formatSearchContext(sources)}

Instructions:
1. Provide the exact financial proof / blocked account / bank statement figure in local currency and approx PKR.
2. Note appointment queue realities for Pakistani applicants (Islamabad/Karachi/Lahore missions) if present in context.
3. State post-study work rights duration and part-time hours.
4. If a field is not verified in the context, state "Not confirmed in recent sources" instead of guessing.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an immigration expert. Never invent or hallucinate amounts. Use exact figures reported by the provided search results.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            flag: { type: Type.STRING },
            financialProofRequired: { type: Type.STRING },
            blockedAccountProvider: { type: Type.STRING },
            appointmentWaitTimePakistan: { type: Type.STRING },
            postStudyWorkPermitMonths: { type: Type.NUMBER },
            prPathwayDetails: { type: Type.STRING },
            partTimeWorkRule: { type: Type.STRING },
            refusalPreventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            stepByStepChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            overallSuccessRating: { type: Type.STRING },
            sourceUrls: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            lastUpdated: { type: Type.STRING },
          },
          required: [
            "country",
            "financialProofRequired",
            "appointmentWaitTimePakistan",
            "postStudyWorkPermitMonths",
            "prPathwayDetails",
            "partTimeWorkRule",
            "refusalPreventionTips",
            "stepByStepChecklist",
            "overallSuccessRating",
            "sourceUrls",
            "lastUpdated",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("AI Visa Checker Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check visa policy",
      },
      { status: 500 },
    );
  }
}
