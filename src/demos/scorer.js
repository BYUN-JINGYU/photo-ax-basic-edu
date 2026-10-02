// 과제 점수기: 기준에 체크하면 몇 개 해당하는지와 판정이 바로 나온다. 예시를 누르면 미리 체크된다.
// props: { criteria:[{ t, s }], examples:[{ name, hits:[0|1…] }], verdicts:[{ min, title, text }] (min 큰 것부터), placeholder }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const crit = props.criteria || [];
    const hits = crit.map(() => false);
    const task = h('input', { type: 'text', class: 'sc-task', placeholder: props.placeholder || '내 업무를 한 줄로' });
    const rows = crit.map((c, i) => {
      const box = h('input', { type: 'checkbox', onchange: () => { hits[i] = box.checked; draw(); } });
      return { box, el: h('label', { class: 'sc-row' }, box, h('span', {}, h('b', {}, c.t), h('span', { class: 'sc-s' }, c.s))) };
    });
    const ex = h('div', { class: 'sc-ex' }, h('span', { class: 'sc-ex-l' }, '예시'), (props.examples || []).map(e =>
      h('button', { class: 'btn small', onclick: () => { task.value = e.name; e.hits.forEach((v, i) => { hits[i] = !!v; rows[i].box.checked = !!v; }); draw(); } }, e.name)));
    const big = h('div', { class: 'sc-big num' });
    const segs = h('div', { class: 'sc-segs' }, crit.map(() => h('i')));
    const title = h('div', { class: 'sc-title' });
    const text = h('div', { class: 'sc-text' });

    function draw() {
      const n = hits.filter(Boolean).length;
      big.replaceChildren(String(n), h('span', {}, ` / ${crit.length}`));
      segs.querySelectorAll('i').forEach((s, i) => s.classList.toggle('on', i < n));
      const v = (props.verdicts || []).find(x => n >= x.min) || { title: '', text: '' };
      title.textContent = v.title;
      text.innerHTML = fmt(v.text);
      rows.forEach((r, i) => r.el.classList.toggle('on', hits[i]));
    }

    const panel = demoPanel('내 업무, 좋은 과제일까?', null);
    panel.append(h('div', { class: 'sc-grid' },
      h('div', { class: 'sc-left' }, task, ex, h('div', { class: 'sc-rows' }, rows.map(r => r.el))),
      h('div', { class: 'sheet sc-right' }, h('div', { class: 'sheet-label' }, '해당하는 기준'), big, segs, title, text)));
    el.append(panel);
    draw();
  }

  AX.demos['scorer'] = { mount };
})();
