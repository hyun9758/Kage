export interface Character {
  id: number;
  name: string;
  age: string;
  personality: string;
  description: string;
  background: string;
  image: string | null;
  color?: string; // hex or tailwind-compatible color
  likes: number;
  shares: number;
  views: number;
}

export const sampleCharacters: Character[] = [
  {
    id: 1,
    name: "아리아",
    age: "22세",
    personality: "밝고 활발한",
    description: "모험을 좋아하는 용감한 소녀",
    background:
      "마법의 숲에서 자란 엘프 소녀로, 자연과 친화적인 힘을 가지고 있습니다.",
    image: null,
    color: "#ef4444", // red-500
    likes: 42,
    shares: 8,
    views: 156,
  },
  {
    id: 2,
    name: "카이",
    age: "25세",
    personality: "조용하고 신중한",
    description: "검술에 뛰어난 기사",
    background: "왕실 근위대 출신으로, 정의를 위해 싸우는 기사입니다.",
    image: null,
    color: "#22c55e", // green-500
    likes: 38,
    shares: 12,
    views: 203,
  },
  {
    id: 3,
    name: "루나",
    age: "20세",
    personality: "신비롭고 지혜로운",
    description: "달의 마법을 다루는 마법사",
    background:
      "고대 마법사의 후손으로, 달의 힘을 다룰 수 있는 특별한 능력을 가지고 있습니다.",
    image: null,
    color: "#3b82f6", // blue-500
    likes: 67,
    shares: 15,
    views: 289,
  },
];

export function getCharacterById(id: number): Character | undefined {
  return sampleCharacters.find((c) => c.id === id);
}
