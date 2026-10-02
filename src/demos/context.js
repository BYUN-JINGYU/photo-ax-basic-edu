// 컨텍스트 윈도우 데모: 세션에 쌓이는 것들이 창을 채우는 모습
(function () {
  const { h, demoPanel } = AX.util;
  const CAP = 128; // K 토큰 (설명용 예시 용량)
  const ITEMS = [
    { k: 0, n: 'AGENTS.md', size: 2 },
    { k: 1, n: '내 요청', size: 1 },
    { k: 2, n: '파일 읽기', size: 8 },
    { k: 3, n: '조회 결과', size: 20 },
    { k: 4, n: '긴 로그 붙여넣기', size: 40 }
  ];

  function mount(el) {
    const panel = demoPanel('세션에 쌓이는 것', `예시 용량 ${CAP}K 토큰. 버튼을 눌러 창을 채워 보고, 70%를 넘으면 무슨 일이 생기는지 보세요.`);
    const track = h('div', { class: 'ctx-track', role: 'img', 'aria-label': '컨텍스트 윈도우 사용량' });
    const btns = h('div', { class: 'ctx-btns' });
    const state = h('div', { class: 'ctx-state' });
    let segs = [];

    const used = () => segs.reduce((a, s) => a + s.size, 0);
    const render = () => {
      track.replaceChildren(...segs.map(s =>
        h('div', { class: 'ctx-seg k' + s.k, style: `width:${(s.size / CAP) * 100}%`, title: `${s.n} ${s.size}K` }, s.size >= 6 ? s.n : '')));
      const u = used(), r = u / CAP;
      state.className = 'ctx-state' + (r >= 1 ? ' full' : r >= 0.7 ? ' warn' : '');
      state.textContent =
        r >= 1 ? `꽉 찼습니다 (${u}K / ${CAP}K). 앞부분을 잊기 시작하고 지시도 흐려집니다. → 새 세션.` :
        r >= 0.7 ? `${u}K / ${CAP}K. 품질이 떨어지기 시작하는 구간입니다. 지금까지 결과를 파일로 남기고 새 세션을 여세요.` :
        `${u}K / ${CAP}K. 여유 있습니다.`;
      btns.querySelectorAll('button[data-add]').forEach(b => { b.disabled = r >= 1; });
    };
    ITEMS.forEach(it => btns.append(h('button', { class: 'btn small', 'data-add': '1', onclick: () => { if (used() < CAP) { segs.push({ ...it, size: Math.min(it.size, CAP - used()) }); render(); } } }, `+ ${it.n} (${it.size}K)`)));
    btns.append(h('button', { class: 'btn small primary', onclick: () => { segs = []; render(); } }, '새 세션'));
    panel.append(track, btns, state, panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['context'] = { mount };
})();
