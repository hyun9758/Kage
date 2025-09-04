"use client";

import { Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  image: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

export default function ImageUpload({
  image,
  onImageUpload,
  onImageRemove,
}: ImageUploadProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <Upload className="w-5 h-5 text-purple-500" />
        <span>캐릭터 이미지</span>
      </h2>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-400 transition-colors relative">
        {image ? (
          <div className="space-y-4">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt="캐릭터 이미지"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={onImageRemove}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              이미지 제거
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                이미지를 업로드하세요
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF 파일 지원</p>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
