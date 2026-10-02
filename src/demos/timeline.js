// 연표: 해를 누르면 그해에 무엇이 바뀌었는지 나온다. 지난 해는 채우고 고른 해는 진하게.
// props: { items:[{ year, title, text, tag }], first }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const items = props.items;
    const title = h('div', { class: 'tl-title' });
    const text = h('div', { class: 'tl-text' });
    const tag = h('span', { class: 'badge acc' });
    const dots = items.map((it, i) => h('button', { class: 'tl-dot', onclick: () => show(i) }, h('i'), h('b', {}, it.year), h('span', {}, it.tag || '')));
    function show(i) {
      dots.forEach((d, k) => { d.classList.toggle('past', k < i); d.classList.toggle('now', k === i); });
      title.textContent = items[i].title;
      text.innerHTML = fmt(items[i].text);
      tag.textContent = items[i].year;
    }
    const panel = demoPanel('LLM 까지 걸어온 길', props.hint);
    panel.append(h('div', { class: 'tl-track', style: `grid-template-columns: repeat(${items.length}, 1fr)` }, dots),
      h('div', { class: 'sheet tl-sheet' }, h('div', { class: 'tl-head' }, tag, title), text), panel.hintEl);
    el.append(panel);
    show(props.first ?? 0);
  }

  AX.demos['timeline'] = { mount };
})();
