# KAGE

## 🚀사이드 프로젝트 소개 
- 지인의 물음인 게임을 사이트에서 할 수 없을까? 라는 고민에서 시작
- 게임처럼 캐릭터를 생성하여 대화를 주고 받을 수 있는 사이트를 개발
<br>

##  🚀프로젝트 개요
- 프로젝트 기간: 2025.09
- 목표: 자유롭게 캐릭터 생성 및 대화가 가능하도록 구현
- 목적: 사이드 프로젝트에 사용하고 싶었던 기술 사용하기
<br>

##  🚀프로젝트 링크
<a href="https://kage-seven.vercel.app/" target="_blank"><strong>KAGE 이용하기</strong></a>

<br>

## 🛠️스텍 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 	![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 	![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

## 페이지별 기능

### 0) 회원가입 및 로그인
- 간단하게 아이디와 비밀번호를 생성하여 로그인할 수 있다.
- 테스트 가능한 계정 정보:
 ```
  ID: admin
  PW: admin1234
```

|로그인|
|-------|
|<img width="1172" height="763" alt="image" src="https://github.com/user-attachments/assets/3ecad539-9e5c-4e57-b092-ab8a5a03794a" />|
<br>
  
### 1) 메인 페이지
- 캐릭터의 이미지와 정보를 업로드할 수 있습니다.
- 정보에는 이름, 나이, 성격, 배경 스토리, 소개글 등 다양하게 커스터마이징이 가능합니다.
- 테마 색상을 지정하여 차별화하였습니다.

|메인 페이지|
|---|
|<img width="1784" height="947" alt="image" src="https://github.com/user-attachments/assets/3749dcc8-d99b-4ebd-bf2a-f0f78a12be97" />|
<br>

### 2) 캐릭터 목록 페이지
- 총 캐릭터 수, 좋아요와 공유 수, 조회수까지 확인이 가능합니다.
- 캐릭터들은 카드 형식으로 목록에 뜨게 됩니다.
  자세히 보기를 눌렀을 때 사용자가 입력했던 정보를 그대로 확인 가능하며 작성자일 경우 버튼을 눌러 삭제 및 수정이 가능합니다. 
  
|캐릭터 목록|
|---------|
|<img width="1863" height="885" alt="image" src="https://github.com/user-attachments/assets/c6918dfc-a850-4022-b66e-fe4c34f71f3d" />|

|캐릭터 카드|
|---------|
|<img width="1851" height="874" alt="image" src="https://github.com/user-attachments/assets/3f20c7ee-4971-4771-931d-15c5bcc0d7de" />|
<br>

### 3) 자유 게시판 
- 로그인한 사용자만 제목, 관계 태그를 설정하여 캐릭터간의 관계를 자유롭게 사용자가 서술할 수 있다.
- 자유롭게 내용을 작성하면 로컬 인증 상태를 확인하고, 게시글 CRUD를 슈파베이스로 이관하였다.
 
|자유 게시판|
|--------------|
|<img width="1892" height="874" alt="image" src="https://github.com/user-attachments/assets/74c5e3bf-0416-40a4-a16b-332a46a95cb8" />|
<br>

### 4) 역할 대화
- 캐릭터를 선택하여 이미지와 메시지를 자유롭게 남길 수 있다. 캐릭터인 것처럼 역할 대화가 가능하다.
- 캐릭터 선택 -> 메세지 작성 -> 실시간 리스트 업데이트 흐름으로 구성하였다.
- 캐릭터 데이터를 메모이제이션하여 렌더링 비용을 줄이고, 작성자 본인과 관리자만 삭제하도록 권한 검증을 반영하였다. 

|역할 대화|
|---|
|<img width="1883" height="871" alt="image" src="https://github.com/user-attachments/assets/28571401-4aa2-4c8d-bfbd-5dad585d2632" />|

