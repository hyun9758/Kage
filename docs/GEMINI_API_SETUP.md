# Google Gemini API 무료 연결 가이드

**카드 없이, 무료로** 캐릭터 AI 채팅을 사용하려면 Google Gemini API를 쓰면 됩니다.

---

## 1단계: Google AI Studio에서 API 키 발급

1. **https://aistudio.google.com/app/apikey** 접속
2. Google 계정으로 로그인
3. **Create API key** 클릭 → 프로젝트 선택 또는 새 프로젝트 생성
4. 생성된 **API 키 복사** (한 번만 표시되므로 꼭 저장)

---

## 2단계: 프로젝트에 연결

1. 프로젝트 폴더 `kage` 루트의 **`.env.local`** 파일을 엽니다.
2. 아래 한 줄을 추가합니다. `여기에_복사한_키`를 발급받은 키로 바꿉니다.

```env
GEMINI_API_KEY=여기에_복사한_키
```

3. **OpenAI만 쓸 때**는 `OPENAI_API_KEY`만 두고, **무료로 쓰려면** `GEMINI_API_KEY`만 있어도 됩니다.  
   두 키가 모두 있으면 **Gemini(무료)가 우선** 사용됩니다.

4. 저장한 뒤 **개발 서버를 재시작**합니다.

```bash
# 터미널에서 Ctrl+C 후
npm run dev
```

---

## 3단계: 사이트에서 확인

1. 캐릭터 페이지에서 **채팅** 버튼 클릭
2. 채팅 창 상단에 **"Google Gemini(무료) API가 연결되어 있습니다"** 라고 나오면 성공
3. 메시지를 보내서 캐릭터가 답하는지 확인

---

## 모델이 없다는 오류가 날 때

`models/gemini-1.5-flash is not found` 같은 메시지가 나오면, Google이 해당 모델 이름을 변경했을 수 있습니다.

- **사용 가능한 모델 목록 확인**: 브라우저에서 아래 주소로 접속 (맨 뒤에 본인 API 키 붙이기)  
  `https://generativelanguage.googleapis.com/v1beta/models?key=본인API키`  
  응답 JSON 안의 `name` 필드에서 `models/` 뒤 이름만 사용하면 됩니다.

- **직접 모델 지정**: `.env.local`에 추가  
  ```env
  GEMINI_MODEL=gemini-2.0-flash
  ```  
  참고: [Stack Overflow (404 해결)](https://stackoverflow.com/questions/79779187/google-generative-ai-404-models-gemini-1-5-flash-is-not-found-error-when-call), [Google AI 모델 문서](https://ai.google.dev/gemini-api/docs/models)

## 참고

- **무료 한도**: Google AI Studio 무료 티어는 일일/분당 요청 제한이 있습니다. 일반적인 대화 사용에는 충분한 경우가 많습니다.
- **"High demand" / "try again later"**: 혼잡 시 **gemini-2.0-flash → gemini-flash-latest → gemini-2.5-flash** 순으로 다른 모델을 시도하고, 같은 모델은 약 2.8초 후 한 번 재시도합니다. 사용할 모델을 고정하려면 `.env.local`에 `GEMINI_MODEL=gemini-2.0-flash` 처럼 지정하세요. (참고: gemini-pro는 v1beta에서 제거되었습니다.)
- **OpenAI와 동시 사용**: `.env.local`에 `GEMINI_API_KEY`와 `OPENAI_API_KEY`를 둘 다 넣으면, **Gemini가 우선**입니다. OpenAI만 쓰려면 `GEMINI_API_KEY` 줄을 지우거나 주석 처리하세요.
