// 5장 그림: Datalake 호수, API 와 MCP, SQL 이 고르는 곳, MCP 서버
(function () {
  const { svg, T, arrow, block, cyl, server, monitor, pill, icon, curve, doc } = AX.pic;

  AX.pics.datalake = () => {
    const src = (y, t) => block(0, y, 130, 46, { t, d: 10, ts: 14 });
    const cx = 320, cy = 140;
    return svg(1000, 270, [
      src(20, '설비 알람'), src(100, '계측'), src(180, '생산 기록'),
      curve(146, 43, 200, 60, 236, 116, { c: 'm' }), curve(146, 123, 190, 130, 214, 138, { c: 'm' }), curve(146, 203, 200, 200, 236, 162, { c: 'm' }),
      `<ellipse cx="${cx + 6}" cy="${cy + 18}" rx="112" ry="52" class="s3 soft"/>`,
      `<ellipse cx="${cx}" cy="${cy}" rx="112" ry="52" class="f3 soft"/>`,
      `<path d="M${cx - 74} ${cy - 22} q12 -8 24 0 t24 0 M${cx + 30} ${cy - 26} q12 -8 24 0 t24 0" class="pl"/>`,
      T(cx, cy + 4, 'Datalake', { size: 18, w: 800 }), T(cx, cy + 24, '원래 모양 그대로 모아 둠', { size: 12, c: 'm' }),
      arrow([[440, 140], [500, 140]], { label: 'SQL 로 고름' }),
      block(508, 106, 140, 68, { t: 'Impala', s: 'SQL 실행 엔진', c: 'acc' }),
      arrow([[664, 140], [712, 140]], { label: '표로 받음' }),
      block(720, 106, 140, 68, { t: 'Bigdataquery', s: '사내 Python' }),
      arrow([[876, 140], [902, 140]], {}),
      doc(908, 100, 90, 80, { t: 'work/', lines: 3 }), T(953, 200, '*.csv', { size: 12, c: 'm', mono: true }),
      pill(684, 40, '이 코드와 SQL 은 에이전트가 씁니다', { c: 'line', a: 'middle', size: 13 }),
      `<path d="M684 66 V96" class="pl m dash"/>`
    ]);
  };

  AX.pics.apimcp = () => {
    const api = (y, t, shape) => block(250, y, 170, 50, { t, d: 10, ts: 14 }) + shape(236, y + 25);
    const sq = (x, y) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" class="pb acc"/>`;
    const ci = (x, y) => `<circle cx="${x}" cy="${y}" r="8" class="pb acc"/>`;
    const tr = (x, y) => `<polygon points="${x - 8},${y + 7} ${x + 8},${y + 7} ${x},${y - 8}" class="pb acc"/>`;
    return svg(1000, 300, [
      `<rect x="0" y="0" width="470" height="300" rx="18" class="frame ghost"/>`, `<rect x="510" y="0" width="490" height="300" rx="18" class="zone"/>`,
      pill(16, 14, 'API', { c: 'line', size: 14 }), T(456, 32, '식당마다 다른 주문서', { size: 13, c: 'm', a: 'end', w: 700 }),
      block(20, 112, 120, 70, { t: '내 코드', s: '사람이 짬', d: 12 }),
      api(64, '설비 API', sq), api(132, '메신저 API', ci), api(200, 'Datalake API', tr),
      arrow([[150, 140], [226, 89]], { c: 'm' }), arrow([[150, 147], [226, 157]], { c: 'm' }), arrow([[150, 154], [226, 225]], { c: 'm' }),
      T(235, 282, '사람이 문서를 읽고, 모양이 다른 연결을 하나씩', { size: 12, c: 'm' }),
      pill(526, 14, 'MCP', { c: 'acc', size: 14 }), T(986, 32, '어느 식당이든 되는 배달 앱', { size: 13, c: 'a', a: 'end', w: 700 }),
      block(530, 104, 130, 84, { t: '에이전트', s: 'LLM + 툴', c: 'acc', d: 12 }),
      arrow([[676, 146], [710, 146]], {}),
      block(716, 58, 34, 176, { c: 'acc', d: 10 }), T(733, 252, 'MCP 규격', { size: 12, c: 'a', w: 700 }),
      ...[[64, '설비'], [132, '메신저'], [200, 'Datalake']].map(([y, t]) =>
        arrow([[764, y + 25], [800, y + 25]], {}) + block(806, y, 170, 50, { t: `MCP 서버 · ${t}`, s: '안에서 API·SQL 호출', c: 'soft', d: 10, ts: 13 })),
      T(755, 282, '툴 이름·설명이 모델에게 자동으로 전달', { size: 12, c: 'a', w: 700 })
    ]);
  };

  AX.pics.sqlmap = () => {
    const x0 = 72, cw = 54, y0 = 84, rh = 20, cols = 6, rows = 8, keep = r => r < 6, limit = 4;
    const cells = [];
    for (let c = 0; c < cols; c++) {
      cells.push(`<rect x="${x0 + c * cw + 1}" y="${y0 - 22}" width="${cw - 2}" height="20" rx="3" class="pb ${c < 4 ? 'acc' : 'mist'}"/>`);
      for (let r = 0; r < rows; r++) {
        const on = c < 4 && keep(r) && r < limit, half = c < 4 && keep(r) && r >= limit;
        cells.push(`<rect x="${x0 + c * cw + 1}" y="${y0 + r * rh + 1}" width="${cw - 2}" height="${rh - 2}" rx="3" class="pb ${on ? 'soft' : half ? 'line' : 'mist'}"/>`);
      }
    }
    return svg(400, 300, [
      block(x0 - 8, y0 - 30, cols * cw + 10, rows * rh + 38, { c: 'line', d: 12 }),
      pill(0, 0, 'FROM  eqp_alarm  (어느 표)', { c: 'line' }),
      T(x0 + 2 * cw, y0 - 40, 'SELECT  어떤 칸', { size: 12, c: 'a', w: 700 }),
      ...cells,
      pill(0, y0 + 40, 'WHERE', { c: 'acc' }),
      T(4, y0 + 78, '어떤 줄', { size: 12, c: 'a', a: 'start', w: 700 }),
      `<path d="M${x0 - 6} ${y0 + limit * rh} h${cols * cw + 12}" class="pl bad dash"/>`,
      T(398, y0 + limit * rh - 6, 'LIMIT 여기까지', { size: 12, c: 'bad', a: 'end', w: 700 }),
      T(200, 292, '파란 칸만 가져옵니다', { size: 13, c: 'a', w: 700 })
    ]);
  };

  AX.pics.mcpserver = () => svg(400, 300, [
    monitor(0, 12, 160, 100, { lines: [['query_datalake', 'g'], ['(sql, limit)', 'w']] }),
    T(80, 152, 'OpenCode', { size: 13, w: 700 }),
    arrow([[176, 62], [226, 62]], { label: 'MCP', ly: 52 }),
    server(234, 8, 140, 112, { t: 'MCP 서버' }),
    arrow([[311, 158], [311, 192]], { label: '읽기만', lx: 344, ly: 180 }),
    cyl(246, 198, 130, 84, { t: 'Datalake', s: '읽기 전용' }),
    icon('shield', 22, 196, 15), T(44, 201, 'SELECT 만 허용', { size: 13, a: 'start', w: 600 }),
    icon('lock', 22, 230, 15), T(44, 235, '행 수 상한', { size: 13, a: 'start', w: 600 }),
    pill(0, 262, 'opencode.json 에 한 줄 등록', { c: 'line', size: 12 })
  ]);
})();

