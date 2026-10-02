# 사내 정보 고치기 가이드 (사내 LLM용)

이 교안은 사외(공개) 기준으로 만들었습니다.
사내 방식이 다른 정보는 전부 `src/site/site.js` 한 파일에 모여 있습니다.
이 문서는 그 파일을 사내 기준으로 고치는 방법입니다. 사람이 읽어도 되고, OpenCode 에게 먼저 읽혀도 됩니다.

## 할 일

1. `src/site/site.js` 에서 고칠 항목을 찾는다 (아래 표).
2. 사용자가 붙여 준 사내 안내문을 보고 **값만** 바꾼다.
3. 고친 항목의 `checked` 를 `true` 로 바꾼다.
4. `python build.py` 를 실행해 `dist/AX교육_교안.html` 을 다시 만든다.
5. 바꾼 항목과 빌드 결과를 사용자에게 알린다.

## 항목과 쓰이는 곳

| 항목 | 내용 | 쓰이는 슬라이드 |
|---|---|---|
| `codemate` | codemate 안 도구 셋의 설명 (`tools[].rows`) | 1장 codemate |
| `models` | 사내 모델 4종(MAX·Pro·Fast·Image) 설명과 "이럴 땐 어떤 모델" (`list`, `tasks`). 이미 사내 기준 | 1장 사내 LLM, 3장 슬래시 명령 |
| `install` | PowerShell 에 붙여넣을 **사내 설치 명령 한 줄** (`code` 의 `<사내 설치 명령 한 줄>` 자리), `points`, `cap` | 3장 설치 |
| `run` | 터미널 첫 위치와 실습 폴더 (`home`, `workdir`), 실행 명령 (`code`, `cap`) | 3장 터미널 두 쪽, 3장 실행법 |
| `config` | `opencode.json` 전체 (`path`, `json`) | 3장 opencode.json 해부 |
| `omo` | Oh-my-codemate 설치 방법과 에이전트 목록 (`points`, `code`, `cap`, `agents`, `agentsFoot`) | 7장 에이전트 팀, 7장 설치 |
| `github` | 사내 GitHub 주소, Pages 주소 형식과 메뉴 위치 (`host`, `pagesUrl`, `pagesPath`, `cap`) | 8장 여러 쪽 |
| `datalake` | Bigdataquery 조회 코드, MCP 서버 코드, 테이블 이름 (`table`, `queryCode`, `mcpCode`, `cap`) | 2장 툴 호출, 5장 여러 쪽 |

## 형식 규칙 (어기면 슬라이드가 넘치거나 깨집니다)

- 키 이름(`checked`, `points`, `code` …)과 항목 순서는 바꾸지 않는다. **값만** 바꾼다.
- `points` 는 줄 수를 그대로 둔다. 한 줄 = 한 문장, **40자 안쪽**.
- `points` 에서 `**굵게**`, `` `코드` `` 표기는 써도 된다. 그 밖의 마크다운은 쓰지 않는다.
- `code` 는 **15줄 안쪽**, 한 줄 **70자 안쪽**. `config.json` 은 **22줄 안쪽**.
- 문자열은 작은따옴표 `'…'` 로 감싼다. 안에 작은따옴표가 있으면 `\'`, 줄바꿈은 `\n`, 역슬래시는 `\\`.
- `config.json` 은 올바른 JSON 이어야 한다. 키 이름 `provider`, `model`, `small_model`, `permission`, `mcp`, `plugin`, `$schema` 는 남긴다 (슬라이드가 이 이름으로 칸을 찾는다).
- `run.home`, `run.workdir` 는 `C:\\폴더` 형식의 Windows 경로. 역슬래시는 두 번 쓴다.
- `github.pagesUrl` 은 한 줄. `<내 아이디>`, `<저장소>` 같은 자리표시는 그대로 둔다.
- `models.list` 는 4개 그대로, `line` 은 30자 안쪽. `tasks[].pick` 은 `list` 의 `id` 중 하나.
- `install.code` 의 `<사내 설치 명령 한 줄>` 은 운영팀이 준 명령으로 바꾼다. 명령 안에 비밀번호·토큰이 있으면 넣지 않는다.
- `omo.agents` 는 8개 안쪽. 각 항목 `{ t: 이름, s: 한 줄 설명(15자 안쪽), tag: 2글자 }`.
- 비밀번호, API 키, 개인 계정은 넣지 않는다. 키는 `{env:변수이름}` 처럼 환경변수로 적는다.
- `src/site/site.js` 말고 다른 파일은 고치지 않는다.

## 확인

- `python build.py` 가 오류 없이 끝나야 한다. 오류가 나면 대개 따옴표나 쉼표 문제다.
- 고친 항목이 쓰이는 슬라이드를 열어, 글이 한 화면에 들어가고 오른쪽 위 "사외 기준" 표시가 사라졌는지 본다.

## 빌드가 안 될 때

- `python build.py` 는 Python 3 만 있으면 된다.
- `fontTools` 가 없으면 미리 잘라 둔 글꼴을 쓴다. 새로 넣은 한글 중 일부가 맑은 고딕으로 보일 수 있지만 동작에는 문제없다.
- 빌드 없이 고치려면 `dist/AX교육_교안.html` 안에서 `AX.site = {` 를 찾아 같은 규칙으로 고친다. 이 경우 다음 빌드 때 덮어쓰이므로 `src/site/site.js` 도 같이 고친다.

## site.js 밖에서 사내 확인이 필요한 곳

이 파일 밖에도 사내 값이 들어가는 곳이 몇 군데 있습니다. 위 작업이 끝난 뒤 사람이 확인합니다.

- `kit/요청문.md` 5장: 테이블 이름 `eqp_alarm` 과 컬럼 (교안의 `datalake.table` 과 같게)
- `kit/README.md`: 실습 폴더 구성, 체크포인트 준비
- `kit/AGENTS.md`, `kit/요청문.md` 8장: 사내 GitHub 주소 (`github.host` 와 같게)
- `src/content/08-git.js` 판정 게임의 예시 저장소 이름 `my-team/alarm-report`
