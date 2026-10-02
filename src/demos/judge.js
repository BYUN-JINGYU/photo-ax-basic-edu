// 판정 게임: 요청 하나를 보고 "괜찮다 / 안 된다"를 고르면 어떤 규칙 때문인지 알려 준다.
// props: { title, hint, cases:[{ text, ok:true|false, why }] }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function mount(el, props) {
    const cases = props.cases || [];
    let i = 0, right = 0, answered = false;
    const num = h('span', { class: 'jg-num' });
    const text = h('div', { class: 'jg-text' });
    const verdict = h('div', { class: 'jg-verdict' });
    const score = h('span', { class: 'jg-score' });
    const okBtn = h('button', { class: 'btn jg-btn', onclick: () => answer(true) }, '괜찮다');
    const noBtn = h('button', { class: 'btn jg-btn', onclick: () => answer(false) }, '안 된다');
    const next = h('button', { class: 'btn small primary', onclick: () => { i = (i + 1) % cases.length; if (i === 0) right = 0; show(); } }, '다음 요청');

    function show() {
      answered = false;
      const c = cases[i];
      num.textContent = `요청 ${i + 1} / ${cases.length}`;
      text.textContent = c.text;
      verdict.replaceChildren(h('span', { class: 'jg-wait' }, '버튼을 눌러 답해 보세요'));
      [okBtn, noBtn].forEach(b => { b.disabled = false; b.classList.remove('picked'); });
      next.style.visibility = 'hidden';
      score.textContent = `맞힌 수 ${right}`;
    }
    function answer(saysOk) {
      if (answered) return;
      answered = true;
      const c = cases[i], hit = saysOk === c.ok;
      if (hit) right++;
      (saysOk ? okBtn : noBtn).classList.add('picked');
      [okBtn, noBtn].forEach(b => { b.disabled = true; });
      verdict.replaceChildren(
        h('span', { class: 'badge ' + (hit ? 'ok' : 'bad') }, hit ? '정답' : '아쉬워요'),
        h('span', { class: 'badge ' + (c.ok ? 'acc' : 'warn') }, c.ok ? '보내도 됩니다' : '고쳐서 보내기'),
        h('span', { class: 'jg-why', html: fmt(c.why) }));
      next.textContent = i === cases.length - 1 ? '처음부터' : '다음 요청';
      next.style.visibility = 'visible';
      score.textContent = `맞힌 수 ${right}`;
    }

    const panel = demoPanel(props.title || '괜찮을까?', props.hint);
    panel.append(h('div', { class: 'sheet jg-card' },
      h('div', { class: 'jg-head' }, num, score), text,
      h('div', { class: 'jg-row' }, okBtn, noBtn, h('span', { class: 'spacer' }), next), verdict), panel.hintEl);
    el.append(panel);
    show();
  }

  AX.demos['judge'] = { mount };
})();
