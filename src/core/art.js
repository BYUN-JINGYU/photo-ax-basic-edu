// 표지·홈의 그림: 웨이퍼 샷맵(장이 지날수록 샷이 노광된다).
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, ...kids) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    for (const k of kids) el.append(k);
    return el;
  }
  let uid = 0;

  // 웨이퍼 샷맵: 300 mm 웨이퍼에 26×33 mm 샷을 지그재그 순서로 찍는다.
  // n/total 만큼 노광, 이번 장 몫은 진하게. animate 면 처음부터 끝까지 장 순서대로 색이 짙어지며 찍힌다(홈)
  function wafer({ n = 0, total = 8, w = 420, h = 380, animate = false } = {}) {
    const id = 'wf' + (uid++);
    const svg = sv('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h, class: 'wafer', 'aria-hidden': 'true' });
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10, s = R / 150;
    const SW = 26 * s, SH = 33 * s;
    const shots = [];
    for (let j = -5; j <= 5; j++) {
      const row = [];
      for (let i = -6; i <= 6; i++) {
        const x = cx + i * SW - SW / 2, y = cy + j * SH - SH / 2;
        const nx = Math.max(x, Math.min(cx, x + SW)), ny = Math.max(y, Math.min(cy, y + SH));
        if (Math.hypot(nx - cx, ny - cy) < R * 0.96) row.push({ x, y });
      }
      if ((j + 5) % 2) row.reverse();           // 지그재그: 줄마다 방향을 바꾼다
      shots.push(...row);
    }
    svg.append(sv('defs', {}, sv('clipPath', { id: id + 'c' }, sv('circle', { cx, cy, r: R }))));
    svg.append(sv('circle', { cx, cy, r: R, class: 'wf-disc' }));
    const g = sv('g', { 'clip-path': `url(#${id}c)` });
    const done = Math.round(shots.length * (n - 1) / total), upto = Math.round(shots.length * n / total);
    shots.forEach((p, k) => {
      const r = sv('rect', { x: p.x + 1, y: p.y + 1, width: SW - 2, height: SH - 2, rx: 2, class: 'wf-shot' });
      if (animate) {
        const step = Math.floor(k / shots.length * total);            // 몇 장째 몫인가
        r.style.setProperty('--shade', `${45 + step * 55 / (total - 1)}%`);
        r.style.transitionDelay = `${k * 14}ms`;
      } else if (k < done) r.classList.add('done');
      else if (k < upto) r.classList.add('now');
      g.append(r);
    });
    svg.append(g);
    // 노치: 아래쪽 V 홈
    svg.append(sv('path', { d: `M${cx - 7} ${cy + R + 1} L${cx} ${cy + R - 8} L${cx + 7} ${cy + R + 1} Z`, class: 'wf-notch' }));
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => g.querySelectorAll('.wf-shot').forEach(r => r.classList.add('lit'))));
    return svg;
  }

  AX.art = { wafer };
})();
