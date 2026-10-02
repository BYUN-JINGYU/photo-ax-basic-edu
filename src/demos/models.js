// 사내 모델 고르기: 왼쪽에서 할 일을 고르면 오른쪽 모델 카드 중 하나가 켜지고 이유가 나온다.
// props: { list:[{ id, name, sub, tag, line, score }], tasks:[{ t, pick, why }], first, hint }  보통 AX.site.models 를 그대로 넘긴다
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const cards = Object.fromEntries(props.list.map(m => [m.id, h('div', { class: 'md-card' },
      h('div', { class: 'md-top' }, h('b', {}, m.name), h('span', {}, m.sub), h('span', { class: 'badge' }, m.tag)),
      h('div', { class: 'md-line' }, m.line),
      h('div', { class: 'md-score' }, m.score))]));
    const why = h('div', { class: 'say-box md-why' });
    const buttons = props.tasks.map((t, i) => h('button', { class: 'md-task', onclick: () => pick(i) }, t.t));

    function pick(i) {
      const t = props.tasks[i], m = props.list.find(x => x.id === t.pick);
      buttons.forEach((b, k) => b.classList.toggle('on', k === i));
      Object.entries(cards).forEach(([id, c]) => c.classList.toggle('on', id === t.pick));
      why.innerHTML = fmt(`**${m.name}** · ${t.why}\n입력창에서 \`/models\` → ${m.name}`);
    }

    const panel = demoPanel('이럴 땐 어떤 모델?', props.hint);
    panel.append(h('div', { class: 'md-grid' },
      h('div', { class: 'md-tasks' }, buttons),
      h('div', { class: 'md-right' }, h('div', { class: 'md-cards' }, Object.values(cards)), why)), panel.hintEl);
    el.append(panel);
    pick(props.first || 0);
  }

  AX.demos['models'] = { mount };
})();
