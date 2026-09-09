import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

const OFFICIAL_DOMAINS: Record<string, string> = {
  Germany:
    "site:make-it-in-germany.com OR site:pakistan.diplo.de OR site:auswaertiges-amt.de",
  Finland: "site:migri.fi OR site:finlandabroad.fi",
  Sweden: "site:migrationsverket.se OR site:swedenabroad.se",
  Canada: "site:canada.ca",
  Australia: "site:immi.homeaffairs.gov.au",
  "New Zealand": "site:immigration.govt.nz",
  Ireland: "site:irishimmigration.ie OR site:dfa.ie",
  Netherlands: "site:ind.nl",
};

export async function POST(req: NextRequest) {
  try {
    const { country = "Germany" } = await req.json();

    const domainFilter = OFFICIAL_DOMAINS[country] || "";
    const currentYear = new Date().getFullYear();

    // Query Tavily for up-to-date official student visa policies
    const query =
      `${domainFilter} "${country}" student visa international students living expenses financial requirements appointment wait time Pakistan ${currentYear}`.trim();
    const sources = await searchWeb(query, 6);

    const prompt = `
You are an immigration specialist. Based ONLY on the real-time search context below, extract the current official immigration criteria for an international Master's applicant from Pakistan going to ${country}.

Search Context:
${formatSearchContext(sources)}

Return accurate, real-world data directly from the sources. If any detail is not mentioned, state "Not confirmed in latest sources" rather than using obsolete data.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Extract factual immigration policies without hallucinating old or outdated amounts.",
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
