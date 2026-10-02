// BERT 와 GPT: 인코더는 빈칸을 앞뒤 보고 맞히고, 디코더는 앞만 보고 다음 말을 이어 쓴다.
// props: { bert:{ who, role, left, right, answers:[[말, %]], good }, gpt:{ who, role, prompt, tokens:[], good }, foot, hint }
(function () {
  const { h, fmt, demoPanel } = AX.util;

  function card(name, p, look, body, btn) {
    return h('div', { class: 'bg-card' },
      h('div', { class: 'bg-head' }, h('b', {}, name), h('span', {}, p.who), h('span', { class: 'badge acc' }, p.role)),
      h('div', { class: 'bg-look' }, look), body, btn,
      h('div', { class: 'bg-good', html: fmt(p.good) }));
  }

  function mount(el, props) {
    const { bert, gpt } = props;
    // BERT: 빈칸 맞히기
    const blank = h('span', { class: 'bg-blank' }, '[ ? ]');
    const bars = h('div', { class: 'bg-bars' });
    const bertBtn = h('button', { class: 'btn small primary', onclick: fill }, '빈칸 맞히기');
    function fill() {
      blank.textContent = bert.answers[0][0];
      blank.classList.add('done');
      bars.replaceChildren(...bert.answers.map(([w, p]) => h('div', { class: 'bg-bar' }, h('span', {}, w), h('i', { style: `--w:${p}%` }), h('b', {}, p + '%'))));
      bertBtn.disabled = true;
    }
    // GPT: 한 조각씩 이어 쓰기
    let n = 0;
    const out = h('span', { class: 'bg-gen' });
    const gptBtn = h('button', { class: 'btn small primary', onclick: next }, '다음 말 잇기');
    function next() {
      if (n >= gpt.tokens.length) { n = 0; out.replaceChildren(); gptBtn.textContent = '다음 말 잇기'; return; }
      out.append(h('span', { class: 'bg-tok' }, gpt.tokens[n++]));
      if (n >= gpt.tokens.length) gptBtn.textContent = '처음부터';
    }

    const panel = demoPanel('같은 트랜스포머, 다른 일', props.hint);
    panel.append(h('div', { class: 'bg-grid' },
      card('BERT', bert, '← 앞뒤를 다 보고 빈칸을 맞힘 →', h('div', {}, h('div', { class: 'bg-sent' }, bert.left + ' ', blank, bert.right), bars), bertBtn),
      card('GPT', gpt, '앞만 보고 → 다음 말을 이어 씀', h('div', { class: 'bg-sent' }, gpt.prompt, out), gptBtn)),
      h('div', { class: 'say-box bg-foot', html: fmt(props.foot) }), panel.hintEl);
    el.append(panel);
  }

  AX.demos['bertgpt'] = { mount };
})();
