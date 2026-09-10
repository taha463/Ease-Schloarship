import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { searchTavily, formatSearchContext } from "@/lib/tavily";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { university, scholarship, country, fieldOfStudy } = await req.json();

    if (!university || !country) {
      return NextResponse.json(
        { success: false, error: "University and Country are required." },
        { status: 400 },
      );
    }

    const cleanField =
      fieldOfStudy || "Computer Science / Software Engineering";
    const cacheKey = `reality_check:${university.toLowerCase().trim()}:${country.toLowerCase().trim()}:${cleanField.toLowerCase().trim()}`;

    // 1. Supabase Intelligence Cache Check (30-day cache)
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

    // 2. Multi-Vector Deep Web Search via Tavily
    // We run two distinct targeted queries to capture both academic quality AND socio-economic immigration ground realities:
    const queryAcademic = `"${university}" ${scholarship ? `"${scholarship}"` : ""} "${country}" "${cleanField}" master ranking reputation acceptance rate student reviews`;
    const queryImmigrationAndJobs = `"${country}" international students tech job market hiring hiring freeze PR permanent residency housing crisis anti immigrant policy`;

    const [academicResp, immigrationResp] = await Promise.allSettled([
      searchTavily(queryAcademic, "advanced"),
      searchTavily(queryImmigrationAndJobs, "advanced"),
    ]);

    const academicResults =
      academicResp.status === "fulfilled"
        ? academicResp.value.results || []
        : [];
    const immigrationResults =
      immigrationResp.status === "fulfilled"
        ? immigrationResp.value.results || []
        : [];

    const allResults = [...academicResults, ...immigrationResults];
    const searchContext = formatSearchContext(allResults);
    const sourceUrls = Array.from(
      new Set(allResults.map((r: any) => r.url).filter(Boolean)),
    );

    // 3. Groq Brutal Analysis & Synthesis
    const groq = getGroqClient();

    const prompt = `
You are an uncompromising, veteran international education critic and immigration consultant. You specialize in giving developing-country international students (e.g. South Asian, African, non-EU applicants) the raw, unfiltered TRUTH about studying abroad. 

You DO NOT sugarcoat. You do not work for university recruitment agencies. You hate visa agent hype.

TARGET APPLICATION:
- Target University: ${university}
- Optional Scholarship: ${scholarship || "None specified (Self-funded or General Tuition Waiver)"}
- Target Country: ${country}
- Intended Discipline: ${cleanField}

LIVE WEB EVIDENCE & RECENT IMMIGRATION CONTEXT:
${searchContext.slice(0, 9000)}

EVALUATION CRITERIA:
1. **University & Program Reality (rankingTruth)**:
   - What is this university's real local and global reputation vs its marketing?
   - Is it a research powerhouse or a degree mill? 
   - How competitive is admission and how rigorous/stressful is the actual coursework?
   - If a scholarship is mentioned, what are the realistic funding odds?

2. **Ground Reality: Jobs, Housing, Language & PR (jobAndPrReality)**:
   - **Housing Crisis**: Is finding student housing an outright nightmare in this city? (e.g. Munich, Dublin, Amsterdam, Stockholm rent shortages and waitlists).
   - **Language Requirement**: Can a student actually get an engineering job speaking only English, or is fluent local language (German, Swedish, Finnish, French, etc.) strictly mandatory to get past screening?
   - **Tech Job Market**: Are junior graduates being hired, or are hiring freezes, tech layoffs, and visa sponsorship rejections common?
   - **Immigration Policy & PR**: What are the latest policy headwinds? Are work permit rules tightening? What is the realistic timeline to Permanent Residency or citizenship?

3. **Brutal Verdict & Rating (ratingOutOfTen)**:
   - Give a numerical rating out of 10 based on the Return On Investment (ROI) and survival difficulty for an international student.
   - Summarize the final verdict in 2-3 blunt, candid sentences. Tell them whether this move is a smart strategic leap or a financial trap unless they meet specific conditions.

Return STRICT JSON matching this schema:
{
  "rankingTruth": "Detailed 2-3 paragraph brutal breakdown of university prestige, academic workload, and actual curriculum value.",
  "jobAndPrReality": "Detailed 2-3 paragraph breakdown of housing, living costs, local language requirements for jobs, junior hiring market, and PR reality.",
  "verdict": "Direct, blunt 2-3 sentence executive verdict.",
  "ratingOutOfTen": number (e.g., 6.5 or 8 or 4)
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You deliver objective, brutally honest academic and immigration reality checks grounded in live evidence. You write in strict JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

    const payload = {
      rankingTruth: parsed.rankingTruth || "Analysis unavailable.",
      jobAndPrReality: parsed.jobAndPrReality || "Analysis unavailable.",
      verdict: parsed.verdict || "No decisive verdict reached.",
      ratingOutOfTen:
        typeof parsed.ratingOutOfTen === "number" ? parsed.ratingOutOfTen : 6,
      sourceUrls: sourceUrls.slice(0, 8),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // 4. Save into Supabase Cache
    await supabaseAdmin.from("intelligence_cache").upsert({
      cache_key: cacheKey,
      country: country,
      category: "reality_check",
      payload,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: payload,
      source: "live_ai",
    });
  } catch (error: any) {
    console.error("Reality Check API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to conduct reality check",
      },
      { status: 500 },
    );
  }
}
