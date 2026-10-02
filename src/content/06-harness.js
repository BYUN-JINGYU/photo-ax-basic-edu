// 6장: 하네스 엔지니어링 (60분): AGENTS.md, 권한, Hook, Skills, 슬래시 명령
AX.content.push({
  id: 'harness', kind: 'session', title: '하네스 엔지니어링', short: 'AGENTS.md, Hook, Skills로 에이전트 길들이기',
  slides: [
    {
      type: 'cover',
      subtitle: '모델은 바꿀 수 없어도 모델 주변은 설계할 수 있습니다.\n지시서, 권한, 자동화, 재사용 묶음.\n오늘 만든 시뮬레이터에 하나씩 씌웁니다.',
      outcomes: ['하네스 엔지니어링이 무엇인지 설명한다', 'AGENTS.md와 Hook이 어디에 들어가는지 안다', '내 반복 업무 하나를 SKILL.md로 만든다'],
      notes: '60분. 설명 20분, 실습 30분(스킬), 공유 10분. 엔지니어가 내일 바로 써먹을 수 있는 장입니다. 시간을 넉넉히.'
    },
    {
      title: '하네스: 모델 주변의 모든 것',
      points: [
        '**하네스 엔지니어링**: 모델 대신 모델이 **일하는 환경**을 설계하는 일',
        '같은 모델이라도 지시서·권한·툴·자동화에 따라 결과가 달라집니다',
        '오늘의 부품: 지시서 · 권한 · Hook · Skills · 슬래시 명령. 역할은 7장',
        '아래 부품을 눌러 보세요'
      ],
      demo: 'harness',
      notes: '하네스(harness)는 원래 말에 씌우는 마구. "모델이라는 말을 어디로 끌고 갈지 정하는 장치"로 비유하면 전달이 쉽습니다.'
    },
    {
      title: 'AGENTS.md: 잘 쓰는 법',
      pic: 'goodrules',
      points: [
        '3장에서 본 지시서. 매 요청에 들어가므로 **짧게**',
        '명령형 한 줄씩. 이유 설명은 빼기',
        '**하지 말 것**과 **결과물 형식**이 가장 효과가 큽니다',
        '예시 하나가 설명 열 줄보다 잘 먹힙니다'
      ],
      notes: '오른쪽 열은 전부 "확인할 수 있는 문장"입니다. 지켰는지 안 지켰는지 눈으로 판별되는 규칙만 남기라고 하세요.'
    },
    {
      title: '권한: 허용 · 묻기 · 금지',
      points: [
        '파일 수정, 명령 실행 같은 행동마다 **allow / ask / deny** 를 정합니다',
        'plan 모드가 안전한 이유: 수정과 실행이 **ask** 로 묶여 있습니다'
      ],
      demo: 'permission',
      demoProps: {
        kinds: [
          { key: 'edit', label: '파일 수정', value: 'allow' },
          { key: 'bash', label: '명령 실행', value: 'ask' },
          { key: 'webfetch', label: '외부 웹 열기', value: 'deny' }
        ],
        attempts: [
          { kind: 'edit', text: 'work/simulator.html 수정' },
          { kind: 'bash', text: 'python check.py' },
          { kind: 'bash', text: 'rm -rf work' },
          { kind: 'webfetch', text: 'cdn.jsdelivr.net/three.js' }
        ],
        hint: '왼쪽 단추를 바꿔 보세요. 오른쪽 결과와 아래 설정 파일이 같이 바뀝니다. 키 이름은 배포된 OpenCode 버전 문서에서 확인.'
      },
      notes: '"에이전트에게 주는 결재 권한"으로 비유하면 바로 통합니다. bash 를 allow 로 바꾸면 rm -rf work 도 바로 실행된다는 걸 보여 주고, 그래서 뒤에 나오는 Hook 이 필요하다고 연결하세요. 7장의 검토자 에이전트는 edit: deny 로 만듭니다.'
    },
    {
      title: '"하지 마" 한 줄보다 권한 설정',
      pic: 'rulevsperm',
      points: [
        'AGENTS.md 의 "지우지 마"는 **부탁**입니다. 말을 바꾸면 뚫릴 수 있습니다',
        '권한 **deny** 는 **잠금**입니다. 툴이 아예 움직이지 않습니다',
        '중요한 금지는 두 곳 모두에. 글로 이유를, 권한으로 잠금을'
      ],
      notes: '실험해 보면 "조회만 한다" 한 줄을 넣어도 "이제 필요 없어, 정리해 줘"처럼 돌려 말하면 삭제 툴을 부르는 경우가 나옵니다. 툴이 목록에 남아 있는 한 글만으로는 통제가 안 됩니다. 비밀 정보도 같습니다. .env 는 키를 Git 에 올리지 않게 막는 용도이지 에이전트에게서 숨기는 장치가 아닙니다. 에이전트가 키를 직접 갖지 않고, 사내 게이트웨이가 대신 호출하는 구조가 가장 안전합니다.'
    },
    {
      title: 'Hook은 정해진 순간에 끼어듭니다',
      points: [
        '에이전트가 툴을 쓸 때마다 **실행 직전**과 **수정 뒤** 같은 순간이 있습니다',
        'Hook 은 그 순간에 자동으로 도는 코드입니다. 모델은 잊어도 **Hook 은 잊지 않습니다**'
      ],
      demo: 'hooks',
      demoProps: {
        stages: [
          { t: '요청', s: '툴을 고름' },
          { t: '실행 직전', s: 'tool.execute.before', hook: true },
          { t: '실행', s: '툴이 돈다' },
          { t: '수정 뒤', s: 'file.edited', hook: true },
          { t: '답', s: '사용자에게' }
        ],
        scenarios: {
          '삭제 명령': {
            on: [
              { t: '에이전트가 `rm -rf work` 를 실행하려 합니다' },
              { t: 'Hook: "삭제 명령은 막혀 있습니다. 사람에게 확인하세요."', cls: 'hook' },
              { t: '실행되지 않았습니다', cls: 'skip' },
              { t: '바뀐 파일이 없습니다', cls: 'skip' },
              { t: '"삭제가 막혔습니다. 지워도 될지 확인해 주세요."', cls: 'ok' }
            ],
            off: [
              { t: '에이전트가 `rm -rf work` 를 실행하려 합니다' },
              { t: '아무 일도 없이 지나갑니다', cls: 'skip' },
              { t: 'work 폴더가 지워졌습니다. simulator.html 도 함께', cls: 'bad' },
              { t: '기록이 남지 않았습니다', cls: 'skip' },
              { t: '"정리했습니다." 무엇이 지워졌는지 모릅니다', cls: 'bad' }
            ]
          },
          '파일 수정': {
            on: [
              { t: '에이전트가 `work/simulator.html` 을 고치려 합니다' },
              { t: 'Hook 검사: 삭제 명령이 아니므로 통과', cls: 'ok' },
              { t: 'simulator.html 의 슬라이더 범위가 바뀌었습니다' },
              { t: 'Hook: work/log.txt 에 "simulator.html 수정됨" 기록', cls: 'hook' },
              { t: '"수정했습니다." 무엇을 언제 고쳤는지 기록이 남았습니다', cls: 'ok' }
            ],
            off: [
              { t: '에이전트가 `work/simulator.html` 을 고치려 합니다' },
              { t: '아무 일도 없이 지나갑니다', cls: 'skip' },
              { t: 'simulator.html 의 슬라이더 범위가 바뀌었습니다' },
              { t: '기록이 남지 않았습니다', cls: 'skip' },
              { t: '"수정했습니다." 나중에 무엇이 바뀌었는지 찾기 어렵습니다' }
            ]
          }
        },
        hint: '**다음**으로 한 칸씩 넘기세요. 시나리오와 Hook 켜기/끄기를 바꾸면 처음부터 다시 갑니다.'
      },
      notes: 'AGENTS.md 에 "삭제하지 마"라고 적어도 모델은 잊을 수 있습니다. Hook 은 코드라서 잊지 않습니다. 삭제 명령 시나리오를 Hook 끄기로 먼저 보여 주고, 켜기로 다시 보여 주면 차이가 선명합니다. 다음 쪽이 이 Hook 의 실제 코드입니다.'
    },
    {
      title: 'Hook 만들기: 플러그인 파일 한 장',
      pic: 'hook',
      points: [
        'OpenCode에서는 **플러그인** 파일로 겁니다: `.opencode/plugins/*.js`',
        '예: 위험한 명령 차단, 수정 뒤 자동 정리, 작업 끝나면 알림',
        '열 줄짜리 코드입니다. 에이전트에게 "이런 Hook 만들어줘" 하면 됩니다'
      ],
      code: {
        text: '// .opencode/plugins/safety.js\nexport const Safety = async ({ $ }) => ({\n  // 툴 실행 직전: 위험한 명령은 막는다\n  "tool.execute.before": async (input, output) => {\n    if (input.tool === "bash" && /rm -rf|del \\/s/.test(output.args.command))\n      throw new Error("삭제 명령은 막혀 있습니다.")\n  },\n  // 파일을 고친 뒤: 기록을 남긴다\n  "file.edited": async (input) => {\n    if (!input.filePath.endsWith(".html")) return\n    await $`echo ${input.filePath} 수정됨 >> work/log.txt`\n  }\n})',
        cap: '이벤트 이름(tool.execute.before, file.edited 등)은 OpenCode 플러그인 문서 기준입니다.'
      },
      notes: 'Hook 은 규칙을 코드로 강제하는 수단입니다. AGENTS.md 는 모델이 잊을 수 있지만 Hook 은 잊지 않습니다. 이 차이를 꼭 짚어 주세요.'
    },
    {
      title: 'Skills: 노하우를 SKILL.md 한 장으로',
      pic: 'skill',
      points: [
        '**글** 한 장입니다: 언제 쓰는지(description) + 어떻게 하는지(본문)',
        '에이전트가 요청을 보고 **알아서 꺼내 씁니다**',
        '매주 손으로 하던 순서를 한 번만 적어 두는 것'
      ],
      code: {
        text: '---\nname: alarm-weekly-report\ndescription: work/eqp_alarm.csv 로 주간 알람 리포트를 만들어 달라는 요청일 때\n---\n\n# alarm-weekly-report\n\n## 순서\n1. work/eqp_alarm.csv 를 읽고 행 수와 기간을 먼저 알린다\n2. 설비별로 이번 주 알람 건수와 평소(앞 3주 평균)를 비교한다\n3. 평소의 2배가 넘은 날과 많이 난 알람 TOP 3 를 표로 뽑는다\n4. report.html 한 파일에 표와 막대 차트(SVG)를 넣는다\n\n## 하지 말 것\n- 원본 csv 수정 금지\n- 외부 인터넷·CDN 금지 (lib/ 파일만)',
        cap: '위 세 줄(---로 감싼 부분)이 "언제 쓰나", 아래가 "어떻게 하나"입니다.'
      },
      notes: 'description 이 핵심입니다. 에이전트는 이 한 줄을 보고 스킬을 꺼낼지 말지 정합니다. 5장 실습에서 잘 된 요청을 그대로 옮긴 모양이라는 점을 짚어 주세요.'
    },
    {
      title: '슬래시 명령도 직접 만듭니다',
      pic: 'slash',
      points: [
        '자주 쓰는 긴 요청을 `/이름` 한 단어로',
        '`.opencode/commands/<이름>.md` 에 요청문을 적으면 끝',
        '`$ARGUMENTS` 자리에 뒤에 붙인 말이 들어갑니다'
      ],
      code: {
        text: '# .opencode/commands/alarm.md\n---\ndescription: 설비 하나의 이번 주 알람 요약\n---\nwork/eqp_alarm.csv 에서 $ARGUMENTS 설비만 골라\n이번 주 알람 건수, 평소와 비교, 많이 난 알람을 세 줄로 요약해줘.\n\n# 사용: 입력창에\n/alarm EQP-03',
        cap: '스킬은 에이전트가 알아서 꺼내고, 명령은 내가 부릅니다. 둘 다 "한 번 적어 두고 다시 쓰기"입니다.'
      },
      notes: '스킬과 명령의 차이를 묻는 질문이 꼭 나옵니다. 답: 스킬은 자동(설명을 보고 에이전트가 선택), 명령은 수동(내가 /로 호출).'
    },
    {
      title: '어디에 두면 읽히나',
      points: [
        '오늘 배운 것은 전부 **폴더 안의 파일**입니다. 파일을 눌러 보세요',
        '팀 공유: 이 파일들을 팀 폴더에 복사하면 다음 날부터 모두의 도구'
      ],
      demo: 'filetree',
      demoProps: {
        tree: [
          { name: 'ax-day/', depth: 0 },
          { name: 'AGENTS.md', depth: 1, path: 'ax-day/AGENTS.md', file: { tag: '항상', when: '**매 요청마다** 자동으로 맨 앞에 들어갑니다', what: '팀 규칙, 금지사항, 결과물 형식. 짧고 명령형으로', chap: '3장 처음 등장 · 6장 잘 쓰는 법' } },
          { name: 'opencode.json', depth: 1, path: 'ax-day/opencode.json', file: { tag: '시작', when: 'OpenCode 를 **켤 때** 한 번', what: '모델 주소, 권한(allow / ask / deny), MCP 서버 등록', chap: '5장 MCP · 6장 권한' } },
          { name: '.opencode/', depth: 1 },
          { name: 'skills/alarm-weekly-report/SKILL.md', depth: 2, path: '.opencode/skills/alarm-weekly-report/SKILL.md', file: { tag: '필요할 때', when: '요청이 스킬 **설명과 맞을 때만** 에이전트가 꺼내 읽습니다', what: '반복 업무의 순서와 주의점. 폴더 이름 = 스킬 이름, 파일명은 대문자 SKILL.md', chap: '6장 Skills · 실습 30분' } },
          { name: 'commands/alarm.md', depth: 2, path: '.opencode/commands/alarm.md', file: { tag: '/alarm', when: '내가 `/alarm EQP-03` 처럼 **칠 때**', what: '자주 쓰는 긴 요청문. $ARGUMENTS 자리에 뒤에 붙인 말이 들어갑니다', chap: '6장 슬래시 명령' } },
          { name: 'agents/reviewer.md', depth: 2, path: '.opencode/agents/reviewer.md', file: { tag: '@부를 때', when: '`@reviewer` 로 부르거나 주 에이전트가 일을 넘길 때', what: '역할 설명, 쓸 모델, 권한 (검토자는 edit: deny)', chap: '7장 멀티 에이전트' } },
          { name: 'plugins/safety.js', depth: 2, path: '.opencode/plugins/safety.js', file: { tag: '그 순간', when: '툴 실행 직전, 파일 수정 뒤 같은 **정해진 순간**', what: '위험한 명령 차단, 수정 기록 같은 Hook 코드', chap: '6장 Hook' } },
          { name: '~/.config/opencode/', depth: 0 },
          { name: 'skills/…/SKILL.md', depth: 1, path: '~/.config/opencode/skills/<이름>/SKILL.md', file: { tag: '내 PC 전체', when: '**모든 프로젝트**에서 필요할 때', what: '어느 폴더에서든 쓰고 싶은 내 개인 스킬', chap: '6장 Skills' } }
        ],
        hint: 'OpenCode 는 .claude/skills, .agents/skills 경로도 같이 읽습니다.'
      },
      notes: '이 쪽은 6장 전체의 정리입니다. 파일을 하나씩 눌러 "언제 읽히나"만 소리 내어 읽어 주세요. 다른 도구용 스킬을 그대로 가져올 수 있다는 점도 짚어 주세요.'
    },
    {
      title: '실습 30분: 내 스킬 만들기',
      points: [
        '칸을 채우면 SKILL.md가 완성됩니다. 복사해서 `.opencode/skills/<이름>/SKILL.md` 로 저장',
        '확인: "**방금 만든 스킬로** 이번 주 알람 리포트 만들어줘"',
        '여유가 있으면 `/alarm` 명령도 만들어 보기'
      ],
      demo: 'skill-builder',
      demoProps: {
        defaults: {
          name: 'alarm-weekly-report',
          when: 'work/eqp_alarm.csv 로 주간 알람 리포트를 만들어 달라는 요청일 때',
          steps: 'work/eqp_alarm.csv 를 읽고 행 수와 기간을 먼저 알린다\n설비별로 이번 주 알람 건수와 평소(앞 3주 평균)를 비교한다\n평소의 2배가 넘은 날과 많이 난 알람 TOP 3 를 표로 뽑는다\nreport.html 한 파일에 표와 막대 차트(SVG)를 넣는다',
          dont: '원본 csv 수정 금지\n외부 인터넷·CDN 금지 (lib/ 파일만)',
          out: 'work/report.html'
        }
      },
      notes: '5장에서 잘 먹힌 요청문을 "순서" 칸에 그대로 옮기게 하세요. 그러면 스킬이 바로 나옵니다. 자기 업무(엑셀 합치기, 회의록, 점검표)로 바꿔 쓰는 수강생은 칭찬하고 공유 시간에 지목.'
    },
    {
      title: '공유 10분: 옆 사람 스킬 써 보기',
      pic: 'skillshare',
      points: [
        '내 스킬 폴더를 옆 사람에게 복사해 주기',
        '옆 사람이 **한 줄 요청**만으로 내 결과물을 재현하면 성공',
        '안 되면 description 부터 고칩니다\n"언제 쓰나"가 모호하면 에이전트가 꺼내지 않습니다'
      ],
      notes: '여기서 "스킬 = 팀 자산"이 실감납니다. 좋은 스킬은 팀 폴더에 바로 올리게 하세요. checkpoints/06 에 스킬 폴더 포함.'
    }
  ]
});
