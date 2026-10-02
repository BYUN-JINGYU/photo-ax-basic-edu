// 3장 그림: 탐색기와 터미널, 설치 순서도, 실행 폴더, AGENTS.md
(function () {
  const { svg, T, box, arrow, doc, folder, win, icon, block, slab, diamond, stadium, num, curve, yes, no, monitor, server, pill } = AX.pic;

  // 탐색기에서 하던 일 ↔ 터미널에서 치는 말
  AX.pics.explorer = () => {
    const pairs = [[58, '주소창 = 경로', 'pwd'], [88, '목록 보기', 'dir'], [140, '폴더 열기', 'cd 폴더'], [170, '위로 가기', 'cd ..']];
    return svg(1000, 270, [
      `<ellipse cx="226" cy="262" rx="220" ry="7" class="shd"/>`, `<ellipse cx="786" cy="262" rx="220" ry="7" class="shd"/>`,
      win(10, 8, 420, 248, { t: '파일 탐색기' }),
      `<rect x="24" y="42" width="392" height="30" rx="8" class="pb mist"/>`,
      T(40, 62, 'C:\\ax-day', { size: 14, a: 'start', mono: true, w: 700 }),
      folder(28, 92, 82, 64, { t: 'lib', c: 'soft' }), folder(124, 92, 82, 64, { t: 'data', c: 'soft' }), folder(220, 92, 82, 64, { t: 'work', c: 'soft' }),
      doc(316, 92, 94, 64, { t: 'AGENTS', lines: 2 }),
      doc(28, 172, 120, 64, { t: 'DealGrove.md', lines: 2 }), doc(162, 172, 104, 64, { t: '요청문.md', lines: 2 }),
      T(350, 214, '더블클릭', { size: 12, c: 'm' }), icon('hand', 350, 186, 16),
      win(570, 8, 420, 248, { t: 'Windows PowerShell', dark: true }),
      T(586, 62, 'PS C:\\ax-day>', { size: 14, c: 'w', a: 'start', mono: true }), T(718, 62, 'pwd', { size: 14, c: 'g', a: 'start', mono: true }),
      T(586, 92, 'PS C:\\ax-day>', { size: 14, c: 'w', a: 'start', mono: true }), T(718, 92, 'dir', { size: 14, c: 'g', a: 'start', mono: true }),
      T(600, 114, 'lib  data  work  AGENTS.md …', { size: 13, c: 'm', a: 'start', mono: true }),
      T(586, 144, 'PS C:\\ax-day>', { size: 14, c: 'w', a: 'start', mono: true }), T(718, 144, 'cd work', { size: 14, c: 'g', a: 'start', mono: true }),
      T(586, 174, 'PS C:\\ax-day\\work>', { size: 14, c: 'w', a: 'start', mono: true }), T(754, 174, 'cd ..', { size: 14, c: 'g', a: 'start', mono: true }),
      T(586, 204, 'PS C:\\ax-day>', { size: 14, c: 'w', a: 'start', mono: true }), T(718, 204, 'opencode', { size: 14, c: 'g', a: 'start', mono: true, w: 700 }),
      T(586, 236, '↑ 맨 앞 PS … > 가 지금 서 있는 폴더', { size: 12, c: 'm', a: 'start' }),
      ...pairs.map(([y, l]) => arrow([[440, y], [560, y]], { c: 'a' }) + T(500, y - 7, l, { size: 12, c: 'a', w: 700 }))
    ]);
  };

  // 설치 순서도: 열기 → 붙여넣기 → 확인 → (버전이 나오나?)
  AX.pics.install = () => svg(400, 300, [
    num(14, 24, 1), block(34, 6, 270, 38, { t: 'PowerShell 열기', d: 10, ts: 14 }),
    arrow([[170, 50], [170, 66]], {}),
    num(14, 88, 2), block(34, 70, 270, 38, { t: '<설치 명령 한 줄> 붙여넣기', c: 'dark', d: 10, ts: 13 }),
    arrow([[170, 114], [170, 130]], {}),
    num(14, 152, 3), block(34, 134, 270, 38, { t: 'opencode --version', d: 10, ts: 14 }),
    arrow([[170, 178], [170, 196]], {}),
    diamond(170, 236, 170, 76, { t: '버전 숫자가\n나오나?' }),
    arrow([[256, 236], [298, 236]], {}), yes(277, 216),
    stadium(300, 220, 96, 34, { t: '완료 ✓' }),
    arrow([[84, 236], [52, 236], [52, 178]], { c: 'bad' }), no(64, 252),
    T(8, 290, '창을 닫고 다시 열어 ③ 다시', { size: 12, c: 'bad', a: 'start', w: 700 })
  ]);

  // 터미널을 연 폴더가 곧 프로젝트
  AX.pics.run = () => svg(400, 300, [
    monitor(0, 6, 236, 120, { lines: [['PS> cd C:\\ax-day', 'w'], ['PS C:\\ax-day>', 'w'], ['  opencode', 'g'], ['읽기 → DealGrove.md', 'w']] }),
    T(118, 166, '내 PC', { size: 13, w: 700 }),
    block(150, 196, 230, 86, { c: 'soft', d: 16 }),
    T(166, 222, 'C:\\ax-day', { size: 15, w: 800, a: 'start', mono: true }), T(374, 222, '= 프로젝트', { size: 12, c: 'a', a: 'end', w: 700 }),
    ...[['DealGrove', 166], ['AGENTS', 238], ['work/', 310]].map(([t, x]) => `<rect x="${x}" y="236" width="62" height="34" rx="6" class="pb line"/>` + T(x + 31, 258, t, { size: 11, mono: true, w: 700 })),
    curve(240, 70, 282, 110, 262, 184, { label: '이 폴더 안에서만\n읽고 씁니다', lx: 344, ly: 118 })
  ]);

  // 요청마다 AGENTS.md 가 맨 앞에 붙어서 모델로 간다
  AX.pics.agentsmd = () => svg(400, 300, [
    ...[0, 1, 2].map(i => {
      const y = 16 + i * 80;
      return block(0, y, 232, 58, { d: 10 }) + `<rect x="10" y="${y + 9}" width="118" height="22" rx="5" class="pb acc"/>` +
        T(69, y + 25, 'AGENTS.md', { size: 12, c: 'w', w: 700, mono: true }) + T(140, y + 25, '자동', { size: 11, c: 'a', a: 'start', w: 700 }) +
        T(14, y + 48, `+ 내 요청 ${i + 1}`, { size: 13, c: 'm', a: 'start' }) + arrow([[250, y + 30], [292, 128]], { c: 'm' });
    }),
    server(298, 70, 92, 112, { t: '모델', n: 3 }),
    T(196, 292, '요청마다 맨 앞에 자동으로 들어갑니다', { size: 13, c: 'a', w: 700 })
  ]);
})();
