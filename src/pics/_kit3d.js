// 입체 도형과 순서도 도형. _kit.js 다음에 읽힌다 (AX.pic 에 덧붙인다).
// 입체는 비스듬히 본 모양: 윗면은 오른쪽 위로, 옆면은 오른쪽으로. 면 색은 pics.css 의 f3·t3·s3 클래스.
(function () {
  const P = AX.pic, { T } = P;
  const D = (d) => [d, d * 0.6];          // 깊이 d → (오른쪽, 위)

  // 바닥 그림자
  const shadow = (x, y, w, h, d = 12) => `<ellipse cx="${x + w / 2 + d / 2}" cy="${y + h + 4}" rx="${w / 2 + d / 2}" ry="${Math.max(4, d * 0.45)}" class="shd"/>`;

  // 상자 (앞면·윗면·옆면). t·s 는 앞면 가운데 글자
  function block(x, y, w, h, { t, s, c = 'line', d = 14, ts = 15, shade = true, r = 6 } = {}) {
    const [dx, dy] = D(d);
    const on = c === 'acc' || c === 'dark';
    return '<g class="blk">' + (shade ? shadow(x, y, w, h, d) : '') +
      `<path d="M${x} ${y} l${dx} ${-dy} h${w} l${-dx} ${dy} z" class="t3 ${c}"/>` +
      `<path d="M${x + w} ${y} l${dx} ${-dy} v${h} l${-dx} ${dy} z" class="s3 ${c}"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(r, 3)}" class="f3 ${c}"/>` +
      (t ? T(x + w / 2, s ? y + h / 2 - 3 : y + h / 2 + ts * 0.35, t, { size: ts, c: on ? 'w' : 't', w: 700 }) : '') +
      (s ? T(x + w / 2, y + h / 2 + 15, s, { size: 12, c: on ? 'w' : 'm' }) : '') + '</g>';
  }
  // 얇은 판 (층을 쌓을 때)
  const slab = (x, y, w, h, o = {}) => block(x, y, w, h, { d: 10, shade: false, ...o });

  // 원통 (DB, 저장 동전)
  function cyl(x, y, w, h, { t, s, c = 'soft' } = {}) {
    const e = Math.max(6, w * 0.14);
    return `<g class="blk"><ellipse cx="${x + w / 2 + 4}" cy="${y + h + 4}" rx="${w / 2 + 4}" ry="${e * 0.7}" class="shd"/>` +
      `<path d="M${x} ${y + e} v${h - e} a${w / 2} ${e} 0 0 0 ${w} 0 v${-(h - e)}" class="f3 ${c}"/>` +
      `<path d="M${x + w * 0.85} ${y + e * 1.9} v${h - e * 1.6}" class="hl"/>` +
      `<ellipse cx="${x + w / 2}" cy="${y + e}" rx="${w / 2}" ry="${e}" class="t3 ${c}"/>` +
      (t ? T(x + w / 2, y + h / 2 + e * 0.6, t, { size: 14, w: 700, c: c === 'acc' ? 'w' : 't' }) : '') +
      (s ? T(x + w / 2, y + h / 2 + e * 0.6 + 16, s, { size: 11, c: c === 'acc' ? 'w' : 'm' }) : '') + '</g>';
  }
  // 서버 한 대 (상자 + 슬롯 + 불빛)
  function server(x, y, w, h, { t, c = 'line', n = 3 } = {}) {
    let s = '<g class="blk">' + block(x, y, w, h, { c, d: 14 });
    for (let i = 0; i < n; i++) {
      const yy = y + 12 + i * ((h - 24) / n);
      s += `<rect x="${x + 10}" y="${yy}" width="${w - 20}" height="${(h - 24) / n - 6}" rx="3" class="pb mist"/><circle cx="${x + w - 18}" cy="${yy + ((h - 24) / n - 6) / 2}" r="3" class="led"/>`;
    }
    return s + (t ? T(x + w / 2 + 7, y + h + 26, t, { size: 13, w: 700 }) : '') + '</g>';
  }
  // 모니터 (화면 안 글자 lines: [[글, 색]])
  function monitor(x, y, w, h, { t, lines = [], dark = true } = {}) {
    let s = `<g class="blk"><rect x="${x + w / 2 - 8}" y="${y + h}" width="16" height="14" class="pb mist"/>` +
      `<ellipse cx="${x + w / 2}" cy="${y + h + 16}" rx="${w * 0.22}" ry="5" class="pb mist"/>` +
      block(x, y, w, h, { c: 'line', d: 8, shade: false, r: 8 }) +
      `<rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="4" class="pb ${dark ? 'dark' : 'soft'}"/>`;
    lines.forEach(([l, c], i) => { s += T(x + 16, y + 26 + i * 17, l, { size: 12, c: c || 'w', a: 'start', mono: true }); });
    return s + (t ? T(x + w / 2, y + h + 40, t, { size: 13, w: 700 }) : '') + '</g>';
  }
  // 구름 (회사 밖)
  function cloud(x, y, w, h, { t, s, c = 'mist' } = {}) {
    const r = h * 0.42;
    return `<g class="cloud ${c}"><circle cx="${x + w * 0.28}" cy="${y + h * 0.58}" r="${r}"/><circle cx="${x + w * 0.52}" cy="${y + h * 0.42}" r="${r * 1.2}"/>` +
      `<circle cx="${x + w * 0.74}" cy="${y + h * 0.6}" r="${r * 0.95}"/><rect x="${x + w * 0.16}" y="${y + h * 0.55}" width="${w * 0.7}" height="${h * 0.42}" rx="${h * 0.2}"/></g>` +
      (t ? T(x + w / 2, y + h * 0.66, t, { size: 14, w: 700 }) : '') + (s ? T(x + w / 2, y + h * 0.66 + 17, s, { size: 11, c: 'm' }) : '');
  }
  // 순서도: 판단(마름모), 시작·끝(알약), 번호
  const diamond = (cx, cy, w, h, { t, c = 'warn', ts = 13 } = {}) =>
    `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" class="pb ${c} dia"/>` +
    (t ? T(cx, cy + ts * 0.35 - (t.includes('\n') ? ts * 0.65 : 0), t, { size: ts, w: 700 }) : '');
  const stadium = (x, y, w, h, { t, c = 'acc', ts = 14 } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" class="pb ${c}"/>` + (t ? T(x + w / 2, y + h / 2 + ts * 0.35, t, { size: ts, w: 700, c: c === 'acc' ? 'w' : 't' }) : '');
  const num = (cx, cy, n, { c = 'acc', r = 12 } = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" class="pb ${c}"/>` + T(cx, cy + r * 0.42, String(n), { size: r * 1.15, w: 800, c: c === 'acc' ? 'w' : 'a' });
  // 굽은 화살표 (2차 곡선)
  function curve(x1, y1, qx, qy, x2, y2, { c = 'a', dash = false, label, lx, ly } = {}) {
    const ang = Math.atan2(y2 - qy, x2 - qx), L = 9, W = 5;
    const hp = [[x2, y2], [x2 - L * Math.cos(ang) + W * Math.sin(ang), y2 - L * Math.sin(ang) - W * Math.cos(ang)], [x2 - L * Math.cos(ang) - W * Math.sin(ang), y2 - L * Math.sin(ang) + W * Math.cos(ang)]];
    return `<path d="M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}" class="pl ${c}${dash ? ' dash' : ' draw'}"${dash ? '' : ' pathLength="1"'}/>` +
      `<polygon points="${hp.map(q => q.join(',')).join(' ')}" class="ph ${c}"/>` +
      (label ? T(lx ?? qx, ly ?? qy, label, { size: 12, c: c === 'a' ? 'a' : c === 'bad' ? 'bad' : 'm', w: 700 }) : '');
  }
  // 예/아니오 꼬리표
  const yes = (x, y, s = '예') => P.pill(x, y, s, { c: 'ok', size: 11, a: 'middle' });
  const no = (x, y, s = '아니오') => P.pill(x, y, s, { c: 'bad', size: 11, a: 'middle' });

  // 아이콘 타일 2×2 (입체). items: [[아이콘, 제목, 부제]]
  const tiles = items => P.svg(420, 350, items.map(([ic, t, s], i) => {
    const x = (i % 2) * 214, y = 14 + Math.floor(i / 2) * 172;
    return '<g class="blk">' + block(x, y, 190, 150, {}) + P.icon(ic, x + 95, y + 52, 24) + T(x + 95, y + 104, t, { size: 17, w: 700 }) + T(x + 95, y + 127, s, { size: 12, c: 'm' }) + '</g>';
  }));

  Object.assign(AX.pic, { shadow, block, slab, cyl, server, monitor, cloud, diamond, stadium, num, curve, yes, no, tiles });
})();
