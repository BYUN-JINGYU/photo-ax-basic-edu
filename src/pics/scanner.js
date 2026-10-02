// 4장 그림: 스캐너 표지, 요청-확인-수정 순서도, 40분 진행 순서도, 체크포인트
(function () {
  const { svg, T, arrow, block, slab, diamond, stadium, yes, no, curve, person, bubble, icon } = AX.pic;

  AX.pics.loop3 = () => svg(1000, 240, [
    stadium(0, 48, 96, 40, { t: '시작', c: 'line' }),
    arrow([[104, 68], [136, 68]], {}),
    block(144, 34, 180, 66, { t: '① 요청', s: '말로 설명' }),
    arrow([[340, 68], [372, 68]], {}),
    block(380, 34, 180, 66, { t: '② 확인', s: '브라우저로 열어 보기', c: 'acc' }),
    arrow([[576, 68], [606, 68]], {}),
    diamond(690, 68, 160, 100, { t: '마음에\n드나?' }),
    arrow([[770, 68], [818, 68]], {}), yes(794, 44),
    stadium(826, 48, 170, 40, { t: '멈추기 ✓' }),
    T(911, 108, '더 좋게 하려다 망가집니다', { size: 12, c: 'm' }),
    arrow([[690, 118], [690, 156]], { c: 'bad' }), no(728, 138),
    block(600, 162, 180, 62, { t: '③ 수정 요청', s: '틀린 것만 콕 집어', c: 'warn' }),
    arrow([[596, 193], [470, 193], [470, 108]], { c: 'bad' }),
    T(533, 185, '다시 확인', { size: 12, c: 'bad', w: 700 })
  ]);

  AX.pics.build40 = () => svg(1000, 230, [
    block(0, 30, 150, 60, { t: '① plan', s: '계획 읽기' }),
    arrow([[166, 60], [196, 60]], {}),
    block(204, 30, 150, 60, { t: '② build', s: '파일 만들기', c: 'acc' }),
    arrow([[370, 60], [400, 60]], {}),
    block(408, 30, 150, 60, { t: '③ 열기', s: '브라우저' }),
    arrow([[574, 60], [600, 60]], {}),
    diamond(690, 60, 176, 104, { t: 'ArF 액침\nR = 40.0 nm?', ts: 13 }),
    arrow([[778, 60], [822, 60]], {}), yes(800, 36),
    stadium(830, 40, 160, 40, { t: '통과 ✓' }),
    arrow([[690, 112], [690, 150]], { c: 'bad' }), no(728, 132),
    block(600, 156, 180, 58, { t: '④ 수정 요청', s: '3절 순서대로 다시', c: 'warn' }),
    arrow([[596, 185], [279, 185], [279, 100]], { c: 'bad' }),
    T(420, 178, '"검산용 값과 다르다"', { size: 12, c: 'bad', w: 700 })
  ]);

  AX.pics.checkpoint = () => svg(1000, 240, [
    slab(20, 128, 930, 26, { c: 'mist', d: 22 }),
    person(96, 112, { c: 'acc' }),
    bubble(30, 8, 150, 40, { t: '"못 끝냈다!"', c: 'warn' }),
    curve(126, 78, 230, 6, 320, 92, { dash: true, label: '복사해서 이어가기', lx: 228, ly: 34 }),
    icon('flag', 340, 98, 20), icon('flag', 640, 98, 20),
    block(262, 172, 170, 56, { t: 'checkpoints/04', s: '4장 완성본', c: 'soft', d: 12 }),
    block(562, 172, 170, 56, { t: '5장 시작', s: '이 파일에서 출발', d: 12 }),
    block(778, 172, 200, 56, { t: '한 줄 기록', s: '예상과 다르게 한 것', c: 'warn', d: 12 })
  ]);

  // 표지: 빛 → 마스크 → 렌즈 → 웨이퍼. 오른쪽에 식의 세 손잡이
  AX.pics.scanhero = () => {
    const stripes = (x, y, w, n, cls) => Array.from({ length: n }, (_, i) =>
      `<rect x="${x + i * (w / n)}" y="${y}" width="${w / n / 2}" height="8" class="pb ${cls}"/>`).join('');
    return svg(470, 330, [
      block(60, 6, 170, 44, { t: '광원', s: 'λ: 빛의 파장', c: 'acc', d: 10, ts: 14 }),
      arrow([[152, 60], [152, 84]], {}),
      slab(40, 92, 210, 20, { c: 'line' }), stripes(52, 98, 186, 7, 'dark'),
      T(270, 107, '마스크', { size: 12, c: 'm', a: 'start', w: 700 }),
      arrow([[152, 122], [152, 146]], {}),
      `<ellipse cx="152" cy="166" rx="104" ry="16" class="pb soft"/><ellipse cx="152" cy="160" rx="104" ry="16" class="pb soft"/>`,
      T(270, 168, '렌즈 · NA', { size: 12, c: 'a', a: 'start', w: 700 }),
      `<polygon points="52,178 252,178 152,262" class="pb soft" opacity=".7"/>`,
      `<path d="M52 178 L152 262 L252 178" class="pl a"/>`,
      slab(30, 266, 240, 22, { c: 'mist', d: 14 }), stripes(40, 258, 220, 9, 'acc'),
      T(152, 318, '웨이퍼 위 레지스트 줄무늬', { size: 12, c: 'm', w: 700 }),
      `<rect x="318" y="196" width="146" height="74" rx="14" class="pb line"/>`,
      T(391, 226, 'R = k1·λ/NA', { size: 16, c: 'a', w: 800, mono: true }),
      T(391, 252, 'λ↓ NA↑ → 더 작게', { size: 12, c: 'm', w: 700 })
    ]);
  };
})();
