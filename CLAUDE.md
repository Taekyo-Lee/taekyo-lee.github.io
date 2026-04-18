# Blog Handoff Notes

**최종 업데이트**: 2026-04-18 (Claude Code 세션 1 완료)
**프로젝트 위치**: `~/workspace/taekyo-lee.github.io/`

> 📌 이 문서는 이 프로젝트에서 작업하는 **Claude Code 세션을 위한 맥락 문서**입니다. 블로그 운영자(저자)의 정체성, 기술 결정, 글쓰기 톤, 다음 단계를 담습니다.

---

## 저자 정체성

블로그에서 쓰는 이름:
- **Nickname**: Guru Cat (브랜드/마스코트)
- **Pseudonym**: Jet (1인칭 서명)

공개 프로필:
- **GitHub**: https://github.com/Taekyo-Lee
- **YouTube**: https://www.youtube.com/@GuruCat-d4h
- **LinkedIn**: https://linkedin.com/in/jet-taekyo-lee-2aab9a317
- **Email**: jetleee.1888@gmail.com

커리어 서사 (브랜드의 핵심):
- **RF Engineer 출신 → AI Engineer**
- 안테나와 신호를 다루던 엔지니어에서, "컴퓨터가 스스로 일하게 만드는 방법" 에 관심이 옮겨 가서 지금은 **AI Agent 엔지니어**
- 기업 환경에서 AI Agent 를 쓰는 일을 함

관심 주제:
- Claude Code (중심)
- Agentic Coding 패러다임
- AI Agent 시스템 아키텍처

### 왜 블로그를 시작했나

- 사내에서 **Claude Code 101** 세미나 발표 (Session 1/3)
- 청중 반응이 매우 긍정적 — *"슬라이드 + 실시간 시연 + HTML 보조자료의 결합이 좋았다"*
- **개인 브랜딩 목표**: AI/Agent 전문가로 인식되기
- 운영 빈도 목표: 주 1회 꾸준히

---

## 기술 스택

- **플랫폼**: GitHub Pages (`Taekyo-Lee/taekyo-lee.github.io`, Public)
- **URL**: https://taekyo-lee.github.io
- **프레임워크**: Astro 6 (blog template 기반, 상당히 커스텀화 됨)
- **콘텐츠 포맷**: `.md` 또는 `.mdx` (MDX 쓰면 Astro 컴포넌트 embed 가능)
- **언어**: TypeScript (strict mode)
- **배포**: GitHub Actions (main branch push → 자동 배포, 3~5분 소요)
- **Node.js 버전**: 22 (22.12.0 이상 필수)

### 주요 파일 위치

```
~/workspace/taekyo-lee.github.io/
├── .github/workflows/deploy.yml       ← GitHub Actions 배포
├── astro.config.mjs                   ← site 설정, MDX integration
├── CLAUDE.md                          ← 이 문서
├── src/
│   ├── content.config.ts              ← Zod schema (category 필수)
│   ├── consts.ts                      ← SITE_TITLE, CATEGORY_LABELS 등
│   ├── styles/global.css              ← 색 토큰 (--accent, --claude)
│   ├── layouts/BlogPost.astro         ← 포스트/About 공용 레이아웃
│   ├── pages/
│   │   ├── index.astro                ← Home (lang="ko")
│   │   ├── about.astro                ← About (Hoian Cat hero)
│   │   └── blog/
│   │       ├── index.astro            ← 목록 페이지
│   │       └── [...slug].astro        ← 동적 라우트 (포스트)
│   ├── components/
│   │   ├── Header.astro               ← Guru Cat 로고 + 네비
│   │   ├── Footer.astro
│   │   ├── BaseHead.astro
│   │   ├── FormattedDate.astro
│   │   ├── HeaderLink.astro
│   │   ├── GuiVsCli.astro             ← MDX 시각 컴포넌트
│   │   ├── EraTimeline.astro          ← MDX 시각 컴포넌트
│   │   ├── LayerStack.astro           ← MDX 시각 컴포넌트
│   │   └── ClosingHero.astro          ← MDX 시각 컴포넌트
│   ├── assets/
│   │   ├── gurucat.jpg                ← Header 로고
│   │   ├── hoian_cat.png              ← About 페이지 hero
│   │   └── blog-placeholder-*.jpg     ← 기본 placeholder 이미지들
│   └── content/blog/
│       └── why-claude-code-is-in-terminal.mdx   ← 첫 포스트
└── public/
```

---

## 현재 블로그 상태 (2026-04-18 저녁 기준)

