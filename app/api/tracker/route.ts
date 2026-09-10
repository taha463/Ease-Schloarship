import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// 1. GET ALL TRACKED APPLICATIONS FOR THE USER
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tracked_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true, nullsFirst: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error("Tracker GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load tracked items",
      },
      { status: 500 },
    );
  }
}

// 2. ADD A NEW SCHOLARSHIP TO USER'S TRACKER
export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const {
      scholarshipName,
      universityProvider,
      country,
      deadline,
      notes,
      status,
    } = await req.json();

    if (!scholarshipName || !universityProvider || !country) {
      return NextResponse.json(
        { success: false, error: "Missing required application fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tracked_applications")
      .insert({
        user_id: user.id,
        scholarship_name: scholarshipName,
        university_provider: universityProvider,
        country: country,
        deadline: deadline || null,
        status: status || "planning",
        notes: notes || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Tracker POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to track application" },
      { status: 500 },
    );
  }
}

// 3. UPDATE AN APPLICATION (STATUS, DEADLINE, NOTES)
export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id, status, deadline, notes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing application ID" },
        { status: 400 },
      );
    }

    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabaseAdmin
      .from("tracked_applications")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Tracker PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update item" },
      { status: 500 },
    );
  }
}

// 4. REMOVE APPLICATION FROM TRACKER
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing application ID" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("tracked_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    console.error("Tracker DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete item" },
      { status: 500 },
    );
  }
}
