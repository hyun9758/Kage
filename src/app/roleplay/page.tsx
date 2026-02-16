"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CharactersHeader from "@/components/CharactersHeader";
import { loadAllCharacters, StoredCharacter } from "@/data/characters";
import { getCurrentUsername } from "@/data/auth";

interface RoleplayMessage {
  id: number;
  character_id: number;
  message: string;
  author: string;
  created_at: string;
}

// 서버에서 롤플레이 메시지 로드
async function loadRoleplayMessagesFromServer(): Promise<RoleplayMessage[]> {
  try {
    const response = await fetch("/api/roleplay");
    if (!response.ok) {
      throw new Error("Failed to load roleplay messages");
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading roleplay messages:", error);
    return [];
  }
}

// 서버에 롤플레이 메시지 추가
async function addRoleplayMessageToServer(
  message: Omit<RoleplayMessage, "id" | "created_at">
): Promise<RoleplayMessage | null> {
  try {
    const response = await fetch("/api/roleplay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error("Failed to add roleplay message");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding roleplay message:", error);
    return null;
  }
}

export default function RoleplayPage() {
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const charactersById = useMemo(() => {
    const map = new Map<number, StoredCharacter>();
    for (const c of characters) map.set(c.id, c);
    return map;
  }, [characters]);

  const selectedCharacter = selectedCharacterId
    ? charactersById.get(selectedCharacterId)
    : null;

  useEffect(() => {
    const loadData = async () => {
      setUsername(getCurrentUsername());

      // 캐릭터 목록과 롤플레이 메시지를 병렬로 로드
      const [charactersData, serverMessages] = await Promise.all([
        loadAllCharacters(),
        loadRoleplayMessagesFromServer(),
      ]);

      setCharacters(charactersData);
      setMessages(serverMessages);

      // 첫 번째 캐릭터를 기본 선택
      if (charactersData.length > 0 && !selectedCharacterId) {
        setSelectedCharacterId(charactersData[0].id);
      }

      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 한 번만 로드
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username || !selectedCharacterId) return;

    const newMessage: Omit<RoleplayMessage, "id" | "created_at"> = {
      character_id: selectedCharacterId,
      message: content.trim(),
      author: username,
    };

    const savedMessage = await addRoleplayMessageToServer(newMessage);
    if (savedMessage) {
      setMessages((prev) => [...prev, savedMessage]);
      setContent("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const handleRemoveMessage = async (id: number) => {
    if (!username) return;

    const message = messages.find((m) => m.id === id);
    if (!message || (message.author !== username && username !== "admin")) {
      alert("본인의 메시지만 삭제할 수 있습니다.");
      return;
    }

    try {
      const response = await fetch(`/api/roleplay/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("메시지 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error removing message:", error);
      alert("메시지 삭제 중 오류가 발생했습니다.");
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 캐릭터 선택 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">캐릭터 선택</h2>
          {characters.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border border-dashed border-red-500/20 rounded-lg">
              <p>등록된 캐릭터가 없습니다.</p>
              <Link
                href="/characters"
                className="text-red-400 hover:text-red-300 mt-2 inline-block"
              >
                캐릭터 만들러 가기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {characters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacterId(character.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCharacterId === character.id
                      ? "border-red-500 bg-red-500/20"
                      : "border-gray-600 hover:border-red-500/50"
                  }`}
                >
                  <div className="text-center">
                    {character.image ? (
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden">
                        <Image
                          src={character.image}
                          alt={character.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl mb-2">👤</div>
                    )}
                    <div className="text-white font-medium">
                      {character.name}
                    </div>
                    <div className="text-gray-400 text-sm">{character.age}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 캐릭터 정보 */}
        {selectedCharacter && (
          <div className="mb-8 p-6 bg-black/50 rounded-lg border border-red-500/20">
            <div className="flex items-center space-x-4">
              {selectedCharacter.image ? (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-4xl">👤</div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedCharacter.name}
                </h3>
                <p className="text-gray-300">{selectedCharacter.description}</p>
                <p className="text-gray-400 text-sm mt-1">
                  성격: {selectedCharacter.personality}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 메시지 입력 폼 */}
        {username && selectedCharacterId && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-black/50 rounded-lg p-6 border border-red-500/20">
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  메시지
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="롤플레이 메시지를 입력하세요..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-white font-medium mb-2">
                  이미지 (선택사항)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                {image && (
                  <div className="mt-2">
                    <Image
                      src={image}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!content.trim()}
                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                메시지 전송
              </button>
            </div>
          </form>
        )}

        {!selectedCharacterId && characters.length > 0 && (
          <div className="mb-8 p-6 bg-black/50 rounded-lg border border-red-500/20 text-center text-gray-400">
            캐릭터를 선택해주세요.
          </div>
        )}

        {/* 메시지 목록 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">롤플레이 메시지</h2>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              아직 메시지가 없습니다. 첫 번째 메시지를 작성해보세요!
            </div>
          ) : (
            messages.map((message) => {
              const character = charactersById.get(message.character_id);
              return (
                <div
                  key={message.id}
                  className="bg-black/50 rounded-lg p-6 border border-red-500/20"
                >
                  <div className="flex items-start space-x-4">
                    {character?.image ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={character.image}
                          alt={character.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl">👤</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-white">
                          {character?.name || "알 수 없는 캐릭터"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{message.author}</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{message.message}</p>
                      {username &&
                        (message.author === username ||
                          username === "admin") && (
                          <button
                            onClick={() => handleRemoveMessage(message.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            삭제
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
