import { supabase } from "@/lib/supabase";

export interface RoleplayMessage {
  id: number;
  character_id: number;
  message: string;
  author: string;
  created_at: string;
}

// 서버에서 모든 롤플레이 메시지 로드
export async function loadRoleplayMessages(): Promise<RoleplayMessage[]> {
  try {
    const { data, error } = await supabase
      .from("roleplay_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading roleplay messages:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error loading roleplay messages:", error);
    return [];
  }
}

// 새 롤플레이 메시지 추가
export async function addRoleplayMessage(
  message: Omit<RoleplayMessage, "id" | "created_at">
): Promise<RoleplayMessage | null> {
  try {
    const { data, error } = await supabase
      .from("roleplay_messages")
      .insert([message])
      .select()
      .single();

    if (error) {
      console.error("Error adding roleplay message:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error adding roleplay message:", error);
    return null;
  }
}

// 특정 캐릭터의 롤플레이 메시지 로드
export async function loadCharacterRoleplayMessages(
  characterId: number
): Promise<RoleplayMessage[]> {
  try {
    const { data, error } = await supabase
      .from("roleplay_messages")
      .select("*")
      .eq("character_id", characterId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading character roleplay messages:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error loading character roleplay messages:", error);
    return [];
  }
}
