# AX 교육 교안 — 소스

대상: 포토 공정 엔지니어. 4장은 스캐너 노광(레일리 식) 3D 패터닝 시뮬레이터 실습, 5~6장은 설비 알람 데이터(예시 테이블 `eqp_alarm`)로, 8장은 Git·사내 GitHub·Pages 로 진행합니다.

**사내 정보(설치·설정·OMO·GitHub·Datalake)는 `src/site/site.js` 한 파일에 모았습니다.** 고치는 방법은 `src/site/README.md`.

`python build.py` → `dist/AX교육_교안.html` (단일 파일, 외부 의존 없음, 폐쇄망 OK)

- `src/content/00-home.js`  홈 화면 문구
- `src/site/site.js`        사내 정보 (사외 기준 값 + checked 표시). 사내 LLM 에게 고치게 할 곳
- `src/content/*.js`        장별 슬라이드 데이터. 장 번호는 파일 순서로 자동 부여(00 시작하기, 01~09 장, 99 부록). 글·순서를 고치려면 여기만
- `src/demos/*.js`          인터랙티브 데모 (이름 → mount). 새 데모는 `AX.demos['이름'] = { mount }` 로 등록
- `src/assets/*.png`        슬라이드에 들어가는 그림. 빌드 때 base64 로 HTML 안에 묻힙니다
- `src/core/`               엔진: util(DOM) · theme(밝기) · art(단면도 SVG) · render(슬라이드) · home(홈) · deck(라우팅·16:9 캔버스·키보드)
- `src/styles/`             base(팔레트) · home · layout(골격) · slides · demos · ui · explain · sim · learn(2장 기초) · work(터미널·Git) · data(5장 SQL·API)
- `kit/`                    수강생 PC 에 넣는 실습 키트 (Scanner.md, AGENTS.md, 요청문.md, lib/three.min.js, checkpoints/)

## 슬라이드 쓰는 법
슬라이드 한 장 = `{ title, points[], caution?, code?{text,cap}, demo?, demoProps?, notes?, site? }`
`site: 'install'` 처럼 site.js 항목을 적으면, 그 항목이 `checked: false` 일 때 오른쪽 위에 "사외 기준" 표시가 뜹니다.
글 규칙: 불릿 하나 = 한 문장 = 한 줄(40자 이내). 보조 설명은 `\n` 뒤에 쓰면 작은 회색 줄로 붙습니다. 부제·주의 문구도 문장마다 `\n`.
슬라이드는 1280×720 설계 크기로 그려지고 화면에 맞춰 통째로 축소·확대됩니다. 새 슬라이드가 이 크기를 넘지 않게 작성하세요.

## 그림(스크린샷) 넣는 법
`src/assets/` 에 PNG 를 두고 `demo: 'figure'` 로 씁니다.
- 한 장: `demoProps: { src: 'asset:파일명.png', caption: '설명', height: 420 }`
- 두 장 나란히: `demoProps: { items: [{ src: 'asset:a.png', caption: '…' }, { src: 'asset:b.png', caption: '…' }], height: 400 }`
`height` 는 1280×720 캔버스 기준 최대 높이(px)입니다. 글이 많은 슬라이드는 380 이하로.

지금 들어 있는 OpenCode 화면은 OpenCode 1.18.34 를 사내 설정(codemate 제공자, Pro/MAX 모델)으로 띄워 찍은 것입니다.
배포 버전이 바뀌면 같은 장면을 다시 찍어 파일 이름만 맞춰 바꾸면 됩니다.

## 디자인: 밝은 키노트 + 어두운 화면
흰 바탕, 짙은 글자, 파랑 하나(`--acc`). 색은 `src/styles/base.css` 의 토큰만 씁니다.
- 어두운 화면: **D** 키나 아래 조작 바의 "어둡게" 버튼. 같은 토큰 이름을 `:root[data-theme="dark"]` 에서 어둡게만 바꿉니다. 그래서 새 CSS 에 `#fff` 같은 색을 직접 쓰지 말고 토큰을 쓰세요.
- 처음에는 저장된 선택, 없으면 PC 설정(밝게/어둡게)을 따릅니다. 인쇄 보기는 늘 밝게. 코드는 `src/core/theme.js`.
- 파랑의 단계(`--blue-1 … --blue-5`)는 범주를 구분해야 하는 데모(컨텍스트·토큰)에만 씁니다.
- 주의·통과·실패에만 의미색(`--amber`, `--ok`, `--bad`)을 씁니다.
- 표지·홈 그림은 웨이퍼 샷맵입니다. 장이 지날수록 지그재그 순서로 샷이 노광되고, 지금 장의 샷이 진하게 표시됩니다.
- 4장 표지만 `art: 'pic:scanhero'` 로 스캐너 그림을 씁니다. `art: 'pic:그림이름'` + `artCap` 이면 어느 표지든 그림을 바꿀 수 있습니다.
- 화면 위아래 조작 바는 마우스를 움직일 때만 2.5초 보입니다. 키: ← → 이동, Esc 홈, N 강사 노트, P 인쇄 보기, D 밝기.
- 움직임: 쪽이 바뀌면 불릿·그림이 차례로 떠오르고, 그림의 입체 상자는 마우스를 올리면 살짝 뜹니다. PC 설정에서 "동작 줄이기"를 켜면 모두 멈춥니다.

