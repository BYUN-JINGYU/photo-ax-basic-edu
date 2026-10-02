// 부록: 강사 가이드
AX.content.push({
  id: 'appendix', kind: 'appendix', title: '강사 가이드', short: '사전 준비·사내 정보·시간 배분',
  slides: [
    {
      title: '사전 준비 체크리스트',
      points: ['교육 성패는 여기서 갈립니다. 전부 체크되기 전엔 시작하지 않기'],
      demo: 'checklist',
      demoProps: {
        key: 'prep',
        items: [
          'OpenCode 설치 명령(PowerShell 한 줄)이 수강생 PC 에서 되는지 리허설. Oh-my-codemate, MCP 실습 패키지, `opencode.json`',
          '실습 키트를 전원 PC의 `ax-day` 폴더에: `DealGrove.md`, `AGENTS.md`, `요청문.md`, `lib/three.min.js`',
          '수강 인원수만큼 동시 요청 부하 테스트 (느리면 조별 시차 운영)',
          '모든 실습을 실제 사내 모델로 리허설. 4장 시뮬레이터가 폐쇄망에서 빈 화면 없이 뜨는지 확인',
          '장별 체크포인트 폴더: `checkpoints/04` 는 키트에 있음, `05`, `06` 은 리허설 때 만들기',
          '라이브 데모 녹화 백업 (5장 MCP, 7장 에이전트 팀)',
          '사전 설문: 반복 업무·불편한 점 (9장 과제용)',
          'Bigdataquery 읽기 전용 계정 + 실습용 테이블 권한. 5장 코드와 `요청문.md` 의 테이블명 교체',
          'Git 설치와 `git config` 이름·메일, `github.samsungds.net` 계정과 저장소 생성 권한, Pages 사용 가능 여부',
          '`src/site/site.js` 사내 정보 확인: 교안의 "사외 기준" 표시가 모두 사라질 때까지 (부록 사내 정보 점검)'
        ],
        done: '교육 준비 완료.'
      },
      notes: '체크 상태는 이 PC 브라우저에 저장됩니다.'
    },
    {
      title: '사내 정보 점검',
      points: [
        '설치·설정·OMO·GitHub·Datalake 처럼 사내 방식이 다른 정보는 **파일 하나**에 모았습니다',
        '아래가 0개가 되면 교안 곳곳의 "사외 기준" 표시가 모두 사라집니다'
      ],
      demo: 'site-status',
      notes: '항목 이름을 누르면 해당 쪽으로 갑니다. 고치는 방법은 다음 쪽과 src/site/README.md 에 있습니다.'
    },
    {
      title: '사내 LLM에게 이 교안 고치게 하기',
      points: [
        '교안 소스 폴더에서 OpenCode 를 열고 아래 요청문에 **사내 안내문을 붙여** 보내세요',
        '규칙은 `src/site/README.md` 에 있고, 에이전트가 먼저 읽습니다. 오늘 배운 그대로입니다'
      ],
      demo: 'promptcard',
      demoProps: {
        title: '사내 정보 고치기 요청문',
        text: 'src/site/README.md 를 먼저 읽고 그 규칙대로 해줘.\nsrc/site/site.js 의 install, run, config, omo, github, datalake, codemate 항목을\n아래 사내 안내문에 맞게 고쳐줘. 안내문에 없는 항목은 그대로 둬.\n고친 항목은 checked 를 true 로 바꾸고, 다른 파일은 고치지 마.\n끝나면 python build.py 를 실행하고, 바꾼 항목을 표로 알려줘.\n\n[사내 안내문]\n(여기에 사내 설치·설정 안내문을 붙여넣기)',
        hint: 'plan 모드로 먼저 보내서 어느 항목을 어떻게 바꿀지 확인한 뒤 build 로 진행하세요.'
      },
      notes: '이 과정 자체가 좋은 시연이 됩니다. 수업 마지막에 "이 교안도 사내 LLM으로 사내 기준에 맞췄다"고 보여 주면 설득력이 큽니다. 비밀번호·API 키는 안내문에서 빼고 붙이세요.'
    },
    {
      title: '시간 배분 (08:30 시작 기준)',
      pic: 'timetable',
      points: ['장 번호로 진행하되, 강사용 시계는 이 그림을 봅니다'],
      notes: '쉬는 시간은 장 사이에 5분씩 끼워 넣고, 밀리면 7장 체험을 줄입니다. 4장은 점심 전에 끝냅니다. 17:30 에 끝내야 하면 7장 체험을 빼고(10), 9장 공유를 조별 대표로(10), 5장 실습을 5분 줄입니다.'
    },
    {
      title: '현장 트러블슈팅',
      points: ['증상이 보이면 왼쪽부터 순서대로'],
      demo: 'table',
      demoProps: {
        head: ['증상', '조치'],
        rows: [
          ['모델 응답 없음·느림', '`opencode.json` 의 모델 주소·서버 상태 → 재시작. 느리면 조별 시차 운영'],
          ['설치 명령이 빨간 글씨로 실패', '오류 문장을 그대로 강사에게. 실행 정책 오류면 운영팀 안내대로'],
          ['opencode 를 못 찾음', 'PowerShell 창을 닫고 다시 열기 → `opencode --version`'],
          ['실습 파일을 못 찾음', '터미널 위치부터: `pwd` → `cd` 실습 폴더 → 다시 `opencode`'],
          ['시뮬레이터 빈 화면', 'F12 콘솔 확인. CDN 주소면 "lib/three.min.js 를 써" 로 재요청'],
          ['검산값(70 nm) 불일치', '"DealGrove.md 3절 순서대로 다시 계산해줘". 흔한 원인: K 변환, τ 누락'],
          ['툴 호출 실패 반복', '같은 요청 한 번 더 → 더 작게 → MAX ↔ Pro 교체'],
          ['AGENTS.md 무시', '파일 위치(프로젝트 루트) 확인, 규칙은 짧고 명령형으로'],
          ['조회 결과가 너무 큼', '요청문에 상한·기간 추가, MCP 툴의 `limit` 낮추기'],
          ['push 실패', '원격 주소가 `github.samsungds.net` 인지, 저장소 권한 확인']
        ]
      },
      notes: '교육 중 새로 겪은 증상은 여기에 추가해 두세요. 다음 기수의 자산입니다.'
    },
    {
      title: '이 교안 사용법',
      pic: 'usage',
      points: [
        '홈에서 장을 고르고, ← → 로 이동. **Esc** 홈, **D** 밝게·어둡게',
        '**N** 강사 노트 켜기·끄기 (수강생 배포본에서는 꺼 두기)',
        '**P** 인쇄 보기: 전체를 세로로 펼침 → 브라우저 인쇄로 유인물',
        '주소창의 `#장id/쪽` 으로 특정 쪽을 바로 엽니다 (예: `#dealgrove/5`)',
        '사내 정보는 소스의 `src/site/site.js` 한 파일. 고친 뒤 `python build.py`'
      ],
      notes: '수강생용 배포본을 따로 만들 필요는 없습니다. 노트는 N 키를 누르기 전엔 보이지 않습니다.'
    }
  ]
});
