# OpenAI API 키 발급 및 연결 가이드

캐릭터 AI 채팅 기능을 사용하려면 OpenAI API 키가 필요합니다.

---

## 1단계: OpenAI 계정 만들기

1. 브라우저에서 **https://platform.openai.com** 접속
2. 오른쪽 위 **Sign up** 클릭
3. 이메일 또는 Google/Apple 계정으로 가입
4. 이메일 인증 완료

---

## 2단계: 결제 수단 등록 (필수)

- OpenAI API는 **사용량만큼 과금**됩니다.
- 무료 크레딧이 있는 경우에도 **결제 수단 등록**이 필요할 수 있습니다.
- [Billing](https://platform.openai.com/account/billing)에서 카드 등록 후 **Usage limits**(사용 한도)를 낮게 설정해 두면 예산 관리에 도움이 됩니다.

---

## 3단계: API 키 발급

1. **https://platform.openai.com/api-keys** 접속  
   (또는 로그인 후 상단 메뉴 **API keys** 클릭)
2. **Create new secret key** 버튼 클릭
3. 키 이름 입력 (예: `kage-chat`) → **Create secret key** 클릭
4. **키가 한 번만 표시**되므로 반드시 **복사**해서 안전한 곳에 저장해 두세요.  
   나중에 다시 볼 수 없습니다.

키 형식 예: `sk-proj-xxxxxxxxxxxxxxxxxxxx`

---

## 4단계: 프로젝트에 연결

1. 프로젝트 폴더(`kage`) 루트에 **`.env.local`** 파일이 있는지 확인합니다.  
   없으면 새로 만듭니다.

2. `.env.local` 파일을 열고 아래 한 줄을 추가합니다.  
   `발급받은키` 부분을 3단계에서 복사한 키로 바꿉니다.

```env
OPENAI_API_KEY=sk-proj-발급받은키를여기에붙여넣기
```

3. **저장**합니다.

4. **주의**
   - `.env.local`은 **절대 GitHub 등에 올리지 마세요.** (이미 `.gitignore`에 포함되어 있는지 확인 권장)
   - 키가 노출되면 다른 사람이 사용할 수 있습니다.

---

## 5단계: 서버 다시 실행

환경 변수는 서버를 **시작할 때** 읽습니다.

1. 터미널에서 개발 서버가 켜져 있다면 **Ctrl+C**로 종료
2. 다시 실행:

```bash
npm run dev
```

3. 브라우저에서 캐릭터 카드의 **채팅** 버튼을 눌러 대화가 되는지 확인합니다.

---

## 문제 해결

| 증상 | 확인할 것 |
|------|------------|
| "OPENAI_API_KEY가 설정되지 않았습니다" | `.env.local`에 `OPENAI_API_KEY=sk-...` 가 있는지, 오타 없는지 확인 후 서버 재시작 |
| "AI 응답 생성에 실패했습니다" | [Billing](https://platform.openai.com/account/billing)에서 크레딧/한도 확인, 키가 유효한지 확인 |
| 401 Unauthorized | API 키가 만료/삭제되지 않았는지 확인 후 새 키 발급 |

---

## 참고 링크

- API 키 관리: https://platform.openai.com/api-keys  
- 사용량/요금: https://platform.openai.com/usage  
- 결제 설정: https://platform.openai.com/account/billing  
