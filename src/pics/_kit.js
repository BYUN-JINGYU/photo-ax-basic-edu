// 슬라이드 그림(pic)용 작은 도구. 그림 하나 = AX.pics[이름] = () => svg 요소.
// 색은 CSS 클래스(pics.css)로만 정한다: 상자 line·soft·acc·dark·mist·ok·bad·warn, 글자 t·m·a·w·ok·bad
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const isWide = ch => /[ᄀ-￿]/.test(ch);
  const tw = (s, size) => [...String(s)].reduce((a, ch) => a + (isWide(ch) ? size : size * 0.58), 0);

  function svg(w, h, parts) {
    const el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', `0 0 ${w} ${h}`);
    el.setAttribute('class', 'pic');
    el.setAttribute('role', 'img');
    el.innerHTML = parts.join('');
    // 등장 순서: 맨 바깥 상자부터 차례로 (pics.css 의 --i)
    [...el.querySelectorAll('.blk')].filter(g => !g.parentElement.closest('.blk')).forEach((g, i) => g.style.setProperty('--i', i));
    return el;
  }
  // 글자. \n 이면 줄을 나눈다
  function T(x, y, s, { size = 14, c = 't', w = 400, a = 'middle', mono = false, lh = 1.35 } = {}) {
    return String(s).split('\n').map((line, i) =>
      `<text x="${x}" y="${y + i * size * lh}" class="pt ${c}${mono ? ' mono' : ''}" font-size="${size}" font-weight="${w}" text-anchor="${a}">${esc(line)}</text>`).join('');
  }
  // 상자 + 가운데 제목·부제
  function box(x, y, w, h, { t, s, c = 'line', r = 12, ts = 15 } = {}) {
    const on = c === 'acc' || c === 'dark';
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="pb ${c}"/>` +
      (t ? T(x + w / 2, s ? y + h / 2 - 3 : y + h / 2 + ts * 0.35, t, { size: ts, c: on ? 'w' : 't', w: 700 }) : '') +
      (s ? T(x + w / 2, y + h / 2 + 15, s, { size: 12, c: on ? 'w' : 'm' }) : '');
  }
  // 화살표 (점 여러 개면 꺾인 선). 끝에 삼각형 머리
  function arrow(pts, { c = 'a', dash = false, label, lx, ly, head = true } = {}) {
    const p = pts.map(([x, y]) => `${x},${y}`).join(' ');
    const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
    const ang = Math.atan2(y2 - y1, x2 - x1), L = 9, W = 5;
    const hp = [[x2, y2], [x2 - L * Math.cos(ang) + W * Math.sin(ang), y2 - L * Math.sin(ang) - W * Math.cos(ang)], [x2 - L * Math.cos(ang) - W * Math.sin(ang), y2 - L * Math.sin(ang) + W * Math.cos(ang)]];
    return `<polyline points="${p}" class="pl ${c}${dash ? ' dash' : ' draw'}"${dash ? '' : ' pathLength="1"'}/>` +
      (head ? `<polygon points="${hp.map(q => q.join(',')).join(' ')}" class="ph ${c}"/>` : '') +
      (label ? T(lx ?? (x1 + x2) / 2, ly ?? (y1 + y2) / 2 - 8, label, { size: 12, c: c === 'a' ? 'a' : 'm', w: 700 }) : '');
  }
  // 문서 한 장 (접힌 귀퉁이 + 회색 줄)
  function doc(x, y, w, h, { t, lines = 3, c = 'line', hi = -1 } = {}) {
    const f = 14;
    let s = `<path d="M${x} ${y + 6} q0 -6 6 -6 h${w - f - 6} l${f} ${f} v${h - f - 6} q0 6 -6 6 h${-(w - 12)} q-6 0 -6 -6 z" class="pb ${c}"/>` +
      `<path d="M${x + w - f} ${y} v${f} h${f}" class="pl m" />`;
    if (t) s += T(x + 10, y + 20, t, { size: 12, c: c === 'acc' ? 'w' : 't', w: 700, a: 'start', mono: true });
    for (let i = 0; i < lines; i++) s += `<rect x="${x + 10}" y="${y + 30 + i * 11}" width="${(w - 20) * (i === lines - 1 ? 0.6 : 1)}" height="5" rx="2" class="pb ${i === hi ? 'acc' : 'mist'}"/>`;
    return s;
  }
  // 폴더
  function folder(x, y, w, h, { t, c = 'soft' } = {}) {
    return `<path d="M${x} ${y + 8} q0 -8 8 -8 h${w * 0.32} l10 10 h${w * 0.68 - 26} q8 0 8 8 v${h - 18} q0 8 -8 8 h${-(w - 16)} q-8 0 -8 -8 z" class="pb ${c}"/>` +
      (t ? T(x + 14, y + 30, t, { size: 14, w: 700, a: 'start' }) : '');
  }
  // 창 (윗줄 점 세 개)
  function win(x, y, w, h, { t = '', dark = false } = {}) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="pb ${dark ? 'dark' : 'line'}"/>` +
      `<path d="M${x} ${y + 24} h${w}" class="pl m"/>` +
      [0, 1, 2].map(i => `<circle cx="${x + 14 + i * 12}" cy="${y + 12}" r="3.5" class="pb mist"/>`).join('') +
      (t ? T(x + w / 2, y + 16, t, { size: 11, c: dark ? 'w' : 'm' }) : '');
  }
  // 사람
  function person(cx, cy, { t, c = 'acc', size = 1 } = {}) {
    const r = 9 * size;
    return `<circle cx="${cx}" cy="${cy - 12 * size}" r="${r}" class="pb ${c}"/>` +
      `<path d="M${cx - 15 * size} ${cy + 16 * size} q0 -16 ${15 * size} -16 q${15 * size} 0 ${15 * size} 16 z" class="pb ${c}"/>` +
      (t ? T(cx, cy + 34 * size, t, { size: 13, w: 700 }) : '');
  }
  // 말풍선
  function bubble(x, y, w, h, { t, tail = 'l', c = 'soft', size = 13 } = {}) {
    const tx = tail === 'l' ? x + 18 : x + w - 18;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="pb ${c}"/>` +
      `<path d="M${tx - 6} ${y + h - 1.5} l${tail === 'l' ? -4 : 4} 11 l10 -11 z" class="pb ${c} notop"/>` +
      (t ? T(x + w / 2, y + h / 2 + size * 0.35, t, { size, c: c === 'acc' ? 'w' : 'a', w: 600 }) : '');
  }
  // 알약 모양 꼬리표
  function pill(x, y, s, { c = 'soft', size = 12, a = 'start' } = {}) {
    const w = tw(s, size) + 18, x0 = a === 'middle' ? x - w / 2 : x;
    return `<rect x="${x0}" y="${y}" width="${w}" height="${size + 10}" rx="${(size + 10) / 2}" class="pb ${c}"/>` +
      T(x0 + w / 2, y + size + 2, s, { size, c: c === 'acc' ? 'w' : c === 'ok' ? 'ok' : c === 'bad' ? 'bad' : 'a', w: 700 });
  }
  // DB 원통
  function db(x, y, w, h, { t, s } = {}) {
    const e = 10;
    return `<path d="M${x} ${y + e} v${h - 2 * e} a${w / 2} ${e} 0 0 0 ${w} 0 v${-(h - 2 * e)}" class="pb soft"/>` +
      `<ellipse cx="${x + w / 2}" cy="${y + e}" rx="${w / 2}" ry="${e}" class="pb soft"/>` +
      (t ? T(x + w / 2, y + h / 2 + 8, t, { size: 14, w: 700 }) : '') + (s ? T(x + w / 2, y + h / 2 + 24, s, { size: 11, c: 'm' }) : '');
  }
  // 키보드 키
  function key(x, y, s, w = 44) {
    return `<rect x="${x}" y="${y + 3}" width="${w}" height="40" rx="8" class="pb mist"/><rect x="${x}" y="${y}" width="${w}" height="38" rx="8" class="pb line"/>` +
      T(x + w / 2, y + 25, s, { size: 15, w: 700 });
  }
  // 아이콘 (cx, cy 가운데, r 반지름)
  const ICONS = {
    check: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="pb ok"/><path d="M${x - r * .45} ${y} l${r * .3} ${r * .32} l${r * .55} ${-r * .6}" class="pl ok thick"/>`,
    cross: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="pb bad"/><path d="M${x - r * .35} ${y - r * .35} l${r * .7} ${r * .7} M${x + r * .35} ${y - r * .35} l${-r * .7} ${r * .7}" class="pl bad thick"/>`,
    plus: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="pb soft"/><path d="M${x - r * .45} ${y} h${r * .9} M${x} ${y - r * .45} v${r * .9}" class="pl a thick"/>`,
    lock: (x, y, r) => `<rect x="${x - r * .6}" y="${y - r * .1}" width="${r * 1.2}" height="${r}" rx="${r * .15}" class="pb acc"/><path d="M${x - r * .35} ${y - r * .1} v${-r * .3} a${r * .35} ${r * .35} 0 0 1 ${r * .7} 0 v${r * .3}" class="pl a thick"/>`,
    shield: (x, y, r) => `<path d="M${x} ${y - r} l${r * .85} ${r * .3} v${r * .5} q0 ${r * .8} ${-r * .85} ${r * 1.2} q${-r * .85} ${-r * .4} ${-r * .85} ${-r * 1.2} v${-r * .5} z" class="pb soft"/><path d="M${x - r * .35} ${y} l${r * .25} ${r * .28} l${r * .5} ${-r * .55}" class="pl a thick"/>`,
    search: (x, y, r) => `<circle cx="${x - r * .15}" cy="${y - r * .15}" r="${r * .55}" class="pl a thick" fill="none"/><path d="M${x + r * .25} ${y + r * .25} l${r * .5} ${r * .5}" class="pl a thick"/>`,
    hand: (x, y, r) => `<path d="M${x - r * .5} ${y + r * .8} v${-r * 1.1} q0 -${r * .2} ${r * .18} -${r * .2} q${r * .18} 0 ${r * .18} ${r * .2} v${-r * .5} q0 -${r * .2} ${r * .18} -${r * .2} q${r * .18} 0 ${r * .18} ${r * .2} v${r * .4} q0 -${r * .2} ${r * .18} -${r * .2} q${r * .18} 0 ${r * .18} ${r * .2} v${r * .6} q${r * .3} -${r * .3} ${r * .4} 0 l-${r * .3} ${r * 1.2} z" class="pb soft"/>`,
    clock: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="pb soft"/><path d="M${x} ${y - r * .55} v${r * .55} l${r * .4} ${r * .25}" class="pl a thick"/>`,
    flag: (x, y, r) => `<path d="M${x - r * .4} ${y + r} v${-r * 2}" class="pl a thick"/><path d="M${x - r * .4} ${y - r} h${r * 1.1} l-${r * .3} ${r * .4} l${r * .3} ${r * .4} h-${r * 1.1} z" class="pb acc"/>`,
    save: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * .55}" class="pb acc"/><circle cx="${x}" cy="${y}" r="${r * .9}" class="pl a" fill="none"/>`,
    equal: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="pb soft"/><path d="M${x - r * .45} ${y - r * .2} h${r * .9} M${x - r * .45} ${y + r * .2} h${r * .9}" class="pl a thick"/>`,
    link: (x, y, r) => `<rect x="${x - r * .9}" y="${y - r * .3}" width="${r}" height="${r * .6}" rx="${r * .3}" class="pl a thick" fill="none"/><rect x="${x - r * .1}" y="${y - r * .3}" width="${r}" height="${r * .6}" rx="${r * .3}" class="pl a thick" fill="none"/>`,
    redo: (x, y, r) => `<path d="M${x + r * .6} ${y - r * .2} a${r * .6} ${r * .6} 0 1 0 ${r * .1} ${r * .6}" class="pl a thick" fill="none"/><path d="M${x + r * .35} ${y - r * .6} l${r * .3} ${r * .4} l-${r * .45} ${r * .1} z" class="ph a"/>`
  };
  const icon = (name, x, y, r = 16) => ICONS[name](x, y, r);

  AX.pic = { svg, T, box, arrow, doc, folder, win, person, bubble, pill, db, key, icon, tw };
  AX.pics = {};
})();
