import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      examName = "IELTS Academic",
      targetScore = "7.5",
      currentMockScore = "6.5",
      examDate,
      weaknesses = "",
      candidate,
    } = await req.json();

    const cacheKey = `exam_plan:${examName.toLowerCase().replace(/\s+/g, "_")}:${targetScore}:${currentMockScore}`;

    // 1. Supabase Cache Check
    const { data: cached } = await supabaseAdmin
      .from("intelligence_cache")
      .select("payload")
      .eq("cache_key", cacheKey)
      .maybeSingle();

    if (cached?.payload) {
      return NextResponse.json({
        success: true,
        data: cached.payload,
        source: "supabase_cache",
      });
    }

    const groq = getGroqClient();

    const prompt = `
You are an expert standardized admissions test director specializing in ${examName}, TOEFL, and GRE for graduate school applicants.

APPLICANT PARAMETERS:
- Test: ${examName}
- Target Score: ${targetScore}
- Current Diagnostic Mock Score: ${currentMockScore}
- Target Test Date: ${examDate || "Within 60 days"}
- Self-Reported Weaknesses / Focus: ${weaknesses || "Technical vocabulary, speed under time pressure"}
- Academic Background: ${candidate?.degree || "Undergraduate Degree"} (Technical background)

TASK:
1. Generate module breakdown (Listening, Reading, Writing, Speaking for IELTS/TOEFL; Verbal, Quant, AWA for GRE).
   - Set current diagnostic baseline and required target score for each module.
   - Pinpoint high-yield weak areas specifically holding test takers back from jumping from ${currentMockScore} to ${targetScore}.
   - Supply authoritative, official preparation resources and strategy tools.
2. Build a high-intensity, practical 7-day initial sprint study schedule with concrete, non-generic daily action items.

Return STRICT JSON matching this exact structure:
{
  "examName": "${examName}",
  "targetScore": "${targetScore}",
  "currentMockScore": "${currentMockScore}",
  "examDate": "${examDate || "2026-10-15"}",
  "modules": [
    {
      "name": "string",
      "targetScore": "string",
      "currentMockScore": "string",
      "weakAreas": ["string", "string"],
      "recommendedResources": [
        {
          "title": "string",
          "url": "string",
          "type": "Official"
        }
      ]
    }
  ],
  "studySchedule": [
    {
      "dayNumber": 1,
      "week": 1,
      "topic": "string",
      "focusArea": "string",
      "actionItems": ["string", "string"],
      "completed": false
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You generate exact, rigorous standardized exam preparation plans and official diagnostic breakdowns in strict JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsedPlan = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    // 2. Cache in Supabase
    if (parsedPlan.modules?.length) {
      await supabaseAdmin.from("intelligence_cache").upsert({
        cache_key: cacheKey,
        country: "Global",
        category: "exam_intelligence",
        payload: parsedPlan,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: parsedPlan,
      source: "live_ai",
    });
  } catch (error: any) {
    console.error("Exam Planner API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate exam plan",
      },
      { status: 500 },
    );
  }
}
