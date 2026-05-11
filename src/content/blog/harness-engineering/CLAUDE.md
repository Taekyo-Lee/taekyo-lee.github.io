# 카테고리: harness-engineering

이 폴더의 글들은 시리즈 *Context Engineering of Claude Code* (`series: 'context-engineering-of-claude-code'`) 에 속합니다. 시리즈 작업 시 따를 원칙들. 루트 `CLAUDE.md` (em-dash 금지, 색 토큰, 톤 등) 위에 *카테고리 한정* 으로 얹는 규칙입니다.

---

## 0. Source of truth

이 시리즈의 콘텐츠는 `~/workspace/claude-code-fork/docs/context-engineering/` 의 markdown 파일들을 **source of truth** 로 합니다. 각 .md 가 한 토픽을 깊이 정리해 둔 reference 이고, 시리즈의 각 글은 거기서 출발해 블로그 voice 로 재작성됩니다.

**파일 ↔ 시리즈 글 매핑**:

| docs 파일 | 시리즈 글 |
|---|---|
| `00-plan.md` | 시리즈 전체 plan |
| `01-claude-md.md` · `02-memory-md.md` · `03-team-memory.md` | 6편 *영구 기억의 다섯 갈래* |
| `04-skills.md` · `05-slash-commands.md` | 7편 *Skills 와 Slash Commands* |
| `06-subagents.md` | 8편 *Subagents* |
| `07-output-styles.md` · `08-settings-keys.md` · `09-mcp-config.md` | 4편 *Settings 와 MCP* |
| `10-session-transcripts.md` · `11-session-memory.md` · `12-scratchpad.md` | 9편 *세션의 기억* |
| `13-git-context.md` | 5편 *gitStatus* |
| `14-hooks.md` | 10편 *Hooks* |
| `99-consolidation.md` | 11편 *Master map* (종합) |

**How to apply**:
- 새 글 작성: 해당 .md 를 먼저 읽고 출발점으로
- 기존 글 review: .md 의 최신 fact 와 어긋난 부분 있는지 비교
- 단, §1 의 fork 주의 (`[FORK]` 표기 단락은 시리즈에 옮기지 않음) 와 §3 의 코드 grep 검증 (.md 자체도 outdated 일 수 있음) 은 같이 적용

**양방향 동기화 (중요)**: 블로그 작성·review 중에 *.md 에 없는 새 fact* 또는 *.md 의 정정거리* 를 발견하면, 해당 변경을 **source of truth 인 .md 에도 반영** 합니다.

- 새 fact (예: 새로운 trace 관측, 추가 함수 경로) → 해당 .md 에 추가
- .md 의 오류 (예: outdated 함수명, 잘못된 라인 번호, 잘못된 fact) → .md 를 정정
- 블로그 쪽만 고치고 .md 를 그대로 두면 source of truth 가 *블로그보다 stale* 한 모순 상태가 되므로, 다음 글 작성·review 시 잘못된 출발점이 됩니다

**Why**: source of truth 가 한 곳이어야 일관성이 유지됩니다. 블로그는 source 의 *재작성* 이지 *fork* 가 아닙니다. 두 곳이 fact 차원에서 갈라지면 어느 쪽이 맞는지 매번 판단해야 하고, 시리즈가 진행될수록 drift 가 누적됨.

**관련 경로 reference**:

| 경로 | 용도 |
|---|---|
| `~/workspace/claude-code-fork/docs/context-engineering/` | Source of truth docs (위 매핑 표 참고) |
| `~/workspace/claude-code-fork/` | Claude Code fork 소스 코드 (§3 코드 grep 검증에 사용) |
| `~/workspace/claude-context-engineering/` | 테스트 sandbox (dummy project) |

**테스트 가이드 (Claude Code fork 동작 검증 시)**:

- 가능하면 sandbox `~/workspace/claude-context-engineering/` 에서 진행 (**기본 권장**)
- fork 디렉토리 자체에서 반드시 해야 하는 경우 (예: bundle 빌드 결과 직접 검증) 만 `~/workspace/claude-code-fork/` 에서

**Why**: fork 디렉토리에서 직접 테스트하면 그 디렉토리의 `.claude/`, `CLAUDE.md`, git state, node_modules 등이 변수로 끼어들어 깨끗한 관측이 어려워요. sandbox 는 *변수 통제* 용. 새 CLAUDE.md / settings 조합을 시험할 때 sandbox 가 default.

---

## 1. Fork 언급 일체 금지

