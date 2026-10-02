// 툴 호출 스테퍼: 사용자 → 모델(요청만) → OpenCode(실행) → 모델 → 사용자. 단계 내용은 콘텐츠에서 받는다
(function () {
  const { h, demoPanel } = AX.util;
  const ACTORS = [
    { n: '사용자', s: '말로 요청' },
    { n: '모델 (LLM)', s: '생각하고 요청만' },
    { n: 'OpenCode', s: '툴을 실제로 실행' }
  ];

  // props: { steps:[{ who: 0|1|2, say, code }] } who 는 ACTORS 의 순서
  function mount(el, props) {
    const STEPS = props.steps;
    const panel = demoPanel('에이전트 한 바퀴', '모델은 코드를 **실행하지 않습니다**. "이 툴을 써 달라"고 쓰면 OpenCode가 실행하고 결과를 돌려줍니다.');
    const lane = h('div', { class: 'tc-lane' });
    const actors = ACTORS.map(a => { const d = h('div', { class: 'tc-actor' }, a.n, h('span', { class: 's' }, a.s)); lane.append(d); return d; });
    const who = h('div', { class: 'who' });
    const say = h('div', { class: 'say' });
    const code = h('pre');
    const msg = h('div', { class: 'tc-msg' }, who, say, code);
    const dots = h('div', { class: 'tc-steps' }, STEPS.map(() => h('i')));
    let i = 0;
    const prev = h('button', { class: 'btn small', onclick: () => { i = Math.max(0, i - 1); render(); } }, '이전');
    const next = h('button', { class: 'btn small primary', onclick: () => { i = (i + 1) % STEPS.length; render(); } }, '다음');
    const counter = h('span', { style: 'font-size:13px;color:var(--mute)' });

    const render = () => {
      const s = STEPS[i];
      actors.forEach((a, k) => a.classList.toggle('hi', k === s.who));
      who.textContent = ACTORS[s.who].n;
      say.textContent = s.say;
      code.textContent = s.code || '';
      code.style.display = s.code ? '' : 'none';
      dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k <= i));
      counter.textContent = `${i + 1} / ${STEPS.length}`;
      prev.disabled = i === 0;
      next.textContent = i === STEPS.length - 1 ? '처음부터' : '다음';
    };
    panel.append(h('div', { class: 'tc-wrap' }, lane, h('div', {}, msg, dots, h('div', { class: 'row', style: 'margin-top:10px' }, prev, next, counter))), panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['toolcall'] = { mount };
})();
