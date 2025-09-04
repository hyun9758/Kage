"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Heart, Share2, Calendar, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import CharacterForm from "@/components/CharacterForm";
import { getCurrentUsername } from "@/data/auth";

interface CharacterData {
  name: string;
  description: string;
  age: string;
  personality: string;
  background: string;
  image: string | null;
  color?: string;
}

export default function Home() {
  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    description: "",
    age: "",
    personality: "",
    background: "",
    image: null,
    color: "#7c3aed",
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCharacter((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof CharacterData, value: string) => {
    setCharacter((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageRemove = () => {
    setCharacter((prev) => ({ ...prev, image: null }));
  };

  const generateShareableImage = () => {
    alert("공유 가능한 이미지가 생성되었습니다!");
  };

  const onSaveCharacter = async () => {
    const username = getCurrentUsername();
    if (!username) {
      alert("로그인 후 저장할 수 있습니다.");
      return;
    }
    if (!character.name.trim()) {
      alert("캐릭터 이름을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: character.name.trim(),
          age: character.age,
          personality: character.personality,
          description: character.description,
          background: character.background,
          image: character.image,
          color: character.color,
          likes: 0,
          shares: 0,
          views: 0,
          owner: username,
        }),
      });

      if (response.ok) {
        alert("캐릭터가 저장되었습니다. 모든 사용자가 볼 수 있습니다!");
        setCharacter({
          name: "",
          description: "",
          age: "",
          personality: "",
          background: "",
          image: null,
          color: "#7c3aed",
        });
        window.location.href = "/characters";
      } else {
        alert("캐릭터 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving character:", error);
      alert("캐릭터 저장 중 오류가 발생했습니다.");
    }
  };

  // 간결한 미리보기 컴포넌트
  const SimplePreview = ({ character }: { character: CharacterData }) => {
    const theme = character.color || "#7c3aed";

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div
          className="p-6 text-white"
          style={{
            background: `linear-gradient(90deg, ${theme} 0%, ${theme}CC 50%, ${theme}99 100%)`,
          }}
        >
          <div className="flex items-center space-x-4">
            {character.image ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <User className="w-10 h-10 text-white/60" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {character.name || "캐릭터 이름"}
              </h1>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                {character.age && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{character.age}</span>
                  </div>
                )}
                {character.personality && (
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{character.personality}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {character.description && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                소개
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {character.description}
              </p>
            </div>
          )}
          {character.background && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                배경 스토리
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {character.background}
              </p>
            </div>
          )}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={generateShareableImage}
              className="flex-1 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg"
              style={{ background: theme }}
            >
              <Share2 className="w-4 h-4" />
              <span>공유하기</span>
            </button>
            <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold">
              <Heart className="w-4 h-4" />
              <span>좋아요</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isPreviewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ImageUpload
              image={character.image}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
            />
            <div className="space-y-4">
              <CharacterForm
                character={character}
                onInputChange={handleInputChange}
              />
              <div className="flex justify-end">
                <button
                  onClick={onSaveCharacter}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                >
                  캐릭터 저장
                </button>
              </div>
            </div>
          </div>
        ) : (
          <SimplePreview character={character} />
        )}
      </main>

      <Footer />
    </div>
  );
}
