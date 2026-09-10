import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const {
      docType,
      targetUniversity,
      scholarshipName,
      targetProgram,
      professorName,
      researchDomain,
      customNote,
      candidate,
    } = await req.json();

    if (!docType || !targetUniversity || !candidate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required document configuration or applicant profile.",
        },
        { status: 400 },
      );
    }

    const groq = getGroqClient();

    // Format applicant's projects cleanly for context injection
    const projectSummary =
      Array.isArray(candidate.projects) && candidate.projects.length > 0
        ? candidate.projects
            .map(
              (p: any) =>
                `- ${p.name}: ${p.description || ""} (Stack: ${(p.tech || []).join(", ")})`,
            )
            .join("\n")
        : "Undergraduate core software architecture projects and academic laboratory assignments.";

    const experienceSummary =
      Array.isArray(candidate.experience) && candidate.experience.length > 0
        ? candidate.experience
            .map(
              (e: any) =>
                `- ${e.role} at ${e.company} (${e.period}): ${(e.highlights || []).join("; ")}`,
            )
            .join("\n")
        : "Undergraduate engineering labs and software development coursework.";

    let typeSpecificInstructions = "";

    switch (docType) {
      case "LOR":
        typeSpecificInstructions = `
DOCUMENT FORMAT: Academic Letter of Recommendation (written from the perspective of an undergraduate Professor or Department Chair).
- Focus on candidate's analytical maturity, laboratory performance, problem-solving stamina, and technical execution.
- Cite specific metrics or project outcomes (${projectSummary.slice(0, 300)}) to substantiate praise.
- Conclude with an unambiguous, highest-tier recommendation for admission and scholarship awards.`;
        break;

      case "ColdEmail":
        typeSpecificInstructions = `
DOCUMENT FORMAT: Concise Prospective Graduate Student Cold Email to a Professor (${professorName || "Professor"}).
- Strict 180-220 word length. Direct, polite, and academically informed.
- Opening: Immediately state prospective Master's intent and concise background (${candidate.degree || "B.Sc."}, CGPA ${candidate.cgpa || ""}).
- Middle: Explicitly cite the professor's research lab and connect it to 1 specific technical project the candidate has built.
- Closing: Request a 10-minute discussion regarding potential supervision or research assistantship slots. Attach no generic flattery.`;
        break;

      case "MotivationLetter":
        typeSpecificInstructions = `
DOCUMENT FORMAT: Competitive Scholarship Motivation Letter (${scholarshipName}).
- Emphasize return on investment, bilateral/regional impact, and capacity to handle rigorous international curricula.
- Connect previous technical leadership to long-term post-study goals in industry or applied scientific research.`;
        break;

      case "SOP":
      default:
        typeSpecificInstructions = `
DOCUMENT FORMAT: 4-Paragraph Academic Statement of Purpose (SOP).
- Paragraph 1: Direct technical thesis and research trajectory grounded in bachelor's studies.
- Paragraph 2: Rigorous breakdown of 1-2 major technical projects/systems engineering challenges solved.
- Paragraph 3: Precise curriculum, lab, and institutional justification for ${targetUniversity}.
- Paragraph 4: Concrete 3-5 year post-graduation technical and societal contribution.`;
        break;
    }

    const prompt = `
You are a senior chair on an elite graduate admissions and international scholarship committee.

Draft a tailored, publication-quality ${docType} for this candidate:

APPLICANT PROFILE:
- Name: ${candidate.name || "The Applicant"}
- Background: ${candidate.degree || "Bachelor's Degree"} from ${candidate.university || "Undergraduate University"}
- Academic Standing: CGPA ${candidate.cgpa || "N/A"} / ${candidate.maxCgpa || "4.00"}
- Technical Competencies: ${JSON.stringify(candidate.skills || {})}
- Concrete Technical Projects:
${projectSummary}
- Experience:
${experienceSummary}
- Target Specialization: ${researchDomain}
- Custom Instructions from Applicant: ${customNote || "None specified."}

TARGET ADMISSION GOAL:
- University: ${targetUniversity}
- Degree Program: ${targetProgram}
- Scholarship / Grant: ${scholarshipName || "Institutional Merit Award"}
- Target Professor: ${professorName || "Graduate Admissions Committee"}

---
${typeSpecificInstructions}
---

STRICT WRITING DIRECTIVES:
1. BAN all AI clichés: "testament to", "delve into", "beacon of hope", "tapestry", "spearhead", "foster", "ever-evolving landscape", "since my childhood", "passionate learner".
2. Use active verbs, precise engineering terminology, and compact sentence structure.
3. Ground statements directly in real project stacks and metrics from the candidate's profile.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.25,
      messages: [
        {
          role: "system",
          content:
            "You draft authentic, publication-grade academic documents for graduate admissions. You write with technical precision and zero AI fluff.",
        },
        { role: "user", content: prompt },
      ],
    });

    const documentText = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      success: true,
      documentText,
    });
  } catch (error: any) {
    console.error("Document Generation Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate document" },
      { status: 500 },
    );
  }
}
