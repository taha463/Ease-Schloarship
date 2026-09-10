import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { searchTavily, formatSearchContext } from "@/lib/tavily";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { university, researchDomain, country, candidate } = await req.json();

    if (!university || !researchDomain) {
      return NextResponse.json(
        {
          success: false,
          error: "University and research domain are required.",
        },
        { status: 400 },
      );
    }

    // 1. Supabase Cache Check
    const cacheKey = `professors:${university.toLowerCase().trim()}:${researchDomain.toLowerCase().trim()}`;
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

    // 2. Live Web Search via searchTavily
    const query = `"${university}" faculty professor computer science "${researchDomain}" email "google scholar"`;
    const searchResponse = await searchTavily(query, "basic");
    const searchContext = formatSearchContext(searchResponse.results || []);

    // 3. Groq Extraction & Matching
    const groq = getGroqClient();

    const candidateProjects =
      Array.isArray(candidate?.projects) && candidate.projects.length > 0
        ? candidate.projects
            .map(
              (p: any) =>
                `${p.name} (${(p.tech || []).join(", ")}): ${p.description || ""}`,
            )
            .join("; ")
        : "Undergraduate software engineering, backend systems, and applied ML.";

    const prompt = `
You are an academic researcher indexing active faculty for prospective graduate students.

TARGET INSTITUTION & FIELD:
- University: ${university} (${country || "International"})
- Research Focus: ${researchDomain}

STUDENT BACKGROUND:
- Student Name: ${candidate?.name || "The Applicant"}
- Background: ${candidate?.degree || "B.Sc. in Engineering"} (CGPA: ${candidate?.cgpa || "N/A"})
- Practical Projects: ${candidateProjects}

LIVE WEB SEARCH RESULTS:
${searchContext.slice(0, 7000)}

TASK:
Extract 3 to 5 real professors/faculty members at ${university} working in or adjacent to ${researchDomain}.
For each professor, formulate a personalized, non-generic persuasion strategy explaining how this specific student's projects align with the professor's lab.

Return STRICT JSON matching this schema:
{
  "professors": [
    {
      "id": "prof-unique-id",
      "name": "Full Name (e.g. Prof. Dr. Jane Doe)",
      "university": "${university}",
      "country": "${country || "International"}",
      "labName": "Name of their research lab or department group",
      "researchFocus": ["Focus 1", "Focus 2", "Focus 3"],
      "email": "Official institutional email (or best verified contact)",
      "website": "Lab or faculty webpage URL",
      "linkedinUrl": "LinkedIn URL or empty string",
      "scholarUrl": "Google Scholar URL or search link",
      "openingsStatus": "Actively Recruiting MS/PhD",
      "recommendedAddressing": "Dear Prof. [Last Name],",
      "persuasionStrategy": {
        "keyPaperToCite": "Representative research topic, paper, or recent lab initiative",
        "taicOverlapHook": "Concrete 1-2 sentence hook connecting the student's specific project experience to this professor's domain",
        "recommendedOffer": "Tangible offer for a 10-minute demo, code benchmark, or thesis discussion"
      }
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
            "You extract authentic faculty directories from web search and construct tailored academic outreach strategies into strict JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsedData = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );
    const professors = parsedData.professors || [];

    // 4. Cache Results in Supabase
    if (professors.length > 0) {
      await supabaseAdmin.from("intelligence_cache").upsert({
        cache_key: cacheKey,
        country: country || "International",
        category: "faculty_intelligence",
        payload: professors,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: professors,
      source: "live_ai",
    });
  } catch (error: any) {
    console.error("Find Professors API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search professors" },
      { status: 500 },
    );
  }
}
