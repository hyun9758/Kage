"use client";

import { Heart, Share2, Eye } from "lucide-react";

interface CharactersStatsProps {
  totalCharacters: number;
  totalLikes: number;
  totalShares: number;
  totalViews: number;
}

export default function CharactersStats({
  totalCharacters,
  totalLikes,
  totalShares,
  totalViews,
}: CharactersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-black/80 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/10 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="font-semibold text-white mb-2">총 캐릭터</h3>
        <p className="text-2xl font-bold text-red-400">{totalCharacters}</p>
      </div>

      <div className="bg-black/80 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/10 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-semibold text-white mb-2">총 좋아요</h3>
        <p className="text-2xl font-bold text-red-400">{totalLikes}</p>
      </div>

      <div className="bg-black/80 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/10 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-semibold text-white mb-2">총 공유</h3>
        <p className="text-2xl font-bold text-red-400">{totalShares}</p>
      </div>

      <div className="bg-black/80 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/10 text-center">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-semibold text-white mb-2">총 조회수</h3>
        <p className="text-2xl font-bold text-red-400">{totalViews}</p>
      </div>
    </div>
  );
}
