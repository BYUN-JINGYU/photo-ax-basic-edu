// 카드 그리드와 그림 (정적 소형 데모)
(function () {
  const { h, fmt } = AX.util;

  // props: { items:[{t, s, tag, hi, say}], cols: 3, foot }
  // 항목에 say 가 있으면 카드를 누를 수 있고, 아래 줄에 그 요청문이 복사 버튼과 함께 나온다
  AX.demos['cards'] = {
    mount(el, props) {
      const items = props.items || [];
      const pickable = items.some(it => it.say);
      const sayText = h('span', { class: 'cards-say-t' });
      const bar = pickable ? h('div', { class: 'cards-say' }, h('span', { class: 'cards-say-l' }, '이렇게 요청'), sayText, AX.ui.copyButton(() => sayText.textContent)) : null;
      const grid = h('div', { class: 'cards', style: `grid-template-columns: repeat(${props.cols || 3}, minmax(0, 1fr))` });
      const cards = items.map(it => h(pickable ? 'button' : 'div', { class: 'card' + (it.hi ? ' hi' : '') + (it.dim ? ' dim' : '') + (pickable ? ' pick' : ''), onclick: pickable ? () => pick(it) : null },
        it.tag ? h('span', { class: 'card-tag' }, it.tag) : null,
        h('div', { class: 'card-t' }, it.t),
        it.s ? h('div', { class: 'card-s', html: fmt(it.s) }) : null));
      function pick(it) { cards.forEach((c, i) => c.classList.toggle('on', items[i] === it)); sayText.textContent = it.say; }
      grid.append(...cards);
      el.append(grid);
      if (bar) { el.append(bar); pick(items.find(it => it.say)); }
      if (props.foot) el.append(h('div', { class: 'cards-foot', html: fmt(props.foot) }));
    }
  };

  // props: { src, caption, height } 또는 { items:[{src, caption}] } (둘 나란히). src 는 빌드 시 data URI 로 바뀐다.
  AX.demos['figure'] = {
    mount(el, props) {
      const one = (it) => [h('img', { src: it.src, alt: it.caption || '' }), it.caption ? h('figcaption', {}, it.caption) : null];
      if (props.items) {
        el.append(h('figure', { class: 'figure two', style: props.height ? `--fig-h:${props.height}px` : '' }, props.items.map(it => h('div', {}, one(it)))));
      } else {
        el.append(h('figure', { class: 'figure', style: props.height ? `--fig-h:${props.height}px` : '' }, one(props)));
      }
    }
  };

})();
