import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getGroqClient } from "@/lib/groq";
import { searchWeb, formatSearchContext } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { country = "Germany" } = await req.json();
    const cacheId = `visa:${country.toLowerCase()}`;

    // 1. CHECK SUPABASE CACHE FIRST (0 API spend, 0 quota burn)
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

    // 2. CACHE MISS / EXPIRED: Run live Tavily search
    const currentYear = new Date().getFullYear();
    const queries = [
      `${country} international student visa proof of funds financial requirement living expenses ${currentYear}`,
      `${country} student visa blocked account bank balance post study work permit hours per week rules`,
    ];

    const searchResults = await Promise.allSettled(
      queries.map((q) => searchWeb(q, 4)),
    );

    const sources: any[] = [];
    for (const res of searchResults) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        sources.push(...res.value);
      }
    }

    const uniqueSources = Array.from(
      new Map(sources.map((item) => [item.url, item])).values(),
    );

    const searchContext = formatSearchContext(uniqueSources);
    const sourceUrls = uniqueSources.map((s) => s.url).filter(Boolean);

    // 3. SYNTHESIZE WITH GROQ
    const groq = getGroqClient();
    const prompt = `
You are an expert international student immigration officer.
Target Destination: ${country}
Target Applicant: Master's degree student holding a Pakistani passport.

LIVE WEB SEARCH EVIDENCE:
${searchContext || "No live search results available."}

TASK:
Extract current official immigration rules for ${country}:
- Exact financial proof / living costs / blocked account figure (currency + approx PKR).
- Account protocol (Blocked Account, GIC, personal bank statement, escrow).
- Post-study work permit duration and PR pathway ease.
- Legal part-time working hours.
- Embassy/VFS wait times for Pakistani applicants.
- Key step-by-step checklist and refusal-prevention warnings.

Return ONLY a single valid JSON object strictly matching this schema:
{
  "country": "${country}",
  "flagEmoji": "flag emoji",
  "visaType": "official visa title",
  "financialProofRequired": "amount with PKR",
  "blockedAccountDetails": "account mechanism",
  "postStudyWorkPermit": "duration",
  "partTimeWorkAllowance": "allowed hours",
  "prPathwayEase": "High" | "Moderate" | "Selective",
  "embassyAppointmentPortal": "official booking portal",
  "pakistanWaitTime": "queue duration in Pakistan",
  "keyStepsPakistani": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "importantWarnings": ["Warning 1", "Warning 2", "Warning 3"],
  "sourceUrls": ${JSON.stringify(sourceUrls.slice(0, 5))},
  "lastUpdated": "${new Date().toISOString().split("T")[0]}"
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON based on official immigration guidelines.",
        },
        { role: "user", content: prompt },
      ],
    });

    const parsedData = JSON.parse(
      completion.choices[0]?.message?.content || "{}",
    );

    // 4. SAVE TO SUPABASE CACHE (valid for 24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from("intelligence_cache").upsert({
      id: cacheId,
      category: "visa",
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
    console.error("Dynamic Visa API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to extract live visa data",
      },
      { status: 500 },
    );
  }
}
