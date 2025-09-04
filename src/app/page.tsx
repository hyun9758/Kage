"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import CharacterForm from "@/components/CharacterForm";
import CharacterPreview from "@/components/CharacterPreview";
import { getCurrentUsername } from "@/data/auth";
import { addUserCharacter } from "@/data/userCharacters";

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

  const onSaveCharacter = () => {
    const username = getCurrentUsername();
    if (!username) {
      alert("로그인 후 저장할 수 있습니다.");
      return;
    }
    if (!character.name.trim()) {
      alert("캐릭터 이름을 입력하세요.");
      return;
    }
    addUserCharacter({
      id: Date.now(),
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
    });
    alert("캐릭터가 저장되었습니다. 내 관리에서 확인하세요.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isPreviewMode ? (
          /* 편집 모드 */
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
          /* 미리보기 모드 */
          <CharacterPreview
            character={character}
            onShare={generateShareableImage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
