import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { extractText } from "unpdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const { text } = await extractText(arrayBuffer);
      extractedText = Array.isArray(text) ? text.join("\n") : text || "";
    } else {
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length < 40) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract readable text from document. Ensure it is not an image-only scan.",
        },
        { status: 422 },
      );
    }

    // Extract structured candidate details with Groq
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
  "university": "Institution Name",
  "graduationDate": "e.g. 2026-07 or July 2026",
  "cgpa": 3.4,
  "maxCgpa": 4.0,
  "location": "City, Country",
  "phone": "Phone number or empty string",
  "summary": "Brief academic summary",
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
    console.error("CV Parse Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse CV" },
      { status: 500 },
    );
  }
}