이 시리즈는 **upstream Claude Code** 만 다룹니다. claude-code-fork 의 fork-specific 동작은 아예 언급하지 않아요.

- *fork* 라는 단어 자체 사용 금지
- fork 한정 동작 (예: OpenAI shim 의 consecutive user message coalescing) 언급 금지
- `~/.claude-fork/` 같은 fork 경로 언급 금지
- *Anthropic-direct mode* 같이 fork 와의 대비를 시사하는 표현도 금지. 그냥 *Claude Code* 로 단정 서술

**Why**: 시리즈 audience 는 일반 Claude Code 사용자입니다. fork 흔적이 들어가면 잘못된 정보 (universal 처럼 표기된 fork-specific fact) 또는 무관한 노이즈가 됩니다.

**Source 참조 시 주의**: 저자의 local 경로 `~/workspace/claude-code-fork/docs/context-engineering/` 가 fact 검증의 reference 로 쓰일 수 있지만, 거기 `[FORK]` 표기된 단락은 시리즈에 옮기지 말 것. 새 글 작성 또는 기존 글 review 후 `grep -i fork` 로 잔흔 확인.

---

## 2. 빌드별로 변할 수 있는 숫자는 hedging

Claude Code 는 계속 update 되므로 *settings 키 개수*, *slot 안의 dynamic block 개수* 같은 fact 는 시점에 묶인 숫자입니다.

- **단정적 표현 피함**: *"다섯 개"*, *"네 키"* → *"손에 꼽힐 정도"*, *"몇 개"*, *"위 키들"* 같은 정성적 표현
- **시점 anchor 필요할 땐**: *"제가 살펴본 빌드 (`cc_version 2.1.88`) 기준 다섯 개"* 처럼 빌드 명시
- **architectural fact 는 단정 OK**: *4 서브 블록*, *static/dynamic cache 절단점* 같은 구조 사실은 안정적

---

## 3. 핵심 fact 는 source 에 grep 으로 검증

slot 번호 매핑, 키 cascade 순서, 함수 위치 같은 fact 를 단정 서술하기 전에 `~/workspace/claude-code-fork/` 에서 직접 grep 으로 검증. 공식 docs 만 의존하면 outdated 또는 incomplete 일 수 있어요. 자주 참조되는 파일:

- `constants/prompts.ts` — system prompt 슬롯 빌드
- `utils/settings/settings.ts`, `utils/settings/constants.ts` — settings cascade 머지 로직
- `utils/api.ts` — `splitSysPromptPrefix`, `prependUserContext`, `appendSystemContext`
- `utils/queryContext.ts` — SDK overrides
- `utils/gitSettings.ts` — `shouldIncludeGitInstructions`

`docs/context-engineering/*.md` 도 좋은 reference 지만, 위 §1 의 fork 주의사항을 따르고, doc 자체에 오류가 있을 수 있으니 코드 검증을 우선으로.

---

## 4. 시리즈 내부 용어 통일

- **3 top-level Block 의 canonical 명명**: 한 LLM 호출의 입력은 세 top-level key 로 나뉘는데, 시리즈에선 각각을 ***System Block*** / ***Tools Block*** / ***Messages Block*** 으로 부릅니다. 2편 (Context Architecture) 에서 정의되고 후속 글들이 이 명명으로 cross-reference.
  - **Block 단어 없이 단독으로 쓸 때도 대문자 시작**: 다이어그램 label, *"System 배열 안에..."*, *"Tools 카테고리..."* 처럼 Block 의미로 단독 등장할 땐 항상 capitalize. 한국어 조사는 그대로 붙임 (*"System Block의"*, *"Messages 배열"*).
  - **lowercase + `<span class="k">` 음영은 *literal API 식별자* 한정**: 진짜 JSON role 값 (*"role: 'system'"*), frontmatter YAML config key (*subagent 의 `tools` / `disallowedTools` 등*), 코드 함수명·상수처럼 *literal code identifier* 에만. *conceptual Block 참조엔 평문 capitalize* 가 default.
  - **변형 표기 금지**: *system message block* (옛 명명), *system 영역* / *system 블록*, *messages 영역* / *messages 블록*, *세 블록* 같은 변형은 시리즈에서 쓰지 않음. 새 글 작성·기존 글 review 시 `grep -nE "(세 블록|system message block|system 블록|system 영역|messages 블록|messages 영역)"` 로 잔흔 확인
