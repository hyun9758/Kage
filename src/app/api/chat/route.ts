import { NextRequest, NextResponse } from "next/server";

interface CharacterForChat {
  name: string;
  age: string;
  personality: string;
  description: string;
  background: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function buildSystemPrompt(character: CharacterForChat): string {
  return `당신은 캐릭터 "${character.name}"입니다. 다음 설정을 절대적으로 따르며, 항상 이 캐릭터로만 대답하세요.

- 이름: ${character.name}
- 나이: ${character.age}
- 성격: ${character.personality}
- 소개: ${character.description}
- 배경/스토리: ${character.background}

규칙:
1. 반드시 한국어로만 답하세요.
2. ${character.name}로서 말하고, 자신을 "저" 또는 캐릭터에 맞는 1인칭으로 표현하세요.
3. 성격과 배경에 맞는 말투와 반응을 유지하세요.
4. 메타 설명이나 "캐릭터로서" 같은 발언은 하지 마세요.
5. 짧고 자연스러운 대화체로 답하세요.`;
}

/** Google Gemini API (무료, 카드 불필요) */
// 참고: https://stackoverflow.com/questions/79779187/ | https://ai.google.dev/gemini-api/docs/models
// 사용 가능한 모델 목록: GET https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY
function getGeminiModelsToTry(): string[] {
  const env = process.env.GEMINI_MODEL?.trim();
  if (env) return [env];
  // v1beta 사용 가능 모델만 (gemini-pro는 v1beta에서 제거됨)
  return ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** "Please retry in 920.065772ms" 등에서 대기 시간(ms) 추출 */
function parseRetryAfterMs(message: string): number {
  const match = message.match(/retry\s+in\s+([\d.]+)\s*ms/i);
  if (match) return Math.ceil(Number(match[1])) + 100;
  return 1500;
}

async function chatWithGemini(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<{ content: string } | { error: string }> {
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

  if (contents.length === 0) {
    return { error: "전송할 메시지가 없습니다." };
  }

  const modelsToTry = getGeminiModelsToTry();
  let lastError = "Gemini API 오류가 발생했습니다.";

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.8,
        },
    });

    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const text = await res.text();

      if (res.ok) {
        const data = JSON.parse(text) as {
          candidates?: {
            content?: { parts?: { text?: string }[] };
            finishReason?: string;
          }[];
        };
        const candidate = data.candidates?.[0];
        const textPart = candidate?.content?.parts?.[0]?.text?.trim();
        if (textPart) return { content: textPart };
        if (candidate?.finishReason && candidate.finishReason !== "STOP") {
          lastError = `모델 응답 제한: ${candidate.finishReason}`;
          break;
        }
        lastError = "AI가 빈 응답을 반환했습니다. 잠시 후 다시 시도해 주세요.";
        break;
      }

      let msg = lastError;
      try {
        const j = JSON.parse(text) as { error?: { message?: string } };
        if (j?.error?.message) msg = j.error.message;
      } catch {
        if (text.length < 300) msg = text;
      }
      lastError = msg;

      const isQuotaOrRateLimit =
        res.status === 429 ||
        /quota|rate limit|limit:\s*0|retry\s+in/i.test(msg);
      const isModelNotFound =
        res.status === 404 || /not found|is not supported for generateContent/i.test(msg);
      const isHighDemand =
        res.status === 503 || /high demand|try again later|experiencing high demand/i.test(msg);

      if ((isQuotaOrRateLimit || isHighDemand) && attempt === 0) {
        const waitMs = isHighDemand ? 2800 : parseRetryAfterMs(msg);
        await sleep(waitMs);
        continue;
      }

      if (
        (isQuotaOrRateLimit || isModelNotFound || isHighDemand) &&
        modelsToTry.indexOf(model) < modelsToTry.length - 1
      ) {
        break;
      }
      if (!isQuotaOrRateLimit && !isModelNotFound && !isHighDemand) {
        return { error: msg };
      }
    }
  }

  return {
    error:
      lastError ||
      "Gemini 무료 한도 초과 또는 사용 불가입니다. 잠시 후 다시 시도하거나, .env.local에 GEMINI_MODEL=gemini-2.0-flash 로 모델을 지정해 보세요. 사용 가능한 모델: https://generativelanguage.googleapis.com/v1beta/models?key=본인API키",
  };
}

/** OpenAI API (유료 크레딧 필요) */
async function chatWithOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<{ content: string } | { error: string }> {
  const openAiMessages: { role: "user" | "assistant" | "system"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-3.5-turbo",
      messages: openAiMessages,
      max_tokens: 512,
      temperature: 0.8,
    }),
  });

  const errText = await response.text();
  if (!response.ok) {
    let userMessage = "AI 응답 생성에 실패했습니다.";
    try {
      const errJson = JSON.parse(errText) as { error?: { message?: string } };
      const msg = errJson?.error?.message ?? errText;
      if (response.status === 401) {
        userMessage =
          "OpenAI API 키가 올바르지 않습니다. .env.local을 확인한 뒤 서버를 재시작하세요.";
      } else if (response.status === 429) {
        userMessage =
          "요청 한도 초과 또는 크레딧 부족입니다. OpenAI 결제 페이지에서 사용량·크레딧을 확인해주세요.";
      } else if (msg) {
        userMessage = msg.length > 200 ? `${msg.slice(0, 200)}...` : msg;
      }
    } catch {
      if (errText.length < 150) userMessage = errText;
    }
    return { error: userMessage };
  }

  const data = JSON.parse(errText) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim() ?? "";
  return { content };
}

export async function POST(request: NextRequest) {
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openAiKey) {
      return NextResponse.json(
        {
          error:
            "API 키가 없습니다. .env.local에 GEMINI_API_KEY(무료) 또는 OPENAI_API_KEY 중 하나를 추가해주세요. 무료 사용은 Google AI Studio에서 Gemini 키 발급 후 GEMINI_API_KEY로 설정하세요.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { character, messages } = body as {
      character: CharacterForChat;
      messages: ChatMessage[];
    };

    if (!character?.name || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "character와 messages가 필요합니다." },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(character);

    // 무료 Gemini 우선, 없으면 OpenAI
    if (geminiKey?.trim()) {
      const result = await chatWithGemini(geminiKey, systemPrompt, messages);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 502 });
      }
      return NextResponse.json({ content: result.content });
    }

    const result = await chatWithOpenAI(openAiKey!, systemPrompt, messages);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }
    return NextResponse.json({ content: result.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "채팅 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
