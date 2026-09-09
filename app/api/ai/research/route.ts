import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { formatSearchContext, searchWeb } from "@/lib/tavily";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetCountry,
      researchTopic,
      degreeLevel = "Master's (MS)",
      candidate,
    } = body;

    // Fallback profile if none passed in request
    const userProfile = {
      name: candidate?.name || "Applicant",
      nationality: candidate?.location || "International Student",
      degree: candidate?.degree || "Undergraduate Degree",
      university: candidate?.university || "Accredited University",
      cgpa: candidate?.cgpa ?? 3.0,
      skills: Array.isArray(candidate?.skills)
        ? candidate.skills.join(", ")
        : candidate?.skills || researchTopic || "Computer Science",
      projects: Array.isArray(candidate?.projects)
        ? candidate.projects.join(", ")
        : candidate?.projects || "Undergraduate projects",
      targetCountries:
        targetCountry ||
        candidate?.targetCountries?.join(", ") ||
        "Europe, Australia, Canada, New Zealand",
    };

    const ai = getGeminiClient();

    // Dynamically search based on user profile
    const searchQuery = `${userProfile.targetCountries} ${degreeLevel} scholarships ${userProfile.degree} ${researchTopic || userProfile.skills} international students deadline`;
    const sources = await searchWeb(searchQuery, 8);

    const prompt = `
You are an expert academic research advisor and scholarship intelligence agent.

Candidate Profile:
- Name: ${userProfile.name}
- Nationality / Location: ${userProfile.nationality}
- Background Degree: ${userProfile.degree} from ${userProfile.university}
- CGPA: ${userProfile.cgpa} / 4.00
- Core Technical Skills: ${userProfile.skills}
- Key Projects / Portfolio: ${userProfile.projects}
- Target Countries / Regions: ${userProfile.targetCountries}
- Target Degree: ${degreeLevel}
- Specific Research Interest: ${researchTopic || userProfile.skills}

Use the Tavily sources below as your primary evidence. Find 3 highly specific, real-world scholarship or research assistantship opportunities that match this applicant's CGPA (${userProfile.cgpa}) and field. Do not invent deadlines, eligibility criteria, or URLs. If a source does not confirm a detail, write "Not confirmed".

Return structured JSON according to the schema provided.

Tavily sources:
${formatSearchContext(sources)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You provide verified academic scholarship intelligence for international applicants. Never hallucinate fake domains or fake deadlines.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  universityOrProvider: { type: Type.STRING },
                  country: { type: Type.STRING },
                  fundingType: {
                    type: Type.STRING,
                    description:
                      "Fully Funded, Full Tuition Waiver, or Partial Funding",
                  },
                  matchScore: {
                    type: Type.NUMBER,
                    description: "Match score percentage out of 100",
                  },
                  matchRating: {
                    type: Type.STRING,
                    description:
                      "Strong Match, Possible Match, or Not Eligible",
                  },
                  matchReason: { type: Type.STRING },
                  stipendDetails: { type: Type.STRING },
                  estimatedDeadline: { type: Type.STRING },
                  keyRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  relevantProfessorsOrLabs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        labName: { type: Type.STRING },
                        email: { type: Type.STRING },
                        researchDomain: { type: Type.STRING },
                      },
                    },
                  },
                  officialPortalLink: { type: Type.STRING },
                },
                required: [
                  "title",
                  "universityOrProvider",
                  "country",
                  "fundingType",
                  "matchScore",
                  "matchRating",
                  "matchReason",
                  "stipendDetails",
                  "estimatedDeadline",
                  "keyRequirements",
                  "officialPortalLink",
                ],
              },
            },
          },
          required: ["opportunities"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Scholarship Research Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute dynamic AI research",
      },
      { status: 500 },
    );
  }
}
