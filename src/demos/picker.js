// 증상 고르기: 왼쪽에서 상황을 고르면 오른쪽에 "이렇게 보이면 → 이렇게 말하세요 → 왜" 가 나온다.
// props: { title, hint, items:[{ label, see, say, why }], labels:[보이는 것, 할 말, 이유] 머리글(생략 가능), compact }
// say 가 없는 항목은 가운데 칸(할 말)을 숨긴다
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const items = props.items || [];
    const [l1, l2, l3] = props.labels || ['이렇게 보이면', '이렇게 말하세요', '왜 통하나'];
    const see = h('div', { class: 'pk-see' });
    const sayText = h('div', { class: 'say-box pk-say' });
    const why = h('div', { class: 'pk-why' });
    const copyBtn = AX.ui.copyButton(() => sayText.textContent, '복사');
    const list = h('div', { class: 'pk-list' });
    const buttons = items.map((it, i) => h('button', { class: 'pk-item', onclick: () => show(i) }, it.label));
    list.append(...buttons);
    const sayLabel = h('div', { class: 'sheet-label pk-gap' }, h('span', {}, l2), copyBtn);
    function show(i) {
      const it = items[i];
      buttons.forEach((b, k) => b.classList.toggle('on', k === i));
      see.innerHTML = fmt(it.see);
      sayText.textContent = it.say || '';
      sayLabel.hidden = sayText.hidden = !it.say;
      why.innerHTML = fmt(it.why);
    }
    const detail = h('div', { class: 'sheet pk-detail' },
      h('div', { class: 'sheet-label' }, l1), see, sayLabel, sayText,
      h('div', { class: 'sheet-label pk-gap' }, l3), why);
    const panel = demoPanel(props.title || '상황 고르기', props.hint);
    panel.append(h('div', { class: 'pk-grid' + (props.compact ? ' compact' : '') }, list, detail), panel.hintEl);
    el.append(panel);
    show(0);
  }

  AX.demos['picker'] = { mount };
})();
