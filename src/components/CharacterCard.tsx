"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Eye } from "lucide-react";

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
}

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div
      className="bg-black/80 border rounded-2xl shadow-lg shadow-red-500/10 overflow-hidden hover:shadow-xl hover:shadow-red-500/20 transition-all duration-200 hover:border-red-500/40"
      style={{ borderColor: character.color || undefined }}
    >
      {/* 캐릭터 이미지 */}
      <div className="h-48 bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center relative overflow-hidden">
        {character.image ? (
          <Image
            src={character.image}
            alt={character.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">👤</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* 캐릭터 정보 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{character.name}</h3>
          <span
            className="text-sm"
            style={{ color: character.color || "#f87171" }}
          >
            {character.age}
          </span>
        </div>

        <p className="text-gray-300 mb-3 line-clamp-2">
          {character.description}
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <span
            className="px-2 py-1 text-xs rounded-full border"
            style={{
              color: character.color || "#f87171",
              borderColor: character.color || "#fecaca",
              backgroundColor: character.color
                ? `${character.color}1A`
                : "#7f1d1d1a",
            }}
          >
            {character.personality}
          </span>
        </div>

        {/* 통계 */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart
                className="w-4 h-4"
                style={{ color: character.color || "#ef4444" }}
              />
              <span>{character.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2
                className="w-4 h-4"
                style={{ color: character.color || "#ef4444" }}
              />
              <span>{character.shares}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye
                className="w-4 h-4"
                style={{ color: character.color || "#ef4444" }}
              />
              <span>{character.views}</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="pt-4 border-t border-red-500/20">
          <Link
            href={`/characters/${character.id}`}
            className="w-full text-white py-2 px-4 rounded-lg transition-all duration-200 text-center block shadow-lg"
            style={{
              background:
                character.color ||
                "linear-gradient(to right, #ef4444, #dc2626)",
            }}
          >
            자세히 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
