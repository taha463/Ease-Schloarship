import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

// 1. GET USER PROFILE
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authentication token" },
        { status: 401 },
      );
    }

    // Verify user identity via Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // Fetch the user's profile from the database
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error("Profile GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// 2. UPSERT (SAVE OR UPDATE) USER PROFILE
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing authentication token" },
        { status: 401 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const profileData = {
      id: user.id,
      full_name: body.fullName || body.name || "Student Applicant",
      degree: body.degree || "Bachelor of Science",
      university: body.university || "",
      graduation_date: body.graduationDate || "",
      cgpa: body.cgpa ? parseFloat(body.cgpa) : null,
      max_cgpa: body.maxCgpa ? parseFloat(body.maxCgpa) : 4.0,
      location: body.location || "",
      phone: body.phone || "",
      summary: body.summary || "",
      skills: body.skills || {
        languages: [],
        aiMl: [],
        backend: [],
        frontend: [],
      },
      experience: body.experience || [],
      projects: body.projects || [],
      certifications: body.certifications || [],
      target_preferences: body.targetPreferences || {
        degreeGoal: "Master of Science",
        fieldOfStudy: [],
        includedRegions: [],
        excludedRegions: [],
        minFundingNeeded: "Fully Funded",
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(profileData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Profile POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 },
    );
  }
}
