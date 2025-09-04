"use client";

import { useEffect, useState } from "react";
import CharactersHeader from "@/components/CharactersHeader";
import CharactersStats from "@/components/CharactersStats";
import CharacterCard from "@/components/CharacterCard";
import EmptyState from "@/components/EmptyState";
import { sampleCharacters, type Character } from "@/data/characters";
import { getCurrentUsername } from "@/data/auth";
import {
  loadUserCharacters,
  removeUserCharacter,
  type StoredCharacter,
} from "@/data/userCharacters";

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
  return key in c && typeof (c as any)[key] === "number"
    ? ((c as any)[key] as number)
    : 0;
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<AnyCharacter[]>([
    ...sampleCharacters,
  ]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getCurrentUsername());
    const userChars = loadUserCharacters();
    setCharacters([...userChars, ...sampleCharacters]);
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

  const onRemoveOwnCharacter = (id: number) => {
    const userChars = loadUserCharacters();
    const target = userChars.find((c) => c.id === id);
    if (!target) return;
    if (username !== "admin" && target.owner !== username) return;

    removeUserCharacter(id);
    const updatedUserChars = loadUserCharacters();
    setCharacters([...updatedUserChars, ...sampleCharacters]);
  };

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
              {/* CharacterCard가 Character만 받는다면, 실제 런타임 호환을 전제로 캐스팅 */}
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
