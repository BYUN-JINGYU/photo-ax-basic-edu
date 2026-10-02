// 8장 그림: Git·GitHub 말 다섯 개, 커밋과 되돌리기
(function () {
  const { svg, T, arrow, block, server, monitor, win, pill, icon, curve, bubble, num } = AX.pic;

  AX.pics.gitwords = () => {
    const dot = (x, y, c = 'acc') => `<circle cx="${x}" cy="${y}" r="7" class="pb ${c}"/>`;
    return svg(1000, 300, [
      monitor(0, 22, 300, 170, {}),
      T(18, 52, '① 저장소', { size: 13, c: 'w', a: 'start', w: 700 }), T(96, 52, '세이브 파일이 든 폴더', { size: 12, c: 'm', a: 'start' }),
      `<path d="M36 98 H270" class="pl thick"/>`, dot(60, 98), dot(130, 98), dot(200, 98), dot(256, 98),
      T(152, 82, '② 커밋 = 세이브 포인트', { size: 12, c: 'w', w: 700 }),
      `<path d="M130 98 Q150 134 190 134 H236" class="pl dash"/>`, dot(236, 134, 'soft'),
      T(36, 120, 'main', { size: 12, c: 'g', a: 'start', mono: true, w: 700 }),
      T(160, 160, '④ 브랜치 = 갈래 길 (오늘은 main 하나)', { size: 12, c: 'w' }),
      T(158, 232, '내 PC', { size: 13, w: 700 }),
      curve(318, 100, 380, 40, 446, 96, { label: '③ 푸시 = 서버에 올리기', lx: 382, ly: 50 }),
      server(456, 64, 140, 120, { t: '사내 GitHub' }),
      pill(526, 220, 'github.samsungds.net', { c: 'soft', a: 'middle', size: 12 }),
      arrow([[618, 124], [672, 124]], {}),
      win(680, 30, 316, 196, { t: '브라우저' }),
      `<rect x="694" y="62" width="288" height="26" rx="13" class="pb mist"/>`,
      T(708, 80, 'pages…/ax-day/', { size: 12, a: 'start', mono: true, c: 'a', w: 700 }),
      block(704, 104, 120, 90, { c: 'soft', d: 10 }), block(846, 104, 120, 40, { d: 8 }), block(846, 158, 120, 36, { d: 8 }),
      T(838, 254, '⑤ Pages = 저장소를 웹 화면으로', { size: 13, c: 'a', w: 700 }),
      bubble(40, 254, 150, 36, { t: '"커밋해줘"', size: 13 }),
      bubble(450, 254, 160, 36, { t: '"push 해줘"', size: 13 }),
      T(838, 280, '링크 하나로 공유', { size: 12, c: 'm' })
    ]);
  };

  AX.pics.commit = () => {
    const pts = [[50, '메뉴 카드'], [150, '뽑기 버튼'], [250, '결과 보기']];
    return svg(400, 300, [
      bubble(150, 0, 140, 40, { t: '"커밋해줘"', c: 'acc' }),
      arrow([[220, 50], [250, 112]], { label: 'git commit', lx: 282, ly: 86 }),
      `<path d="M20 140 H380" class="pl m thick"/>`,
      ...pts.map(([x, t], i) => AX.pic.cyl(x - 15, 124, 30, 22, { c: i === 2 ? 'acc' : 'soft' }) + T(x, 182, t, { size: 13, w: i === 2 ? 700 : 400, c: i === 2 ? 'a' : 't' })),
      `<circle cx="350" cy="140" r="12" class="pb line" stroke-dasharray="3 3"/>`, icon('cross', 350, 140, 9),
      T(350, 182, '지금(깨짐)', { size: 13, c: 'bad', w: 700 }),
      curve(350, 200, 300, 250, 256, 196, { label: '"되돌려줘"', lx: 300, ly: 256, c: 'bad' }),
      AX.pic.pill(200, 268, '"기록 보여줘" → git log', { c: 'line', a: 'middle', size: 13 })
    ]);
  };
})();
