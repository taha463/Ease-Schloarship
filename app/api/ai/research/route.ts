import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetCountry, researchTopic, degreeLevel = "Master's (MS)" } = body;

    const ai = getGeminiClient();
    const sources = await searchWeb(
      `${targetCountry || "Europe Australia Canada New Zealand"} current scholarships master's software engineering Pakistani students ${researchTopic || "artificial intelligence"} ${degreeLevel}`,
      8
    );

    const prompt = `
You are an expert academic research advisor and scholarship intelligence agent.
Candidate Profile:
- Name: Muhammad Taha
- Nationality: Pakistani Passport Holder
- Academic Degree: B.Sc. Software Engineering from HITEC University, Taxila
- CGPA: 3.20 / 4.00
- Core AI Skills: PyTorch, Multi-Agent Systems, RAG, FastAPI, Docker, Transformers, Causal Cross-Attention, LLM inference.
- Key Projects: Aegis (AI Flood Prediction with NASA/GEOGloWS), FEHM.AI (Socratic Multi-Agent Learning), Mizan (AI Legal Evidence Reasoning).
- Strict Allowed Regions: Europe (Germany, Sweden, Finland, Netherlands, France, Italy, Ireland, Austria), Australia, New Zealand, Canada.
- Strictly EXCLUDED Destinations: USA, UK, Gulf, China, South Asia, Japan.

Search Query:
Target Region/Country: ${targetCountry || "Europe, Australia, Canada, New Zealand"}
Focus Research Area: ${researchTopic || "Artificial Intelligence, Multi-Agent Systems, RAG, Software Engineering"}
Target Degree: ${degreeLevel}

Use the Tavily sources below as your evidence. Find 3 highly specific, real-world scholarship or research assistantship opportunities available for Pakistani software engineers matching CGPA 3.20. Do not invent deadlines, eligibility, professors, or URLs. If a source does not confirm a detail, write "Not confirmed".
Include professor names/labs where relevant for research thesis pathways.

Return structured JSON according to the schema provided.

Tavily sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You provide precise, real academic scholarship intelligence for international students from Pakistan. Never hallucinate fake domains or fake deadlines.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  universityOrProvider: { type: Type.STRING },
                  country: { type: Type.STRING },
                  fundingType: { type: Type.STRING, description: "Fully Funded, Full Tuition Waiver, or Partial Funding" },
                  matchScore: { type: Type.NUMBER, description: "Match score percentage out of 100" },
                  matchRating: { type: Type.STRING, description: "Strong Match, Possible Match, or Not Eligible" },
                  matchReason: { type: Type.STRING },
                  stipendDetails: { type: Type.STRING },
                  estimatedDeadline: { type: Type.STRING },
                  keyRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  relevantProfessorsOrLabs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        labName: { type: Type.STRING },
                        email: { type: Type.STRING },
                        researchDomain: { type: Type.STRING }
                      }
                    }
                  },
                  officialPortalLink: { type: Type.STRING }
                },
                required: ["title", "universityOrProvider", "country", "fundingType", "matchScore", "matchRating", "matchReason", "stipendDetails", "estimatedDeadline", "keyRequirements", "officialPortalLink"]
              }
            }
          },
          required: ["opportunities"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Scholarship Research Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute AI research" },
      { status: 500 }
    );
  }
}
