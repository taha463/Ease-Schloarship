import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function GET(req: NextRequest) {
  return handleCronScan();
}

export async function POST(req: NextRequest) {
  return handleCronScan();
}

async function handleCronScan() {
  const timestamp = new Date().toISOString();
  try {
    const ai = getGeminiClient();
    const sources = await searchWeb(
      "official scholarship deadlines 2026 2027 international master's students Germany Sweden Finland Netherlands Canada Australia New Zealand",
      10
    );

    const prompt = `
You are the Ease Scholarship automated intelligence crawler.
Scan recent 2026/2027 Master's scholarship deadlines and research openings for Software Engineers / CS graduates from Pakistan across:
- Germany (DAAD, Deutschlandstipendium, SBW Berlin)
- Sweden (SI Scholarship, KTH, Chalmers)
- Finland (Finland Fellowship, Aalto, Oulu)
- Netherlands (Holland Scholarship, TU Delft)
- Canada (Vanier, OGS, Alberta Excellence)
- Australia & NZ (RTP, Melbourne, Manaaki NZ)

Use the Tavily sources below. Return a brief JSON status update of the scan results. Do not claim a deadline was updated unless a source supports it.

Tavily sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an automated cron crawler reporting real-time database indexing updates.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scanTimestamp: { type: Type.STRING },
            scholarshipsCrawledCount: { type: Type.NUMBER },
            deadlinesUpdatedCount: { type: Type.NUMBER },
            status: { type: Type.STRING },
            recentPR: {
              type: Type.OBJECT,
              properties: {
                prNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                status: { type: Type.STRING }
              },
              required: ["prNumber", "title", "status"]
            },
            summary: { type: Type.STRING }
          },
          required: ["scanTimestamp", "scholarshipsCrawledCount", "deadlinesUpdatedCount", "status", "recentPR", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");

    return NextResponse.json({
      success: true,
      timestamp,
      cronExecuted: true,
      data: result
    });
  } catch (error: any) {
    console.error("Cron Scan Error:", error);
    return NextResponse.json({
      success: false,
      timestamp,
      cronExecuted: false,
      error: error instanceof Error ? error.message : "Scholarship scan failed."
    }, { status: 500 });
  }
}
