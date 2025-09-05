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
  Edit,
  MoreVertical,
} from "lucide-react";
import CharacterForm from "./CharacterForm";

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
  onUpdate?: (updatedCharacter: Character) => void;
  showDeleteButton?: boolean;
  isDeleting?: boolean;
}

export default function CharacterCard({
  character,
  onRemove,
  onUpdate,
  showDeleteButton = false,
  isDeleting = false,
}: CharacterCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editCharacter, setEditCharacter] = useState<Character>(character);
  const theme = character.color || "#7c3aed";

  const handleDelete = () => {
    if (onRemove) {
      onRemove();
      setShowDeleteConfirm(false);
      setShowActionMenu(false);
    }
  };

  const handleInputChange = (field: keyof Character, value: string) => {
    setEditCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!onUpdate) return;

    setIsUpdating(true);
    try {
      console.log("🔄 캐릭터 수정 시작:", editCharacter);

      const response = await fetch(`/api/characters/${character.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editCharacter.name,
          age: editCharacter.age,
          personality: editCharacter.personality,
          description: editCharacter.description,
          background: editCharacter.background,
          color: editCharacter.color,
          image: editCharacter.image,
          // 통계는 유지
          likes: character.likes,
          shares: character.shares,
          views: character.views,
          owner: character.owner,
        }),
      });

      console.log("📡 API 응답 상태:", response.status);

      if (response.ok) {
        const updatedCharacter = await response.json();
        console.log("✅ 수정된 캐릭터 데이터:", updatedCharacter);

        // 로컬 상태 업데이트
        onUpdate(updatedCharacter);
        setShowEditModal(false);
        setShowActionMenu(false);
        alert("캐릭터가 성공적으로 수정되었습니다!");
      } else {
        const errorData = await response.json();
        console.error("❌ 수정 실패:", errorData);
        alert(
          `캐릭터 수정에 실패했습니다: ${errorData.error || "알 수 없는 오류"}`
        );
      }
    } catch (error) {
      console.error("❌ 수정 중 오류 발생:", error);
      alert("캐릭터 수정 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
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

            {/* 액션 메뉴 버튼 (본인 캐릭터만) */}
            {showDeleteButton && (
              <div className="relative">
                <button
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>

                {/* 액션 메뉴 드롭다운 */}
                {showActionMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowActionMenu(false);
                      }}
                      disabled={isUpdating}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Edit className="w-4 h-4" />
                      <span>수정하기</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowActionMenu(false);
                      }}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>삭제하기</span>
                    </button>
                  </div>
                )}
              </div>
            )}
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

          {/* 자세히 보기 버튼 */}
          <div className="pt-4">
            <button
              onClick={() => setShowDetails(true)}
              disabled={isDeleting}
              className="w-full text-white py-3 px-4 rounded-lg transition-all duration-200 text-center block shadow-lg hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              style={{ background: theme }}
            >
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                캐릭터 수정
              </h2>

              <CharacterForm
                character={editCharacter}
                onInputChange={handleInputChange}
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating || !editCharacter.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>수정 중...</span>
                    </>
                  ) : (
                    <span>수정 완료</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                  소개
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {character.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                  배경 스토리
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {character.background}
                  </p>
                </div>
              </div>

              {/* 통계 섹션 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                  통계
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Heart className="w-4 h-4" style={{ color: theme }} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {character.likes}
                    </div>
                    <div className="text-xs text-gray-500">좋아요</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Share2 className="w-4 h-4" style={{ color: theme }} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {character.shares}
                    </div>
                    <div className="text-xs text-gray-500">공유</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Eye className="w-4 h-4" style={{ color: theme }} />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {character.views}
                    </div>
                    <div className="text-xs text-gray-500">조회</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메뉴 외부 클릭 시 닫기 */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionMenu(false)}
        />
      )}
    </>
  );
}
