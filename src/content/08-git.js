// 8장: Git·GitHub 저장하고 공유하기 (30분)
// 세 가지만: 커밋은 세이브 포인트 / 업무 코드는 사내 GitHub / 만든 것은 Pages(branch 방식)로 공유
const GH = AX.site.github;
AX.content.push({
  id: 'git', kind: 'session', title: 'Git·GitHub 저장과 공유', short: '커밋, 사내 GitHub, Pages',
  slides: [
    {
      type: 'cover',
      subtitle: '잘 되던 화면도 요청 한 번에 깨질 수 있습니다.\n커밋은 그 전으로 돌아갈 세이브 포인트입니다.\n만든 것은 사내 GitHub 에 올리고 Pages 링크로 나눕니다.',
      outcomes: ['기능이 잘 될 때마다 "커밋해줘"', `업무 코드는 ${GH.host} 에만`, '만든 화면은 Pages(branch 방식) 링크로'],
      notes: '30분. 명령어를 외우게 하지 않습니다. Git 명령은 에이전트가 칩니다. 사람은 "언제 저장할지"와 "어디에 올릴지"만 정합니다. 세 가지를 장 처음과 끝에 두 번 말하세요.'
    },
    {
      title: 'Git 과 GitHub, 말 다섯 개',
      pic: 'gitwords',
      site: 'github',
      points: [
        '**Git**: 내 PC에서 파일의 버전을 기록하는 도구',
        `**GitHub**: 그 기록을 올려 두는 서버. 사내는 \`${GH.host}\``,
        '명령은 에이전트가 칩니다. 사람은 **언제·어디에**만 정합니다'
      ],
      notes: '게임 세이브 비유가 가장 잘 통합니다. 브랜치는 오늘 main 하나만 씁니다. 여러 갈래는 팀으로 일할 때 다시 배우면 됩니다.'
    },
    {
      title: '1. 커밋은 세이브 포인트: 잘 될 때마다 "커밋해줘"',
      points: ['기능 하나가 **잘 되면 바로** 커밋. 깨지면 "되돌려줘"'],
      demo: 'savepoints',
      demoProps: {
        file: 'lunch.html',
        steps: [
          { add: 'menu', ask: '점심 메뉴 네 개를 카드로 보여줘', label: '메뉴 카드' },
          { add: 'button', ask: '"뽑기" 버튼 붙여줘', label: '뽑기 버튼' },
          { add: 'result', ask: '뽑힌 메뉴를 크게 보여줘', label: '결과 크게 보기' },
          { add: 'chart', ask: '이번 주 뽑힌 횟수 그래프도 붙여줘', label: '횟수 그래프', breaks: true, retry: '그래프 다시. 이번엔 콘솔 오류 없이' }
        ],
        hint: '한 번은 **세 번째 뒤에 커밋하지 말고** 네 번째를 눌러 보세요. 되돌리면 무엇이 사라지나요?'
      },
      notes: '예시는 "점심 메뉴 뽑기" 화면입니다. 4장 시뮬레이터를 만들 때도 똑같은 일이 자주 생깁니다. /undo 는 지금 세션 안에서만 통하고, 커밋은 PC를 껐다 켜도 남습니다. 그래서 "잘 되면 커밋"을 습관으로 만듭니다.'
    },
    {
      title: '커밋을 시키는 법',
      pic: 'commit',
      points: [
        '잘 되는 걸 **눈으로 확인한 뒤** "커밋해줘"',
        '메시지는 **무엇을 했는지** 한 줄. 예: 뽑기 버튼 추가',
        '"되돌려줘"는 마지막 커밋으로. "기록 보여줘"로 목록 확인',
        '`AGENTS.md` 에 한 줄: 기능이 끝나면 커밋하자고 먼저 말할 것'
      ],
      code: {
        text: '# "커밋해줘" 라고 하면 에이전트가 치는 명령\ngit add .\ngit commit -m "결과 크게 보기 추가"\n\n# "되돌려줘" (커밋 안 한 변경 버리기)\ngit restore .\n\n# "기록 보여줘"\ngit log --oneline\nc58d3e9 결과 크게 보기 추가\na71e0b4 뽑기 버튼\n3f9a1c2 메뉴 카드',
        cap: '명령은 외우지 않아도 됩니다. 에이전트가 무엇을 치는지 읽을 수만 있으면 됩니다.'
      },
      notes: 'Git 첫 사용 때 이름·메일 설정(git config --global user.name / user.email)이 필요합니다. 사전 준비에서 끝내 두세요. 되돌리기 전에 에이전트가 무엇을 지우는지 말하게 하면 안전합니다.'
    },
    {
      title: '2. 업무 코드는 사내 GitHub. github.com 이 아닙니다',
      site: 'github',
      points: [
        `업무 코드·데이터·화면은 **${GH.host}** 에만 올립니다`,
        '`github.com` 은 회사 밖 서버. 올리는 순간 **외부 유출**입니다',
        '에이전트도 헷갈립니다. 주소를 **AGENTS.md 에 적어 둡니다**'
      ],
      demo: 'judge',
      demoProps: {
        title: '이 push, 괜찮을까?',
        cases: [
          { text: `git push https://${GH.host}/my-team/alarm-report.git`, ok: true, why: `**${GH.host}** 는 사내 GitHub 입니다. 업무 코드는 여기에.` },
          { text: 'git push https://github.com/내아이디/alarm-report.git', ok: false, why: '**github.com** 은 사외 서버입니다. 마스킹된 샘플이라도 올리지 않습니다.' },
          { text: '"github 에 올려줘" (주소 없이 요청)', ok: false, why: `에이전트가 github.com 을 고를 수 있습니다. **${GH.host}** 주소를 꼭 적습니다.` },
          { text: '비밀번호가 든 `.env` 파일까지 같이 커밋', ok: false, why: '사내 GitHub 라도 비밀번호·키는 올리지 않습니다. `.gitignore` 에 넣으라고 시키세요.' },
          { text: '사내 Pages 주소를 팀 메일로 공유', ok: true, why: '사내 Pages 는 사내에서만 열립니다. 공유는 이 링크로 합니다.' }
        ]
      },
      notes: `AGENTS.md 에 넣을 한 줄: "원격 저장소는 ${GH.host} 만. github.com 에 push 하지 않는다." 실습 키트의 AGENTS.md 에 이미 들어 있습니다. 회사 보안 규정의 정확한 문구는 사내 안내를 따르세요.`
    },
    {
      title: '3. 만든 것은 Pages(branch 방식)로 공유',
      site: 'github',
      points: [
        'Pages 는 저장소의 HTML 을 **웹 주소 하나**로 보여 줍니다',
        '**branch 방식**: `main` 에 push 하면 그 파일이 그대로 사이트',
        '첫 화면은 `index.html`. 이름이 다르면 "index.html 로 바꿔줘"'
      ],
      demo: 'pages',
      demoProps: {
        host: GH.host,
        repo: 'ax-day',
        url: GH.pagesUrl,
        hint: `실제 위치는 저장소의 **${GH.pagesPath}**. 사내 버전에 따라 메뉴 이름이 조금 다를 수 있습니다.`
      },
      notes: '파일을 보내면 받는 사람이 열 방법을 찾아야 합니다. 링크는 누르면 끝입니다. 시뮬레이터처럼 lib/three.min.js 를 쓰는 화면은 lib 폴더도 같이 올라가야 화면이 뜹니다. Pages 에 올린 파일은 사내 누구나 볼 수 있다고 생각하고, 데이터 파일은 올리지 않습니다. Pages 주소 형식은 사내 GitHub 설정에 따라 다릅니다(src/site/site.js 의 github 항목).'
    },
    {
      title: '실습 15분: 4장 시뮬레이터를 링크로 만들기',
      site: 'github',
      points: [
        `① ${GH.host} 웹에서 빈 저장소 \`ax-day\` 만들기`,
        '② 아래 요청문을 OpenCode 에 보내 커밋·push',
        '③ Settings → Pages 에서 main · / (root) · Save → 옆 사람에게 링크'
      ],
      demo: 'promptcard',
      demoProps: {
        title: '커밋·push 요청문',
        text: `이 폴더를 git 저장소로 만들어줘. data 폴더는 .gitignore 에 넣어 올리지 마.\n맨 위에 index.html 을 만들고 work/simulator.html 로 가는 링크를 넣어줘.\n지금 상태를 "딜-그로브 시뮬레이터 첫 버전"으로 커밋해줘.\n원격 저장소는 https://${GH.host}/<내 아이디>/ax-day 야. github.com 은 쓰지 마.\nmain 브랜치로 push 하고 git log --oneline 을 보여줘.`,
        hint: 'push 할 때 로그인 창이 뜨면 사내 안내대로 로그인합니다. 비밀번호나 토큰을 요청문에 붙이지 않습니다.'
      },
      notes: '빨리 끝난 사람은 시뮬레이터를 하나 고친 뒤 "커밋하고 push 해줘" → 1~2분 뒤 같은 링크에서 바뀐 화면을 확인하게 하세요. push 가 안 되면 저장소 주소와 권한부터 봅니다.'
    },
    {
      title: '확인 퀴즈',
      demo: 'quiz',
      demoProps: {
        questions: [
          { q: '커밋은 언제 하나요?', opts: ['하루 일을 다 마친 뒤 한 번', '기능 하나가 잘 되는 걸 확인할 때마다', '화면이 깨졌을 때'], a: 1, exp: '세이브 포인트가 촘촘해야 깨졌을 때 잃는 것이 적습니다.' },
          { q: '업무 코드를 올리는 곳은?', opts: ['github.com', GH.host, '개인 클라우드 드라이브'], a: 1, exp: `업무 코드는 사내 GitHub(${GH.host})에만. github.com 은 사외입니다.` },
          { q: 'Pages(branch 방식)의 첫 화면 파일은?', opts: ['README.md', 'index.html', '가장 최근에 고친 파일'], a: 1, exp: '고른 브랜치·폴더의 index.html 이 첫 화면입니다.' }
        ]
      },
      notes: '세 문제가 오늘 이 장의 세 가지입니다. 3분.'
    }
  ]
});
