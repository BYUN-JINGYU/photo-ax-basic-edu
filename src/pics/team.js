// 7장 그림: 에이전트 조직도, 검토자, Oh-my-codemate 설치, 강사 데모, 작게 쪼개기
(function () {
  const { svg, T, arrow, block, slab, doc, win, person, bubble, pill, icon, curve } = AX.pic;

  // 주 에이전트 둘(Tab 으로 전환) 아래에 서브에이전트
  AX.pics.agentorg = () => {
    const subs = [['general', '여러 단계 일 떼어 맡음'], ['explore', '읽기 전용 · 코드 찾기'], ['scout', '읽기 전용 · 문서 조사'], ['(내 것)', '.opencode/agents/']];
    return svg(1000, 270, [
      pill(0, 4, '주 에이전트', { c: 'acc', size: 13 }),
      block(240, 24, 200, 68, { t: 'build', s: '수정·실행까지 전부', c: 'acc', ts: 18 }),
      block(560, 24, 200, 68, { t: 'plan', s: '분석만 · 수정은 묻기', c: 'soft', ts: 18 }),
      arrow([[456, 50], [544, 50]], {}), arrow([[544, 66], [456, 66]], {}), T(500, 42, 'Tab', { size: 13, c: 'a', w: 800 }),
      `<path d="M340 104 V134 M115 134 H835 M115 134 V160 M355 134 V160 M595 134 V160 M835 134 V160" class="pl m"/>`,
      pill(0, 104, '서브에이전트', { c: 'line', size: 13 }),
      ...subs.map(([t, s], i) => block(30 + i * 240, 164, 170, 64, { t, s, c: i === 3 ? 'warn' : 'line', ts: 16 })),
      T(500, 262, '주 에이전트가 일을 떼어 맡기거나, @general 처럼 직접 부릅니다', { size: 13, c: 'a', w: 700 })
    ]);
  };

  AX.pics.reviewer = () => svg(400, 300, [
    slab(16, 88, 72, 12, { c: 'soft' }), person(50, 70, {}), T(56, 120, '구현자', { size: 13, w: 700 }),
    block(120, 30, 140, 84, { d: 12 }), T(132, 52, 'simulator.html', { size: 12, a: 'start', mono: true, w: 700 }),
    ...[0, 1, 2].map(i => `<rect x="132" y="${64 + i * 12}" width="${i === 2 ? 70 : 112}" height="5" rx="2" class="pb mist"/>`),
    arrow([[92, 72], [114, 72]], { label: '만듦', ly: 60 }),
    arrow([[280, 72], [306, 72]], { label: '읽기만', lx: 292, ly: 60 }),
    slab(312, 88, 72, 12, { c: 'mist' }), person(346, 70, { c: 'mist' }), T(352, 120, '검토자', { size: 13, w: 700 }),
    icon('lock', 376, 40, 14),
    bubble(130, 150, 262, 44, { t: '"습식 B 값이 계획과 다릅니다"', tail: 'r' }),
    arrow([[130, 172], [56, 172], [56, 132]], { label: '지적 → 고침', lx: 92, ly: 164 }),
    pill(200, 236, 'edit: deny · bash: deny', { c: 'line', a: 'middle', size: 13 }),
    T(200, 290, '검토자는 손이 없습니다. 말로만 지적', { size: 13, c: 'a', w: 700 })
  ]);

  AX.pics.omo = () => {
    const rows = [['build', 0], ['plan', 0], ['Sisyphus', 1], ['Prometheus', 1], ['Oracle', 1], ['Librarian', 1], ['…', 1]];
    return svg(400, 300, [
      block(0, 26, 176, 128, { d: 12 }),
      T(12, 48, 'opencode.json', { size: 12, a: 'start', mono: true, w: 700 }),
      ...[0, 1, 2, 3].map(i => `<rect x="12" y="${60 + i * 14}" width="${i === 3 ? 90 : 150}" height="6" rx="3" class="pb mist"/>`),
      `<rect x="12" y="122" width="150" height="20" rx="5" class="pb acc"/>`, T(87, 136, '"plugin": [ … ]', { size: 11, c: 'w', mono: true, w: 700 }),
      T(88, 186, '플러그인 한 줄', { size: 13, c: 'a', w: 700 }),
      arrow([[192, 86], [232, 86]], { label: '재시작', ly: 74 }), icon('redo', 212, 108, 12),
      win(240, 10, 156, 240, { t: 'Tab 에이전트 목록' }),
      ...rows.map(([t, n], i) => (n ? `<rect x="250" y="${44 + i * 28}" width="136" height="22" rx="6" class="pb soft"/>` : '') +
        T(260, 60 + i * 28, t, { size: 13, c: n ? 'a' : 'm', a: 'start', w: n ? 700 : 400 })),
      T(318, 288, '파란 줄이 늘었으면 성공', { size: 13, c: 'a', w: 700 })
    ]);
  };

  AX.pics.teamdemo = () => {
    const who = (x, y, t, c) => slab(x - 34, y + 22, 68, 12, { c: 'mist' }) + person(x, y, { c }) + T(x + 6, y + 54, t, { size: 13, w: 700 });
    return svg(1000, 240, [
      pill(0, 30, 'A  단일', { c: 'line', size: 13 }),
      who(150, 50, 'Pro 하나', 'mist'), arrow([[188, 50], [236, 50]], {}),
      block(244, 22, 210, 58, { t: '결과', s: '빠름 · 검토는 내가' }),
      pill(0, 150, 'B  팀', { c: 'acc', size: 13 }),
      who(150, 170, '계획자'), arrow([[184, 166], [232, 166]], {}),
      who(270, 170, '구현자'), arrow([[304, 166], [352, 166]], {}),
      who(390, 170, '검토자'),
      curve(390, 136, 330, 108, 276, 136, { label: '지적 → 수정', lx: 332, ly: 112 }),
      arrow([[428, 166], [476, 166]], {}),
      block(484, 138, 210, 58, { t: '결과', s: '느림 · 실수를 잡음', c: 'soft' }),
      block(760, 24, 226, 176, { d: 14 }),
      T(778, 56, '데모에서 볼 것', { size: 15, w: 800, a: 'start' }),
      T(778, 96, '① 계획이 어디서', { size: 14, a: 'start' }), T(798, 118, '틀어지나', { size: 14, a: 'start', w: 700, c: 'a' }),
      T(778, 154, '② 검토자가 무엇을', { size: 14, a: 'start' }), T(798, 176, '잡나', { size: 14, a: 'start', w: 700, c: 'a' })
    ]);
  };

  AX.pics.smalltasks = () => svg(1000, 210, [
    block(0, 40, 190, 130, { t: '큰 과제', s: '통째로 맡기면 흔들림', c: 'warn', d: 22, ts: 18 }),
    arrow([[220, 105], [282, 105]], { label: '사람이 쪼갬' }),
    block(292, 10, 150, 48, { t: '작은 과제 1', d: 10, ts: 14 }),
    block(292, 80, 150, 48, { t: '작은 과제 2', d: 10, ts: 14 }),
    block(292, 150, 150, 48, { t: '작은 과제 3', d: 10, ts: 14 }),
    arrow([[460, 105], [516, 105]], {}),
    block(526, 56, 210, 98, { t: '단일 에이전트', s: 'plan 먼저 · 하나씩', c: 'acc', d: 16 }),
    arrow([[756, 105], [812, 105]], { label: '잘 됐으면' }),
    block(822, 56, 170, 98, { t: '저장', s: '스킬 · 명령 (6장)', c: 'soft', d: 16 })
  ]);
})();

