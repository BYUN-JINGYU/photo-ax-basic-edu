// API 주문해 보기: 왼쪽에서 주문을 고르면 보내는 요청(주소·방식·내용)과 돌아오는 응답(JSON)이 나온다.
// props: { base, key, items:[{ label, method, path, body?, res, say }], hint }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const req = h('pre', { class: 'ap-pre' });
    const res = h('pre', { class: 'ap-pre res' });
    const say = h('div', { class: 'say-box ap-say' });
    const arrow = h('div', { class: 'ap-arrow' });
    const btns = props.items.map((it, i) => h('button', { class: 'ap-item', onclick: () => show(i) },
      h('span', { class: 'ap-m ' + it.method.toLowerCase() }, it.method), it.label));

    function show(i) {
      const it = props.items[i];
      btns.forEach((b, k) => b.classList.toggle('on', k === i));
      req.replaceChildren(
        h('span', { class: 'ap-m ' + it.method.toLowerCase() }, it.method), ' ', h('b', {}, props.base + it.path), '\n',
        h('span', { class: 'ap-dim' }, `Authorization: ${props.key}`),
        ...(it.body ? ['\n\n', it.body] : []));
      res.textContent = it.res;
      arrow.textContent = '200 OK · 0.2초';
      say.innerHTML = fmt(it.say);
    }

    const panel = demoPanel('API 주문해 보기', props.hint);
    panel.append(h('div', { class: 'ap-grid' },
      h('div', { class: 'ap-items' }, h('div', { class: 'sheet-label' }, '메뉴판 (API 문서)'), btns),
      h('div', { class: 'ap-flow' },
        h('div', { class: 'sheet-label' }, '보내는 요청 (주소 · 방식 · 열쇠 · 내용)'), req,
        arrow,
        h('div', { class: 'sheet-label' }, '돌아오는 응답 (JSON)'), res, say)), panel.hintEl);
    el.append(panel);
    show(0);
  }

  AX.demos['api'] = { mount };
})();
