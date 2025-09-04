"use client";

import Image from "next/image";
import {
  User,
  Heart,
  Star,
  Share2,
  Download,
  Palette,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";

interface CharacterData {
  name: string;
  description: string;
  age: string;
  personality: string;
  background: string;
  image: string | null;
  color?: string;
}

interface CharacterPreviewProps {
  character: CharacterData;
  onShare: () => void;
}

export default function CharacterPreview({
  character,
  onShare,
}: CharacterPreviewProps) {
  const theme = character.color || "#7c3aed"; // fallback to purple-600
  return (
    <div className="max-w-5xl mx-auto">
      {/* 캐릭터 프로필 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
        {/* 헤더 섹션 */}
        <div
          className="p-8 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${theme} 0%, ${theme}CC 50%, ${theme}99 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* 프로필 이미지 */}
              {character.image ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <Image
                    src={character.image}
                    alt={character.name || "캐릭터"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
                  <User className="w-16 h-16 text-white/60" />
                </div>
              )}

              {/* 기본 정보 */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {character.name || "캐릭터 이름"}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90">
                  {character.age && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{character.age}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>캐릭터</span>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex space-x-2">
                <button
                  onClick={onShare}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                  title="공유하기"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                  title="좋아요"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 왼쪽 컬럼 */}
            <div className="space-y-6">
              {/* 성격 */}
              {character.personality && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    background: `${theme}1A`,
                    borderColor: theme,
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme }}
                    >
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      성격
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {character.personality}
                  </p>
                </div>
              )}

              {/* 소개 */}
              {character.description && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    background: `${theme}14`,
                    borderColor: theme,
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme }}
                    >
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      소개
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {character.description}
                  </p>
                </div>
              )}
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              {/* 배경 스토리 */}
              {character.background && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    background: `${theme}14`,
                    borderColor: theme,
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      배경 스토리
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {character.background}
                  </p>
                </div>
              )}

              {/* 추가 정보 카드 */}
              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: `${theme}0D`,
                  borderColor: theme,
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    상세 정보
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>생성일:</span>
                    <span>{new Date().toLocaleDateString("ko-KR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>상태:</span>
                    <span className="text-green-600 dark:text-green-400">
                      활성
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>카테고리:</span>
                    <span>캐릭터</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onShare}
              className="flex-1 text-white py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg"
              style={{ background: theme }}
            >
              <Share2 className="w-5 h-5" />
              <span>공유하기</span>
            </button>
            <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold">
              <Download className="w-5 h-5" />
              <span>이미지 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${theme}1A` }}
          >
            <Heart className="w-6 h-6" style={{ color: theme }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            좋아요
          </h3>
          <p className="text-2xl font-bold" style={{ color: theme }}>
            0
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${theme}1A` }}
          >
            <Share2 className="w-6 h-6" style={{ color: theme }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            공유
          </h3>
          <p className="text-2xl font-bold" style={{ color: theme }}>
            0
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${theme}1A` }}
          >
            <Star className="w-6 h-6" style={{ color: theme }} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            조회수
          </h3>
          <p className="text-2xl font-bold" style={{ color: theme }}>
            1
          </p>
        </div>
      </div>
    </div>
  );
}
