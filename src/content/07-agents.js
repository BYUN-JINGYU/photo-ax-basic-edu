// 7장: 멀티 에이전트 & OMO (40분, 데모 위주)
AX.content.push({
  id: 'agents', kind: 'session', title: '멀티 에이전트 & OMO', short: '계획·구현·검토를 나눠 보기, Oh-my-codemate',
  slides: [
    {
      type: 'cover',
      subtitle: '한 명이 다 하면 놓칩니다. 계획·구현·검토를 나눠 봅니다.\nOpenCode의 에이전트 구조와 사내판 OMO(Oh-my-codemate).\n강사 데모 위주, 체험은 10분입니다.',
      outcomes: ['역할을 나누면 왜 결과가 좋아지는지 안다', 'OpenCode 에이전트의 종류와 호출법을 안다', 'Oh-my-codemate 가 어떻게 일하는지 본다'],
      notes: '40분. 사내 모델에서 서브에이전트가 흔들리기 쉽고 전원 동시 실행은 서버 부하가 큽니다. 그래서 데모 위주로 설계했습니다.'
    },
    {
      title: '역할을 나누면 결과가 좋아집니다',
      points: [
        '사람도 기획·실행·검수를 나누듯 에이전트도 나눕니다',
        '검토자가 따로 있으면 **환각과 실수를 한 번 더** 거릅니다. 아래에서 직접 보세요'
      ],
      demo: 'relay',
      demoProps: {
        roles: [
          { name: '계획자', sub: '무엇을, 어떤 순서로' },
          { name: '구현자', sub: '실제 작업' },
          { name: '검토자', sub: '틀린 곳 찾기' }
        ],
        steps: [
          { who: -1, title: '요청', lines: ['"회식비 정산표에 1인당 금액 열을 넣어줘"'] },
          { who: 0, title: '계획을 적습니다', lines: ['1. 회식비.xlsx 에서 총액과 참석 인원을 읽는다', '2. 1인당 금액 열을 만든다', '3. 검산: 248,000원 ÷ 8명 = **31,000원**'] },
          { who: 1, title: '만듭니다', lines: ['→ Edit work/정산.html', '1인당 금액 열을 넣었습니다. 1인당 24,800원'], badge: { text: '숨은 실수', cls: 'warn' } },
          { who: 2, title: '검산값과 대조합니다', lines: ['계획의 검산값은 31,000원인데 지금 24,800원입니다', '참석 인원(8명) 자리에 **팀 전체 인원(10명)**을 썼습니다'], badge: { text: '실수 발견', cls: 'bad' } },
          { who: 1, title: '고칩니다', lines: ['→ Edit 나누는 수 = 참석 인원', '다시 계산: 248,000원 ÷ 8명 = **31,000원** ✓'], badge: { text: '통과', cls: 'ok' } },
          { who: -1, title: '확인', lines: ['한 에이전트였다면 24,800원이 그대로 나갔을 겁니다', '단점: 느리고, 사내 모델에선 가끔 흔들립니다. 그래서 **작은 과제**에만'] }
        ],
        hint: '**다음**으로 한 단계씩. 계획자가 적어 둔 검산값이 검토자의 기준이 됩니다.'
      },
      notes: '3장의 plan/build 가 "한 사람이 모자를 바꿔 쓰는 것"이라면, 멀티 에이전트는 "사람을 셋 두는 것"이라고 비유. 24,800원은 참석 인원 대신 팀 전체 인원으로 나눈 값입니다. 검산값을 계획 단계에 적어 두는 것이 핵심입니다.'
    },
    {
      title: 'OpenCode의 에이전트: 주 에이전트와 서브에이전트',
      pic: 'agentorg',
      points: [
        '**주 에이전트**: build(모든 툴) / plan(분석만). Tab 으로 전환',
        '**서브에이전트**: 주 에이전트가 일을 떼어 맡기는 보조. `@general 이 함수 찾아줘` 처럼 직접 불러도 됩니다',
        '내 에이전트는 `.opencode/agents/<이름>.md` 한 장으로 만듭니다'
      ],
      notes: '이름과 종류는 opencode.ai/docs/agents 기준. 배포 버전에 따라 서브에이전트 목록이 다를 수 있으니 /help 로 확인.'
    },
    {
      title: '검토자 에이전트 한 장',
      pic: 'reviewer',
      points: [
        'description: 언제 부르나 · mode: subagent · permission: 수정·실행 **금지**',
        '본문이 곧 역할 설명입니다',
        '6장 권한 설정이 여기서 쓰입니다. 검토자는 손이 없어야 합니다'
      ],
      code: {
        text: '# .opencode/agents/review.md\n---\ndescription: 시뮬레이터 코드와 수식을 검토한다. 수정은 하지 않는다\nmode: subagent\ntemperature: 0.1\npermission:\n  edit: deny\n  bash: deny\n---\n너는 검토자다. DealGrove.md 의 수식·상수와 코드가 일치하는지,\n검산값(1000 °C 1 h 건식 = 70 nm)이 나오는지 확인하고\n틀린 곳을 줄 번호와 함께 보고한다. 고치지는 않는다.',
        cap: '사용: 입력창에 "@review work/simulator.html 검토해줘"'
      },
      notes: '검토자에게 edit: deny 를 주는 이유를 꼭 설명. "검토하다가 고쳐 버리면 누가 검토한 건지 모른다".'
    },
    {
      title: 'Oh-my-codemate: 사내판 OMO',
      points: [
        '**OMO (Oh My OpenAgent)** 를 사내 환경에 맞게 바꾼 것이 **Oh-my-codemate** 입니다',
        '메인 에이전트가 작업을 나눠 전문 에이전트 11개에게 맡깁니다. 기능을 골라 보세요'
      ],
      demo: 'picker',
      demoProps: {
        title: 'Oh-my-codemate 기능 9가지',
        compact: true,
        labels: ['무엇을 하나', '이렇게 써 보세요', '오늘과 이어지는 곳'],
        items: [
          { label: '에이전트 오케스트레이션', see: '작업 유형에 따라 **11개 에이전트**에게 자동으로 나눠 맡깁니다. 메인 에이전트가 작업을 분석하고 전문 에이전트에게 위임', say: '시뮬레이터에 건식 / 습식 비교 모드를 추가해줘. 계획하고, 만들고, 검토까지 해줘', why: '앞 쪽 릴레이 데모와 같은 흐름입니다' },
          { label: 'ultrawork (ulw)', see: '`ulw` 를 넣으면 모든 에이전트를 **병렬로** 켜서 복잡한 작업을 끝까지 수행', say: 'ulw 시뮬레이터에 두께 vs 시간 그래프와 온도 프리셋 버튼을 추가해줘', why: '서버 부하가 큽니다. 강사가 정한 순서대로만 씁니다' },
          { label: 'Team Mode', see: '여러 에이전트가 **동시에 협업**하는 멀티 에이전트 시스템. 직접 켜야 동작합니다(opt-in)', why: '오늘은 강사 데모로만 봅니다' },
          { label: 'LSP 통합', see: '코드 탐색, 진단, 심볼 검색, 워크스페이스 rename 같은 **IDE 수준의 정밀 도구**', why: '파일이 많은 코드 프로젝트에서 힘을 씁니다. 오늘 실습은 HTML 한 파일이라 덜 보입니다' },
          { label: '내장 MCP', see: '웹 검색(Exa), 공식 문서(Context7), GitHub 코드 검색(grep.app), CodeGraph, LSP', why: 'CodeGraph 는 **사내망 접근 제한으로 꺼져** 있습니다. MCP 는 5장' },
          { label: 'Context Injection', see: '**AGENTS.md** 와 프로젝트 규칙을 자동으로 넣어 에이전트가 프로젝트 맥락을 이해', why: '3장·6장에서 쓴 AGENTS.md 가 그대로 들어갑니다' },
          { label: 'Comment Checker', see: 'AI가 만든 **불필요한 주석**을 자동으로 막습니다', why: '결과 코드가 깔끔해져 검토가 쉬워집니다' },
          { label: 'Session Tools', see: '세션 기록 **조회, 검색, 분석**', say: '지난 세션에서 simulator.html 의 슬라이더를 어떻게 고쳤는지 찾아줘', why: '3장 `/sessions` 의 확장판' },
          { label: 'Todo Enforcer', see: '에이전트가 작업을 **중간에 멈추지 않도록** 강제합니다', why: '사내 모델이 긴 작업에서 흐름을 잃는 문제(1장)를 줄여 줍니다' }
        ]
      },
      notes: '기능 목록은 사내 Oh-my-codemate 안내 기준입니다. 내장 MCP 중 외부 검색 계열(Exa, Context7, grep.app)이 사내망에서 실제로 동작하는지는 리허설 때 확인해 두세요.'
    },
    {
      title: '에이전트 팀: 총괄 하나에 전문가 여럿',
      site: 'omo',
      points: [
        '총괄이 계획을 세우고 전문 에이전트에게 나눠 맡깁니다',
        '검토자가 따로 있어서 **실수를 한 번 더** 거릅니다'
      ],
      demo: 'cards',
      demoProps: { cols: 4, items: AX.site.omo.agents, foot: AX.site.omo.agentsFoot },
      notes: '에이전트 이름과 역할은 공개판 OMO 기준입니다. 사내판 11개 목록은 src/site/site.js 의 omo.agents 에서 바꾸세요. 이름은 그리스 신화에서 왔고 외울 필요는 없습니다.'
    },
    {
      title: 'Oh-my-codemate 설치',
      pic: 'omo',
      site: 'omo',
      points: AX.site.omo.points,
      code: { text: AX.site.omo.code, cap: AX.site.omo.cap },
      notes: '설치 방법은 src/site/site.js 의 omo 항목에서 사내 방식으로 바꾸세요. 설치 실패 PC는 강사 화면을 보며 데모만 따라옵니다.'
    },
    {
      title: '강사 데모 15분: 기능 하나를 팀으로',
      pic: 'teamdemo',
      points: [
        '과제: 시뮬레이터에 "**건식 vs 습식 비교 모드**" 추가 (요청문.md 7장)',
        '계획자가 단계를 적고 → 구현자가 만들고 → 검토자가 지적 → 수정',
        '볼 것: 계획이 **어디서 틀어지는지**, 검토자가 **무엇을 잡는지**',
        '비교: 같은 요청을 Pro 단일 에이전트로. 어디가 다른가'
      ],
      notes: '녹화본을 백업으로 준비. 라이브가 흔들리면 "이게 바로 작은 과제에만 쓰라는 이유"로 받아치고 녹화본으로 전환.'
    },
    {
      title: '체험 15분: 두 방식으로 같은 요청',
      points: [
        'A: Pro 단일 에이전트에게 "온도별 두께 표(900/1000/1100 °C, 1 h) 추가해줘"',
        'B: MAX + Oh-my-codemate 에게 같은 요청',
        '관찰 세 가지: 걸린 시간 / 검산값 일치 / 내가 고친 횟수',
        '조별로 **시차를 두고** 실행합니다 (서버 부하)'
      ],
      demo: 'compare',
      demoProps: {
        cols: [
          { title: 'A. 단일', sub: 'Pro', rows: ['빠름', '작게 쪼개면 충분히 잘함', '검토는 내가 함'] },
          { title: 'B. 팀', sub: 'MAX + Oh-my-codemate', uv: true, rows: ['느림', '검토자가 실수를 잡아 줌', '흔들리면 단일로 돌아가면 됨'] }
        ],
        foot: '결과를 옆 사람과 비교해 보세요. "어느 쪽이 내 업무에 맞나"가 질문입니다.'
      },
      notes: '1조부터 시작, 5분 간격. 서버가 버티면 간격을 줄여도 됩니다.'
    },
    {
      title: '나누면 얻는 것, 치르는 것',
      pic: 'splitcost',
      points: [
        '얻는 것: 에이전트마다 **지시와 툴이 적어져** 실수와 고칠 곳이 줄어듭니다',
        '치르는 것: 주고받는 **시간**, 전달 중 **빠지는 맥락**',
        '서브에이전트는 넘겨받은 말만 압니다. 지시에 **앞 결과를 꼭** 넣기'
      ],
      notes: '역할 문구로 막는 것보다 역할마다 툴 목록 자체를 나누는 쪽이 확실합니다(검토자 = edit deny). 결과를 볼 때는 "각자 자기 일만 했나"를 확인하세요: 총괄이 직접 수치를 지어내지 않았는지, 조사 담당이 코드를 쓰지 않았는지. "누구에게 맡길지" 고르는 일은 선택지 중 하나만 고르면 되므로 Fast 같은 작은 모델로도 충분할 수 있습니다. 에이전트끼리 주고받는 표준(A2A)도 논의 중입니다.'
    },
    {
      title: '사내 모델에서 멀티 에이전트를 쓸 때',
      pic: 'smalltasks',
      points: [
        '작은 과제에만. 큰 과제는 사람이 쪼개서 단일 에이전트로',
        '흔들리면 **단일 에이전트 + plan 먼저**로 돌아가면 됩니다',
        '결과가 좋았던 요청문은 **스킬이나 명령으로** 저장 (6장)'
      ],
      caution: '전원이 동시에 에이전트 팀을 돌리면 모델 서버가 느려집니다.\n강사가 조별 순서를 정합니다.',
      notes: '9장으로 연결: "오늘 잘 먹힌 요청문을 버리지 말고 내 업무에 옮기자".'
    }
  ]
});
