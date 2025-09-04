"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CharactersHeader from "@/components/CharactersHeader";
import { loginUser } from "@/data/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CharactersHeader />
      <main className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">로그인</h1>
        <form
          onSubmit={onSubmit}
          className="bg-black/70 border border-red-500/20 rounded-2xl p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors"
          >
            로그인
          </button>
          <div className="text-sm text-gray-400">
            계정이 없으신가요?{" "}
            <Link
              href="/auth/register"
              className="text-red-400 hover:text-red-300"
            >
              회원가입
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