// MCP 서버를 연결하면: 인사 → 툴 목록 받기 → 툴 부르기
(function () {
  const { svg, T, arrow, block, server, cyl, num, pill } = AX.pic;
  AX.pics.mcpflow = () => {
    const L = 236, R = 646;
    const row = (y, n, go, back) =>
      num(L + 22, y - 6, n) + arrow([[L + 40, y], [R - 10, y]], {}) + T((L + R) / 2 + 10, y - 10, go, { size: 13, w: 700, c: 'a' }) +
      arrow([[R - 10, y + 26], [L + 10, y + 26]], { c: 'm' }) + T((L + R) / 2, y + 46, back, { size: 12, c: 'm' });
    return svg(1000, 300, [
      block(40, 10, 150, 56, { t: 'LLM', s: '받은 목록에서 고름', c: 'acc', d: 10, ts: 15 }),
      arrow([[115, 78], [115, 104]], { c: 'm' }),
      block(30, 112, 170, 120, { t: 'OpenCode', s: 'MCP 클라이언트', c: 'line', d: 14 }),
      `<path d="M${L} 30 V280" class="pl m dash"/>`, `<path d="M${R} 30 V280" class="pl m dash"/>`,
      row(70, 1, 'initialize · 인사', '규격 버전 확인'),
      row(150, 2, 'tools/list · 툴 목록 주세요', '이름 · 설명 · 입력 형식 (코드는 안 옴)'),
      row(230, 3, 'tools/call · 이 툴을 이 값으로', '실행 결과 (JSON)'),
      server(670, 60, 130, 130, { t: 'MCP 서버' }),
      pill(670, 236, 'http://127.0.0.1:8790/mcp', { c: 'line', size: 11 }),
      arrow([[818, 126], [852, 126]], { c: 'm' }),
      cyl(860, 76, 120, 104, { t: 'Datalake', s: '안에서 SQL' })
    ]);
  };
})();
