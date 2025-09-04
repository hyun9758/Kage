"use client";

import { useEffect, useState } from "react";
import CharactersHeader from "@/components/CharactersHeader";
import CharactersStats from "@/components/CharactersStats";
import CharacterCard from "@/components/CharacterCard";
import EmptyState from "@/components/EmptyState";
import { sampleCharacters, type Character } from "@/data/characters";
import { getCurrentUsername } from "@/data/auth";

interface StoredCharacter {
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
  owner?: string;
}

type AnyCharacter = Character | StoredCharacter;

export default function CharactersPage() {
  const [characters, setCharacters] = useState<AnyCharacter[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  // 서버에서 캐릭터 로드
  const loadCharactersFromServer = async () => {
    try {
      console.log("[CLIENT] Loading characters from server...");
      const response = await fetch("/api/characters");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const serverCharacters = await response.json();
      console.log(
        "[CLIENT] Server characters loaded:",
        serverCharacters.length
      );
      return serverCharacters;
    } catch (error) {
      console.error("[CLIENT] Error loading characters:", error);
      return [];
    }
  };

  // 캐릭터 삭제 (사용자 등록 캐릭터만)
  const deleteCharacter = async (id: number) => {
    try {
      setDeleting(id);
      console.log(`[CLIENT] Deleting character ID: ${id}`);

      const response = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("[CLIENT] Delete result:", result);

      if (result.success) {
        // 성공: UI에서 캐릭터 제거 (사용자 등록 캐릭터만)
        setCharacters((prev) => prev.filter((c) => c.id !== id));
        alert(`✅ ${result.message}`);
        console.log(`[CLIENT] Character ${id} removed from UI`);
      } else {
        // 실패: 에러 메시지만 표시
        alert(`❌ ${result.message}`);
        console.error(
          `[CLIENT] Delete failed for character ${id}:`,
          result.error
        );
      }
    } catch (error) {
      console.error("[CLIENT] Delete error:", error);
      alert("❌ 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setUsername(getCurrentUsername());
      const serverCharacters = await loadCharactersFromServer();

      // 샘플 캐릭터 3명 + 사용자 등록 캐릭터들 (ID 충돌 없음)
      const allCharacters = [...sampleCharacters, ...serverCharacters];

      console.log(
        `[CLIENT] Total characters: ${allCharacters.length} (${sampleCharacters.length} samples + ${serverCharacters.length} user registered)`
      );
      setCharacters(allCharacters);
      setLoading(false);
    };
    loadData();
  }, []);

  const totalLikes = characters.reduce(
    (sum, char) => sum + (char.likes || 0),
    0
  );
  const totalShares = characters.reduce(
    (sum, char) => sum + (char.shares || 0),
    0
  );
  const totalViews = characters.reduce(
    (sum, char) => sum + (char.views || 0),
    0
  );

  const isOwnedByUser = (c: AnyCharacter): c is StoredCharacter => {
    return (c as StoredCharacter).owner !== undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">캐릭터를 불러오는 중...</div>
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

        {characters.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => {
              const isOwner =
                isOwnedByUser(character) && character.owner === username;
              const isDeleting = deleting === character.id;

              return (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onRemove={
                    isOwner ? () => deleteCharacter(character.id) : undefined
                  }
                  showDeleteButton={isOwner}
                  isDeleting={isDeleting}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
