import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { searchTavily, formatSearchContext } from "@/lib/tavily";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { countries } = await req.json();
    const targetCountries: string[] = countries || [
      "Germany",
      "Sweden",
      "Finland",
      "Italy",
      "Ireland",
      "Australia",
      "Canada",
      "New Zealand",
    ];

    const results: any[] = [];
    const groq = getGroqClient();

    for (const country of targetCountries) {
      const cacheKey = `country_comparison:${country.toLowerCase().trim()}`;

      // 1. Supabase cache check
      const { data: cached } = await supabaseAdmin
        .from("intelligence_cache")
        .select("payload")
        .eq("cache_key", cacheKey)
        .maybeSingle();

      if (cached?.payload) {
        results.push({
          ...cached.payload,
          dataStatus: "live",
          source: "supabase_cache",
        });
        continue;
      }

      // 2. Tavily Live Search for immigration & student metrics
      const query = `${country} international student tuition fees living costs blocked account post study work permit part time hours`;
      let searchContext = "";
      try {
        const searchResp = await searchTavily(query, "basic");
        searchContext = formatSearchContext(searchResp.results || []);
      } catch (e) {
        console.warn(
          `Tavily search failed for ${country}, relying on internal LLM knowledge.`,
        );
      }

      // 3. Groq extraction into CountryComparisonMetric schema
      const prompt = `
You are an international education and immigration policy analyst.

Analyze and extract current student metrics for ${country} from the web search context:
${searchContext.slice(0, 5000)}

Return a single JSON object matching this schema:
{
  "country": "${country}",
  "flag": "emoji flag",
  "avgTuitionFeeUsdYear": number (average USD/year for master's degree),
  "avgLivingCostUsdYear": number (realistic annual living cost or official blocked account in USD),
  "tuitionWaiverAvailabilityScore": number (1-100 score on how accessible scholarships/waivers are),
  "postStudyWorkPermitMonths": number (post-graduation work visa length in months),
  "prPathwayScore": number (1-100 ease of transition to permanent residence/work visa),
  "aiTechJobMarketScore": number (1-100 demand for software/AI/engineering grads),
  "partTimeWorkHoursWeek": number (legal student work hours allowed per week during term),
  "keyTechHubs": ["City 1", "City 2", "City 3"],
  "lastUpdated": "${new Date().toISOString().split("T")[0]}"
}
`;

      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You extract exact immigration metrics and student costs into strict JSON.",
          },
          { role: "user", content: prompt },
        ],
      });

      const parsed = JSON.parse(
        completion.choices[0]?.message?.content || "{}",
      );

      if (parsed.country) {
        // 4. Cache in Supabase for 30 days
        await supabaseAdmin.from("intelligence_cache").upsert({
          cache_key: cacheKey,
          country: country,
          category: "country_metrics",
          payload: parsed,
          expires_at: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30,
          ).toISOString(),
        });

        results.push({ ...parsed, dataStatus: "live", source: "live_ai" });
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error("Country Comparison API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch country comparison metrics",
      },
      { status: 500 },
    );
  }
}
