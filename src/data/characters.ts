import { supabase } from "@/lib/supabase";

export interface Character {
  id: number;
  name: string;
  age: string;
  personality: string;
  description: string;
  background: string;
  image: string | null;
  color?: string;
  likes: number;
  shares: number;
  views: number;
}

export interface StoredCharacter extends Character {
  owner: string;
  created_at?: string;
  updated_at?: string;
}

// 서버에서 모든 캐릭터 로드
export async function loadAllCharacters(): Promise<StoredCharacter[]> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading characters:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error loading characters:", error);
    return [];
  }
}

// 새 캐릭터 추가
export async function addCharacter(
  character: Omit<StoredCharacter, "id" | "created_at" | "updated_at">
): Promise<StoredCharacter | null> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .insert([character])
      .select()
      .single();

    if (error) {
      console.error("Error adding character:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error adding character:", error);
    return null;
  }
}

// 캐릭터 삭제
export async function removeCharacter(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("characters").delete().eq("id", id);

    if (error) {
      console.error("Error removing character:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error removing character:", error);
    return false;
  }
}

// 캐릭터 통계 업데이트 (좋아요, 공유, 조회)
export async function updateCharacterStats(
  id: number,
  stats: { likes?: number; shares?: number; views?: number }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("characters")
      .update(stats)
      .eq("id", id);

    if (error) {
      console.error("Error updating character stats:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating character stats:", error);
    return false;
  }
}

// 샘플 캐릭터들 (ID를 음수로 변경하여 충돌 방지)
export const sampleCharacters: Character[] = [
  {
    id: -1, // 음수 ID로 변경
    name: "아리아",
    age: "22세",
    personality: "밝고 활발한",
    description: "모험을 좋아하는 용감한 소녀",
    background:
      "마법의 숲에서 자란 엘프 소녀로, 자연과 친화적인 힘을 가지고 있습니다.",
    image: null,
    color: "#ef4444",
    likes: 42,
    shares: 8,
    views: 156,
  },
  {
    id: -2, // 음수 ID로 변경
    name: "카이",
    age: "25세",
    personality: "조용하고 신중한",
    description: "검술에 뛰어난 기사",
    background: "왕실 근위대 출신으로, 정의를 위해 싸우는 기사입니다.",
    image: null,
    color: "#22c55e",
    likes: 38,
    shares: 12,
    views: 203,
  },
  {
    id: -3, // 음수 ID로 변경
    name: "루나",
    age: "20세",
    personality: "신비롭고 지혜로운",
    description: "달의 마법을 다루는 마법사",
    background:
      "고대 마법사의 후손으로, 달의 힘을 다룰 수 있는 특별한 능력을 가지고 있습니다.",
    image: null,
    color: "#3b82f6",
    likes: 67,
    shares: 15,
    views: 289,
  },
];

export function getCharacterById(id: number): Character | undefined {
  return sampleCharacters.find((c) => c.id === id);
}
