// 요청문 카드: 복사 버튼 + (선택) 4요소 해부. 칩을 누르면 요청문에서 그 부분이 칠해진다.
// props: { title, text, extra:{ label, text }, hint, parts:[{ label, match:[문자열], note }] }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  // text 를 [{ s, p }] 조각으로 나눈다. p 는 해당하는 요소 번호(없으면 -1)
  function segment(text, parts) {
    const marks = [];
    (parts || []).forEach((pt, p) => pt.match.forEach(m => {
      const at = text.indexOf(m);
      if (at >= 0) marks.push({ a: at, b: at + m.length, p });
    }));
    marks.sort((x, y) => x.a - y.a);
    const out = []; let pos = 0;
    marks.forEach(m => { if (m.a < pos) return; if (m.a > pos) out.push({ s: text.slice(pos, m.a), p: -1 }); out.push({ s: text.slice(m.a, m.b), p: m.p }); pos = m.b; });
    if (pos < text.length) out.push({ s: text.slice(pos), p: -1 });
    return out;
  }
  const textBlock = (text, parts, cls) => h('pre', { class: 'pc-text ' + (cls || '') },
    segment(text, parts).map(g => g.p < 0 ? g.s : h('span', { class: 'pp', 'data-p': g.p }, g.s)));

  function mount(el, props) {
    const panel = demoPanel(props.title || '요청문', props.hint);
    const pre = textBlock(props.text, props.parts);
    panel.querySelector('.demo-head').append(h('span', { class: 'spacer' }), AX.ui.copyButton(() => pre.textContent, '복사해서 붙여넣기', 'btn small primary'));

    if (props.parts) {
      const note = h('span', { class: 'pp-note' });
      const chips = props.parts.map((pt, p) => h('button', { class: 'pp-chip', onclick: () => light(p) }, pt.label));
      function light(p) {
        chips.forEach((c, k) => c.classList.toggle('on', k === p));
        panel.querySelectorAll('.pp').forEach(s => s.classList.toggle('lit', +s.dataset.p === p));
        note.innerHTML = fmt(props.parts[p].note);
      }
      panel.append(h('div', { class: 'pp-row' }, h('span', { class: 'pp-l' }, '4요소 찾기'), chips, note));
      panel.append(pre);
      light(0);
    } else panel.append(pre);

    if (props.extra) {
      const ex = textBlock(props.extra.text, props.parts, 'extra');
      panel.append(h('div', { class: 'pc-extra-label row', style: 'justify-content:space-between' }, h('span', {}, props.extra.label), AX.ui.copyButton(() => ex.textContent)), ex);
      if (props.parts) panel.querySelectorAll('.pp').forEach(s => s.classList.toggle('lit', +s.dataset.p === 0));
    }
    if (panel.hintEl) panel.append(panel.hintEl);
    el.append(panel);
  }

  AX.demos['promptcard'] = { mount };
})();
