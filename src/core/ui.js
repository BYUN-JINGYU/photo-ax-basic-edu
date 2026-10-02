// 데모들이 같이 쓰는 작은 조작부: 단계 넘기기, 선택 버튼 묶음, 복사 버튼. 화면 모양만 맡고 내용은 모른다.
(function () {
  const { h, copy } = AX.util;

  // 단계 넘기기: [이전] [다음] ●●●○○ 3 / 5. render(i) 는 단계가 바뀔 때마다 불린다
  function stepper(count, render, { nextLabel = '다음', restartLabel = '처음부터' } = {}) {
    let i = 0;
    const dots = h('div', { class: 'ui-dots' }, Array.from({ length: count }, (_, k) =>
      h('button', { class: 'ui-dot', 'aria-label': `${k + 1}단계`, onclick: () => go(k) })));
    const prev = h('button', { class: 'btn small', onclick: () => go(i - 1) }, '이전');
    const next = h('button', { class: 'btn small primary', onclick: () => go(i === count - 1 ? 0 : i + 1) }, nextLabel);
    const counter = h('span', { class: 'ui-count' });
    const el = h('div', { class: 'ui-stepper' }, prev, next, dots, counter);
    function go(k) {
      i = Math.max(0, Math.min(count - 1, k));
      dots.querySelectorAll('.ui-dot').forEach((d, n) => { d.classList.toggle('on', n <= i); d.classList.toggle('now', n === i); });
      prev.disabled = i === 0;
      next.textContent = i === count - 1 ? restartLabel : nextLabel;
      counter.textContent = `${i + 1} / ${count}`;
      render(i);
    }
    return { el, go, get index() { return i; } };
  }

  // 선택 버튼 묶음 (하나만 고른다). options: [{value, label}] 또는 문자열
  function segmented(options, value, onChange, { size = '' } = {}) {
    const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
    const el = h('div', { class: 'ui-seg ' + size, role: 'radiogroup' });
    const buttons = opts.map(o => h('button', { class: 'ui-seg-btn', role: 'radio', 'data-v': o.value, onclick: () => set(o.value, true) }, o.label));
    el.append(...buttons);
    function set(v, fire) {
      value = v;
      buttons.forEach(b => { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      if (fire && onChange) onChange(v);
    }
    set(value, false);
    el.set = v => set(v, false);
    return el;
  }

  // 복사 버튼: 누르면 getText() 를 복사하고 잠깐 '복사됨'
  function copyButton(getText, label = '복사', cls = 'btn small') {
    const b = h('button', { class: cls, onclick: () => copy(getText(), b) }, label);
    return b;
  }

  AX.ui = { stepper, segmented, copyButton };
})();
