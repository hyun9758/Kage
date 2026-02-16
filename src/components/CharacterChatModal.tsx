"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, User, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Character {
  id: number;
  name: string;
  age: string;
  personality: string;
  description: string;
  background: string;
  image: string | null;
  color?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CharacterChatModalProps {
  character: Character;
  onClose: () => void;
}

export default function CharacterChatModal({
  character,
  onClose,
}: CharacterChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    ok: boolean | null;
    message: string;
  }>({ ok: null, message: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = character.color || "#7c3aed";

  // 채팅 모달이 열릴 때 API 연결 상태 확인
  useEffect(() => {
    let cancelled = false;
    setConnectionStatus({ ok: null, message: "연결 확인 중..." });
    fetch("/api/chat/status")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setConnectionStatus({
            ok: data.ok === true,
            message: data.message || (data.ok ? "연결됨" : "연결 안 됨"),
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setConnectionStatus({ ok: false, message: "연결 확인 실패" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || streamingContent !== null) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);
    setStreamingContent("");

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: {
            name: character.name,
            age: character.age,
            personality: character.personality,
            description: character.description,
            background: character.background,
          },
          messages: chatHistory,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "스트리밍을 시작할 수 없습니다.");
        setStreamingContent(null);
        setMessages((prev) => prev.slice(0, -1));
        setInput(text);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("스트림을 읽을 수 없습니다.");
        setStreamingContent(null);
        setMessages((prev) => prev.slice(0, -1));
        setInput(text);
        return;
      }

      const dec = new TextDecoder();
      let acc = "";
      let buf = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line) as {
              t?: string;
              done?: boolean;
              e?: string;
            };
            if (data.t) {
              acc += data.t;
              setStreamingContent(acc);
            }
            if (data.done) {
              streamDone = true;
              break;
            }
            if (data.e) {
              setError(data.e);
              setStreamingContent(null);
              setMessages((prev) => prev.slice(0, -1));
              setInput(text);
              return;
            }
          } catch {
            /* skip invalid line */
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: acc || "..." }]);
      setStreamingContent(null);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setStreamingContent(null);
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className="flex items-center gap-3 p-4 text-white shrink-0"
          style={{
            background: `linear-gradient(90deg, ${theme} 0%, ${theme}CC 100%)`,
          }}
        >
          {character.image ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
              <Image
                src={character.image}
                alt={character.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white/80" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">{character.name}</h2>
            <p className="text-white/90 text-sm truncate">AI와 대화하기</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 연결 상태 표시 */}
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
          {connectionStatus.ok === null ? (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              {connectionStatus.message}
            </div>
          ) : connectionStatus.ok ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{connectionStatus.message}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{connectionStatus.message}</span>
            </div>
          )}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto min-h-[240px] max-h-[50vh] p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              {character.name}에게 메시지를 보내보세요.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "text-white rounded-br-md"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-md"
                }`}
                style={
                  msg.role === "user" ? { backgroundColor: theme } : undefined
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {streamingContent !== null && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words inline">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 ml-0.5 bg-gray-600 dark:bg-gray-400 animate-pulse align-middle" />
                </p>
              </div>
            </div>
          )}
          {loading && streamingContent === null && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2.5 border border-gray-200 dark:border-gray-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">입력 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 입력 */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지 입력..."
              disabled={loading || streamingContent !== null}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || streamingContent !== null || !input.trim()}
              className="p-3 rounded-xl text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme }}
              aria-label="전송"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
