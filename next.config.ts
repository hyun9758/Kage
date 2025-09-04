import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 실험적 기능으로 빌드 속도 향상
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
