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
  const contents = messages
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
                temperature: 0.8,
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
                await sleep(2800);
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
            ...messages
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
              temperature: 0.8,
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
