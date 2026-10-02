// 딥러닝을 손잡이 2개로: 점들에 직선을 맞춘다. [한 걸음 배우기]를 누르면 오차가 줄어드는 쪽으로 손잡이가 저절로 돈다.
// props: { data:[[x, y]], xLabel, yLabel, xUnit, yUnit, center, span, start:{ w, b }, lr, hint }  모델: y = w·u + b, u = (x − center) / span
(function () {
  const { h, demoPanel } = AX.util;
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  function mount(el, props) {
    const data = props.data, C = props.center, SP = props.span, LR = props.lr || 0.4;
    let w = props.start.w, b = props.start.b, steps = 0;
    const U = x => (x - C) / SP;
    const loss = () => data.reduce((a, [x, y]) => a + (w * U(x) + b - y) ** 2, 0) / data.length;
    function step() {          // 경사 하강 한 번: 오차를 줄이는 방향으로 손잡이를 조금 돌린다
      let gw = 0, gb = 0;
      data.forEach(([x, y]) => { const e = w * U(x) + b - y; gw += 2 * e * U(x); gb += 2 * e; });
      w -= LR * gw / data.length; b -= LR * gb / data.length; steps++;
    }

    const W = 520, H = 230, P = { l: 44, r: 14, t: 12, b: 34 };
    const xs = data.map(d => d[0]), ys = data.map(d => d[1]);
    const pad = (Math.max(...ys) - Math.min(...ys)) * 0.12, dx = (Math.max(...xs) - Math.min(...xs)) * 0.04;
    const x0 = Math.min(...xs) - dx, x1 = Math.max(...xs) + dx, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
    const X = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), Y = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
    const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'fit-svg', role: 'img', 'aria-label': props.xLabel + ' 대 ' + props.yLabel });

    // 기울기 손잡이 범위: 정답 기울기의 두 배까지
    const mx = xs.reduce((a, v) => a + U(v), 0) / xs.length, my = ys.reduce((a, v) => a + v, 0) / ys.length;
    const wFit = data.reduce((a, [x, y]) => a + (U(x) - mx) * (y - my), 0) / data.reduce((a, [x]) => a + (U(x) - mx) ** 2, 0);
    const wMax = Math.max(12, Math.ceil(Math.abs(wFit) * 2));
    const wIn = h('input', { type: 'range', min: String(-wMax), max: String(wMax), step: '0.1', 'aria-label': '기울기 손잡이' });
    const bIn = h('input', { type: 'range', min: String(Math.floor(y0)), max: String(Math.ceil(y1)), step: '0.1', 'aria-label': '높이 손잡이' });
    const wOut = h('b'), bOut = h('b'), err = h('b', { class: 'num' }), cnt = h('span', { class: 'fit-cnt' });
    const bar = h('i');
    wIn.addEventListener('input', () => { w = +wIn.value; draw(); });
    bIn.addEventListener('input', () => { b = +bIn.value; draw(); });
    const L0 = loss();

    function draw() {
      svg.replaceChildren();
      [y0 + pad, (y0 + y1) / 2, y1 - pad].forEach(v => {
        svg.append(sv('line', { x1: P.l, x2: W - P.r, y1: Y(v), y2: Y(v), class: 'fit-grid' }));
        const t = sv('text', { x: P.l - 6, y: Y(v) + 4, class: 'fit-ax', 'text-anchor': 'end' }); t.textContent = v.toFixed(0); svg.append(t);
      });
      xs.forEach((x, i) => { if (i % 2 === 0) { const t = sv('text', { x: X(x), y: H - 14, class: 'fit-ax', 'text-anchor': 'middle' }); t.textContent = x; svg.append(t); } });
      const cap = sv('text', { x: W - P.r, y: H - 1, class: 'fit-ax', 'text-anchor': 'end' }); cap.textContent = props.xLabel; svg.append(cap);
      // 오차: 점에서 선까지 세로 막대
      data.forEach(([x, y]) => svg.append(sv('line', { x1: X(x), x2: X(x), y1: Y(y), y2: Y(w * U(x) + b), class: 'fit-res' })));
      svg.append(sv('line', { x1: X(x0), x2: X(x1), y1: Y(w * U(x0) + b), y2: Y(w * U(x1) + b), class: 'fit-line' }));
      data.forEach(([x, y]) => svg.append(sv('circle', { cx: X(x), cy: Y(y), r: 5, class: 'fit-dot' })));
      wIn.value = w; bIn.value = b;
      wOut.textContent = `${(w / SP).toFixed(1)} ${props.yUnit} / ${props.xUnit}`;
      bOut.textContent = `${b.toFixed(0)} ${props.yUnit}`;
      const l = loss();
      err.textContent = `±${Math.sqrt(l).toFixed(1)}`;
      bar.style.width = Math.max(2, Math.min(100, l / L0 * 100)) + '%';
      cnt.textContent = steps ? `${steps}걸음 배움` : '아직 안 배움';
    }
    const run = n => { for (let i = 0; i < n; i++) step(); draw(); };
    const reset = () => { w = props.start.w; b = props.start.b; steps = 0; draw(); };

    const panel = demoPanel('손잡이 2개짜리 딥러닝', props.hint);
    panel.append(h('div', { class: 'fit-grid-wrap' },
      h('div', { class: 'fit-chart' }, svg),
      h('div', { class: 'sheet fit-side' },
        h('label', { class: 'fit-knob' }, h('span', {}, '손잡이 1 · 기울기'), wOut, wIn),
        h('label', { class: 'fit-knob' }, h('span', {}, `손잡이 2 · ${C}${props.xUnit} 일 때 높이`), bOut, bIn),
        h('div', { class: 'fit-err' }, h('span', {}, `평균 오차 (${props.yUnit})`), err, h('div', { class: 'fit-bar' }, bar)),
        h('div', { class: 'row' }, h('button', { class: 'btn small primary', onclick: () => run(1) }, '한 걸음 배우기'), h('button', { class: 'btn small', onclick: () => run(10) }, '10걸음'), h('button', { class: 'btn small', onclick: reset }, '처음부터')),
        cnt)), panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['fit'] = { mount };
})();
