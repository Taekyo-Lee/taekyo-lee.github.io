# Blog Ops Notes

**프로젝트**: `~/workspace/taekyo-lee.github.io/`
**용도**: 이 레포에서 일하는 Claude Code 세션을 위한 운영 맥락 (저자 정체성, 톤, 기술 규칙, 다음 작업).

> 셋업은 끝났습니다. 이 문서는 "새 글 쓰고 배포하는" 일상 운영에 필요한 것만 담습니다. 과거 셋업 이력은 `git log` 를 보세요.

---

## 작업 환경 (local PC)

저자는 세 개의 로컬 PC 에서 이 블로그를 작업합니다.

| 환경 | 용도 | Production URL |
|---|---|---|
| **HOME** | 집 | https://taekyo-lee.github.io |
| **DEVELOPMENT** | 개발용 | https://taekyo-lee.github.io |
| **COMPANY** | 회사 (보안 엄격) | https://github.samsungds.net/pages/aiagent/ai-native-development-blog/ |

- HOME 과 DEVELOPMENT 는 환경 차이 없음 — 동일 사외 배포 (`taekyo-lee.github.io`).
- COMPANY 는 보안 정책상 매우 다름 — 사내 GitHub Enterprise 로 배포되며 GitHub Actions 사용 불가, `gh-pages` 브랜치 방식. 자세한 분기 규칙은 아래 "이중 배포 아키텍처" 참고.
- 현재 세션의 **배포 타겟** (사외/사내) 은 git remote URL 로 자동 판별됨 (`samsungds.net` 포함 여부). HOME 과 DEVELOPMENT 는 둘 다 사외로 동일 취급.

---

## 저자 정체성

- **Nickname**: Guru Cat (브랜드/마스코트)
- **Pseudonym**: Jet (1인칭 서명)
- 본명은 블로그 표시 텍스트에 쓰지 않음. GitHub URL (`Taekyo-Lee`) 과 사이트 URL 은 구조적으로 노출 — 허용.
- 회사/기업명 구체 언급 피함 (기업 환경은 일반화 표현으로)

공개 프로필 (HOME / DEVELOPMENT — 사외 배포에서만 사용):
- GitHub: https://github.com/Taekyo-Lee
- YouTube: https://www.youtube.com/@GuruCat-d4h
- LinkedIn: https://linkedin.com/in/jet-taekyo-lee-2aab9a317
- Email: jetleee.1888@gmail.com

사내용 프로필 (COMPANY — 사내 배포에서만 사용, **Email 만 공개**):
- Email: taekyo.lee@samsung.com

**커리어 서사 (브랜드 핵심)**: RF Engineer → AI Agent Engineer. 안테나·신호에서 "컴퓨터가 스스로 일하게 만드는 방법" 으로 관심이 옮겨감. 기업 환경에서 AI Agent 를 쓰는 일을 함.

**관심 주제**: AI 전반. 당분간은 Claude Code 중심 (Agentic Coding 패러다임, AI Agent 시스템 아키텍처 포함).

**운영 목표**: AI/Agent 전문가 개인 브랜딩. 주 1회 꾸준히 발행.

---

## 기술 스택

- Astro 6 + TypeScript (strict) + MDX
- Node 22.12.0 이상 필수 (로컬·CI 모두)
- GitHub Pages 배포 (main push → GitHub Actions, 3~5분)

### 이중 배포 아키텍처 (HOME&DEVELOPMENT / COMPANY)

동일 소스코드가 HOME&DEVELOPMENT (github.com) 와 COMPANY (기업 GitHub Enterprise) 양쪽에 배포됨. **merge만 하면 자동 분기** — 수동 설정 불필요.

| | HOME&DEVELOPMENT | COMPANY |
|---|---|---|
| URL | `taekyo-lee.github.io` | `github.samsungds.net/pages/aiagent/ai-native-development-blog` |
| github repo | `https://github.com/Taekyo-Lee/taekyo-lee.github.io` | `https://github.samsungds.net/aiagent/ai-native-development-blog` |
| workflow | `deploy.yml` | `deploy_at_company.yml` |
| `site` (Astro config) | `https://taekyo-lee.github.io` | `https://github.samsungds.net` |
| `base` | `/` (루트) | `/pages/aiagent/ai-native-development-blog/` |
| `build.assets` | `_astro` (기본값) | `assets` (GE가 `_` 폴더 무시) |

**자동 탐지**: `astro.config.mjs`에서 git remote URL 기반으로 `isCompany` 자동 판별 (`samsungds.net` 포함 여부). CI fallback으로 `DEPLOY_TARGET=company` 환경변수도 지원.

**내부 링크**: 모든 `href`는 `import.meta.env.BASE_URL` 기반으로 생성. 하드코딩 절대 경로 (`/blog` 등) 사용 금지 — `base` 변경 시 링크 깨짐.

