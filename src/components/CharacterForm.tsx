"use client";

import { User } from "lucide-react";

interface CharacterData {
  name: string;
  description: string;
  age: string;
  personality: string;
  background: string;
  image: string | null;
  color?: string;
}

interface CharacterFormProps {
  character: CharacterData;
  onInputChange: (field: keyof CharacterData, value: string) => void;
}

export default function CharacterForm({
  character,
  onInputChange,
}: CharacterFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <User className="w-5 h-5 text-purple-500" />
        <span>캐릭터 정보</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            캐릭터 이름
          </label>
          <input
            type="text"
            value={character.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="캐릭터의 이름을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            나이
          </label>
          <input
            type="text"
            value={character.age}
            onChange={(e) => onInputChange("age", e.target.value)}
            placeholder="예: 25세, 20대 등"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            성격
          </label>
          <input
            type="text"
            value={character.personality}
            onChange={(e) => onInputChange("personality", e.target.value)}
            placeholder="예: 밝고 활발한, 조용하고 신중한"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            배경 스토리
          </label>
          <textarea
            value={character.background}
            onChange={(e) => onInputChange("background", e.target.value)}
            placeholder="캐릭터의 배경 스토리를 입력하세요"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            소개글
          </label>
          <textarea
            value={character.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="캐릭터에 대한 간단한 소개를 작성하세요"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            테마 색상
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={character.color || "#7c3aed"}
              onChange={(e) => onInputChange("color", e.target.value)}
              className="h-10 w-14 rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent"
            />
            <input
              type="text"
              value={character.color || "#7c3aed"}
              onChange={(e) => onInputChange("color", e.target.value)}
              placeholder="#RRGGBB 형식의 색상값"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