- **블로그 글**: `why-claude-code-is-in-terminal.mdx` 1편 (category: `claude-code`)
- **헤더**: 🐱 Guru Cat 로고 + "Guru Cat's AI" 제목 + GitHub 아이콘 1개
- **Home 페이지**: Minimal 톤 인사말 (RF → AI 엔지니어 소개)
- **About 페이지**: Hoian Cat hero + 3섹션 소개 + 연락처 4개 (Email/GitHub/YouTube/LinkedIn)
- **Footer**: "© 2026 Guru Cat. All rights reserved." + GitHub 아이콘 1개
- **카테고리 시스템**: 3종 (`claude-code`, `ai-agent`, `essays`) — schema 에 필수 필드로 등록
- **색 브랜딩**: 블루 액센트 (사이트 전체) + Claude 오렌지 (콘텐츠 하이라이트) 이원 체계
- **배포**: 정상 작동 (https://taekyo-lee.github.io)

---

## 지금까지 완료한 것

### Session 0 (2026-04-18 낮, 웹 Claude)
- Astro blog template 셋업
- GitHub Pages 배포 파이프라인 구축 (withastro/action@v3 + Node 22)
- 기본 hello-world 포스트 1편

### Session 1 (2026-04-18 저녁, Claude Code)

**Phase 1 완전 완료**:
- Guru Cat 브랜드로 Header/Footer/Home/About 전면 개편
- Guru Cat 로고 (gurucat.jpg) Header 에 장착
- Hoian Cat (hoian_cat.png) About hero 에 장착
- 모든 페이지 `lang="ko"` 정정

**카테고리 시스템 구현**:
- `content.config.ts` 에 `category: z.enum([...])` 필수 필드 추가
- `consts.ts` 에 `CATEGORY_LABELS` 맵
- `/blog/` 목록과 포스트 페이지에 뱃지 표시

**세미나 Chapter 1 → 블로그 발행**:
- `.md` → `.mdx` 전환 (Astro 컴포넌트 embed 목적)
- 1인칭 서사로 재작성, 세미나 비주얼 임팩트 보존
- hello-world 포스트 삭제

**4개 시각 컴포넌트 (재사용 가능)**:
- `GuiVsCli.astro` — 2열 대비 (과거 GUI vs 현재 CLI)
- `EraTimeline.astro` — 3단 ERA 진화 + 색온도 진행감
- `LayerStack.astro` — Web→IDE→Terminal→Computer 근접 모델
- `ClosingHero.astro` — 결론 Hero 블록 (slide 5 변환)

**색 시스템 확장**:
- `global.css` 에 `--claude`, `--claude-dark`, `--claude-soft` 추가
- **쿨 슬레이트 (과거/멀다) → 연한 웜 (전환) → 풀 오렌지 (현재/가깝다)** 진행감 규칙화
- 모든 시각 컴포넌트에 일관 적용

---

## 다음에 할 일

### Phase 1: 기본 커스터마이징 — ✅ 완료

### Phase 2: Flagship 글 — 대기 중

블로그의 "결정적 증거" 역할을 할 글. 기업 환경에서 AI Agent 도구를 쓸 때의 제약과 그에 대한 대응 경험을 담는 1인칭 서사. 기술적 배경 + 조직 맥락 + 과정의 고민을 블렌드.

(구체적 주제/타이틀은 이후 세션에서 저자와 상의)

### Phase 3: 세미나 자료 기반 후속 포스트들

참고 자료: `~/workspace/claude-code-seminar/` (Private repo)

- ✅ "왜 Claude Code 는 터미널에 있을까?" — `why_cli.html` 기반, **발행 완료**
- ⬜ "Claude Code 를 `--debug` 로 열어봤다" — `claude-code-startup.html` 참고
- ⬜ "Commands vs Skills — 누가 진짜 일을 하는가" — `commands-vs-skills.html` 참고
- ⬜ "OpenAI가 만든 Claude Code Plugin 뜯어보기" — `codex-plugin.html` 참고

### Phase 4 (보류): 카테고리 네비게이션 UI

- **언제**: 글 5~10개 쌓인 뒤
- **방법**: `/category/[slug].astro` 동적 라우트 + 뱃지 클릭 가능화
- **이유**: 현재 글 1편이라 필터 페이지 만들면 허전함

---

## 세미나 원본 자료 위치

- **위치**: `~/workspace/claude-code-seminar/` (Private repo)
- 주요 파일: `why_cli.html`, `commands-vs-skills.html`, `claude-code-startup.html`, `codex-plugin.html`, `claude-code-keystrokes.html`, `claude-code-plugins.html` 등

**원칙**: 복붙 아닌 **블로그 톤으로 재작성**. 세미나 자료의 **핵심 비주얼은 Astro 컴포넌트로** 포팅 (Session 1 에서 확립한 방식).

---

## 글쓰기 톤 가이드

### 블로그 목소리

- **1인칭 한국어**: "저는", "제가", "~합니다/~해요"
- **톤**: 담백하고 진지하되, 과장·호들갑 없음
- **기술 깊이**: 낮추지 않음. 독자의 지능을 존중
- **서사 구조**: 개인 서사 + 기술적 깊이 블렌드
- **독자 가정**: 처음 오는 사람. 맥락을 친절히 깔아줌
- **Em-dash (—)**: 남발하지 않기. 꼭 필요할 때만

### 글 구조 권장

- **Opening hook**: 첫 2-3 문장으로 독자 사로잡기
- **맥락과 동기**: 왜 이 글을 썼는지, 누구에게 도움이 될지
- **본문**: 서사 곡선 (도입 → 전개 → 절정 → 결말)
- **구체적 예시**: 코드, 스크린샷, 실제 명령어
- **마무리**: 다음 포스트 예고 또는 독자에게 던지는 질문

### 세미나 자료 변환 시

| | 세미나 자료 | 블로그 포스트 |
|---|---|---|
| 톤 | Reference, 중립적 | 1인칭 서사 |
| 구조 | 슬라이드 덱 | 서사 곡선 |
| 독자 | 세미나 참석자 | 맥락 0에서 시작 |
| 비주얼 | 풀스크린 슬라이드 | **MDX + Astro 컴포넌트** |

---

## 기술 노트

### Frontmatter 포맷 (category 필수)

```yaml
---
title: '글 제목'
description: '요약 한 줄'
pubDate: 'Apr 18 2026'
category: claude-code   # 필수. claude-code / ai-agent / essays 중 하나
heroImage: '../../assets/some.jpg'   # 선택
---
```

- `category`: **오타 내면 빌드 에러**. Zod schema 가 즉시 잡음
- `heroImage`: optional. 없으면 hero 영역 자동 생략

### 색 시스템 (브랜딩 규칙)

| 용도 | CSS 변수 | 언제 쓰나 |
|---|---|---|
| 사이트 전체 accent | `var(--accent)` (블루) | 카테고리 뱃지, 네비 active, 링크 |
| 콘텐츠 NOW/현재 | `var(--claude)` (오렌지) | 시각 컴포넌트의 "지금" 요소 |
| 과거/먼 요소 | 쿨 슬레이트 톤 | `rgba(96, 115, 159, 0.09)` 등 |
| 전환기 요소 | 연한 웜 톤 | `rgba(204, 120, 92, 0.04)` 등 |

### MDX 컴포넌트 사용법

포스트 맨 위 (frontmatter 바로 아래) 에 import:

```mdx
---
title: '...'
---

import ClosingHero from '../../components/ClosingHero.astro';

본문 ...

<ClosingHero />
```

기존 4개 컴포넌트는 현재 포스트 특화 — 다른 포스트에서 쓸 때는 재작성 또는 props 로 일반화 필요.

### 새 글 추가 워크플로우

```bash
cd ~/workspace/taekyo-lee.github.io

# 새 글 파일 (.md 또는 .mdx)
code src/content/blog/<slug>.mdx

# 로컬 미리보기
npm run dev
# http://localhost:4321/blog/<slug>/

# 커밋 & push
git add .
git commit -m "Add post: <title>"
git push
```

---

## 트러블슈팅

**블로그에 새 글이 안 보일 때**:
1. **Ctrl+Shift+R** (Astro View Transitions 캐싱)
2. **dev 서버 재시작** 필요 케이스: `content.config.ts` 변경, 새 `.mdx` 파일 추가, `astro.config.mjs` 변경
3. 빌드 실패 확인: https://github.com/Taekyo-Lee/taekyo-lee.github.io/actions

**Node 버전**: Astro 6 은 Node 22.12.0 이상 필수. `deploy.yml` 과 로컬 모두 Node 22.

**개인정보 원칙**: 
- 블로그 표시 텍스트에서 본명은 쓰지 않음 — "Jet" 또는 "Guru Cat" 사용
- GitHub URL (`Taekyo-Lee`) 과 사이트 URL (`taekyo-lee.github.io`) 은 구조적으로 노출됨 — 허용
- 회사/기업명 구체 언급 피함 (기업 환경은 일반화 표현으로)

---

## 맥락 종결

Phase 1 완료 + Phase 3 첫 글 발행까지 옴. 다음 세션은 Phase 2 (flagship 글) 또는 Phase 3 나머지 포스트들로 이어가면 됩니다.
