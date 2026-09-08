import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { countryOrComparison } = await req.json();

    const ai = getGeminiClient();
    const sources = await searchWeb(
      `${countryOrComparison || "Germany Canada Sweden Australia"} international student living costs post study work visa permanent residence Pakistani software engineering 2026`,
      8
    );

    const prompt = `
You are a global academic student forum aggregator and intelligence analyst.
Analyze real internet discussions (Reddit r/IWW, r/StudyInEurope, r/ImmigrationCanada, r/AusVisa, student forums, Expat blogs) for international CS / Software Engineering students regarding:
Topic/Countries: "${countryOrComparison || "Germany vs Canada vs Sweden vs Australia"}"

Use the Tavily sources below. Provide authentic, unvarnished real-world student reviews and community consensus covering:
1. Honest Pros & Cons of studying MS in CS/AI in this country/comparison.
2. Real living expenses breakdown (rent, food, insurance, part-time jobs).
3. Post-study work visa realities & PR feasibility for Pakistani software engineering grads.
4. 3 authentic student discussion posts/comments reflecting real conversations from the web.

Do not fabricate comments or present estimates as official policy. Include source URLs in the text when possible.
Return structured JSON according to the schema provided.

Tavily sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Provide candid, real-world internet reviews and student sentiment. Avoid overly promotional marketing copy.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            livingCostRealities: { type: Type.STRING },
            workVisaAndPrRealities: { type: Type.STRING },
            webComments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  author: { type: Type.STRING },
                  roleOrSource: { type: Type.STRING },
                  commentText: { type: Type.STRING },
                  upvotes: { type: Type.NUMBER },
                  timeAgo: { type: Type.STRING }
                },
                required: ["author", "roleOrSource", "commentText", "upvotes", "timeAgo"]
              }
            }
          },
          required: ["title", "summary", "pros", "cons", "livingCostRealities", "workVisaAndPrRealities", "webComments"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Country Review Aggregation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to aggregate real internet reviews." },
      { status: 500 }
    );
  }
}
