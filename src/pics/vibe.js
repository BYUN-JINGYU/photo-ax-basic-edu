// 1장 그림: 바이브 코딩 순서도, 에이전트 = LLM + 툴, 사내망 안에서만
(function () {
  const { svg, T, arrow, block, diamond, stadium, curve, yes, no, num, monitor, server, cyl, cloud, icon, pill, bubble } = AX.pic;

  AX.pics.vibeloop = () => svg(1000, 250, [
    block(0, 64, 170, 66, { t: '① 말한다', s: '원하는 것을' }),
    arrow([[184, 97], [232, 97]], {}),
    block(240, 64, 190, 66, { t: '② 에이전트가 만든다', s: '읽고 · 쓰고 · 실행', c: 'acc' }),
    arrow([[446, 97], [494, 97]], {}),
    block(502, 64, 170, 66, { t: '③ 확인한다', s: '열어 보고 대조' }),
    arrow([[688, 97], [726, 97]], {}),
    diamond(800, 97, 150, 96, { t: '마음에\n드나?' }),
    arrow([[800, 49], [800, 34]], {}), yes(840, 30),
    stadium(740, 0, 120, 32, { t: '멈추기 ✓' }),
    curve(800, 146, 560, 270, 330, 140, { label: '④ 다시 말한다 · 틀린 것만 콕 집어', lx: 560, ly: 226 }),
    no(842, 160)
  ]);

  // 에이전트 = LLM + 툴 (+ 반복)
  AX.pics.agent = () => {
    const tool = (x, y, t, s) => block(x, y, 112, 52, { t, s, d: 10, ts: 14 });
    const cx = 790, cy = 152, rx = 150, ry = 92;
    return svg(1000, 300, [
      block(0, 104, 150, 92, { t: 'LLM', s: '글만 씁니다', c: 'acc', d: 16, ts: 22 }),
      T(80, 236, '혼자서는 파일도, 실행도 못 함', { size: 12, c: 'm' }),
      T(196, 164, '+', { size: 40, c: 'a', w: 800 }),
      tool(232, 70, '읽기', 'read'), tool(362, 70, '쓰기', 'write'),
      tool(232, 156, '실행', 'bash'), tool(362, 156, '조회', 'MCP'),
      T(360, 250, '툴 = 손 (2장에서 자세히)', { size: 12, c: 'm' }),
      T(536, 164, '=', { size: 40, c: 'a', w: 800 }),
      T(cx, 30, '에이전트', { size: 22, w: 800, c: 'a' }),
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="pl m dash"/>`,
      block(cx - 62, cy - 30, 124, 60, { t: 'LLM + 툴', c: 'acc', d: 12, ts: 16 }),
      ...[['생각', 0, -1], ['툴 사용', 1, 0], ['결과 보기', 0, 1], ['다음 판단', -1, 0]].map(([t, ux, uy]) =>
        pill(cx + ux * rx, cy + uy * ry - 12, t, { c: 'line', a: 'middle', size: 13 })),
      curve(cx + 60, cy - ry + 4, cx + rx - 12, cy - ry + 18, cx + rx - 4, cy - 30, { c: 'a' }),
      curve(cx + rx - 4, cy + 30, cx + rx - 12, cy + ry - 18, cx + 62, cy + ry - 4, { c: 'a' }),
      curve(cx - 62, cy + ry - 4, cx - rx + 12, cy + ry - 18, cx - rx + 4, cy + 30, { c: 'a' }),
      curve(cx - rx + 4, cy - 30, cx - rx + 12, cy - ry + 18, cx - 60, cy - ry + 4, { c: 'a' }),
      T(cx, 292, '목표를 이룰 때까지 스스로 반복', { size: 13, c: 'a', w: 700 })
    ]);
  };

  // 회사 안(파란 점선) 에서만 오가는 선. 밖의 클라우드 AI 는 막혀 있다
  AX.pics.closednet = () => svg(1000, 250, [
    `<rect x="4" y="18" width="742" height="226" rx="22" class="zone"/>`,
    `<rect x="4" y="18" width="742" height="226" rx="22" class="wall"/>`,
    pill(24, 6, '사내망', { c: 'acc', size: 13 }),
    monitor(40, 62, 180, 104, { t: '내 PC · OpenCode', lines: [['> opencode', 'g'], ['Scanner.md 읽기…', 'w']] }),
    arrow([[238, 112], [318, 112]], {}), arrow([[318, 126], [238, 126]], { c: 'm' }),
    server(330, 60, 132, 116, { t: '사내 LLM 서버' }),
    T(400, 228, 'MAX · Pro · Fast · Image', { size: 12, c: 'm' }),
    arrow([[492, 112], [572, 112]], {}), arrow([[572, 126], [492, 126]], { c: 'm' }),
    cyl(586, 62, 128, 120, { t: '사내 Datalake', s: '5장에서 연결' }),
    cloud(800, 64, 196, 112, { t: '외부 AI', s: 'Claude · GPT …', c: 'bad' }),
    `<path d="M748 132 H806" class="pl bad dash"/>`, icon('cross', 776, 132, 13),
    T(898, 214, '회사 밖으로 나가는 선 없음', { size: 13, c: 'bad', w: 700 })
  ]);
  // 왜 지금: 숫자 두 개 + 역할 변화 → 그래서 확인이 우리 일
  AX.pics.whynow = () => {
    const stat = (x, big, t, s, c) => block(x, 40, 200, 150, { c, d: 14 }) +
      T(x + 100, 104, big, { size: big.length > 4 ? 22 : 40, w: 800, c: c === 'acc' ? 'w' : 'a' }) +
      T(x + 100, 140, t, { size: 14, w: 700, c: c === 'acc' ? 'w' : 't' }) +
      T(x + 100, 162, s, { size: 11, c: c === 'acc' ? 'w' : 'm' });
    return svg(1000, 250, [
      stat(0, '90%', '개발 현장 AI 도입', 'Google DORA 2025', 'soft'),
      stat(236, '올해의 단어', '"vibe coding"', 'Collins 사전 2025', 'line'),
      stat(472, '짜기 → 맡기기', '개발자 역할 변화', '정의 · 설계 · 검증 중심', 'line'),
      arrow([[690, 115], [740, 115]], {}),
      block(748, 40, 228, 150, { c: 'warn', d: 14 }),
      T(862, 96, '그런데 신뢰는', { size: 16, w: 800 }), T(862, 120, '아직 못 따라옴', { size: 16, w: 800 }),
      T(862, 156, '그래서 확인이 사람 몫', { size: 13, c: 'a', w: 700 }),
      T(500, 238, '빨리 만들게 됐지만, 맞는지 보는 일은 그대로 남았습니다', { size: 13, c: 'm' })
    ]);
  };
})();
