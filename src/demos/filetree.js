// 파일 트리: 하네스 파일을 누르면 "언제 읽히나 · 무엇을 적나 · 몇 장" 이 나온다.
// props: { tree:[{ name, depth, file:{ when, what, where, chap } }] } file 이 없으면 폴더
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const name = h('div', { class: 'ft-name' });
    const fields = h('div', { class: 'ft-fields' });
    const buttons = [];
    const tree = h('div', { class: 'ft-tree' }, props.tree.map(n => {
      const pad = `padding-left:${12 + n.depth * 20}px`;
      if (!n.file) return h('div', { class: 'ft-dir', style: pad }, n.name);
      const b = h('button', { class: 'ft-file', style: pad, onclick: () => show(n, b) }, n.name, n.file.tag ? h('span', { class: 'ft-tag' }, n.file.tag) : null);
      buttons.push([n, b]);
      return b;
    }));
    function show(n, b) {
      buttons.forEach(([, x]) => x.classList.toggle('on', x === b));
      name.textContent = n.path || n.name;
      fields.replaceChildren(...[['언제 읽히나', n.file.when], ['무엇을 적나', n.file.what], ['어디서 배우나', n.file.chap]].map(([k, v]) =>
        h('div', { class: 'ft-field' }, h('div', { class: 'sheet-label' }, k), h('div', { class: 'ft-v', html: fmt(v) }))));
    }
    const panel = demoPanel('ax-day 폴더 안의 하네스', props.hint);
    panel.append(h('div', { class: 'ft-grid' }, h('div', { class: 'sheet ft-left' }, tree), h('div', { class: 'sheet ft-right' }, name, fields)), panel.hintEl);
    el.append(panel);
    show(...buttons[0]);
  }

  AX.demos['filetree'] = { mount };
})();