## 그림 (pic)
글만 있던 쪽과 코드 쪽에는 간단한 그림을 붙입니다. 슬라이드에 `pic: '이름'` 을 적으면 됩니다.
- 코드가 있으면 코드 옆, 없으면 글 아래에 놓입니다. `picSide: true` 면 글 옆, `picW` 로 너비(px)를 바꿉니다.
- 그림은 `src/pics/*.js` 에 장별로 있습니다. 그리는 도구(상자·화살표·문서·폴더·사람·아이콘)는 `src/pics/_kit.js`, 입체 도형(상자·원통·서버·모니터)과 순서도 도형(마름모·알약·굽은 화살표)은 `_kit3d.js`, 색은 `src/styles/pics.css`.
- 입체 상자는 `<g class="blk">` 로 묶여 차례로 떠오르고, 실선 화살표는 그려지듯 나타납니다.

## 인터랙티브 데모
데모 하나 = `src/demos/` 파일 하나. 내용은 콘텐츠 파일의 `demoProps` 에 있고, 데모는 동작만 맡습니다.
공용 조작부(단계 넘기기, 선택 버튼, 복사 버튼)는 `src/core/ui.js` 에 있습니다.

| 데모 | 쪽 | 하는 일 |
|---|---|---|
| `picker` (labels) | 1장 내 업무에 넣어 보면 | 업무를 고르면 지금 방식·요청문·실습 위치 |
| `models` | 1장 사내 LLM 네 가지 | 할 일을 고르면 맞는 모델(MAX·Pro·Fast·Image)과 이유 |
| `evolution` | 1장 자동완성에서 에이전트로 | 탭을 바꾸면 "누가 무엇을 하나" 표가 바뀜 |
| `reveal` | 1장 미리 알고 가기 | 증상 카드를 뒤집으면 처방 |
| `grounding` | 2장 모른다고 말하지 않습니다 | 파일 유무에 따른 답 비교, 되묻기 |
| `tui` | 3장 슬래시 명령 | OpenCode 입력창 흉내: `/` 목록, Tab 모드, `/models` |
| `promptcard` (parts) | 4장 오늘의 요청문 | 4요소 칩을 누르면 요청문에서 칠해짐 |
| `cards` (say) | 4장 개선해보기 | 카드를 누르면 한 줄 요청과 복사 |
| `picker` | 4장 막혔을 때 | 상황을 고르면 보이는 것·할 말·이유 |
| `sql` | 5장 SQL | 칸(SELECT)·조건(WHERE)을 고르면 SQL 문장과 결과 표가 바뀜 |
| `api` | 5장 API | 주문을 고르면 보내는 요청(GET·POST)과 돌아오는 JSON |
| `mcp-plug` | 5장 MCP | 꽂기/뽑기에 따라 툴 목록과 답이 바뀜 |
| `judge` | 5장 데이터 규칙, 8장 push | 요청을 괜찮다/안 된다로 판정 |
| `alarms` | 5장 실습 알람 차트 | 설비를 고르면 하루 알람 건수 막대, 평소 선, 평소의 2배 넘은 날 (키트의 가상 데이터) |
| `permission` | 6장 권한 | allow/ask/deny 를 고르면 결과와 설정이 바뀜 |
| `hooks` | 6장 Hook | 실행 직전·수정 뒤를 한 칸씩, Hook 켜기/끄기 비교 |
| `filetree` | 6장 어디에 두면 읽히나 | 파일을 누르면 언제 읽히는지 |
| `relay` | 7장 역할 나누기 | 계획자→구현자→검토자, 검토자가 실수를 잡음 |
| `litho` | 4장 노광 원리 | 광원·NA·k1·하프피치를 바꾸면 R·DOF·판정과 줄무늬 단면이 바뀜 |
| `fit` | 2장 딥러닝 | 기온–커피 판매량 점에 직선을 맞추며 오차가 줄어드는 과정 |
| `attention` | 2장 트랜스포머 | 단어를 누르면 어느 단어를 얼마나 보는지 |
| `bertgpt` | 2장 BERT 와 GPT | 인코더는 빈칸 맞히기, 디코더는 한 조각씩 이어 쓰기 |
| `timeline` | 2장 LLM 까지 | 해를 누르면 그해의 변화 |
| `shell` | 3장 터미널 연습 | 가짜 PowerShell: pwd · dir · cd 로 실습 폴더에 들어가 opencode |
| `anatomy` | 3장 opencode.json | 칸 이름을 누르면 설정 파일에서 그 부분이 칠해짐 |
| `savepoints` | 8장 커밋은 세이브 포인트 | 다음 요청 · 커밋해줘 · 되돌려줘, 커밋을 건너뛰면 무엇을 잃는지 |
| `pages` | 8장 Pages | Settings → Pages 를 branch · main · Save 순서로 눌러 주소 받기 |
| `scorer` | 9장 과제 고르기 | 기준 체크 → 점수와 판정 |
| `site-status` | 부록 사내 정보 점검 | site.js 항목별 확인 여부와 쓰이는 쪽 |

## 글꼴 (HTML 안에 묻힘, 설치 불필요)
- 본문·제목: Wanted Sans (OFL). `src/fonts/WantedSansVariable.ttf` 를 빌드 때 교안에 쓰인 글자만 잘라 넣습니다 (약 110 KB).
  - 자르기에는 `pip install fonttools brotli` 가 필요합니다. 없으면 미리 잘라 둔 `WantedSans-subset.woff2` 를 그대로 씁니다.
    이 경우 새로 추가한 글자는 시스템 글꼴(맑은 고딕)로 표시됩니다. 글을 많이 고쳤으면 fontTools 가 있는 PC 에서 한 번 빌드하세요.
- 큰 숫자: Unbounded 800 (OFL). 코드: JetBrains Mono (OFL).
