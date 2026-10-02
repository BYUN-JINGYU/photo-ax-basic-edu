// 2장 그림: 트랜스포머 생김새 (인코더 탑 + 디코더 탑, 같은 층을 N번 쌓음)
(function () {
  const { svg, T, arrow, slab, pill, curve } = AX.pic;

  // 탑 하나: 뒤에 겹친 틀 두 장(= 여러 층) + 앞 틀 + 아래에서 위로 쌓인 판들
  function tower(x, y, w, h, slabs) {
    const frames = [20, 10, 0].map(o => `<rect x="${x + o}" y="${y - o}" width="${w}" height="${h}" rx="14" class="frame${o ? ' ghost' : ''}"/>`).join('');
    const sh = 32, gap = (h - 30 - slabs.length * sh) / (slabs.length + 1);
    const ss = slabs.map(([t, c], i) => {
      const yy = y + h - 30 - (i + 1) * (sh + gap) + gap;           // 아래부터 위로
      return slab(x + 18, yy, w - 46, sh, { t, c, ts: 13 }) +
        (i ? arrow([[x + w / 2 - 6, yy + sh + gap - 2], [x + w / 2 - 6, yy + sh + 6]], { c: 'm' }) : '');
    }).join('');
    return frames + ss + T(x + w - 12, y + h - 10, '× N층', { size: 12, c: 'm', a: 'end', w: 700 });
  }
  const chips = (cx, y, words) => {
    let x = cx - words.reduce((a, s) => a + AX.pic.tw(s, 13) + 28, 0) / 2;
    return words.map(s => { const p = pill(x, y, s, { c: 'line', size: 13 }); x += AX.pic.tw(s, 13) + 28; return p; }).join('');
  };

  AX.pics.transformer = () => svg(1000, 340, [
    pill(260, 2, '인코더 · 읽고 이해', { c: 'line', size: 13, a: 'middle' }), pill(370, 2, 'BERT', { c: 'soft', size: 13, a: 'middle' }),
    pill(720, 2, '디코더 · 이어 쓰기', { c: 'line', size: 13, a: 'middle' }), pill(830, 2, 'GPT', { c: 'acc', size: 13, a: 'middle' }),
    // 인코더
    tower(110, 110, 290, 140, [['어텐션 · 서로 보기', 'acc'], ['생각 정리', 'soft']]),
    slab(128, 268, 244, 26, { t: '단어 → 숫자 + 자리 번호', c: 'mist', ts: 12 }),
    arrow([[250, 262], [250, 254]], { c: 'm' }), arrow([[250, 310], [250, 298]], { c: 'm' }),
    chips(250, 312, ['비', '오는', '날엔']),
    // 디코더
    tower(590, 100, 290, 150, [['가린 어텐션 · 앞만 보기', 'acc'], ['인코더 보기', 'soft'], ['생각 정리', 'soft']]),
    slab(608, 268, 244, 26, { t: '단어 → 숫자 + 자리 번호', c: 'mist', ts: 12 }),
    arrow([[730, 262], [730, 254]], { c: 'm' }), arrow([[730, 310], [730, 298]], { c: 'm' }),
    chips(730, 312, ['<시작>', '파전에']),
    slab(608, 40, 244, 28, { t: '다음 말 확률', c: 'acc', ts: 13 }),
    arrow([[730, 78], [730, 72]], {}),
    T(942, 60, '"막걸리가"', { size: 13, c: 'a', w: 700 }), T(942, 78, '62%', { size: 12, c: 'm' }),
    // 인코더가 읽은 뜻을 디코더로
    curve(404, 150, 500, 112, 600, 178, { label: '읽은 뜻을 넘겨줌', lx: 498, ly: 120 }),
    T(52, 170, '같은 층을', { size: 12, c: 'm' }), T(52, 186, '수십 번', { size: 12, c: 'm', w: 700 }), T(52, 202, '쌓음', { size: 12, c: 'm' })
  ]);
})();