- **21 slot framing**: *static 7 + dynamic 14 (slot 21 = gitStatus trailer)*. 3편이 정한 기준이고 후속 글들이 이 명명으로 cross-reference. 99-consolidation 의 *20 + trailer* 변형은 시리즈에 옮기지 않음
- **4 서브 블록**: System Block 안의 4 sub-block 구조 (*attribution header* / *system prompt prefix* / *static system blocks* / *dynamic system blocks*). 3편이 set 한 명명을 시리즈 전반에서 일관 유지
- **cross-reference 표기 (title-link 룰)**: 다른 글 reference 는 *N편* 같은 편 번호 형태가 아니라 **title 자체 + link** 으로 표기. 정확한 형식은 컨텍스트에 따라 hybrid:
  - **본문 inline 참조**: short identifier 사용. 예: `[*Subagents*](../subagents/) 에서 자세히 보지만`, `[*gitStatus*](../git-context/) 의 cache 분류`
  - **시리즈 banner / Take-home blockquote / 이미지 caption / explicit citation**: full title 사용. 예: banner 안의 `<a href="../system-prompt-assembly/">3편 <em>Claude Code 의 system message block</em></a>`
  - **link format**: `[*identifier*](../<slug>/)` (italic title inside link, 상대 경로). HTML form 도 OK: `<a href="../<slug>/"><em>identifier</em></a>` (특히 `<p>` 태그 안에서)
  - **slug 매핑**: harness-vs-context-engineering / claude-code-context-architecture / system-prompt-assembly / settings-and-mcp / git-context / permanent-memory-three-channels / skills-and-slash-commands / subagents / sessions-transcripts-and-memory / hooks-context-injection / master-map-and-phase2-findings (1편~11편 순서)
  - **self-reference**: 자기 자신을 가리키는 경우 link 없이 *이 글*, *이 편* 등으로 자연스럽게
  - **References 블록**: 마지막 섹션의 `시리즈 N편: <link>` 형태는 그대로 OK (목록 자체가 explicit citation 형식)
- **시리즈 뱃지**: 각 글 첫 자리에 `<div class="series-banner">📚 시리즈 ... 의 N 번째 글입니다 ...</div>` 한 단락

---

## 5. Inline backtick 일체 금지

이 시리즈의 .mdx 본문에선 markdown 의 인라인 backtick (`` `xxx` ``) 을 쓰지 않습니다. fenced code block (` ```...``` `) 은 OK — 그건 진짜 코드 영역이라 시각이 정돈됨.

대신 사용:

