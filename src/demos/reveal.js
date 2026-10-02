// 뒤집기 카드: 앞면(문제)을 누르면 뒷면(처방)이 나온다. 다 뒤집으면 한 줄 정리가 나온다.
// props: { items:[{ front, back, tag }], done }
(function () {
  const { h, fmt, esc } = AX.util;

  function mount(el, props) {
    const items = props.items || [];
    const opened = new Set();
    const done = h('div', { class: 'rv-done', html: fmt(props.done || '') });
    const grid = h('div', { class: 'rv-grid', style: `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))` });
    items.forEach((it, i) => {
      const card = h('button', { class: 'rv-card', 'aria-pressed': 'false', onclick: () => {
        const on = !card.classList.contains('on');
        card.classList.toggle('on', on); card.setAttribute('aria-pressed', on);
        on ? opened.add(i) : opened.delete(i);
        done.classList.toggle('show', opened.size === items.length);
      } },
        h('span', { class: 'rv-tag' }, it.tag || `증상 ${i + 1}`),
        h('span', { class: 'rv-front', html: esc(it.front).replace(/\n/g, '<br>') }),
        h('span', { class: 'rv-back' }, h('span', { class: 'rv-arrow' }, '처방'), h('span', { html: fmt(it.back) })),
        h('span', { class: 'rv-tap' }, '눌러서 처방 보기'));
      grid.append(card);
    });
    el.append(grid, done);
  }

  AX.demos['reveal'] = { mount };
})();
