// Hook 타임라인: 에이전트가 툴을 쓰는 순간들을 한 칸씩 넘기며, Hook 을 켰을 때와 껐을 때를 비교한다.
// props: { stages:[{ t, s, hook }], scenarios:{ 이름: { on:[{t, cls}], off:[{t, cls}] } } }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const names = Object.keys(props.scenarios);
    let scen = names[0], hookOn = 'on';
    const lane = h('div', { class: 'hk-lane' });
    const nodes = props.stages.map((s, i) => {
      const n = h('div', { class: 'hk-node' + (s.hook ? ' hook' : '') }, h('b', {}, s.t), h('span', {}, s.s));
      if (i > 0) lane.append(h('div', { class: 'hk-link' }));
      lane.append(n);
      return n;
    });
    const log = h('div', { class: 'hk-log' });

    const stepper = AX.ui.stepper(props.stages.length, i => {
      const lines = props.scenarios[scen][hookOn];
      nodes.forEach((n, k) => {
        n.classList.toggle('now', k === i);
        n.classList.toggle('done', k < i);
        n.classList.toggle('fire', !!(k <= i && props.stages[k].hook && lines[k].cls === 'hook'));
        n.classList.toggle('skip', k <= i && lines[k].cls === 'skip');
      });
      log.replaceChildren(...lines.slice(0, i + 1).map((l, k) =>
        h('div', { class: 'hk-line ' + (l.cls || '') + (k === i ? ' now' : '') }, h('span', { class: 'hk-at' }, props.stages[k].t), h('span', { html: fmt(l.t) }))));
    });
    const reset = () => stepper.go(0);
    const scenSeg = AX.ui.segmented(names, scen, v => { scen = v; reset(); });
    const hookSeg = AX.ui.segmented([{ value: 'on', label: 'Hook 켜기' }, { value: 'off', label: 'Hook 끄기' }], hookOn, v => { hookOn = v; reset(); });

    const panel = demoPanel('에이전트가 일하는 순간들', props.hint);
    panel.append(h('div', { class: 'hk-top' }, scenSeg, hookSeg), lane, h('div', { class: 'sheet hk-sheet' }, log), stepper.el, panel.hintEl);
    el.append(panel);
    reset();
  }

  AX.demos['hooks'] = { mount };
})();
