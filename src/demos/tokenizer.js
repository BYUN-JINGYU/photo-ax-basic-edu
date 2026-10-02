// 토큰화 데모 (근사치). 한글은 조사를 떼고 2글자씩, 영문은 4글자씩, 숫자는 3자리씩.
(function () {
  const { h, demoPanel } = AX.util;
  const PARTICLES = new Set(['은', '는', '이', '가', '을', '를', '에', '의', '도', '로', '와', '과', '만', '에서', '으로', '에게']);

  function splitKorean(run) {
    const out = [];
    let core = run;
    let tail = '';
    for (const len of [2, 1]) {
      if (run.length > len && PARTICLES.has(run.slice(-len))) { core = run.slice(0, -len); tail = run.slice(-len); break; }
    }
    for (let i = 0; i < core.length; i += 2) out.push(core.slice(i, i + 2));
    if (tail) out.push(tail);
    return out;
  }

  function tokenize(text) {
    const out = [];
    const re = /[가-힣]+|[A-Za-z]+|\d+|\s+|./gs;
    let m;
    while ((m = re.exec(text))) {
      const s = m[0];
      if (/^[가-힣]+$/.test(s)) out.push(...splitKorean(s));
      else if (/^[A-Za-z]+$/.test(s)) { for (let i = 0; i < s.length; i += 4) out.push(s.slice(i, i + 4)); }
      else if (/^\d+$/.test(s)) { for (let i = 0; i < s.length; i += 3) out.push(s.slice(i, i + 3)); }
      else out.push(s);
    }
    return out;
  }

  // props: { text } 처음에 보여 줄 문장
  function mount(el, props = {}) {
    const panel = demoPanel('문장을 토큰으로 잘라 보기', '색 하나가 토큰 하나입니다. 실제 모델의 토크나이저와는 다른 **근사치**이며, 한글은 영문보다 토큰을 더 많이 씁니다.');
    const ta = h('textarea', { rows: 3, 'aria-label': '토큰화할 문장' }, props.text || '');
    const view = h('div', { class: 'tokens' });
    const stat = h('div', { class: 'row', style: 'margin-top:12px' });

    const render = () => {
      const toks = tokenize(ta.value);
      view.replaceChildren();
      let ci = 0;
      toks.forEach(t => {
        const isSpace = /^\s+$/.test(t);
        view.append(h('span', { class: 'tok ' + (isSpace ? 'sp' : 'c' + (ci++ % 5)) }, isSpace ? '' : t));
      });
      const n = toks.filter(t => !/^\s+$/.test(t)).length;
      const chars = ta.value.replace(/\s+/g, '').length;
      stat.replaceChildren(
        h('span', { class: 'stat' }, h('b', {}, String(n)), '토큰 (근사)'),
        h('span', { class: 'stat' }, h('b', {}, String(chars)), '글자'));
    };
    ta.addEventListener('input', render);
    panel.append(ta, view, stat, panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['tokenizer'] = { mount };
})();
