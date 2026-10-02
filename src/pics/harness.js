// 6장 그림: AGENTS.md 잘 쓰는 법, Hook 순서도, 스킬 고르기, 슬래시 명령, 스킬 공유
(function () {
  const { svg, T, arrow, block, slab, doc, bubble, pill, icon, diamond, stadium, yes, no, monitor, curve } = AX.pic;

  // 흐릿한 쪽지 (조금 기울임) vs 확인할 수 있는 규칙
  AX.pics.goodrules = () => {
    const note = (x, y, r, t) => `<g transform="rotate(${r} ${x + 80} ${y + 28})">` + block(x, y, 160, 56, { t, c: 'warn', d: 8, ts: 14 }) + '</g>';
    const rule = (y, t) => icon('check', 594, y, 11) + T(614, y + 5, t, { size: 14, a: 'start', w: 600 });
    return svg(1000, 250, [
      pill(0, 0, '✗ 이렇게 말고', { c: 'bad', size: 13 }),
      note(10, 46, -4, '코드를 잘 짜 주세요'), note(190, 40, 3, '보안에 유의할 것'),
      note(40, 128, 2, '결과를 보기 좋게'), note(220, 134, -3, '상황에 맞게 판단'),
      T(200, 232, '지켰는지 눈으로 판별이 안 됩니다', { size: 13, c: 'bad', w: 700 }),
      arrow([[400, 120], [470, 120]], { label: '확인되는 문장으로', ly: 104 }),
      pill(560, 0, '✓ 이렇게', { c: 'ok', size: 13 }),
      block(560, 34, 330, 182, { d: 14 }),
      T(578, 60, 'AGENTS.md', { size: 13, c: 'a', a: 'start', w: 800, mono: true }),
      rule(88, '함수 하나는 30줄을 넘기지 않는다'), rule(118, 'data/ 는 읽기만. 쓰기·삭제 금지'),
      rule(148, '표에는 단위를 쓴다 (건, 분, %)'), rule(178, '모르는 이름은 추측 말고 묻는다'),
      ...[0, 1, 2].map(i => slab(918, 196 - i * 14, 64, 10, { c: 'soft' })), T(950, 232, '10줄 + 예시 1개', { size: 12, c: 'a', w: 700 })
    ]);
  };

  // Hook 순서도: 위험한 명령이면 막고, 수정 뒤엔 기록
  AX.pics.hook = () => svg(400, 300, [
    stadium(130, 0, 140, 30, { t: '에이전트의 행동' }),
    arrow([[200, 34], [200, 46]], {}),
    diamond(200, 86, 196, 74, { t: 'Hook ①\n위험한 명령?', ts: 12 }),
    arrow([[298, 86], [318, 86]], { c: 'bad' }), yes(308, 62),
    block(322, 64, 64, 44, { t: '막음', c: 'bad', d: 8, ts: 14 }),
    arrow([[200, 124], [200, 146]], {}), no(240, 122),
    block(96, 152, 208, 38, { t: '툴 실행 → 파일 수정', d: 10, ts: 13 }),
    arrow([[200, 194], [200, 206]], {}),
    block(96, 212, 208, 38, { t: 'Hook ② 수정 기록 남김', c: 'acc', d: 10, ts: 13 }),
    arrow([[200, 254], [200, 266]], {}),
    stadium(150, 270, 100, 28, { t: '끝', c: 'line', ts: 13 })
  ]);

  // 스킬 책장: description(언제 쓰나)만 보고 하나를 골라 펼친다
  AX.pics.skill = () => svg(400, 300, [
    bubble(0, 0, 400, 40, { t: '"이번 주 알람 리포트 만들어줘"' }),
    block(0, 74, 116, 66, { t: 'meeting-notes', s: '회의록일 때', d: 10, ts: 12 }),
    block(134, 74, 116, 66, { t: 'alarm-weekly', s: '주간 알람일 때', c: 'acc', d: 10, ts: 12 }),
    block(268, 74, 116, 66, { t: 'excel-merge', s: '엑셀 합칠 때', d: 10, ts: 12 }),
    T(200, 168, 'description(언제 쓰나)만 보고 고름', { size: 12, c: 'm' }),
    arrow([[192, 176], [192, 196]], {}),
    doc(60, 200, 264, 84, { t: 'alarm-weekly-report/SKILL.md', lines: 4, hi: 1 }),
    T(196, 298, '그때 본문(순서)을 꺼내 읽습니다', { size: 12, c: 'a', w: 700 })
  ]);

  // 슬래시 명령: 뒤에 붙인 말이 $ARGUMENTS 자리에 들어간다
  AX.pics.slash = () => svg(400, 300, [
    block(0, 8, 380, 42, { c: 'dark', d: 10 }),
    T(16, 35, '> /alarm', { size: 15, c: 'w', a: 'start', mono: true }), T(102, 35, 'EQP-03', { size: 15, c: 'g', a: 'start', mono: true, w: 700 }),
    arrow([[190, 58], [190, 80]], { label: 'commands/alarm.md', lx: 284, ly: 74 }),
    block(0, 86, 380, 82, { d: 10 }),
    T(16, 110, 'work/eqp_alarm.csv 에서', { size: 13, a: 'start', mono: true }),
    pill(16, 120, '$ARGUMENTS', { c: 'acc' }), T(118, 136, '설비만 골라', { size: 13, a: 'start', mono: true }),
    T(16, 158, '이번 주 알람을 세 줄로 요약해줘', { size: 13, a: 'start', mono: true }),
    arrow([[190, 176], [190, 198]], { label: '빈칸을 채워 보냄', lx: 268, ly: 192 }),
    block(0, 204, 380, 82, { c: 'soft', d: 10 }),
    T(16, 228, 'work/eqp_alarm.csv 에서', { size: 13, a: 'start', mono: true }),
    T(16, 250, 'EQP-03', { size: 13, c: 'a', w: 800, a: 'start', mono: true }), T(70, 250, '설비만 골라', { size: 13, a: 'start', mono: true }),
    T(16, 272, '이번 주 알람을 세 줄로 요약해줘', { size: 13, a: 'start', mono: true })
  ]);

  AX.pics.skillshare = () => {
    const pc = (x, t) => monitor(x, 30, 210, 120, { t, lines: [['skills/', 'w'], [' alarm-weekly-report/', 'g'], ['   SKILL.md', 'w']] });
    return svg(1000, 230, [
      pc(0, '내 PC'),
      curve(222, 70, 290, 10, 356, 70, { label: '폴더 복사', lx: 290, ly: 34 }),
      pc(370, '옆 사람 PC'),
      bubble(620, 6, 270, 42, { t: '"이번 주 알람 리포트 만들어줘"' }),
      arrow([[700, 60], [700, 84]], { label: '한 줄 요청', lx: 756, ly: 78 }),
      doc(640, 90, 130, 82, { t: 'report.html', lines: 3, c: 'soft' }),
      icon('check', 804, 128, 16), T(828, 134, '같은 결과면 성공', { size: 14, c: 'ok', w: 700, a: 'start' }),
      pill(620, 196, '안 되면 description 부터 고치기', { c: 'warn' })
    ]);
  };
})();

