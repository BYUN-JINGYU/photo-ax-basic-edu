// =====================================================================
// 사내 정보: 사내 방식과 다른 내용은 전부 이 파일 하나에 모았습니다.
// 지금 값은 사외(공개) 기준입니다. 사내 방식으로 고친 항목은 checked 를 true 로 바꾸세요.
// checked 가 false 인 항목을 쓰는 슬라이드에는 오른쪽 위에 "사외 기준" 표시가 뜹니다.
//
// 고칠 때 지킬 것 (슬라이드가 한 화면에 들어가도록)
// - points 한 줄 = 한 문장, 40자 안쪽. 줄을 늘리지 말고 바꾸기만 합니다.
// - code 는 15줄 안쪽, 한 줄 70자 안쪽.
// - 키 이름(checked, label, points …)은 바꾸지 않습니다. 값만 바꿉니다.
// - 문자열 안에 작은따옴표(')가 들어가면 \' 로 씁니다. 줄바꿈은 \n 입니다.
// =====================================================================
AX.site = {

  // 1장: codemate 안의 도구 셋
  codemate: {
    checked: false,
    label: 'codemate 도구 설명',
    tools: [
      { title: 'Roo Code', sub: 'VS Code 확장', rows: ['편집기 안에서 채팅과 수정', '코드를 보며 쓰는 사람용', '사내 모델 연결'] },
      { title: 'codemate', sub: '자체 AI Tool', rows: ['사내에서 만든 AI 도구', '질문·코드 생성', '세부 기능은 사내 안내 참고'] },
      { title: 'OpenCode', sub: '터미널 에이전트', rows: ['파일 읽기·쓰기·실행까지', '사내 모델 4종 전환', 'MCP · 스킬 · 플러그인 · 팀', '오늘의 선택'] }
    ]
  },

  // 1장·3장: 사내 모델 네 가지 (사용자가 알려 준 사내 안내 기준)
  models: {
    checked: true,
    label: '사내 모델 4종',
    list: [
      { id: 'max', name: 'MAX', sub: 'GLM 5.2', tag: '플래그십', line: '큰 코드베이스를 한 번에 읽고 고치는 플래그십', score: 'Terminal-Bench 2.1 81.0 · SWE-bench Pro 62.1' },
      { id: 'pro', name: 'Pro', sub: 'DeepSeek', tag: '에이전트', line: '터미널·도구 작업에 강한 에이전트 코딩, 최대 1M 토큰', score: 'Terminal-Bench 2.1 82.7 · NL2Repo 54.2' },
      { id: 'fast', name: 'Fast', sub: '코딩 특화', tag: '빠름', line: '코드 수정·도구 호출을 빠르게', score: 'Terminal-Bench 2.1 67.8 · SWE-bench Verified 79.0' },
      { id: 'image', name: 'Image', sub: '멀티모달', tag: '그림', line: '이미지와 글을 함께 읽음. 스크린샷·문서 질문', score: 'MoE, 활성 파라미터 약 4B' }
    ],
    tasks: [
      { t: '여러 파일을 한 번에 고치는 큰 일', pick: 'max', why: '대규모 코드베이스를 한 번에 분석·수정하도록 만든 플래그십' },
      { t: '계획 세우기·역할 분담(7장)', pick: 'max', why: '장시간 에이전트 작업과 복잡한 설계에 맞춘 모델' },
      { t: '터미널에서 실행·수정을 반복', pick: 'pro', why: 'Terminal-Bench 2.1 82.7. 터미널·도구 작업에 최적화' },
      { t: '아주 긴 자료를 통째로 읽히기', pick: 'pro', why: '최대 1M 토큰을 효율적으로 처리하는 구조' },
      { t: '짧은 질문·작은 수정을 빨리', pick: 'fast', why: '코딩 특화에 응답이 빠름. 결과를 빨리 보고 다음으로' },
      { t: '에러 화면·사진을 보여 주며 묻기', pick: 'image', why: '이미지를 직접 읽는 유일한 모델' }
    ]
  },

  // 3장: OpenCode 설치 (PowerShell 에 사내 설치 명령 한 줄)
  install: {
    checked: false,
    label: 'OpenCode 설치 명령',
    points: [
      '**PowerShell** 을 열고 운영팀이 준 **설치 명령 한 줄**을 붙여넣기',
      '끝나면 `opencode --version` 으로 버전이 나오는지 확인',
      '`opencode` 를 못 찾으면 PowerShell 창을 닫고 다시 열기'
    ],
    code: '# PowerShell 에 붙여넣기 (사내 설치 명령, 운영팀 안내)\n<사내 설치 명령 한 줄>\n\n# 설치 확인\nopencode --version\n\n# 참고: 사외(공개) 설치\nnpm install -g opencode-ai',
    cap: '설치 명령은 사내 안내를 따릅니다. 이 칸은 src/site/site.js 의 install 항목에서 고칩니다.'
  },

  // 3장: 실행 폴더
  run: {
    checked: false,
    label: 'OpenCode 실행 폴더',
    home: 'C:\\Users\\me',                     // 터미널을 열면 처음 서 있는 곳
    workdir: 'C:\\ax-day',                        // 실습 폴더
    code: '# Windows 터미널 (PowerShell)\ncd C:\\ax-day\nopencode\n\n# 다른 폴더를 바로 열 때\nopencode C:\\ax-day',
    cap: '폴더 이름은 운영팀이 배포한 실습 폴더 위치에 맞춰 바꾸세요.'
  },

  // 3장: opencode.json (모델 연결 설정). 아래 키 이름(provider, model …)은 OpenCode 공통입니다
  config: {
    checked: false,
    label: 'opencode.json 모델 연결',
    path: '~/.config/opencode/opencode.json',
    json: '{\n  "$schema": "https://opencode.ai/config.json",\n  "provider": {\n    "codemate": {\n      "npm": "@ai-sdk/openai-compatible",\n      "name": "codemate (사내 LLM)",\n      "options": { "baseURL": "http://사내-LLM-주소/v1" },\n      "models": {\n        "max": { "name": "MAX (GLM 5.2)" },\n        "pro": { "name": "Pro (DeepSeek)" },\n        "fast": { "name": "Fast (빠른 코딩)" },\n        "image": { "name": "Image (이미지 입력)" }\n      }\n    }\n  },\n  "model": "codemate/max",\n  "small_model": "codemate/fast",\n  "permission": { "edit": "allow", "bash": "ask" },\n  "mcp": {},\n  "plugin": ["oh-my-openagent"]\n}'
  },

  // 7장: Oh-my-codemate (사내판 OMO) 설치와 에이전트
  omo: {
    checked: false,
    label: 'Oh-my-codemate 설치',
    points: [
      '사외 공개판은 설치 명령이 `opencode.json` 에 **플러그인 한 줄**을 넣어 줍니다',
      '사내판 Oh-my-codemate 는 설치 방법이 다릅니다. 운영팀 안내를 따르세요',
      '설치 후 OpenCode 재시작. **Tab** 을 눌러 에이전트 목록이 늘었으면 성공'
    ],
    code: '# 사외 공개판 (OpenCode 플러그인)\nbunx oh-my-openagent install        # 또는 npx oh-my-openagent install\n\n# opencode.json 에 생기는 줄\n"plugin": ["oh-my-openagent"]\n\n# 설정 파일\n~/.config/opencode/oh-my-openagent.json',
    cap: '공개판 기준. 2026년 공개판은 독립 CLI(omo)로도 나왔지만, 이 교안은 OpenCode 플러그인 방식 기준입니다.',
    agentsFoot: '사내판은 에이전트가 11개입니다. 대표만 추렸습니다. 이름은 외울 필요 없습니다.',
    agents: [
      { t: 'Sisyphus', s: '총괄. 계획하고 나눠 맡김', tag: '총괄', hi: true },
      { t: 'Prometheus', s: '계획자. 질문하며 요구 정리', tag: '계획' },
      { t: 'Metis', s: '사전 점검. 빠진 조건 찾기', tag: '계획' },
      { t: 'Momus', s: '계획 검토. 모호하면 반려', tag: '검토' },
      { t: 'Hephaestus', s: '자율 실행. 끝까지 구현', tag: '구현' },
      { t: 'Oracle', s: '설계·디버깅 조언. 읽기 전용', tag: '조언' },
      { t: 'Librarian', s: '문서·오픈소스 조사', tag: '조사' },
      { t: 'Explore', s: '코드 빠르게 찾기', tag: '조사' }
    ]
  },

  // 8장: 사내 GitHub 와 Pages
  github: {
    checked: false,
    label: '사내 GitHub·Pages 주소',
    host: 'github.samsungds.net',
    pagesUrl: 'https://pages.github.samsungds.net/<내 아이디>/<저장소>/',
    pagesPath: 'Settings → Pages',
    cap: 'Pages 주소 형식과 Pages 사용 가능 여부는 사내 GitHub 안내를 확인하세요.'
  },

  // 5장: Datalake 조회 (Bigdataquery) 와 MCP 등록
  datalake: {
    checked: false,
    label: 'Bigdataquery·테이블 이름',
    table: 'eqp_alarm',
    queryCode: 'from bigdataquery import BigDataQuery   # 사내 라이브러리 (예시)\n\nbq = BigDataQuery()                      # 읽기 전용 계정으로 접속\nsql = """\nSELECT alarm_time, eqp_id, alarm_name, stop_min   -- 어떤 칸\nFROM   eqp_alarm                                  -- 어느 표\nWHERE  alarm_time >= \'2026-09-05\'                 -- 어떤 줄\nLIMIT  10000                                      -- 상한\n"""\ndf = bq.query(sql)                       # Impala SQL 실행 → 표\n\ndf.to_csv("work/eqp_alarm.csv", index=False)\nprint(len(df), "행 저장")',
    mcpCode: 'from mcp.server.fastmcp import FastMCP\nfrom bigdataquery import BigDataQuery     # 사내 라이브러리 (예시)\n\nmcp = FastMCP("datalake")\nbq = BigDataQuery()                         # 읽기 전용 계정\n\n@mcp.tool()\ndef query_datalake(sql: str, limit: int = 1000) -> str:\n    """Datalake를 읽기 전용으로 조회해 CSV 문자열로 돌려준다."""\n    if not sql.lstrip().upper().startswith("SELECT"):\n        return "SELECT 문만 허용됩니다."\n    return bq.query(sql).head(limit).to_csv(index=False)\n\nmcp.run()\n\n# opencode.json 에 등록:\n# "mcp": { "datalake": { "type": "local",\n#          "command": ["python", "mcp_datalake.py"] } }',
    cap: 'Impala SQL 기준. 호출 방식·테이블 이름(예시)은 실제 Datalake 에 맞추세요.'
  }
};
