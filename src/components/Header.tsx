"use client";

import { useEffect, useState } from "react";
import { User, Camera, Home, Users, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              KAKEGURUI
            </h1>
          </div>

          {/* 데스크톱 네비게이션 메뉴 */}
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

          {/* 데스크톱 액션 버튼들 */}
          <div className="hidden md:flex items-center gap-3">
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
              <div className="flex items-center gap-2">
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

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-red-500/20">
            {/* 네비게이션 링크들 */}
            <nav className="flex flex-col space-y-2 mt-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>홈</span>
              </Link>
              <Link
                href="/characters"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>캐릭터 목록</span>
              </Link>
              <Link
                href="/board"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <span>자유 게시판</span>
              </Link>
              <Link
                href="/roleplay"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <span>역할 대화</span>
              </Link>
            </nav>

            {/* 사용자 정보 및 액션 버튼들 */}
            <div className="mt-4 pt-4 border-t border-red-500/20">
              {username ? (
                <div className="flex flex-col space-y-2">
                  <div className="px-4 py-2 text-gray-300">
                    <span className="text-sm">로그인된 사용자:</span>
                    <div className="font-medium">{username}</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="mx-4 px-4 py-2 text-sm bg-black/40 border border-red-500/20 text-white rounded-lg hover:bg-black/60"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white text-center border border-gray-600 rounded-lg hover:border-red-500/50 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-center"
                  >
                    회원가입
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  onTogglePreview();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mx-4 mt-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-red-500/25"
              >
                <Camera className="w-4 h-4" />
                <span>{isPreviewMode ? "편집하기" : "미리보기"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