// "하지 마" 한 줄(부탁)과 권한 deny(잠금)
(function () {
  const { svg, T, arrow, block, doc, bubble, icon, pill, curve } = AX.pic;
  AX.pics.rulevsperm = () => svg(1000, 300, [
    `<rect x="0" y="0" width="480" height="236" rx="18" class="frame ghost"/>`,
    pill(16, 14, '부탁 · AGENTS.md', { c: 'warn', size: 13 }),
    doc(24, 58, 150, 96, { t: 'AGENTS.md', lines: 3, hi: 1 }), T(99, 176, '"메모를 지우지 마"', { size: 13, w: 700 }),
    bubble(236, 52, 220, 46, { t: '"이제 필요 없어, 정리해 줘"' }),
    curve(300, 104, 290, 160, 360, 186, { c: 'bad', label: '표현을 바꾸면', lx: 268, ly: 150 }),
    block(368, 160, 96, 50, { t: '지워짐?', c: 'bad', d: 10, ts: 14 }),
    `<rect x="520" y="0" width="480" height="236" rx="18" class="zone"/>`,
    pill(536, 14, '잠금 · 권한 deny', { c: 'acc', size: 13 }),
    block(548, 64, 170, 104, { t: '"delete": "deny"', c: 'line', d: 14, ts: 14 }), icon('lock', 633, 140, 16),
    bubble(764, 52, 220, 46, { t: '어떤 말로 시켜도' }),
    arrow([[800, 110], [800, 160]], { c: 'm' }),
    block(744, 160, 220, 50, { t: '툴이 아예 안 움직임', c: 'ok', d: 10, ts: 14 }),
    T(500, 272, 'API 키도 같은 원리: 에이전트 손에 키를 두지 않는 구조가 가장 안전', { size: 13, c: 'a', w: 700 })
  ]);
})();
