import { NextResponse } from "next/server";

/**
 * GET /api/chat/status
 * 채팅에 사용할 API 키(Gemini 또는 OpenAI)가 설정되어 있는지 확인합니다.
 */
export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (geminiKey) {
    return NextResponse.json({
      ok: true,
      message: "Google Gemini(무료) API가 연결되어 있습니다. 채팅을 사용할 수 있습니다.",
    });
  }

  if (openAiKey) {
    const formatOk = openAiKey.startsWith("sk-");
    return NextResponse.json({
      ok: true,
      message: formatOk
        ? "OpenAI API가 연결되어 있습니다. 채팅을 사용할 수 있습니다."
        : "OpenAI API 키 형식을 확인해주세요. (sk- 로 시작해야 합니다.)",
    });
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "API 키가 없습니다. .env.local에 GEMINI_API_KEY(무료) 또는 OPENAI_API_KEY를 추가하세요. 무료: Google AI Studio에서 Gemini 키 발급.",
    },
    { status: 200 }
  );
}
