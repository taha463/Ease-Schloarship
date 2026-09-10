import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { searchTavily, formatSearchContext } from "@/lib/tavily";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { targetCountry, university, candidateNationality, fieldOfStudy } =
      await req.json();

    if (!targetCountry) {
      return NextResponse.json(
        { success: false, error: "Target country is required." },
        { status: 400 },
      );
    }

    const cleanUni = university?.trim() || "";
    const cleanField = fieldOfStudy?.trim() || "Computer Science / AI";
    const cleanNationality = candidateNationality?.trim() || "Pakistani";

    const cacheKey = `ambassadors:${targetCountry.toLowerCase().trim()}:${cleanUni.toLowerCase().trim()}:${cleanField.toLowerCase().trim()}:${cleanNationality.toLowerCase().trim()}`;

    // 1. Supabase cache check
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

    // 2. Targeted search for student/alumni LinkedIn profiles from candidate's home country
    const query = cleanUni
      ? `site:linkedin.com/in/ "${cleanUni}" "${cleanField}" ("${cleanNationality}" OR "Pakistan") ("Master" OR "Graduate Student" OR "Alumni")`
      : `site:linkedin.com/in/ "${targetCountry}" "${cleanField}" ("${cleanNationality}" OR "Pakistan") ("Master Student" OR "Working Student")`;

    const searchResp = await searchTavily(query, "basic");
    const searchContext = formatSearchContext(searchResp.results || []);

    // 3. Groq Extraction & Custom Outreach Generation
    const groq = getGroqClient();

    const prompt = `
You are an expert alumni relations director helping an international student find genuine student ambassadors, current master's students, or recent alumni on LinkedIn.

CRITERIA:
- Target Destination: ${targetCountry}
- Target University: ${cleanUni || "Top Universities in " + targetCountry}
- Target Field of Study: ${cleanField}
- Applicant Background: ${cleanNationality} applicant targeting international Master's degree

LIVE SEARCH EVIDENCE (Public LinkedIn profiles and student bios):
${searchContext.slice(0, 6000)}

TASK:
Extract 3 to 5 real or representative student ambassadors / alumni who study or studied in ${targetCountry}.
For each person:
1. Provide their full name and current academic or industry role.
2. Provide their verified LinkedIn URL from the search results (if unavailable, format a realistic LinkedIn search query URL: https://www.linkedin.com/search/results/people/?keywords=...).
3. Explain the strategic reason why contacting them is high-yield (matchReason).
4. Draft a concise, non-generic 2-sentence cold message/inquiry the applicant can send them on LinkedIn (adviceToAsk).

Return STRICT JSON matching this format:
{
  "ambassadors": [
    {
      "name": "Full Name",
      "currentRole": "e.g. M.Sc. Informatics Student at TUM | Ex-Software Engineer",
      "linkedinUrl": "https://www.linkedin.com/in/...",
      "matchReason": "Detailed reason why their journey aligns with the applicant's background.",
      "adviceToAsk": "Hi [Name], I noticed your journey from Pakistan to [University] for [Degree]. As an applicant preparing for the upcoming intake, could I ask how you navigated the blocked account/ECTS conversion?"
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
            "You extract authentic student ambassador profiles and craft high-response LinkedIn cold messages in strict JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const ambassadors = parsed.ambassadors || [];

    // 4. Cache into Supabase
    if (ambassadors.length > 0) {
      await supabaseAdmin.from("intelligence_cache").upsert({
        cache_key: cacheKey,
        country: targetCountry,
        category: "ambassador_intelligence",
        payload: ambassadors,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: ambassadors,
      source: "live_ai",
    });
  } catch (error: any) {
    console.error("Ambassadors API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to find ambassadors" },
      { status: 500 },
    );
  }
}
