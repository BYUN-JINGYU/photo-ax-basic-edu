// 9장 그림: 35분 진행 막대, 3분 공유 양식, 내일부터 네 가지
(function () {
  const { svg, T, arrow, block, bubble, pill, icon, tiles } = AX.pic;

  AX.pics.project35 = () => {
    const segs = [['plan 8분', '계획 읽고 고치기', 8, 'soft'], ['build 18분', '작게, 한 번에 하나', 18, 'acc'], ['검증 5분', '원본과 대조', 5, 'ok'], ['저장 4분', '커밋 · SKILL.md', 4, 'warn']];
    const k = 940 / 35;
    let x = 0, t = 0;
    const parts = [];
    segs.forEach(([a, b, m, c]) => {
      parts.push(block(x, 70, m * k - 6, 74, { t: a, s: b, c, d: 16, ts: 16 }));
      parts.push(icon('clock', x, 34, 11), T(x + 16, 39, `${t}분`, { size: 12, c: 'm', a: 'start', w: 700 }));
      x += m * k; t += m;
    });
    parts.push(icon('clock', 934, 34, 11), T(950, 39, '35분', { size: 12, c: 'm', a: 'start', w: 700 }));
    return svg(1000, 230, [
      ...parts,
      bubble(300, 178, 300, 40, { t: '막히면 과제를 반으로 줄이기', c: 'warn', size: 13 }),
      `<path d="M450 176 V156" class="pl m dash"/>`,
      bubble(700, 178, 290, 40, { t: '잘 먹힌 요청문은 바로 스킬 칸에', size: 13 }),
      `<path d="M890 176 V156" class="pl m dash"/>`
    ]);
  };

  AX.pics.sharecard = () => svg(440, 350, [
    block(0, 12, 420, 326, { r: 16, d: 14 }),
    T(20, 48, '3분 공유', { size: 19, w: 800, a: 'start' }),
    icon('link', 296, 40, 14), T(316, 45, 'Pages 링크', { size: 13, c: 'a', w: 700, a: 'start' }),
    T(20, 88, '① 무엇을', { size: 13, c: 'm', a: 'start', w: 700 }), T(100, 88, '주간 알람 요약 자동화', { size: 14, a: 'start', w: 600 }),
    T(20, 128, '② 요청문', { size: 13, c: 'm', a: 'start', w: 700 }),
    bubble(100, 106, 300, 36, { t: '"이번 주 알람 리포트 만들어줘"', size: 12 }),
    T(20, 188, '③ 시간', { size: 13, c: 'm', a: 'start', w: 700 }),
    `<rect x="100" y="172" width="290" height="18" rx="5" class="pb mist"/>`, T(394, 186, '60분', { size: 12, c: 'm', a: 'end' }),
    `<rect x="100" y="200" width="50" height="18" rx="5" class="pb acc"/>`, T(160, 214, '10분', { size: 12, c: 'a', a: 'start', w: 700 }),
    T(100, 236, '원래 → 지금', { size: 11, c: 'm', a: 'start' }),
    T(20, 282, '④ 내일', { size: 13, c: 'm', a: 'start', w: 700 }),
    icon('check', 112, 277, 11), T(130, 282, '바로 씀', { size: 14, a: 'start', w: 600 }),
    icon('cross', 112, 310, 11), T(130, 315, '부족한 것: 데이터 권한', { size: 14, a: 'start', w: 600 })
  ]);

  AX.pics.tomorrow = () => tiles([
    ['plus', '새 세션', '주제가 바뀌면'],
    ['flag', 'plan 먼저', '새 과제는 계획부터'],
    ['equal', '원본과 대조', '숫자는 늘 확인'],
    ['save', '"커밋해줘"', '잘 되면 세이브 포인트']
  ]);
})();
