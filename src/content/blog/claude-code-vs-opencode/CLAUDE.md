# 카테고리: claude-code-vs-opencode

이 폴더의 글들은 *OpenCode* 와 *Claude Code* 의 메커니즘을 *평행 시점* 에서 다룹니다. 루트 `CLAUDE.md` (em-dash 금지, HTML-first, 색 토큰 등) 위에 *카테고리 한정* 으로 얹는 규칙입니다.

---

## 0. Source of truth

이 카테고리의 글들은 두 source 를 reference 로 합니다.

| 종류 | 경로 | 용도 |
|---|---|---|
| 콘텐츠 (raw 리서치 + plan) | `~/workspace/ai-blog-contents-source/03-Claude-vs-OpenCode/` | 각 글의 출발점 |
| 코드 (OpenCode 소스) | `~/workspace/opencode-fork/` | 함수 위치, 라인 번호, mechanism 검증 |
| 공식 웹 | https://opencode.ai/ (docs: https://opencode.ai/docs/) | 기능 / 컨벤션 / 권장 사용법 공식 reference |

**파일 ↔ 글 매핑**:

| 콘텐츠 파일 | 블로그 글 |
|---|---|
| `research-notes/01-opencode-agentsmd.md` + `00-plan.md` | `opencode-agentsmd-mechanics/` (OpenCode 의 AGENTS.md mechanics) |

**how to apply**:
- 새 글 작성: 해당 raw 리서치 + plan 을 먼저 읽고 출발점으로
- 기존 글 review: raw 의 최신 fact 와 어긋난 부분 비교
- **양방향 동기화**: 블로그에서 발견한 새 fact / 정정거리는 raw 쪽에도 반영. 한쪽만 고치면 다음 글 작성 시 잘못된 출발점이 됩니다.

**Why**: source of truth 가 한 곳이어야 일관성 유지. 블로그는 raw 의 *재작성* 이지 *복제* 가 아닙니다.

---

## 1. 코드 검증은 `~/workspace/opencode-fork/` 에서 grep

함수 위치, mechanism, line 번호 같은 fact 는 코드에서 직접 grep 으로 검증합니다. 자주 보게 될 파일:

| 파일 | 다루는 mechanism |
|---|---|
| `packages/opencode/src/session/instruction.ts` | AGENTS.md / CLAUDE.md / opencode.json instructions 로딩, `findUp`, `resolve()`, 헤더 포맷 |
| `packages/opencode/src/session/prompt.ts` | runLoop 의 system 합성 (`[env, ...instructions, skills]` 순서) |
| `packages/opencode/src/session/system.ts` | provider 별 base prompt, `environment()` block |
| `packages/opencode/src/config/` | `opencode.json` schema, `instructions` field 처리 |

**Why**: `agents.md` spec 또는 `opencode.ai/docs/` 만 의존하면 outdated 가능. 코드가 최종 진실. 인용 시 라인 번호 (`instruction.ts:N`) 를 같이 적어두면 후속 review 가 쉬워집니다.

**버전 명시**: OpenCode 는 빠르게 update 됩니다. 라인 번호 / 정확한 함수 시그니처 같은 fact 는 *조사 시점* 한 줄로 묶어두세요 (예: *"2026-05-18 시점 `dev` 브랜치 기준"*). 시점 anchor 가 없으면 6 개월 뒤 같은 줄이 잘못된 fact 가 됩니다.

---

## 2. *fork* 라는 단어는 블로그 본문에 쓰지 않음

`~/workspace/opencode-fork/` 는 *저자의 verification sandbox* 일 뿐이고, 블로그 audience 는 일반 OpenCode 사용자입니다.

- *fork* 단어 본문 사용 금지
- 저자의 fork 한정 경로 (`~/workspace/opencode-fork/`) 가 본문에 등장하면 안 됨
- 코드 인용 시 reference 는 `sst/opencode` 또는 단순히 *OpenCode* 로 단정 서술

**Why**: fork 흔적이 들어가면 audience 가 *모든 사용자에게 universal 인지, 저자 환경 한정 fact 인지* 구분할 수 없어 노이즈가 됩니다.

새 글 작성 또는 기존 글 review 후 `grep -i fork` 로 잔흔 확인.

---

## 3. *vs* 가 아니라 *parallel*

폴더명이 `claude-code-vs-opencode` 이긴 하지만, 글들은 *대상 비교* 가 아니라 *같은 자리에 두 도구가 무엇을 두었는가* 의 평행 시점에서 작성합니다.

- *더 낫다 / 더 약하다 / 부족하다 / 우월하다* 같은 가치 판단 표현 자제
- *Claude Code 의 X 와 평행하게 OpenCode 는 Y* 같은 *구조 평행 매핑* 은 OK
- *Claude Code 에는 있는데 OpenCode 에는 없는 것* 식의 결손 framing 은 *원하면 짚되 가치 판단 없이*. *"OpenCode 는 X 시스템이 부재합니다"* 정도가 적절. *"OpenCode 는 X 가 약합니다"* 는 부적절.

**Why**: 두 도구는 서로 다른 디자인 가설로 출발했어요. 한쪽 기준으로 다른 쪽을 평가하면 매번 한쪽이 *부족* 해 보이는 framing 으로 흐릅니다. 메커니즘의 *모양* 자체를 보여주는 게 더 정확하고 audience 에게도 유용해요.

---

## 4. Sister blog 와의 cross-reference

이 카테고리의 글들은 자주 [*Claude Code 의 Long-term Memory*](../permanent-memory-three-channels/) (소스: `src/content/blog/harness-engineering/permanent-memory-three-channels/index.mdx`) 를 reference 합니다. 표기 규칙:

- **본문 inline**: `[Claude Code 의 Long-term Memory](../permanent-memory-three-channels/)` 같이 *full title + 상대 경로 link*
- **문맥이 분명한 짧은 자리**: *sister blog*, *자매편* 같은 식별자 link 도 OK

Astro 의 flat URL 구조 (`/blog/<slug>/`) 라 카테고리가 달라도 `../<slug>/` 가 안전합니다 (production 빌드의 `BASE_URL` 도 자동 반영).

**Why**: sister blog 는 *구조적 template* 입니다. 사전 지식 가정 없이 읽혀도 글이 성립하되, 그 글을 본 독자에게는 *같은 모양 다른 채움* 이라는 추가 layer 가 자연스럽게 얹혀요.

---

## 5. 카테고리 내부 용어 통일

- **OpenCode** — 항상 대문자 시작. *opencode* (소문자) 는 패키지/리포지토리 식별자로만.
- **AGENTS.md / CLAUDE.md** — 대문자 그대로. 첫 등장은 `<span class="term">AGENTS.md</span>` 로 강조.
- **함수 / 코드 식별자**: `<span class="k">findUp</span>`, `<span class="k">resolve()</span>`, `<span class="k">systemPaths()</span>` 같은 식으로 블루 모노스페이스. (`.k` 클래스는 post 상단 `<style>` 블록에 정의)
- **소스 라인 인용**: `<span class="mod">instruction.ts:N</span>` 또는 fenced 코드블록 옆 평문 `instruction.ts:N`.
- **레퍼런스 출처 표기**: *agents.md* 공식 스펙 vs *opencode.ai/docs/* 문서 vs *sst/opencode* 소스 코드. 세 layer 가 다르므로 인용 시 어디서 가져왔는지 구분.
