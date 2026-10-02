// 3장: OpenCode 시작하기 (55분)
AX.content.push({
  id: 'opencode', kind: 'session', title: 'OpenCode 시작하기', short: '터미널, 설치, 모드, 슬래시 명령',
  slides: [
    {
      type: 'cover',
      subtitle: '터미널이 무엇인지부터 시작합니다.\nPowerShell 로 OpenCode를 설치하고 첫 요청을 보냅니다.\n설정 파일과 명령 열 개를 봅니다.',
      outcomes: ['터미널에서 cd 로 실습 폴더에 들어간다', 'OpenCode를 설치하고 사내 LLM의 답을 받는다', 'opencode.json 의 칸 이름을 읽는다', 'plan과 build, 슬래시 명령을 쓴다'],
      notes: '55분. 터미널 두 쪽 7분, 설치와 확인은 15분 안에 끝내는 게 목표. 설정 쪽은 5분. 안 되는 PC는 조교가 붙고 나머지는 진행합니다.'
    },
    {
      title: '터미널: 글자로 명령을 치는 창',
      pic: 'explorer',
      site: 'run',
      points: [
        '터미널은 마우스 대신 **글자로 시키는 창**. Windows 에선 PowerShell',
        '맨 앞 `PS C:\\…>` 가 **지금 서 있는 폴더**입니다',
        'OpenCode 는 **터미널이 서 있는 폴더**를 보고 일합니다',
        '팁: 탐색기 주소창에 `powershell` 입력 → 그 폴더에서 열림'
      ],
      notes: '코딩이 처음인 분이 가장 많이 막히는 곳이 "어느 폴더에서 열었나"입니다. 탐색기와 1:1 로 대응시켜 설명하세요. 터미널을 열면 보통 C:\\Users\\내아이디 에 서 있고, 거기서 opencode 를 치면 실습 파일을 못 찾습니다. 탐색기 주소창에 powershell 을 치는 방법이 가장 덜 헷갈립니다.'
    },
    {
      title: '터미널 연습: 실습 폴더로 들어가 OpenCode 열기',
      site: 'run',
      points: ['아래 파란 창을 누르고 명령을 칩니다. 오른쪽 미션을 차례로'],
      demo: 'shell',
      demoProps: {
        home: AX.site.run.home,
        workdir: AX.site.run.workdir,
        entries: ['DealGrove.md', 'AGENTS.md', '요청문.md', 'lib\\', 'lib\\three.min.js', 'data\\', `data\\${AX.site.datalake.table}.csv`, 'work\\'],
        hint: '**Tab** 은 폴더 이름 자동 완성, **↑** 는 방금 친 명령. 일부러 엉뚱한 폴더에서 `opencode` 를 쳐 보세요.'
      },
      notes: '브라우저 안 흉내라 무엇을 쳐도 PC에는 아무 일도 없습니다. 3분 주고, 다 한 사람은 실제 PowerShell 에서 같은 순서로 해 보게 하세요. 홈 폴더에서 opencode 를 치면 어떻게 되는지 일부러 보여 주면 기억에 남습니다.'
    },
    {
      title: '설치: PowerShell 에 명령 한 줄',
      pic: 'install',
      site: 'install',
      points: AX.site.install.points,
      code: { text: AX.site.install.code, cap: AX.site.install.cap },
      notes: '전원이 같이 합니다. 설치 명령은 강사 화면에 띄우거나 메신저로 나눠 주고, 손으로 치지 말고 붙여넣게 하세요. 빨간 글씨가 나오면 오류 문장을 그대로 강사에게 보여 달라고 합니다. 회사 PC 의 실행 정책 때문에 막히면 운영팀 안내를 따릅니다. 설치 명령은 src/site/site.js 의 install 항목에 있습니다.'
    },
    {
      title: '설치 끝? 세 가지만 확인',
      points: ['하나라도 안 되면 손 드세요. 지금 고쳐야 뒤 실습을 놓치지 않습니다'],
      demo: 'checklist',
      demoProps: {
        key: 'env',
        items: [
          '`opencode --version` 을 치면 버전 숫자가 나온다',
          '실습 폴더 `ax-day` 에 `DealGrove.md`, `AGENTS.md`, `lib/three.min.js` 가 보인다',
          '실습 폴더에서 `opencode` 를 치면 화면이 뜬다'
        ],
        done: '다음 쪽으로 가셔도 됩니다.'
      },
      notes: '모델 응답이 없으면 opencode.json 의 모델 주소와 서버 상태부터. codemate 로그인도 같이 확인합니다. 부록의 트러블슈팅 표 참고.'
    },
    {
      title: '실행법: 폴더로 가서 한 단어',
      pic: 'run',
      points: [
        '터미널을 열고 실습 폴더로 이동한 뒤 `opencode` 입력',
        '폴더가 곧 **프로젝트**입니다. 그 안의 파일을 읽고 그 안에 결과를 씁니다',
        '첫 화면에서 `/models` 로 사내 모델 4개가 보이면 연결 성공',
        '끝낼 때는 `/exit`'
      ],
      site: 'run',
      code: { text: AX.site.run.code, cap: AX.site.run.cap },
      notes: '"폴더가 프로젝트"라는 말이 중요합니다. 엉뚱한 폴더에서 열면 DealGrove.md 를 못 찾습니다.'
    },
    {
      title: 'OpenCode 첫 화면, 이것만 알면 됩니다',
      points: [
        '**입력창**에 말로 요청합니다. 아래 줄에 지금 모드(Build)와 모델(MAX)이 보입니다',
        '**Tab** 으로 plan / build 전환, **ctrl+p** 로 명령 목록'
      ],
      demo: 'figure',
      demoProps: { src: 'asset:oc-01-home.png', caption: 'OpenCode 1.18 실제 화면. 사내 LLM(codemate)의 MAX 모델이 연결된 상태', height: 390 },
      notes: '이 화면은 실제 OpenCode 1.18.34 를 사내 환경과 같은 설정(codemate 제공자, 기본 모델 MAX)으로 띄워 찍은 것입니다. 배포 버전이 다르면 모양이 조금 다를 수 있습니다.'
    },
    {
      title: 'plan은 말만, build는 손까지',
      points: [
        '규칙: **새 과제는 plan으로 시작**합니다. 계획을 읽고 괜찮으면 build',
        '계획이 이상하면 build 전에 고칩니다. 만든 뒤에 고치면 다시 만들어야 합니다'
      ],
      demo: 'compare',
      demoProps: {
        cols: [
          { title: 'plan', sub: '계획만 말한다', rows: ['파일을 건드리지 않음', '"이렇게 하겠다"는 단계 목록', '읽고 고칠 수 있는 지점', 'MAX 모델이 잘하는 영역'] },
          { title: 'build', sub: '실제로 만든다', uv: true, rows: ['파일을 만들고 고침', '툴을 실행함', '결과를 열어 확인해야 함', '작게, 한 번에 하나씩'] }
        ]
      },
      notes: 'plan 모드는 "레시피를 바꾸기 전에 변경 검토부터 받는 것"에 비유하면 공정 엔지니어에게 바로 통합니다.'
    },
    {
      title: '슬래시 명령: 열 개면 충분합니다',
      points: ['아래 검은 창이 OpenCode 입력창입니다. `/` 를 치거나 오른쪽 버튼을 눌러 보세요'],
      demo: 'tui',
      demoProps: {
        models: AX.site.models.list.map(m => `${m.name} (${m.sub})`),
        replies: {
          build: ['→ Read DealGrove.md', '요청대로 작업했습니다. (실습에서는 사내 LLM이 답합니다)'],
          plan: ['계획만 세웁니다: 1) 파일 읽기 2) 수정 3) 확인', '파일은 건드리지 않았습니다. Tab 으로 build 로 넘기세요.']
        },
        commands: [
          { c: '/init', d: 'AGENTS.md 지시서 초안 만들기', when: '새 프로젝트 폴더를 처음 열었을 때', out: ['→ Write AGENTS.md', 'AGENTS.md 초안을 만들었습니다. 열어서 우리 팀 규칙으로 고치세요.'] },
          { c: '/models', d: '모델 고르기 (MAX · Pro · Fast · Image)', when: '큰 일은 MAX, 빠른 일은 Fast, 그림은 Image', effect: 'models' },
          { c: '/new', d: '새 세션 시작', when: '주제가 바뀌거나 답이 엉킬 때 가장 먼저', effect: 'clear', out: ['새 세션입니다. 이전 대화는 /sessions 에 남아 있습니다.'] },
          { c: '/undo', d: '마지막 요청 취소 + 파일 되돌리기', when: '에이전트가 파일을 망쳤을 때', out: ['마지막 요청을 취소하고 파일 변경 2건을 되돌렸습니다.'] },
          { c: '/redo', d: '되돌린 것을 다시', when: '/undo 를 잘못 눌렀을 때', out: ['되돌렸던 변경 2건을 다시 적용했습니다.'] },
          { c: '/compact', d: '긴 대화를 요약해 컨텍스트 비우기', when: '대화가 길어져 답이 흐려질 때 (2장 컨텍스트)', out: ['대화를 요약했습니다. 41,200 → 2,300 토큰'] },
          { c: '/sessions', d: '이전 세션 목록으로 돌아가기', when: '어제 하던 대화를 이어갈 때', out: ['1. 딜-그로브 시뮬레이터 (오늘 10:42)', '2. DealGrove.md 요약 (오늘 10:05)'] },
          { c: '/export', d: '대화를 Markdown 으로 저장', when: '작업 과정을 공유하거나 기록할 때', out: ['→ Write session-2026-10-02.md', '대화를 파일로 저장했습니다.'] },
          { c: '/help', d: '도움말', when: '명령이 기억나지 않을 때. ctrl+p 도 같은 목록', out: ['/ 로 명령 목록, Tab 으로 plan/build, ctrl+p 로 전체 명령'] },
          { c: '/exit', d: '종료', when: '작업을 마칠 때. 다시 열려면 터미널에서 opencode', out: ['종료합니다.'] }
        ],
        hint: '실제 화면처럼 움직이는 흉내입니다. **Tab** 은 plan / build 전환, 글을 쓰고 Enter 를 치면 지금 모드대로 답합니다.'
      },
      notes: '/undo 는 코딩이 처음인 엔지니어에게 안전망입니다. "망치면 /undo" 를 두 번 말하세요. 수강생에게 /models 로 Fast 를 골라 보게 하고, Tab 을 눌러 아래 줄의 Build/Plan 이 바뀌는 것을 확인시키세요. 명령 목록은 opencode.ai/docs/tui 기준입니다.'
    },
    {
      title: '실제 화면: / 를 치면 목록, /models 로 모델 선택',
      points: [
        '왼쪽: `/` 만 쳐도 명령 목록이 뜹니다. 외울 필요가 없습니다',
        '오른쪽: `/models` 에서 **MAX · Pro · Fast · Image** 중 고릅니다'
      ],
      demo: 'figure',
      demoProps: { items: [{ src: 'asset:oc-02-slash-crop.png', caption: '/ 입력 → 명령 목록' }, { src: 'asset:oc-03-models-crop.png', caption: '/models → 사내 모델 4개' }], height: 400 },
      notes: '두 화면 모두 실제 OpenCode 캡처. 모델 목록은 검색창에 codemate 를 쳐서 사내 모델만 남긴 상태입니다.'
    },
    {
      title: 'opencode.json: 모델·권한·MCP를 적는 한 장',
      site: 'config',
      points: ['OpenCode 설정은 전부 이 파일 한 장에 있습니다. 칸 이름을 눌러 보세요'],
      demo: 'anatomy',
      demoProps: {
        title: '설정 파일 해부',
        path: AX.site.config.path,
        code: AX.site.config.json,
        first: 'provider',
        parts: [
          { key: 'provider', what: '모델 서버를 등록하는 곳. **사내 LLM 주소**(baseURL)와 모델 목록', chap: '1장 사내 모델 4종 · 3장 `/models`' },
          { key: 'model', what: '기본으로 쓸 모델. `제공자/모델` 형식', chap: '3장 `/models` 로 바꾸면 여기가 바뀐 것과 같습니다' },
          { key: 'small_model', what: '대화 제목 짓기 같은 가벼운 일에 쓰는 모델', chap: '빠른 **Fast** 를 둡니다' },
          { key: 'permission', what: '행동마다 allow / ask / deny', chap: '6장 권한' },
          { key: 'mcp', what: '꽂아 둘 MCP 서버 목록', chap: '5장 MCP' },
          { key: 'plugin', what: '플러그인 목록. Oh-my-codemate 같은 확장이 여기 등록됩니다', chap: '7장 멀티 에이전트' },
          { key: '$schema', what: '칸 이름 사전 주소. 편집기가 자동 완성에 씁니다', chap: '건드릴 일 없음' }
        ],
        hint: '내 PC 전체용(~/.config/opencode)과 프로젝트 폴더용이 둘 다 있으면 **프로젝트 쪽이 이깁니다**. 키 이름은 OpenCode 공통입니다.'
      },
      notes: '수강생이 이 파일을 직접 고칠 일은 거의 없습니다. "모델이 안 붙으면 여기, 권한은 여기, MCP 는 여기"만 기억시키세요. 파일 내용은 src/site/site.js 의 config 항목에서 사내 값으로 바꿉니다.'
    },
    {
      title: 'AGENTS.md: 에이전트에게 주는 업무 지시서',
      pic: 'agentsmd',
      points: [
        '프로젝트 폴더에 두면 **매 요청마다 자동으로** 읽습니다 (2장의 지시 자리)',
        '팀 규칙, 금지사항, 결과물 형식을 적습니다',
        '`/init` 이 초안을 만들어 줍니다. 오늘은 실습 키트의 것을 씁니다'
      ],
      code: {
        text: '# AGENTS.md\n\n- 항상 한국어로 답한다.\n- 새 과제는 먼저 단계별 계획을 보여주고, 확인을 받은 뒤 작업한다.\n- 결과 파일은 work/ 폴더 안에만 만든다.\n- DealGrove.md 같은 원본 파일은 수정하지 않는다.\n- 외부 인터넷은 없다. 라이브러리는 lib/ 폴더의 파일만 쓴다.\n- 모르는 파일 이름은 추측하지 말고 물어본다.\n- 원격 저장소는 ' + AX.site.github.host + ' 만. github.com 에 push 하지 않는다.',
        cap: '규칙은 짧고 명령형으로. 길어지면 모델이 일부를 놓칩니다. 6장·8장에서 더 다룹니다.'
      },
      notes: 'AGENTS.md 는 컨텍스트에 매번 들어가므로(2장 데모) 길면 비용입니다. 10줄 안쪽 권장.'
    },
    {
      title: '첫 실습 10분: 사내 LLM에게 첫 요청',
      points: [
        '입력: `DealGrove.md 를 읽고 핵심을 세 줄로 요약해줘. 수식은 그대로 보여줘`',
        '**→ Read DealGrove.md** 가 먼저 뜨고 답이 옵니다. 이것이 2장의 툴 호출입니다',
        '답에 `x² + A·x = B·(t + τ)` 가 있으면 성공. 이 식을 4장에서 씁니다'
      ],
      demo: 'figure',
      demoProps: { src: 'asset:oc-05-answer-crop.png', caption: '실제 화면: 파일을 읽고(→ Read) 요약한 뒤 "Build · MAX (GLM 5.2)" 로 끝납니다', height: 350 },
      notes: '여기서 처음으로 에이전트가 파일을 읽습니다. "파일은 OpenCode가 읽어서 모델에게 넣어 준다"를 다시 한 번(2장 요청 해부). 여유가 있으면 "AGENTS.md 규칙을 지키면서 같은 내용을 한 줄로 줄여줘"를 한 번 더.'
    }
  ]
});
