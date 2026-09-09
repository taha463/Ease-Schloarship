import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { searchWeb, formatSearchContext } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const { country = "Germany" } = await req.json();
    const currentYear = new Date().getFullYear();

    // 1. Dynamic live searches across the web - ZERO hardcoded amounts
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

    // 2. Groq Model processes the live web snippets directly
    const groq = getGroqClient();

    const prompt = `
You are an expert international student immigration intelligence officer.
Target Destination: ${country}
Target Applicant: Master's degree student holding a Pakistani passport.

LIVE WEB SEARCH EVIDENCE:
${searchContext || "No live search results available."}

TASK:
Analyze the web search evidence above and extract the current official immigration policies for ${country}.
Extract:
1. Exact financial proof, living costs, or blocked account figure in local currency and approximate PKR.
2. Deposit protocol (e.g. Blocked Account, GIC, personal bank statement, or escrow).
3. Post-study work permit duration and PR pathways.
4. Part-time working hours allowed during semesters and vacations.
5. Embassy / VFS Global application procedures and wait time realities for Pakistani passport holders.
6. Crucial warnings and refusal-prevention advice.

OUTPUT FORMAT:
You MUST respond with a single valid JSON object strictly matching this schema:
{
  "country": "${country}",
  "flagEmoji": "flag emoji",
  "visaType": "official visa or residence permit title",
  "financialProofRequired": "exact currency amount and approx PKR",
  "blockedAccountDetails": "account mechanism (e.g. Sperrkonto, GIC, personal bank balance)",
  "postStudyWorkPermit": "exact post-study work visa duration",
  "partTimeWorkAllowance": "hours allowed per week or fortnight",
  "prPathwayEase": "High" | "Moderate" | "Selective",
  "embassyAppointmentPortal": "official booking portal name",
  "pakistanWaitTime": "current appointment wait time in Pakistan",
  "keyStepsPakistani": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "importantWarnings": ["Warning 1", "Warning 2", "Warning 3"],
  "sourceUrls": ${JSON.stringify(sourceUrls.slice(0, 6))},
  "lastUpdated": "${new Date().toISOString().split("T")[0]}"
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // High-capacity open weights model on Groq
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are an immigration data extraction system. You output only valid JSON based on verified immigration information and search snippets. Never return placeholders like 'Not confirmed'.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(content);

    return NextResponse.json({ success: true, data });
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
