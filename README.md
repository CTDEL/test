# 🎓 Grade Calc — 성적 계산기

과목별 점수를 입력하면 평균, 등급, 막대그래프를 보여주는 웹앱입니다.

---

## 🚀 Vercel로 배포하기 (무료, 5분 완성)

### 1단계 — GitHub에 올리기

1. [github.com](https://github.com) 로그인 후 **New repository** 클릭
2. 이름 입력 (예: `grade-calc`) → **Create repository**
3. 이 폴더 안의 **모든 파일**을 그대로 업로드
   - `Upload files` 버튼 클릭 → 전체 선택 후 드래그
   - **Commit changes** 클릭

### 2단계 — Vercel 연동

1. [vercel.com](https://vercel.com) 접속 → **Sign up with GitHub**
2. **Add New Project** → 방금 만든 repository 선택
3. 설정 건드릴 필요 없이 그냥 **Deploy** 클릭
4. 1~2분 후 `https://grade-calc-xxx.vercel.app` 주소 완성! 🎉

---

## 💻 로컬에서 실행하기

```bash
# Node.js 설치 필요 (nodejs.org)
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

---

## 📁 파일 구조

```
grade-calc/
├── index.html          # HTML 진입점
├── vite.config.js      # Vite 설정
├── package.json        # 패키지 정보
└── src/
    ├── main.jsx        # React 앱 마운트
    └── App.jsx         # 성적 계산기 메인 컴포넌트
```
