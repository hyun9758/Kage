"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-white mb-2">
        아직 캐릭터가 없습니다
      </h3>
      <p className="text-gray-400 mb-6">첫 번째 캐릭터를 만들어보세요!</p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
      >
        <Plus className="w-5 h-5" />
        <span>캐릭터 만들기</span>
      </Link>
    </div>
  );
}
