"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CharactersHeader from "@/components/CharactersHeader";
import { sampleCharacters } from "@/data/characters";
import {
  RoleplayMessage,
  loadRoleplayMessages,
  addRoleplayMessage,
  clearRoleplayMessages,
  removeRoleplayMessage,
} from "@/data/roleplay";
import { getCurrentUsername } from "@/data/auth";

export default function RoleplayPage() {
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(
    sampleCharacters[0]?.id || 1
  );
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const charactersById = useMemo(() => {
    const map = new Map<number, (typeof sampleCharacters)[number]>();
    for (const c of sampleCharacters) map.set(c.id, c);
    return map;
  }, []);

  useEffect(() => {
    setMessages(loadRoleplayMessages());
    setUsername(getCurrentUsername());
    const onStorage = () => setUsername(getCurrentUsername());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canManage = (m: RoleplayMessage) => {
    if (!username) return false;
    if (username === "admin") return true;
    return m.author === username;
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onSend = () => {
    if (!username) return;
    if (!content.trim() && !image) return;
    const msg: RoleplayMessage = {
      id: Date.now(),
      characterId: selectedCharacterId,
      content: content.trim(),
      image: image || undefined,
      author: username,
      createdAt: new Date().toISOString(),
    };
    addRoleplayMessage(msg);
    setMessages((prev) => [msg, ...prev]);
    setContent("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDeleteMessage = (id: number) => {
    const target = messages.find((m) => m.id === id);
    if (!target || !canManage(target)) return;
    removeRoleplayMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAll = () => {
    clearRoleplayMessages();
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CharactersHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">역할 대화 게시판</h1>
          <div className="flex items-center gap-4">
            <Link href="/board" className="text-red-400 hover:text-red-300">
              자유 게시판
            </Link>
            <Link href="/" className="text-red-400 hover:text-red-300">
              홈으로
            </Link>
          </div>
        </div>

        {username ? (
          <div className="bg-black/70 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedCharacterId}
                onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
                className="md:col-span-1 px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {sampleCharacters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="대사를 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="md:col-span-2 px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="md:col-span-1 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-red-500/20 text-white hover:bg-black/60"
                >
                  이미지
                </button>
                <button
                  onClick={onSend}
                  className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                >
                  전송
                </button>
              </div>
            </div>
            {image && (
              <div className="mt-3 text-sm text-gray-300">이미지 첨부됨</div>
            )}
          </div>
        ) : (
          <div className="bg-black/70 border border-red-500/20 rounded-2xl p-6 mb-8 text-gray-300">
            대화 참여는 로그인한 사용자만 가능합니다.{" "}
            <Link
              href="/auth/login"
              className="text-red-400 hover:text-red-300"
            >
              로그인
            </Link>{" "}
            또는{" "}
            <Link
              href="/auth/register"
              className="text-red-400 hover:text-red-300"
            >
              회원가입
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-10 border border-dashed border-red-500/20 rounded-2xl">
              아직 대화가 없습니다. 첫 대사를 남겨보세요!
            </div>
          ) : (
            messages.map((m) => {
              const ch = charactersById.get(m.characterId);
              const isLeft = m.characterId % 2 === 1;
              const color = ch?.color || "#ef4444";
              return (
                <div
                  key={m.id}
                  className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {!isLeft && (
                      <div className="text-xs text-gray-400 mt-1">
                        {m.author || "익명"}
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-black/40 border border-red-500/20 flex items-center justify-center text-white overflow-hidden">
                      {ch?.image ? (
                        <Image
                          src={ch.image}
                          alt={ch.name}
                          width={40}
                          height={40}
                          className="object-cover w-10 h-10"
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm text-gray-300">{ch?.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(m.createdAt).toLocaleString("ko-KR")}
                        </div>
                        {canManage(m) && (
                          <button
                            onClick={() => onDeleteMessage(m.id)}
                            className="text-[10px] text-red-300 hover:text-red-200"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <div
                        className="rounded-2xl p-3 text-white"
                        style={{ background: color }}
                      >
                        {m.content}
                        {m.image && (
                          <div className="mt-2 relative w-56 h-56 rounded-lg overflow-hidden">
                            <Image
                              src={m.image}
                              alt="첨부 이미지"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {isLeft && (
                      <div className="text-xs text-gray-400 mt-1">
                        {m.author || "익명"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 justify-end">
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg bg-black/40 border border-red-500/20 text-white hover:bg-black/60"
          >
            전체 삭제
          </button>
          <Link
            href="/board"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
          >
            자유 게시판으로
          </Link>
        </div>
      </main>
    </div>
  );
}
