import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: 모든 캐릭터 조회
export async function GET() {
  try {
    console.log("Fetching characters from Supabase...");

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(
      "Characters fetched successfully:",
      data?.length || 0,
      "characters"
    );
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: 새 캐릭터 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating character:", body.name);

    const { data, error } = await supabase
      .from("characters")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Character created successfully:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API insert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
