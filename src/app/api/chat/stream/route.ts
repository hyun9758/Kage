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
  return `당신은 "${character.name}"(나이: ${character.age}, 성격: ${character.personality}). 소개: ${character.description}. 배경: ${character.background}
규칙: 한국어만, ${character.name} 1인칭, 성격에 맞는 말투. 답변은 반드시 2~3문장으로 짧게.`;
}

const MAX_HISTORY_MESSAGES = 6;

function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

function getGeminiModelsToTry(): string[] {
  const env = process.env.GEMINI_MODEL?.trim();
  if (env) return [env];
  return ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendChunk(controller: ReadableStreamDefaultController, obj: object) {
  controller.enqueue(new TextEncoder().encode(JSON.stringify(obj) + "\n"));
}

export async function POST(request: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (!geminiKey && !openAiKey) {
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let body: { character: CharacterForChat; messages: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { character, messages } = body;
  if (!character?.name || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "character와 messages가 필요합니다." },
      { status: 400 }
    );
  }

  const systemPrompt = buildSystemPrompt(character);
  const trimmed = trimMessages(messages);
  const contents = trimmed
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

  if (contents.length === 0) {
    return NextResponse.json(
      { error: "전송할 메시지가 없습니다." },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (geminiKey) {
          const modelsToTry = getGeminiModelsToTry();
          let lastError = "Gemini 스트리밍 오류";
          let streamed = false;

          for (const model of modelsToTry) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(geminiKey)}`;
            const bodyStr = JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                maxOutputTokens: 512,
                temperature: 0.7,
              },
            });

            let res: Response | null = null;
            let errText = "";
            for (let attempt = 0; attempt < 2; attempt++) {
              res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: bodyStr,
              });
              if (res.ok) break;
              errText = await res.text();
              try {
                const j = JSON.parse(errText) as { error?: { message?: string } };
                if (j?.error?.message) lastError = j.error.message;
              } catch {
                if (errText.length < 250) lastError = errText;
              }
              const isQuotaOrLimit =
                res.status === 429 ||
                /quota|rate limit|limit:\s*0|retry\s+in/i.test(lastError);
              const isHighDemand =
                res.status === 503 ||
                /high demand|try again later|experiencing high demand/i.test(lastError);
              if ((isQuotaOrLimit || isHighDemand) && attempt === 0) {
                await sleep(1500);
                continue;
              }
              break;
            }

            if (!res?.ok) {
              const isQuotaOrLimit =
                res?.status === 429 ||
                /quota|rate limit|limit:\s*0|retry\s+in/i.test(lastError);
              const isHighDemand =
                res?.status === 503 ||
                /high demand|try again later|experiencing high demand/i.test(lastError);
              if (
                (isQuotaOrLimit || isHighDemand) &&
                modelsToTry.indexOf(model) < modelsToTry.length - 1
              ) {
                continue;
              }
              sendChunk(controller, { e: lastError });
              controller.close();
              return;
            }

            const resBody = res!.body;
            if (!resBody) {
              lastError = "스트림을 열 수 없습니다.";
              continue;
            }

            const reader = resBody.getReader();
            const dec = new TextDecoder();
            let buf = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buf += dec.decode(value, { stream: true });
              const lines = buf.split("\n");
              buf = lines.pop() ?? "";
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const json = line.slice(6).trim();
                  if (json === "[DONE]" || !json) continue;
                  try {
                    const data = JSON.parse(json) as {
                      candidates?: { content?: { parts?: { text?: string }[] } }[];
                    };
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) sendChunk(controller, { t: text });
                  } catch {
                    /* ignore parse */
                  }
                }
              }
            }
            streamed = true;
            break;
          }

          if (!streamed) {
            sendChunk(controller, {
              e: lastError || "Gemini 무료 한도 초과. 잠시 후 다시 시도하거나 .env.local에 GEMINI_MODEL=gemini-2.0-flash 등 사용 가능한 모델로 지정해 보세요.",
            });
            controller.close();
            return;
          }
        } else {
          const openAiMessages: { role: "user" | "assistant" | "system"; content: string }[] = [
            { role: "system", content: systemPrompt },
            ...trimmed
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({ role: m.role, content: m.content })),
          ];

          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: process.env.OPENAI_CHAT_MODEL || "gpt-3.5-turbo",
              messages: openAiMessages,
              max_tokens: 512,
              temperature: 0.7,
              stream: true,
            }),
          });

          if (!res.ok) {
            const err = await res.text();
            let msg = "OpenAI 스트리밍 오류";
            try {
              const j = JSON.parse(err) as { error?: { message?: string } };
              if (j?.error?.message) msg = j.error.message;
            } catch {
              if (err.length < 200) msg = err;
            }
            sendChunk(controller, { e: msg });
            controller.close();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            sendChunk(controller, { e: "스트림을 열 수 없습니다." });
            controller.close();
            return;
          }

          const dec = new TextDecoder();
          let buf = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const json = line.slice(6).trim();
                if (json === "[DONE]" || !json) continue;
                try {
                  const data = JSON.parse(json) as {
                    choices?: { delta?: { content?: string } }[];
                  };
                  const content = data.choices?.[0]?.delta?.content;
                  if (content) sendChunk(controller, { t: content });
                } catch {
                  /* ignore */
                }
              }
            }
          }
        }

        sendChunk(controller, { done: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "스트리밍 중 오류";
        sendChunk(controller, { e: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