- **단일 토큰** (key, file, version, 함수명 단어): 평문 (예: language, ~/.claude/settings.json, cc_version 2.1.88)
- **다토큰 shell/JSON 스니펫**: `<span class="mod">…</span>` (모노스페이스 + 옅은 슬레이트 배경, 예: `<span class="mod">--setting key=value</span>`)
- **code identifier** (함수·시스템 상수): `<span class="k">…</span>` (모노스페이스 + 블루, 배경 없음, 예: `<span class="k">getInitialSettings</span>`)
- **system prompt block 이름**: `<span class="k">#&nbsp;Block&nbsp;Name</span>` (블루 모노스페이스, # 와 공백 보존)

**Why**: 인라인 backtick 의 회색 음영이 한 줄에 여러 개 있으면 시각 노이즈로 흐름이 깨지고 가독성이 나빠짐. 단일 토큰은 *맥락만으로* 충분히 코드임을 알 수 있어 음영 없이 평문이 더 읽기 좋음. 코드성 강조가 필요한 자리만 위 HTML 스타일로 골라냄.

**How to apply**:
- 새 글 작성 시 인라인 backtick 사용하지 않기
- 기존 글 review 시 grep 으로 잔흔 확인 (fenced 안 의 것 제외)
- 원본 markdown 자료에서 옮길 때 backtick 자동 제거 후 위 규칙대로 변환

(이 CLAUDE.md 자체나 README 같은 문서 파일에는 backtick 사용 OK — 규칙은 *시리즈 .mdx 본문* 한정.)

**⚠ MDX 안전성 주의 — `<span>` 안의 특수 문자 escape**

markdown 메타문자가 `<span class="mod">` (또는 다른 `<span>`) 안에 들어가면 MDX 가 italic/JSX expression 시작으로 해석해서 빌드 에러 (*Expected the closing tag `</span>`...*) 발생. HTML entity 로 escape 필수:

| 문자 | 해석 위험 | escape |
|---|---|---|
| `*` | italic 시작 | `&#42;` |
| `{`, `}` | JSX expression | `&#123;`, `&#125;` |
| `<`, `>` | tag 시작 | `&lt;`, `&gt;` |

예시:
- `<span class="mod">browser_*</span>` → `<span class="mod">browser_&#42;</span>`
- `<span class="mod">{ "key": "value" }</span>` → `<span class="mod">&#123; "key": "value" &#125;</span>`
- `<span class="mod"><repo>/.claude/...</span>` → `<span class="mod">&lt;repo&gt;/.claude/...</span>`

(span 바깥 평문에선 markdown 파서가 다르게 작동 — `*` 가 단어 끝에 있어도 안전한 경우 많음. 위 escape 규칙은 *span 안* 한정.)

---

## 6. "박히다" / "바이트" 표현 사용 금지

### 6a. "박히다" 동사 사용 금지

이 시리즈의 .mdx 본문에서 *박히다* (그리고 변형: 박히는, 박혀, 박혔, 박힌, 박힘 등) 표현을 쓰지 않습니다.

대신 사용:

- **일반**: *들어가다* (들어가는, 들어가요, 들어가야, 들어갔, 들어간, 들어감)
- **정착 의미**: *자리잡다*
- **추가 의미**: *추가되다*, *포함되다*, *나타나다*, *등장하다*

**Why**: *박히다* 가 *못박는 듯한 물리적 강제성* image 라 글의 부드러운 voice (1인칭 *해요체*) 와 어긋나요. 또 시리즈 전반에서 반복되면서 단조로워졌고, *settings 가 prompt 에 들어가는 동작* 같이 주된 맥락에선 *들어가다* 가 더 자연스러움.

**How to apply**:
- 새 글 작성 시 *박히다* 사용하지 않기
- 기존 글 review 시 `grep -nE "박히|박혀|박힘|박혔|박힌"` 로 잔흔 확인
- 대체어 후보 중 문맥에 가장 자연스러운 것 선택 (대부분 *들어가다* 가 맞음)

### 6b. "바이트" 표현 사용 금지

이 시리즈의 .mdx 본문에서 *바이트* (그리고 *바이트를 박다*, *prompt 바이트*, *바이트 단위* 등 변형) 표현을 쓰지 않습니다.

대신 사용:

- **content 의미**: *내용*, *텍스트*, *컨텐츠*, *한 줄*
- **변환·도달 의미**: *prompt 에 들어가*, *LLM 에 도달하는* (바이트 변환 비유 제거)
- **active 주입 의미** (*바이트를 박다* 류): *내용을 넣다*, *추가하다*, *주입하다*

**Why**: *바이트* 가 시리즈 voice 와 안 맞아요. 너무 low-level (전송 단위) 한 비유라 *prompt 안에 들어가는 콘텐츠* 라는 주된 맥락의 자연스러움이 깨지고, *바이트를 박다* 같은 결합 표현은 §6a 의 *박히다* 와 같은 물리적-강제성 image 를 강화함.

**How to apply**:
- 새 글 작성 시 *바이트* 사용하지 않기
- 기존 글 review 시 `grep -n "바이트"` 로 잔흔 확인
- *바이트를 박다 / 박을 / 박습니다* 같은 결합은 *내용을 넣다 / 넣어요* 로 한꺼번에 정리

---

## 7. Take-home 등 multi-paragraph blockquote 는 `<p>` 태그로

시리즈의 Take-home 같이 *blockquote 안에 여러 단락* 을 넣는 자리에선 `<br/><br/>` 으로 단락을 분리하지 않습니다 — paragraph 간 공백이 과도하게 커져서 시각이 산만해져요.

대신 각 단락을 `<p>...</p>` 태그로 감싸기. paragraph 간 자연스러운 spacing 이 자동 적용돼요.

```mdx
✗ 잘못된 패턴 (공백 과다)
<blockquote>
첫 단락 ...
<br/><br/>
두 번째 단락 ...
</blockquote>

✓ 올바른 패턴
<blockquote>
<p>첫 단락 ...</p>
<p>두 번째 단락 ...</p>
</blockquote>
```

`<p>` 태그 안에선 markdown 파서가 일관되지 않을 수 있으니 강조 표현은 HTML 등가물 사용:

- `**bold**` → `<strong>bold</strong>`
- `*italic*` → `<em>italic</em>`

**reference 패턴**: 3편 (system-prompt-assembly) 의 Take-home 이 canonical 예시. 새 글 작성 시 그 구조 따르기.

**기존 글 점검**: 시리즈 다수 글에서 `<br/><br/>` 패턴이 남아 있을 수 있어요. 발견 시 위 패턴으로 마이그레이션:
```bash
grep -l "<br/><br/>" src/content/blog/harness-engineering/*/index.mdx
```
