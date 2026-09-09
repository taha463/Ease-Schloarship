import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { targetCountry, university, candidateNationality, fieldOfStudy } = await req.json();

    const ai = getGeminiClient();
    
    // Search the web (specifically targeting LinkedIn or university pages)
    const searchQuery = `site:linkedin.com/in OR site:*.edu "international student" OR "alumni" "${university || targetCountry}" "${candidateNationality || "Pakistani"}" "${fieldOfStudy || "Software Engineering"}"`;
    const sources = await searchWeb(searchQuery, 10);

    const prompt = `
You are a networking and alumni intelligence tool. Based on the following web search results (mostly LinkedIn or university profiles), extract a list of 3-5 real student ambassadors or alumni who match the following profile:
- Country of study: ${targetCountry || "Unknown"}
- University: ${university || "Any"}
- Nationality/Origin: ${candidateNationality || "Pakistani"}
- Field of Study: ${fieldOfStudy || "Software Engineering or Computer Science"}

DO NOT HALLUCINATE PROFILES. Only use the names and data provided in the Tavily sources. If you can't find exact matches, find the closest possible matches from the sources (e.g. same country, similar field). If you truly find nothing, return an empty array.

For each profile, extract:
1. name: Their full name.
2. currentRole: E.g., "MSc Computer Science Student at TUM" or "Software Engineer at SAP".
3. linkedinUrl: Their LinkedIn URL or profile link (if available in the sources).
4. matchReason: Why they are a good person to contact for this candidate.
5. adviceToAsk: 1-2 suggested questions the candidate can ask them in a cold message.

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
              name: { type: Type.STRING },
              currentRole: { type: Type.STRING },
              linkedinUrl: { type: Type.STRING },
              matchReason: { type: Type.STRING },
              adviceToAsk: { type: Type.STRING }
            },
            required: ["name", "currentRole", "linkedinUrl", "matchReason", "adviceToAsk"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Ambassador Search Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search for ambassadors." },
      { status: 500 }
    );
  }
}
