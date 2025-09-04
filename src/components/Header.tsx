"use client";

import { useEffect, useState } from "react";
import { User, Camera, Home, Users } from "lucide-react";
import Link from "next/link";
import { getCurrentUsername, logoutUser, seedAdminAccount } from "@/data/auth";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export default function Header({
  isPreviewMode,
  onTogglePreview,
}: HeaderProps) {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    // seed temporary admin once
    seedAdminAccount("admin", "admin1234");
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              KAKEGURUI
            </h1>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>홈</span>
            </Link>
            <Link
              href="/characters"
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>캐릭터 목록</span>
            </Link>
            <Link
              href="/board"
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <span>자유 게시판</span>
            </Link>
            <Link
              href="/roleplay"
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <span>역할 대화</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {username ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{username}</span>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-sm bg-black/40 border border-red-500/20 text-white rounded-lg hover:bg-black/60"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
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
              </div>
            )}

            <button
              onClick={onTogglePreview}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-red-500/25"
            >
              <Camera className="w-4 h-4" />
              <span>{isPreviewMode ? "편집하기" : "미리보기"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
