import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getGroqClient } from "@/lib/groq";
import { searchWeb, formatSearchContext } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const {
      targetCountry,
      researchTopic,
      degreeLevel = "Master of Science",
      candidate,
    } = await req.json();

    const topic =
      researchTopic ||
      candidate?.targetPreferences?.fieldOfStudy?.[0] ||
      "Computer Science";

    const country =
      targetCountry ||
      candidate?.targetPreferences?.includedRegions?.[0] ||
      "Germany";

    const userCgpa = candidate?.cgpa ?? 3.2;

    // Normalizing cache ID (e.g., "scholarship:germany:computer-science")
    const cleanCountry = country.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cacheId = `scholarship:${cleanCountry}:${cleanTopic}`;

    // 1. CHECK SUPABASE CACHE FIRST (0 API costs)
    const { data: cachedEntry } = await supabaseAdmin
      .from("intelligence_cache")
      .select("payload, expires_at")
      .eq("id", cacheId)
      .maybeSingle();

    if (cachedEntry && new Date(cachedEntry.expires_at) > new Date()) {
      return NextResponse.json({
        success: true,
        data: cachedEntry.payload,
        source: "supabase_cache",
      });
    }

    // 2. CACHE MISS: Live search using Tavily
    const currentYear = new Date().getFullYear();
    const query = `${country} ${degreeLevel} fully funded international student scholarships ${topic} deadline ${currentYear}`;

    let sources: any[] = [];
    try {
      sources = await searchWeb(query, 5);
    } catch (err) {
      console.warn("Tavily scholarship search warning:", err);
    }

    const searchContext = formatSearchContext(sources);

    // 3. SYNTHESIZE OPPORTUNITIES USING GROQ
    const groq = getGroqClient();
    const prompt = `
You are an academic scholarship advisor for international students from Pakistan.

Target Country: ${country}
Field of Study: ${topic}
Degree Level: ${degreeLevel}
Applicant Profile: CGPA ${userCgpa} / 4.00

LIVE WEB SEARCH EVIDENCE:
${searchContext || "No live snippets retrieved. Provide verified government and university scholarships."}

TASK:
Analyze the snippets and provide a structured list of real, active scholarship opportunities.
For each opportunity, calculate an estimated match score for a candidate with CGPA ${userCgpa}.

Return ONLY valid JSON matching this schema:
{
  "opportunities": [
    {
      "id": "slug-id",
      "title": "Scholarship Name",
      "universityOrProvider": "University or Host Organization",
      "country": "${country}",
      "fundingType": "Fully Funded" | "Partial Waiver" | "Tuition Only",
      "matchScore": 88,
      "matchRating": "Strong Match" | "Moderate Match" | "Competitive Reach",
      "matchReason": "Why this aligns with the applicant's profile",
      "stipendDetails": "Monthly stipend and tuition coverage details",
      "estimatedDeadline": "YYYY-MM-DD or Season (e.g. 2026-11-15)",
      "keyRequirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
      "officialPortalLink": "https://..."
    }
  ],
  "lastUpdated": "${new Date().toISOString().split("T")[0]}"
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You extract active academic scholarships into clean JSON. Always provide realistic deadlines and requirements.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsedData = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    // 4. SAVE TO SUPABASE CACHE (Valid for 48 hours to preserve search credits)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from("intelligence_cache").upsert({
      id: cacheId,
      category: "scholarship",
      payload: parsedData,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: "live_ai_grounded",
    });
  } catch (error: any) {
    console.error("Scholarship Research API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch scholarships",
      },
      { status: 500 },
    );
  }
}
