"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { getCurrentUsername, logoutUser } from "@/data/auth";

export default function CharactersHeader() {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    setUsername(getCurrentUsername());
    const onStorage = () => setUsername(getCurrentUsername());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onLogout = () => {
    logoutUser();
    setUsername(null);
  };

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-red-500" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                KAKEGURUI 캐릭터 목록
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {username ? (
              <>
                <span className="text-gray-300">{username}</span>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-sm bg-black/40 border border-red-500/20 text-white rounded-lg hover:bg-black/60"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700"
                >
                  회원가입
                </Link>
              </>
            )}
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-red-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>새 캐릭터 만들기</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
