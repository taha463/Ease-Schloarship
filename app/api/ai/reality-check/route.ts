import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { university, scholarship, country, fieldOfStudy } = await req.json();

    const ai = getGeminiClient();
    
    const searchQuery = `current reality ${country} international student ${university} ${scholarship} PR "post study work visa" "job market" ${fieldOfStudy}`;
    const sources = await searchWeb(searchQuery, 10);

    const prompt = `
You are a brutal, completely honest, no-sugar-coating AI Mentor for international students.
The student is analyzing a potential path:
- University: ${university}
- Scholarship: ${scholarship}
- Country: ${country}
- Field: ${fieldOfStudy}

Using ONLY facts from the provided internet sources, give a "Reality Check". Do not invent rankings, comments, salaries, deadlines, or policy details. Include the source URLs used and the current UTC timestamp.
Address the following:
1. University vs. Scholarship Ranking: Is the university actually good, or is it just a weak university offering a strong scholarship to attract international students? How is it perceived locally vs globally?
2. Life after study & PR: What is the brutal truth about getting a job in ${fieldOfStudy} in ${country} right now? What is the actual reality of getting PR (Permanent Residency) and citizenship? Don't sugarcoat it.
3. Honest Verdict: Should a student take this path? Give a rating out of 10.

Tavily Sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankingTruth: { type: Type.STRING },
            jobAndPrReality: { type: Type.STRING },
            verdict: { type: Type.STRING },
            ratingOutOfTen: { type: Type.NUMBER },
            sourceUrls: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            lastUpdated: { type: Type.STRING }
          },
          required: ["rankingTruth", "jobAndPrReality", "verdict", "ratingOutOfTen", "sourceUrls", "lastUpdated"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Reality Check Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate reality check." },
      { status: 500 }
    );
  }
}
