import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST() {
  try {
    const ai = getGeminiClient();
    
    // Search the web for latest metrics
    const sources = await searchWeb(
      "current 2026 international student tuition living costs post study work visa PR policy AI software engineering job market Germany Sweden Finland Italy Ireland Australia Canada New Zealand",
      10
    );

    const prompt = `
You are a global academic data analyst. Based on the following Tavily search sources from the web, provide the latest 2026 data for international students in Software Engineering/AI for these 8 countries:
Germany, Sweden, Finland, Italy, Ireland, Australia, Canada, New Zealand.

For each country, determine:
1. avgTuitionFeeUsdYear (Average Tuition Fee in USD per year, considering common waivers/public universities)
2. avgLivingCostUsdYear (Average Living Cost in USD per year)
3. tuitionWaiverAvailabilityScore (1-100 score: how easy is it to get full funding/waivers)
4. postStudyWorkPermitMonths (Duration of post-study work visa in months)
5. prPathwayScore (1-100 score: how easy is it to get Permanent Residency for tech grads)
6. aiTechJobMarketScore (1-100 score: strength of AI/Software job market)
7. partTimeWorkHoursWeek (Allowed part-time work hours per week)
8. keyTechHubs (Array of 3-4 top tech hub cities)

Use realistic estimates if exact numbers are missing, but rely on the provided search context.

Tavily Sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              flag: { type: Type.STRING },
              avgTuitionFeeUsdYear: { type: Type.NUMBER },
              avgLivingCostUsdYear: { type: Type.NUMBER },
              tuitionWaiverAvailabilityScore: { type: Type.NUMBER },
              postStudyWorkPermitMonths: { type: Type.NUMBER },
              prPathwayScore: { type: Type.NUMBER },
              aiTechJobMarketScore: { type: Type.NUMBER },
              partTimeWorkHoursWeek: { type: Type.NUMBER },
              keyTechHubs: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              "country", "flag", "avgTuitionFeeUsdYear", "avgLivingCostUsdYear",
              "tuitionWaiverAvailabilityScore", "postStudyWorkPermitMonths",
              "prPathwayScore", "aiTechJobMarketScore", "partTimeWorkHoursWeek", "keyTechHubs"
            ]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Country Metrics Live Data Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch live country metrics." },
      { status: 500 }
    );
  }
}
