import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No CV/Resume file provided" },
        { status: 400 },
      );
    }

    let extractedText = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      extractedText = pdfData.text;
      await parser.destroy();
    } else {
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract readable text from document.",
        },
        { status: 422 },
      );
    }

    // 2. Extract structured profile using Groq
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are an academic profile parser. Extract candidate details from resume text into strictly formatted JSON. Do not fabricate missing information.",
        },
        {
          role: "user",
          content: `
Extract the candidate profile from this CV:
---
${extractedText.slice(0, 7000)}
---

Output JSON structure:
{
  "fullName": "Candidate Name",
  "degree": "e.g. Bachelor of Science in Software Engineering",
  "university": "University Name",
  "graduationDate": "e.g. 2026-07 or July 2026",
  "cgpa": 3.4,
  "maxCgpa": 4.0,
  "location": "City, Country",
  "phone": "Phone number or empty string",
  "summary": "Brief 2-3 sentence academic and professional summary",
  "skills": {
    "languages": ["Python", "TypeScript"],
    "aiMl": ["PyTorch", "LLMs"],
    "backend": ["FastAPI", "Node.js"],
    "frontend": ["React", "Next.js"]
  },
  "targetPreferences": {
    "degreeGoal": "Master of Science",
    "fieldOfStudy": ["Artificial Intelligence", "Computer Science"],
    "includedRegions": ["Germany", "Sweden", "Finland"],
    "minFundingNeeded": "Fully Funded"
  }
}
`,
        },
      ],
    });

    const parsedData = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("CV Parse Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse CV" },
      { status: 500 },
    );
  }
}
