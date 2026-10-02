// 하네스 링: 가운데 모델, 둘레에 모델을 둘러싼 부품들. 누르면 무엇·어디에·언제 배우는지.
(function () {
  const { h, demoPanel } = AX.util;

  const ITEMS = [
    { t: '지시서', k: 'AGENTS.md', what: '매 요청 앞에 붙는 팀 규칙. 짧고 명령형으로.', where: 'ax-day/AGENTS.md', when: '6장' },
    { t: '툴', k: 'MCP', what: 'Datalake 조회처럼 에이전트가 쓸 수 있는 손. 규격이 같아 어디에나 꽂힌다.', where: 'opencode.json 의 mcp', when: '5장' },
    { t: '권한', k: 'permission', what: '파일 수정·명령 실행을 허용 / 묻기 / 금지로 정한다.', where: 'opencode.json 의 permission', when: '6장' },
    { t: '자동화', k: 'Hook', what: '정해진 순간에 자동으로 도는 코드. 위험 명령 차단, 수정 뒤 포맷.', where: '.opencode/plugins/*.js', when: '6장' },
    { t: '재사용', k: 'Skills', what: '한 번 적어 둔 노하우를 에이전트가 알아서 꺼내 쓴다.', where: '.opencode/skills/<이름>/SKILL.md', when: '6장' },
    { t: '단축어', k: 'Commands', what: '자주 쓰는 긴 요청을 /이름 한 단어로.', where: '.opencode/commands/<이름>.md', when: '6장' },
    { t: '역할', k: 'Agents', what: '계획자·구현자·검토자처럼 역할이 정해진 에이전트.', where: '.opencode/agents/<이름>.md', when: '7장' }
  ];

  function mount(el) {
    const panel = demoPanel('모델 주변의 부품들', '같은 모델이라도 이 부품들을 어떻게 짜느냐에 따라 결과가 달라집니다. 이것을 설계하는 일이 하네스 엔지니어링입니다.');
    const ring = h('div', { class: 'hn-ring' });
    const R = 108, CX = 170, CY = 130;
    // 바큇살: 모델에서 각 부품으로
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'hn-spokes'); svg.setAttribute('viewBox', '0 0 340 260'); svg.setAttribute('aria-hidden', 'true');
    const spokes = ITEMS.map((_, i) => {
      const a = -Math.PI / 2 + (i / ITEMS.length) * Math.PI * 2;
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', CX); l.setAttribute('y1', CY);
      l.setAttribute('x2', CX + R * Math.cos(a)); l.setAttribute('y2', CY + R * Math.sin(a));
      svg.append(l); return l;
    });
    ring.append(svg);
    const center = h('div', { class: 'hn-center' }, h('b', {}, 'LLM'), h('span', {}, '사내 모델'));
    ring.append(center);
    const detail = h('div', { class: 'hn-detail' });
    let sel = 0;
    const nodes = ITEMS.map((it, i) => {
      const a = -Math.PI / 2 + (i / ITEMS.length) * Math.PI * 2;
      const n = h('button', { class: 'hn-node', style: `left:${CX + R * Math.cos(a)}px;top:${CY + R * Math.sin(a)}px`, onclick: () => { sel = i; render(); } },
        h('b', {}, it.t), h('span', {}, it.k));
      ring.append(n);
      return n;
    });
    const render = () => {
      nodes.forEach((n, i) => n.classList.toggle('on', i === sel));
      spokes.forEach((l, i) => l.classList.toggle('on', i === sel));
      const it = ITEMS[sel];
      detail.replaceChildren(
        h('div', { class: 'hn-k' }, it.t, h('span', {}, it.k)),
        h('div', { class: 'hn-what' }, it.what),
        h('div', { class: 'hn-meta' }, h('span', {}, '어디에: ', h('code', {}, it.where)), h('span', {}, '배우는 곳: ', it.when)));
    };
    panel.append(h('div', { class: 'hn-grid' }, ring, detail), panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['harness'] = { mount };
})();
