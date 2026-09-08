import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country = "Germany" } = body;

    const ai = getGeminiClient();

    const prompt = `
Analyze the current Pakistani student visa policy, embassy appointment availability status, blocked account financial proof requirement, and post-study work regulations for Pakistani passport holders applying for a Master's degree in ${country}.

Provide real-time structured updates on:
1. Current Financial Proof Amount (Blocked Account / Bank Balance required in PKR & Foreign Currency)
2. Pakistani Embassy / VFS Global Appointment Queue situation (e.g. Cat-A vs Cat-B wait times)
3. Post-Study Work Permit duration & Permanent Residency (PR) pathways
4. Top 3 common visa refusal reasons for Pakistani students and how to avoid them
5. Actionable 5-step checklist for visa preparation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert immigration consultant specializing in student visas for Pakistani citizens applying to Europe, Canada, Australia, and New Zealand.",
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
              items: { type: Type.STRING }
            },
            stepByStepChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            overallSuccessRating: { type: Type.STRING }
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
            "overallSuccessRating"
          ]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Visa Checker Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check visa policy" },
      { status: 500 }
    );
  }
}
