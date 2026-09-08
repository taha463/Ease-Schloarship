import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      docType, // 'SOP' | 'LOR' | 'ColdEmail' | 'MotivationLetter'
      targetUniversity,
      scholarshipName,
      targetProgram, // e.g. "Master of Science in Artificial Intelligence"
      professorName,
      researchDomain,
      customNote
    } = body;

    const ai = getGeminiClient();

    const humanizerInstructions = `
CRITICAL HUMANIZER & SCHOLARSHIP WINNING GUIDELINES:
1. Tone: Human, intellectually curious, rigorous, concise, authentic.
2. BANNED CLICHÉS (NEVER USE):
   - "In today's fast-paced digital world..."
   - "Ever since I was a child / Since my early childhood..."
   - "It is with great enthusiasm that I am applying..."
   - "Technology has always fascinated me..."
   - "I am a passionate, hard-working individual..."
3. MANDATORY SPECIFICITY:
   - Must explicitly highlight candidate's actual projects:
     * Aegis: AI Flood Prediction platform integrating NASA POWER, GEOGloWS V2, and IRSA hydrological data with 8km danger / 25km safe zone mapping and bilingual emergency chatbot.
     * FEHM.AI: Multi-Agent Socratic Learning Platform with Supervisor, Teacher, Critic, and Librarian agents built with Redis & Celery.
     * Mizan: AI Legal Reasoning Framework enforcing evidence-grounded LLM inference via causal cross-attention gating.
     * Internships: Nexium (Groq, OpenRouter, Tavily RAG visa verification workflow) & Elevvo Pathways.
     * Academic Degree: B.Sc. Software Engineering, HITEC University, Taxila (CGPA: 3.20/4.00).
   - Show how the candidate's engineering background connects seamlessly to the target institution (${targetUniversity || "Target University"}) and scholarship (${scholarshipName || "Scholarship Committee"}).
4. STRUCTURE BY DOC TYPE:
   - For SOP: Hook with a concrete technical challenge solved (e.g., real-time hydrological data assimilation or causal grounding in LLMs), transition to academic foundation at HITEC, explain exact alignment with ${targetUniversity}'s curriculum and research labs, and close with long-term research contribution goals.
   - For Cold Email: Max 200 words. Direct subject line, immediate mention of candidate's PyTorch/RAG/Multi-Agent codebase, precise reference to Professor ${professorName || "[Professor Name]"}'s research paper/lab, and polite ask for 15-minute meeting or MS thesis supervision.
   - For LOR: Written from the perspective of a Senior Professor or Internship Director at HITEC University / Nexium praising Taha's technical autonomy, analytical problem-solving, and leadership in disaster AI.
`;

    const prompt = `
Generate a top-tier, award-winning ${docType} for candidate Muhammad Taha.

Target Details:
- Document Type: ${docType}
- Target University: ${targetUniversity || "University"}
- Target Program: ${targetProgram || "M.Sc. in Artificial Intelligence / Computer Science"}
- Scholarship / Grant: ${scholarshipName || "Merit / Fully Funded Scholarship"}
- Professor Name (if applicable): ${professorName || "Faculty Advisor"}
- Specific Research Domain: ${researchDomain || "Multi-Agent Systems & Explainable AI"}
- Additional Instructions: ${customNote || "None"}

${humanizerInstructions}

Output strictly markdown format ready to read, edit, or copy.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite academic writing consultant and former scholarship selection board reviewer. Your documents sound 100% human-written, highly persuasive, and tailored to global university standards in Europe, Canada, and Australia."
      }
    });

    const outputText = response.text || "Failed to generate document text.";

    return NextResponse.json({ success: true, documentText: outputText });
  } catch (error: any) {
    console.error("AI Document Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
