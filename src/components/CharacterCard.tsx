"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  Eye,
  User,
  Calendar,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";

interface Character {
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

interface CharacterCardProps {
  character: Character;
  onRemove?: () => void;
  showDeleteButton?: boolean;
  isDeleting?: boolean;
}

export default function CharacterCard({
  character,
  onRemove,
  showDeleteButton = false,
  isDeleting = false,
}: CharacterCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const theme = character.color || "#7c3aed";

  const handleDelete = () => {
    if (onRemove) {
      onRemove();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* 헤더 */}
        <div
          className="p-4 sm:p-6 text-white relative"
          style={{
            background: `linear-gradient(90deg, ${theme} 0%, ${theme}CC 50%, ${theme}99 100%)`,
          }}
        >
          <div className="flex items-center space-x-4">
            {/* 프로필 이미지 */}
            {character.image ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white/60" />
              </div>
            )}

            {/* 기본 정보 */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold">{character.name}</h3>
              <div className="flex items-center space-x-3 text-white/90 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{character.age}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{character.personality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* 소개 */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              소개
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {character.description}
            </p>
          </div>

          {/* 통계 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" style={{ color: theme }} />
                <span className="text-sm">{character.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="w-4 h-4" style={{ color: theme }} />
                <span className="text-sm">{character.shares}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" style={{ color: theme }} />
                <span className="text-sm">{character.views}</span>
              </div>
            </div>

            {character.owner && (
              <span className="text-xs text-gray-500">
                by {character.owner}
              </span>
            )}
          </div>

          {/* 버튼들 */}
          <div className="pt-4 space-y-2">
            {/* 자세히 보기 버튼 */}
            <button
              onClick={() => setShowDetails(true)}
              disabled={isDeleting}
              className="w-full text-white py-2 px-4 rounded-lg transition-all duration-200 text-center block shadow-lg hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: theme }}
            >
              자세히 보기
            </button>

            {/* 삭제 버튼 (텍스트) */}
            {showDeleteButton && onRemove && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full text-red-500 py-2 px-4 rounded-lg border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <span>캐릭터 삭제</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              캐릭터 삭제
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <strong>{character.name}</strong> 캐릭터를 정말 삭제하시겠습니까?
              <br />
              <span className="text-sm text-red-500">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <span>삭제</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 보기 모달 - 이미지 포함 */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="p-6 text-white"
              style={{
                background: `linear-gradient(90deg, ${theme} 0%, ${theme}CC 50%, ${theme}99 100%)`,
              }}
            >
              <div className="flex items-center space-x-4">
                {/* 큰 프로필 이미지 */}
                {character.image ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <User className="w-12 h-12 text-white/60" />
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{character.name}</h1>
                  <p className="text-white/90">
                    {character.age} • {character.personality}
                  </p>
                  {character.owner && (
                    <p className="text-white/80 text-sm mt-1">
                      by {character.owner}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  소개
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {character.description}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  배경 스토리
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {character.background}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
