"use client";

import { useEffect, useState } from "react";
import CharactersHeader from "@/components/CharactersHeader";
import CharactersStats from "@/components/CharactersStats";
import CharacterCard from "@/components/CharacterCard";
import EmptyState from "@/components/EmptyState";
import { sampleCharacters, type Character } from "@/data/characters";
import { getCurrentUsername } from "@/data/auth";

interface StoredCharacter extends Character {
  owner: string;
  created_at?: string;
  updated_at?: string;
}

type AnyCharacter = Character | StoredCharacter;

// 소유주 여부 판별용 타입 가드
const isOwnedByUser = (c: AnyCharacter): c is StoredCharacter => {
  return "owner" in c && c.owner !== undefined;
};

// 안전하게 숫자 통계 값을 뽑는 헬퍼
const getStat = (
  c: AnyCharacter,
  key: "likes" | "shares" | "views"
): number => {
  if (key in c && typeof c[key] === "number") {
    return c[key] as number;
  }
  return 0;
};

// 서버에서 캐릭터 로드
async function loadCharactersFromServer(): Promise<StoredCharacter[]> {
  try {
    const response = await fetch("/api/characters");
    if (!response.ok) {
      throw new Error("Failed to load characters");
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading characters:", error);
    return [];
  }
}

// 서버에서 캐릭터 삭제
async function removeCharacterFromServer(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/characters/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error removing character:", error);
    return false;
  }
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<AnyCharacter[]>([
    ...sampleCharacters,
  ]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setUsername(getCurrentUsername());

      // 서버에서 캐릭터 로드
      const serverCharacters = await loadCharactersFromServer();

      // 샘플 캐릭터와 서버 캐릭터 합치기
      setCharacters([...serverCharacters, ...sampleCharacters]);
      setLoading(false);
    };

    loadData();
  }, []);

  const totalLikes = characters.reduce(
    (sum, c) => sum + getStat(c, "likes"),
    0
  );
  const totalShares = characters.reduce(
    (sum, c) => sum + getStat(c, "shares"),
    0
  );
  const totalViews = characters.reduce(
    (sum, c) => sum + getStat(c, "views"),
    0
  );

  const onRemoveOwnCharacter = async (id: number) => {
    const userChars = characters.filter(isOwnedByUser);
    const target = userChars.find((c) => c.id === id);
    if (!target) return;
    if (username !== "admin" && target.owner !== username) return;

    const success = await removeCharacterFromServer(id);
    if (success) {
      // 로컬 상태에서도 제거
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("캐릭터 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CharactersHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <CharactersStats
          totalCharacters={characters.length}
          totalLikes={totalLikes}
          totalShares={totalShares}
          totalViews={totalViews}
        />

        {/* 캐릭터 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div key={character.id} className="relative group">
              <CharacterCard character={character as Character} />

              {isOwnedByUser(character) &&
                (username === "admin" || character.owner === username) && (
                  <button
                    onClick={() => onRemoveOwnCharacter(character.id)}
                    className="absolute top-2 right-2 hidden group-hover:block text-xs px-2 py-1 rounded bg-black/60 text-white border border-red-500/30"
                  >
                    삭제
                  </button>
                )}
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {characters.length === 0 && <EmptyState />}
      </main>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-red-500/20 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 KAKEGURUI - 나만의 캐릭터를 소개해보세요</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
