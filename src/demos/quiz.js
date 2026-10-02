// 미니 퀴즈. props: { questions:[{q, opts:[], a:정답index, exp}] }
(function () {
  const { h, demoPanel } = AX.util;

  function mount(el, props) {
    const panel = demoPanel('확인 퀴즈');
    const qs = props.questions || [];
    const score = h('div', { class: 'quiz-score' });
    let right = 0, answered = 0;
    const wrap = h('div', { class: 'quiz' + (qs.length >= 4 ? ' two' : qs.length === 3 ? ' three' : '') });

    qs.forEach((q, qi) => {
      const box = h('div', { class: 'q' });
      const exp = h('div', { class: 'exp' }, q.exp || '');
      const opts = h('div', { class: 'opts' });
      q.opts.forEach((o, oi) => {
        const b = h('button', { class: 'opt', onclick: () => {
          if (box.classList.contains('answered')) return;
          box.classList.add('answered');
          opts.querySelectorAll('.opt').forEach((x, k) => {
            if (k === q.a) x.classList.add('right');
            else if (k === oi) x.classList.add('wrong');
          });
          answered++; if (oi === q.a) right++;
          score.textContent = answered === qs.length ? `${right} / ${qs.length} 정답` : `${answered} / ${qs.length} 답함`;
        } }, o);
        opts.append(b);
      });
      box.append(h('div', { class: 'qt' }, `${qi + 1}. ${q.q}`), opts, exp);
      wrap.append(box);
    });
    panel.append(wrap, h('div', { class: 'row', style: 'margin-top:14px' }, score));
    el.append(panel);
  }

  AX.demos['quiz'] = { mount };
})();
