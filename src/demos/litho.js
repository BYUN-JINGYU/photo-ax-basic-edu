// 스캐너 미니 시뮬레이터: 광원(λ)·NA·k1·목표 하프피치 → 해상도 R, 초점 심도 DOF, 찍히는지.
// 옆에서 본 단면: 렌즈 → 빛 원뿔 → 레지스트 줄무늬. 모델은 kit/Scanner.md 와 같다.
(function () {
  const { h, demoPanel } = AX.util;
  const NS = 'http://www.w3.org/2000/svg';
  const SOURCES = [['g-line', 436, 0.45], ['i-line', 365, 0.6], ['KrF', 248, 0.8], ['ArF', 193, 0.93], ['ArF 액침', 193, 1.35], ['EUV', 13.5, 0.33]];
  const VERDICT = { ok: ['인쇄 OK', 'ok'], blur: ['흐림 (불안정)', 'warn'], no: ['안 찍힘', 'bad'] };

  // Scanner.md 3절·6절
  function litho(lambda, na, k1, hp) {
    const R = Math.round(k1 * lambda / na * 10) / 10;
    const DOF = 0.5 * lambda / (na * na);
    const verdict = hp >= R ? 'ok' : hp >= R / 2 ? 'blur' : 'no';
    const C = Math.min(1, Math.max(0, 2 * hp / R - 1));
    return { R, DOF, verdict, C };
  }

  const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); return e; };

  // 단면 그림: 폭 320, 높이 250. 레지스트 막대 14 개의 높이와 원뿔 각도만 바뀐다
  function scene() {
    const s = svgEl('svg', { viewBox: '0 0 320 250', class: 'lt-svg' });
    const cone = svgEl('polygon', { class: 'lt-cone' });
    const lens = svgEl('ellipse', { rx: 70, ry: 9, cx: 160, class: 'lt-lens' });
    s.append(cone, lens, svgEl('rect', { x: 20, y: 214, width: 280, height: 22, rx: 3, class: 'lt-wafer' }));
    const bars = Array.from({ length: 14 }, (_, i) => {
      const r = svgEl('rect', { x: 20 + i * 20, width: 19.4, class: i % 2 ? 'lt-space' : 'lt-line' });
      s.append(r); return r;
    });
    const set = (r, na) => {
      bars.forEach((b, i) => {
        const hh = 44 * (i % 2 ? 0.5 - 0.5 * r.C : 0.5 + 0.5 * r.C);
        b.setAttribute('y', 214 - hh); b.setAttribute('height', Math.max(0.5, hh));
      });
      const n = na > 0.93 ? 1.44 : 1, tan = Math.tan(Math.asin(Math.min(0.99, na / n)));
      const top = Math.max(26, 170 - 70 / tan);             // 렌즈 반지름 70 고정, NA 가 크면 렌즈가 내려온다
      lens.setAttribute('cy', top);
      cone.setAttribute('points', `90,${top} 230,${top} 160,170`);
    };
    return { el: s, set };
  }

  function mount(el) {
    const panel = demoPanel('스캐너 미니 시뮬레이터', '4장에서 에이전트에게 만들게 할 것의 축소판입니다. 줄무늬 모양은 Scanner.md 6절의 **교육용 단순화**이고, 숫자는 식 그대로입니다.');
    let src = SOURCES[4];
    const slider = (min, max, step, val, label) => h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
    const na = slider('0.3', '1.35', '0.01', '1.35', 'NA'), k1 = slider('0.25', '0.8', '0.01', '0.28', 'k1'), hp = slider('5', '200', '1', '40', '하프피치');
    const naV = h('b'), k1V = h('b'), hpV = h('b');
    const chips = SOURCES.map(s => h('button', { class: 'lt-src', onclick: () => { src = s; na.value = s[2]; render(); } }, s[0], h('small', {}, s[1] + ' nm')));
    const view = scene();
    const rOut = h('div', { class: 'lt-r' }), dofOut = h('div', { class: 'lt-dof' }), badge = h('span', { class: 'badge' });

    function render() {
      const r = litho(src[1], +na.value, +k1.value, +hp.value);
      naV.textContent = (+na.value).toFixed(2); k1V.textContent = (+k1.value).toFixed(2); hpV.textContent = hp.value + ' nm';
      chips.forEach((c, i) => c.classList.toggle('on', SOURCES[i] === src));
      view.set(r, +na.value);
      rOut.innerHTML = `<b>${r.R.toFixed(1)}</b> nm <span>찍을 수 있는 최소 하프피치</span>`;
      dofOut.textContent = `초점 심도 DOF = ${r.DOF.toFixed(1)} nm`;
      const [t, c] = VERDICT[r.verdict];
      badge.textContent = t; badge.className = 'badge ' + c;
    }
    [na, k1, hp].forEach(i => i.addEventListener('input', render));

    panel.append(h('div', { class: 'lt-grid' },
      h('div', { class: 'lt-controls' },
        h('div', { class: 'lt-srcs' }, chips),
        h('label', {}, h('span', {}, 'NA ', naV), na),
        h('label', {}, h('span', {}, 'k1 ', k1V), k1),
        h('label', {}, h('span', {}, '목표 하프피치 ', hpV), hp)),
      view.el,
      h('div', { class: 'lt-read' }, h('div', { class: 'lt-formula' }, 'R = k1 · λ / NA'), rOut, dofOut, h('div', {}, badge))),
      panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['litho'] = { mount };
})();
