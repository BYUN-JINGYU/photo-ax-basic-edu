// 역할 릴레이: 계획자 → 구현자 → 검토자 → 구현자. 한 단계씩 넘기며 누가 무엇을 넘기는지 본다.
// props: { roles:[{ name, sub }], steps:[{ who, title, lines:[줄], badge:{ text, cls } }] } who 가 -1 이면 사용자
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const roles = [{ name: '사용자', sub: '요청·확인' }, ...props.roles];
    const cards = roles.map(r => h('div', { class: 'rl-role' }, h('b', {}, r.name), h('span', {}, r.sub)));
    const lane = h('div', { class: 'rl-lane' });
    cards.forEach((c, i) => { if (i > 0) lane.append(h('div', { class: 'rl-arrow' }, '→')); lane.append(c); });
    const title = h('div', { class: 'rl-title' });
    const badge = h('span');
    const body = h('div', { class: 'rl-body' });

    const stepper = AX.ui.stepper(props.steps.length, i => {
      const s = props.steps[i];
      cards.forEach((c, k) => { c.classList.toggle('now', k === s.who + 1); });
      title.replaceChildren(h('span', { class: 'rl-who' }, roles[s.who + 1].name), s.title);
      badge.className = s.badge ? 'badge ' + s.badge.cls : '';
      badge.textContent = s.badge ? s.badge.text : '';
      body.replaceChildren(...s.lines.map(t => h('div', { class: 'rl-line' + (t.startsWith('→') ? ' tool' : ''), html: fmt(t) })));
    });

    const panel = demoPanel('기능 하나를 팀으로', props.hint);
    panel.append(lane, h('div', { class: 'sheet rl-sheet' }, h('div', { class: 'rl-head' }, title, badge), body), stepper.el, panel.hintEl);
    el.append(panel);
    stepper.go(0);
  }

  AX.demos['relay'] = { mount };
})();
