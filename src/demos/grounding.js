// 근거가 있을 때와 없을 때: 같은 질문에 파일을 주느냐에 따라 답이 어떻게 달라지는지.
// props: { file, question, without:{ lines, badge, why }, with:{ lines, badge, why }, ask:{ without, with }, truth }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    let mode = 'without', asked = false;
    const chat = h('div', { class: 'gr-chat' });
    const follow = h('div', { class: 'gr-chat gr-follow' });
    const verdict = h('div', { class: 'gr-verdict' });
    const askBtn = h('button', { class: 'btn small', onclick: () => { asked = true; draw(); } }, '"근거가 뭐야?" 되묻기');
    const seg = AX.ui.segmented([{ value: 'without', label: '파일 없이 묻기' }, { value: 'with', label: `${props.file} 와 함께` }], mode, v => { mode = v; asked = false; draw(); });

    const line = (t) => h('div', { class: 'gr-line' + (t.startsWith('→') ? ' tool' : '') , html: fmt(t) });
    function draw() {
      const c = props[mode];
      chat.replaceChildren(h('div', { class: 'gr-me' }, props.question), h('div', { class: 'gr-ai' }, c.lines.map(line)));
      follow.replaceChildren(...(asked
        ? [h('div', { class: 'gr-me' }, '근거가 뭐야?'), h('div', { class: 'gr-ai' }, line(props.ask[mode]))]
        : [h('div', { class: 'gr-wait' }, '"근거가 뭐야?" 를 눌러 되물어 보세요')]));
      verdict.replaceChildren(
        h('span', { class: 'badge ' + (mode === 'with' ? 'ok' : 'bad') }, c.badge),
        h('span', { class: 'gr-why', html: fmt(c.why) }));
      askBtn.disabled = asked;
    }

    const panel = demoPanel('같은 질문, 다른 답', props.hint);
    panel.append(h('div', { class: 'gr-top' }, seg, askBtn, h('span', { class: 'gr-truth', html: fmt(props.truth) })),
      h('div', { class: 'sheet gr-sheet' }, chat, follow), verdict, panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['grounding'] = { mount };
})();
