// MCP 꽂기: Datalake MCP 서버를 꽂고 뽑으면 툴 목록과 같은 질문의 답이 바뀐다.
// props: { request, base:[툴], plug:{ tool, name, sub }, without:[줄], with:[줄] }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    let on = false;
    const tools = h('div', { class: 'mp-tools' });
    const json = h('pre', { class: 'mp-json' });
    const chat = h('div', { class: 'mp-chat' });
    const cable = h('div', { class: 'mp-cable' }, h('i'));
    const plugBtn = h('button', { class: 'btn small primary', onclick: () => { on = !on; draw(); } });
    const server = h('div', { class: 'sheet mp-server' },
      h('div', { class: 'mp-sv-t' }, props.plug.name), h('div', { class: 'mp-sv-s' }, props.plug.sub), plugBtn);

    const line = t => h('div', { class: 'mp-line' + (t.startsWith('→') ? ' tool' : ''), html: fmt(t) });
    function draw() {
      const list = on ? [...props.base, props.plug.tool] : props.base;
      tools.replaceChildren(...props.base.map(t => h('span', { class: 'mp-tool' }, t)),
        h('span', { class: 'mp-tool slot' + (on ? ' on' : '') }, on ? props.plug.tool : '빈 자리'));
      json.textContent = `"tools": [ ${list.map(t => `"${t}"`).join(', ')} ]`;
      cable.classList.toggle('on', on);
      server.classList.toggle('on', on);
      plugBtn.textContent = on ? '뽑기' : '꽂기';
      chat.replaceChildren(h('div', { class: 'mp-me' }, props.request), h('div', { class: 'mp-ai' }, (on ? props.with : props.without).map(line)));
    }

    const panel = demoPanel('Datalake MCP 꽂아 보기', props.hint);
    panel.append(h('div', { class: 'mp-grid' },
      h('div', { class: 'mp-left' },
        h('div', { class: 'mp-board' },
          h('div', { class: 'sheet mp-agent' }, h('div', { class: 'mp-sv-t' }, 'OpenCode'), h('div', { class: 'mp-sv-s' }, '쓸 수 있는 툴'), tools),
          cable, server),
        h('div', { class: 'sheet-label mp-json-l' }, '모델에게 가는 요청 (2장)'), json),
      h('div', { class: 'sheet mp-right' }, h('div', { class: 'sheet-label' }, '같은 질문을 보내면'), chat)), panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['mcp-plug'] = { mount };
})();
