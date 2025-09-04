import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: 특정 캐릭터 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[GET] Fetching character with ID: ${id}`);

    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[GET] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.log("[GET] Character fetched successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: 캐릭터 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log(`[PUT] Updating character with ID: ${id}`, body);

    const { data, error } = await supabase
      .from("characters")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PUT] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[PUT] Character updated successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PUT] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: 캐릭터 완전 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const characterId = parseInt(id);

    console.log(`[DELETE] Starting deletion for character ID: ${characterId}`);

    // 1. 캐릭터 존재 확인
    console.log(`[DELETE] Step 1: Checking if character exists...`);
    const { data: existingCharacter, error: fetchError } = await supabase
      .from("characters")
      .select("id, name, owner")
      .eq("id", characterId)
      .single();

    if (fetchError) {
      console.error("[DELETE] Character not found:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: "Character not found",
          message: "캐릭터를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    console.log("[DELETE] Character found:", existingCharacter);

    // 2. 실제 삭제 실행
    console.log(`[DELETE] Step 2: Executing delete operation...`);
    const { error: deleteError, count } = await supabase
      .from("characters")
      .delete({ count: "exact" })
      .eq("id", characterId);

    if (deleteError) {
      console.error("[DELETE] Delete operation failed:", deleteError);
      return NextResponse.json(
        {
          success: false,
          error: deleteError.message,
          message: "삭제 작업이 실패했습니다.",
        },
        { status: 500 }
      );
    }

    console.log(`[DELETE] Delete operation completed. Rows affected: ${count}`);

    // 3. 삭제 확인
    if (count === 0) {
      console.warn("[DELETE] No rows were deleted");
      return NextResponse.json(
        {
          success: false,
          error: "No rows deleted",
          message: "삭제할 캐릭터가 없습니다.",
        },
        { status: 404 }
      );
    }

    // 4. 삭제 검증
    console.log(`[DELETE] Step 3: Verifying deletion...`);
    const { data: verifyData, error: verifyError } = await supabase
      .from("characters")
      .select("id")
      .eq("id", characterId)
      .single();

    if (verifyError && verifyError.code === "PGRST116") {
      // PGRST116 = "No rows found" - 삭제 성공
      console.log(
        `[DELETE] ✅ SUCCESS: Character ${existingCharacter.name} (ID: ${characterId}) permanently deleted from Supabase`
      );
      return NextResponse.json({
        success: true,
        message: "캐릭터가 완전히 삭제되었습니다.",
        deletedCharacter: existingCharacter,
      });
    } else if (verifyData) {
      // 캐릭터가 여전히 존재 - 삭제 실패
      console.error(
        "[DELETE] ❌ FAILED: Character still exists after deletion"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Character still exists",
          message: "삭제에 실패했습니다. 캐릭터가 여전히 존재합니다.",
        },
        { status: 500 }
      );
    }

    // 기본 성공 응답
    console.log(
      `[DELETE] ✅ Character ${existingCharacter.name} (ID: ${characterId}) deleted successfully`
    );
    return NextResponse.json({
      success: true,
      message: "캐릭터가 완전히 삭제되었습니다.",
      deletedCharacter: existingCharacter,
    });
  } catch (error) {
    console.error("[DELETE] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
