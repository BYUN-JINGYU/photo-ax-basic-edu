// 설정 파일 해부: 칸 이름을 누르면 파일에서 그 블록이 칠해지고 뜻이 나온다.
// props: { title, path, code, parts:[{ key, what, chap }], hint }  key 는 JSON 의 키 이름("provider" 등)
(function () {
  const { h, fmt, demoPanel } = AX.util;

  // key 가 시작하는 줄부터, 같은 들여쓰기에서 닫히는 줄까지를 한 블록으로 본다
  function blockOf(lines, key) {
    const start = lines.findIndex(l => new RegExp(`^\\s*"${key.replace(/\$/g, '\\$')}"\\s*:`).test(l));
    if (start < 0) return null;
    const ind = lines[start].match(/^\s*/)[0].length;
    let end = start;
    if (/[{[]\s*$/.test(lines[start])) {
      for (let i = start + 1; i < lines.length; i++) {
        if (lines[i].match(/^\s*/)[0].length === ind && /^\s*[}\]]/.test(lines[i])) { end = i; break; }
      }
    }
    return [start, end];
  }

  function mount(el, props) {
    const lines = props.code.split('\n');
    const rows = lines.map(l => h('div', { class: 'an-line' }, l || ' '));
    const what = h('div', { class: 'an-what' });
    const chap = h('div', { class: 'an-chap' });
    const name = h('div', { class: 'an-name' });
    const parts = props.parts.map(p => ({ ...p, range: blockOf(lines, p.key) })).filter(p => p.range);
    const chips = parts.map(p => h('button', { class: 'an-chip', onclick: () => pick(p) }, p.key));
    function pick(p) {
      chips.forEach((c, i) => c.classList.toggle('on', parts[i] === p));
      rows.forEach((r, i) => r.classList.toggle('lit', i >= p.range[0] && i <= p.range[1]));
      name.textContent = `"${p.key}"`;
      what.innerHTML = fmt(p.what);
      chap.innerHTML = fmt(p.chap || '');
    }
    rows.forEach((r, i) => r.addEventListener('click', () => { const p = parts.find(x => i >= x.range[0] && i <= x.range[1] && x.range[1] > x.range[0]) || parts.find(x => x.range[0] === i); if (p) pick(p); }));
    const panel = demoPanel(props.title || '설정 파일 해부', props.hint);
    panel.append(h('div', { class: 'an-grid' },
      h('div', { class: 'an-code' }, h('div', { class: 'an-path' }, props.path), h('div', { class: 'an-lines' }, rows)),
      h('div', { class: 'an-side' }, h('div', { class: 'an-chips' }, chips), h('div', { class: 'sheet an-sheet' }, name, what, chap))), panel.hintEl);
    el.append(panel);
    if (parts[0]) pick(parts.find(p => p.key === props.first) || parts[0]);
  }

  AX.demos['anatomy'] = { mount };
})();