```astro
const base = import.meta.env.BASE_URL;
// O: ${base} 는 production 빌드에서 항상 trailing slash (`/` 또는 `/pages/.../`) 가 붙어 있음
<a href={`${base}blog`}>...</a>          // HOME&DEVELOPMENT → /blog, COMPANY → /pages/aiagent/.../blog
<a href={`${base}category/${slug}/`}>...</a>

// X: 절대 금지 패턴
<a href={`${base}/blog`}>...</a>         // production 에서 //blog 가 되어 protocol-relative URL 로 깨짐
<a href="/blog">...</a>                  // base 미반영 → COMPANY 에서 404
```

**핵심 규칙**: `${base}` 뒤에 슬래시를 추가로 붙이지 말 것. base 가 이미 `/` 로 끝남.

**COMPANY 배포 워크플로우**: HOME/DEVELOPMENT 에서 업데이트 → COMPANY upstream 에서 pull → main 에 merge → push

### COMPANY merge conflict 자동 해결 규칙

**왜 이 규칙이 필요한가**: 블로그 작성·수정은 **무조건 HOME/DEVELOPMENT 에서만** 진행. 그 변경분을 COMPANY 에서 `git pull` 로 가져와 사내 레포에 반영하는 흐름임.

핵심은 두 환경의 git remote 가 서로 다른 레포라는 점:
- HOME/DEVELOPMENT remote → `https://github.com/Taekyo-Lee/taekyo-lee.github.io` (사외 배포: https://taekyo-lee.github.io)
- COMPANY remote → `https://github.samsungds.net/aiagent/ai-native-development-blog` (사내 배포: https://github.samsungds.net/pages/aiagent/ai-native-development-blog/)

이 두 레포는 환경 차이가 존재 — 대표적으로 HOME/DEVELOPMENT 는 GitHub Actions 사용, COMPANY 는 `gh-pages` 브랜치 방식. 이 차이로 인해 `astro.config.mjs`, 워크플로우 파일 등에서 conflict 가 발생함. 가장 흔하고 치명적인 실수는 **링크가 깨지는 것** (`base` 분기 로직 손상 → COMPANY 배포에서 404). 그래서 conflict 해결은 아래 규칙대로 **신중하게** 적용해야 함.

`git merge upstream` 시 발생하는 충돌은 다음 규칙에 따라 항상 동일하게 해결:

| 충돌 파일 | 원인 | 해결 (COMPANY 기준) |
|---|---|---|
| `.github/workflows/deploy.yml` | HOME&DEVELOPMENT 에만 있는 파일, COMPANY 에서 삭제됨 | `git rm` 으로 삭제 유지 (COMPANY 는 `deploy_at_company.yml`만 사용) |
| `astro.config.mjs` | upstream에 `PUBLIC_IS_COMPANY` env 노출 코드 추가 | `process.env.PUBLIC_IS_COMPANY = String(isCompany);` 라인 **유지** (`about.astro`, `index.astro`에서 mirror 안내 표시에 필요) |
| `.gitignore` | 주석 문구 차이 | HEAD (COMPANY 주석) 유지 |

**빠른 해결 스크립트**:
```bash
# 1. deploy.yml 삭제 유지
git rm .github/workflows/deploy.yml

# 2. astro.config.mjs: PUBLIC_IS_COMPANY 블록 제거 (HEAD 유지)
# 충돌 마커에서 upstream 쪽 라인만 삭제

# 3. .gitignore: HEAD 주석 유지

# 4. 스테이징 & 커밋
git add -A
git commit -m "Merge upstream: resolve conflicts for company repo"
```

구조가 궁금하면 `src/` 를 직접 보세요. 핵심만:
- `src/content.config.ts` — Zod schema. `category` 필수 enum.
- `src/consts.ts` — `SITE_TITLE`, `CATEGORY_LABELS`
- `src/styles/global.css` — 색 토큰 (`--accent` 블루, `--claude` 오렌지)
- `src/components/` — `Header`, `Footer`, 시각 컴포넌트 (`GuiVsCli`, `EraTimeline`, `LayerStack`, `ClosingHero`)
- `src/content/blog/` — 포스트 (`.md` 또는 `.mdx`)

---

## 글쓰기 톤 가이드

### 블로그 목소리

- **1인칭 한국어**: "저는", "제가", "~합니다/~해요"
- **톤**: 담백하고 진지하되, 과장·호들갑 없음
- **기술 깊이**: 낮추지 않음. 독자의 지능을 존중
- **서사 구조**: 개인 서사 + 기술적 깊이 블렌드
- **독자 가정**: 처음 오는 사람. 맥락을 친절히 깔아줌
- **Em-dash (—)**: 남발 금지. 꼭 필요할 때만

### 글 구조 권장

- Opening hook (첫 2-3 문장으로 사로잡기)
- 맥락과 동기 (왜 썼고, 누구에게 도움이 될지)
- 본문은 서사 곡선 (도입 → 전개 → 절정 → 결말)
- 구체적 예시 (코드, 스크린샷, 실제 명령어)
- 마무리는 다음 포스트 예고 또는 독자에게 던지는 질문

### 원본 자료 변환 원칙

블로그 콘텐츠 원본: 별도 Private repo 로 관리 (계속 확장).

**복붙 금지**. 블로그 톤으로 재작성하고, 핵심 비주얼은 Astro 컴포넌트로 포팅.

| | 원본 자료 | 블로그 포스트 |
|---|---|---|
| 톤 | Reference, 중립적 | 1인칭 서사 |
| 구조 | 슬라이드/문서 | 서사 곡선 |
| 독자 | 내부 참조용 | 맥락 0에서 시작 |
| 비주얼 | 정적 HTML | MDX + Astro 컴포넌트 |

---

## 새 글 작성 규칙

### Frontmatter (category 필수)

```yaml
---
title: '글 제목'
description: '요약 한 줄'
pubDate: 'Apr 22 2026'
category: claude-code-101   # claude-code-101 / harness-engineering / claude-code-vs-opencode / about-astro / lab-notes 중 하나 — 오타 시 빌드 에러
series: 'understanding-claude-code'   # 선택. 같은 시리즈 글들끼리 묶는 슬러그 (prev/next 자동 표시용)
seriesOrder: 1                          # 선택. 시리즈 내 순번. series 와 함께 지정해야 동작
heroImage: '../../assets/some.jpg'      # 선택. 없으면 hero 자동 생략
---
```

### MDX 컴포넌트 사용

`.mdx` 파일 frontmatter 바로 아래에 import:

```mdx
import ClosingHero from '../../components/ClosingHero.astro';

본문 ...

<ClosingHero />
```

기존 4개 컴포넌트는 첫 포스트에 특화됨 — 다른 글에서 쓸 때는 재작성하거나 props 로 일반화 필요.

### 색 시스템 (브랜딩 규칙)

| 용도 | 토큰 | 언제 |
|---|---|---|
| 사이트 전체 accent | `var(--accent)` 블루 | 카테고리 뱃지, 네비 active, 링크 |
| 콘텐츠 NOW/현재 | `var(--claude)` 오렌지 | 시각 컴포넌트의 "지금" 요소 |
| 과거/먼 요소 | 쿨 슬레이트 | `rgba(96, 115, 159, 0.09)` 등 |
| 전환기 요소 | 연한 웜 | `rgba(204, 120, 92, 0.04)` 등 |

규칙: **쿨 슬레이트 (과거/멀다) → 연한 웜 (전환) → 풀 오렌지 (현재/가깝다)** 진행감.

### 발행 워크플로우

**원칙**: 블로그 테스트는 로컬에서 (`npm run dev`), commit 및 push 는 저자가 수동으로 진행한다. **Claude 가 자동 commit 금지**.

```bash
# 로컬 미리보기
npm run dev   # http://localhost:4321

# 배포 (저자가 직접 실행)
git add src/content/blog/<slug>.mdx
git commit -m "Add post: <title>"
git push
```

---

## 다음 작업 백로그

### Phase 2: Flagship 글 — 대기 중

블로그의 "결정적 증거" 역할. 기업 환경에서 AI Agent 도구를 쓸 때의 제약과 대응 경험을 1인칭 서사로. 기술 배경 + 조직 맥락 + 과정의 고민 블렌드. **구체 주제는 저자와 상의**.

### Phase 3: 원본 자료 기반 후속 포스트

- ✅ "왜 Claude Code 는 터미널에 있을까?" (`why_cli.html`)
- ⬜ "Claude Code 를 `--debug` 로 열어봤다" (`claude-code-startup.html`)
- ⬜ "Commands vs Skills — 누가 진짜 일을 하는가" (`commands-vs-skills.html`)
- ⬜ "OpenAI가 만든 Claude Code Plugin 뜯어보기" (`codex-plugin.html`)

### Phase 4 (보류): 카테고리 네비게이션 UI

글 5~10편 쌓인 뒤. `/category/[slug].astro` 동적 라우트 + 뱃지 클릭 가능화. 지금은 글 수가 적어 필터 페이지가 허전함.

---

## 트러블슈팅

- **새 글이 안 보임**: Ctrl+Shift+R (Astro View Transitions 캐싱). `content.config.ts`·새 `.mdx`·`astro.config.mjs` 변경 시 dev 서버 재시작.
- **빌드 실패**: https://github.com/Taekyo-Lee/taekyo-lee.github.io/actions
- **Node 버전**: Astro 6 은 22.12.0 이상 필수. `nvm alias default 22` 으로 기본 설정.
- **COMPANY 블로그 CSS 깨짐**: `build.assets`가 `_astro`면 GE가 무시 → `assets`로 자동 설정됨. `astro.config.mjs`의 `isCompany` 탐지 로직 확인.
- **COMPANY 블로그 링크 404**: `href`에 하드코딩 절대 경로가 있으면 `base` 미반영 → `import.meta.env.BASE_URL` 사용.

  