// 나누면 얻는 것 · 치르는 것 (저울)
(function () {
  const { svg, T, block, pill } = AX.pic;
  AX.pics.splitcost = () => {
    const pan = (x, y, title, items, c) =>
      `<path d="M${x} ${y} h220 l-22 26 h-176 z" class="pb mist"/>` +
      items.map((s, i) => block(x + 24, y - 44 - i * 46, 172, 38, { t: s, c, d: 8, ts: 13, shade: false })).join('') +
      T(x + 110, y + 50, title, { size: 15, w: 800, c: c === 'ok' ? 'ok' : 'bad' });
    return svg(1000, 300, [
      `<polygon points="500,150 470,236 530,236" class="pb line"/>`,
      `<rect x="420" y="236" width="160" height="12" rx="6" class="pb mist"/>`,
      `<path d="M190 166 L810 134" class="pl t thick"/>`, `<circle cx="500" cy="150" r="9" class="pb acc"/>`,
      `<path d="M190 166 V196 M810 134 V164" class="pl m"/>`,
      pan(80, 196, '얻는 것', ['지시 · 툴이 적어짐', '고칠 곳이 좁아짐', '역할 추가가 쉬움'], 'ok'),
      pan(700, 164, '치르는 것', ['전달하는 시간', '빠지는 맥락'], 'warn'),
      pill(500, 268, '서브에이전트는 넘겨받은 말만 압니다', { c: 'acc', size: 13, a: 'middle' })
    ]);
  };
})();
