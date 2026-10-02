// 세이브 포인트: 요청 → 커밋 → (깨지면) 되돌리기. 커밋을 건너뛰면 되돌릴 때 무엇을 잃는지 보여 준다.
// props: { file, steps:[{ add, ask, label, breaks?, retry? }], hint }
//  add 는 화면에 생기는 부품(menu · button · result · chart), breaks 면 첫 시도에 화면이 깨진다.
(function () {
  const { h, fmt, demoPanel } = AX.util;
  const NS = 'http://www.w3.org/2000/svg';
  const HASH = ['3f9a1c2', 'a71e0b4', 'c58d3e9', '0b2f7a6', '9e4c1d8', '5d07b3f', 'e2a96c1', '7c3b5e0'];
  const MENU = ['김치찌개', '돈가스', '국밥', '샐러드'];

  // "점심 메뉴 뽑기" 화면 그림. 있는 부품만 그린다
  function scene(features) {
    const has = f => features.includes(f);
    const parts = [];
    if (!features.length) parts.push('<text x="260" y="104" text-anchor="middle" class="sp-txt">빈 화면</text>');
    if (has('menu')) MENU.forEach((m, i) => {
      const x = 24 + (i % 2) * 112, y = 18 + Math.floor(i / 2) * 54;
      parts.push(`<rect x="${x}" y="${y}" width="102" height="44" rx="10" style="fill:var(--quartz);stroke:var(--line)"/><text x="${x + 51}" y="${y + 27}" text-anchor="middle" class="sp-txt dark">${m}</text>`);
    });
    if (has('button')) parts.push(
      '<rect x="24" y="134" width="214" height="36" rx="18" style="fill:var(--acc)"/>',
      '<text x="131" y="157" text-anchor="middle" class="sp-txt on">뽑기</text>');
    if (has('result')) parts.push(
      '<rect x="290" y="18" width="206" height="72" rx="14" style="fill:var(--acc-soft)"/>',
      '<text x="393" y="44" text-anchor="middle" class="sp-txt">오늘 점심은</text>',
      '<text x="393" y="76" text-anchor="middle" class="sp-big">돈가스!</text>');
    if (has('chart')) {
      ['찌개', '돈가스', '국밥', '샐러드'].forEach((m, i) => {
        const v = [3, 5, 2, 1][i], x = 302 + i * 50, hgt = v * 10;
        parts.push(`<rect x="${x}" y="${168 - hgt}" width="30" height="${hgt}" rx="3" style="fill:var(--blue-2)"/><text x="${x + 15}" y="186" text-anchor="middle" class="sp-txt">${m}</text>`);
      });
      parts.push('<line x1="292" y1="168" x2="500" y2="168" style="stroke:var(--line-strong)"/><text x="292" y="110" class="sp-txt">이번 주 뽑힌 횟수</text>');
    }
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 520 196');
    svg.innerHTML = parts.join('');
    return svg;
  }

  function mount(el, props) {
    const steps = props.steps;
    const s = { features: [], broken: false, commits: [], tried: new Set() };
    const view = h('div', { class: 'sp-view' });
    const say = h('div', { class: 'say-box sp-say' });
    const line = h('div', { class: 'sp-line' });
    const next = h('button', { class: 'btn small primary', onclick: ask }, '다음 요청');
    const commitBtn = h('button', { class: 'btn small', onclick: commit }, '커밋해줘');
    const backBtn = h('button', { class: 'btn small', onclick: back }, '되돌려줘');
    const reset = h('button', { class: 'btn small', onclick: start }, '처음부터');

    const last = () => s.commits[s.commits.length - 1];
    const dirty = () => s.broken || last().features.join() !== s.features.join();
    const nextStep = () => steps.find(st => !s.features.includes(st.add));

    function ask() {
      const st = nextStep();
      if (!st) return tell('준비한 요청을 다 했습니다. **처음부터** 로 다시 해 보세요.');
      if (s.broken) return tell('화면이 깨진 상태입니다. 먼저 **되돌려줘**.');
      const first = !s.tried.has(st.add);
      s.tried.add(st.add);
      s.features = [...s.features, st.add];
      s.broken = !!st.breaks && first;
      tell(`나: "${first ? st.ask : st.retry || st.ask}"\n` + (s.broken ? '화면이 깨졌습니다. 앞에서 잘 되던 것까지 안 보입니다.' : '잘 됩니다. 지금이 **커밋할 때**입니다.'));
    }
    function commit() {
      if (s.broken) return tell('깨진 상태는 저장하지 않습니다. **잘 될 때** 커밋합니다.');
      if (!dirty()) return tell('바뀐 것이 없어 저장할 것이 없습니다.');
      const st = steps.find(x => x.add === s.features[s.features.length - 1]);
      const hash = HASH[s.commits.length % HASH.length];
      s.commits.push({ hash, msg: st.label, features: [...s.features] });
      tell(`나: "커밋해줘"\n에이전트: \`git commit -m "${st.label}"\` → 세이브 포인트 \`${hash}\``);
    }
    function back() {
      if (!dirty()) return tell('마지막 세이브 포인트와 같습니다. 되돌릴 것이 없습니다.');
      const lost = s.features.filter(f => !last().features.includes(f) && !(s.broken && f === s.features[s.features.length - 1]));
      s.features = [...last().features];
      s.broken = false;
      tell(`나: "되돌려줘"\n\`${last().hash}\` "${last().msg}" 로 돌아갔습니다.` + (lost.length ? ` 커밋 안 한 **${lost.map(f => steps.find(x => x.add === f).label).join(', ')}** 도 같이 사라졌습니다.` : ''));
    }
    function tell(t) { say.innerHTML = fmt(t); draw(); }
    function draw() {
      view.replaceChildren(scene(s.features), h('div', { class: 'sp-broken' }, '화면이 하얗게 나옵니다', h('code', {}, 'TypeError: chart is undefined')));
      view.classList.toggle('broken', s.broken);
      const rows = [...s.commits].reverse().map((c, i) => h('div', { class: 'sp-pt' + (i === 0 ? ' head' : '') }, h('span', {}, c.msg), h('b', {}, c.hash)));
      if (dirty()) rows.unshift(h('div', { class: 'sp-pt dirty' }, h('span', {}, s.broken ? '지금: 깨짐 (저장 안 됨)' : '지금: 저장 안 됨'), h('b', {}, '커밋하면 점이 생깁니다')));
      line.replaceChildren(...rows);
      next.disabled = !nextStep();
    }
    function start() {
      Object.assign(s, { features: [], broken: false, tried: new Set(), commits: [{ hash: HASH[HASH.length - 1], msg: '빈 폴더에서 시작', features: [] }] });
      tell('**다음 요청** 을 눌러 시작하세요. 잘 되면 **커밋해줘**, 깨지면 **되돌려줘**.');
    }

    const panel = demoPanel('세이브 포인트 연습', props.hint);
    panel.append(h('div', { class: 'sp-grid' },
      h('div', {}, h('div', { class: 'sp-screen' }, h('div', { class: 'sp-bar' }, h('i'), h('i'), h('i'), props.file || 'simulator.html'), view),
        h('div', { class: 'sp-acts' }, next, commitBtn, backBtn, reset), say),
      h('div', { class: 'sheet' }, h('div', { class: 'sheet-label' }, '세이브 포인트 (최근이 위)'), line)), panel.hintEl);
    el.append(panel);
    start();
  }

  AX.demos['savepoints'] = { mount };
})();
