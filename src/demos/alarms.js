// 알람 차트 미리보기: 설비를 고르면 하루 알람 건수 막대, "평소" 선, 평소의 몇 배를 넘은 날이 나온다. 5장 실습 결과물의 모양.
// props: { start:'YYYY-MM-DD', baseline:평소로 칠 앞쪽 날 수, factor:몇 배부터 빨강, eqps:{ 이름: { counts:[하루 건수], top:[[알람, 건수]] } }, hint }
(function () {
  const { h, demoPanel } = AX.util;
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const day = (start, i) => { const d = new Date(start + 'T00:00:00'); d.setDate(d.getDate() + i); return `${d.getMonth() + 1}/${d.getDate()}`; };

  function mount(el, props) {
    const names = Object.keys(props.eqps), BASE = props.baseline, F = props.factor || 2;
    const W = 640, H = 196, PAD = { l: 34, r: 44, t: 12, b: 24 };
    const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'al-svg', role: 'img', 'aria-label': '하루 알람 건수' });
    const tip = h('div', { class: 'al-tip' });
    const stats = h('div', { class: 'al-stats' });

    function draw(name) {
      const { counts, top } = props.eqps[name], N = counts.length;
      const usual = counts.slice(0, BASE).reduce((a, v) => a + v, 0) / BASE;
      const hi = Math.max(...counts, usual * F) * 1.1;
      const bw = (W - PAD.l - PAD.r) / N;
      const X = i => PAD.l + i * bw, Y = v => PAD.t + (1 - v / hi) * (H - PAD.t - PAD.b);
      svg.replaceChildren();
      // 이번 주 칸은 옅게 칠한다
      svg.append(sv('rect', { x: X(BASE), y: PAD.t, width: bw * (N - BASE), height: H - PAD.t - PAD.b, class: 'al-week' }));
      [0, Math.round(hi / 2), Math.round(hi)].forEach(v => {
        const t = sv('text', { x: PAD.l - 8, y: Y(v) + 4, class: 'al-ax', 'text-anchor': 'end' }); t.textContent = v; svg.append(t);
      });
      [[0, day(props.start, 0)], [BASE, '이번 주'], [N - 1, day(props.start, N - 1)]].forEach(([i, s]) => {
        const t = sv('text', { x: X(i) + bw / 2, y: H - 6, class: 'al-ax', 'text-anchor': i ? 'middle' : 'start' }); t.textContent = s; svg.append(t);
      });
      const over = [];
      counts.forEach((v, i) => {
        const bad = i >= BASE && v > usual * F;
        if (bad) over.push(i);
        const bar = sv('rect', { x: X(i) + 2, y: Y(v), width: bw - 4, height: Y(0) - Y(v), rx: 2, class: 'al-bar' + (bad ? ' out' : '') });
        const hit = sv('rect', { x: X(i), y: PAD.t, width: bw, height: H - PAD.t - PAD.b, class: 'al-hit' });
        hit.addEventListener('mouseenter', () => {
          tip.innerHTML = `<b>${day(props.start, i)}</b> · ${name}<br>알람 ${v}건${bad ? ` · <em>평소의 ${F}배 넘음</em>` : ''}`;
          tip.style.left = ((X(i) + bw / 2) / W * 100) + '%'; tip.style.top = (Y(v) / H * 100) + '%'; tip.classList.add('show');
        });
        hit.addEventListener('mouseleave', () => tip.classList.remove('show'));
        svg.append(bar, hit);
      });
      svg.append(sv('line', { x1: PAD.l, x2: W - PAD.r, y1: Y(usual), y2: Y(usual), class: 'al-usual' }));
      const lab = sv('text', { x: W - PAD.r + 6, y: Y(usual) + 4, class: 'al-ax' }); lab.textContent = '평소'; svg.append(lab);

      const week = counts.slice(BASE).reduce((a, v) => a + v, 0), usualWeek = usual * (N - BASE);
      const change = Math.round((week / usualWeek - 1) * 100);
      const row = (k, v) => h('div', { class: 'al-row' }, h('span', {}, k), h('b', {}, v));
      stats.replaceChildren(
        h('div', { class: 'sheet-label' }, `${name} · 이번 주`),
        row('이번 주 알람', `${week}건`), row('평소 한 주', `${Math.round(usualWeek)}건`), row('변화', `${change > 0 ? '+' : ''}${change}%`),
        h('span', { class: 'badge ' + (over.length ? 'bad' : 'ok') }, over.length ? `! 평소 ${F}배 넘은 날 ${over.length}일` : '✓ 평소 수준'),
        h('div', { class: 'sheet-label al-top-label' }, '많이 난 알람'),
        h('ol', { class: 'al-top' }, top.map(([a, n]) => h('li', {}, h('span', {}, a), h('b', {}, `${n}건`)))));
    }

    const panel = demoPanel('report.html 은 이렇게 나오면 됩니다', props.hint);
    panel.append(h('div', { class: 'al-head' }, AX.ui.segmented(names, names[0], draw, { size: 'small' }), h('span', { class: 'al-note' }, '막대에 마우스를 올리면 날짜와 건수')),
      h('div', { class: 'al-grid' }, h('div', { class: 'al-chart' }, svg, tip), h('div', { class: 'sheet al-side' }, stats)), panel.hintEl);
    el.append(panel);
    draw(names[0]);
  }

  AX.demos['alarms'] = { mount };
})();
