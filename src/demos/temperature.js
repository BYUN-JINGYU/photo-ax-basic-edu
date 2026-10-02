// temperature 데모: 다음 토큰 후보의 확률 분포가 T에 따라 어떻게 변하는지
(function () {
  const { h, demoPanel } = AX.util;

  function softmax(CANDS, T) {
    const ex = CANDS.map(c => Math.exp(c.l / T));
    const sum = ex.reduce((a, b) => a + b, 0);
    return ex.map(x => x / sum);
  }

  function readout(T) {
    if (T < 0.4) return '거의 항상 1등만 고릅니다. 같은 질문 → 같은 답.';
    if (T <= 1.0) return '대체로 안정적이고 가끔 다른 표현이 섞입니다. 기본값 영역.';
    return '엉뚱한 답이 섞일 확률이 눈에 띄게 올라갑니다. 보고서·조회에는 비추천.';
  }

  // props: { prompt, cands:[{ t, l }] } l 은 후보의 점수(로짓). 클수록 잘 뽑힌다
  function mount(el, props) {
    const PROMPT = props.prompt, CANDS = props.cands;
    const panel = demoPanel('다음 토큰 뽑기', '막대는 "다음에 올 말"의 확률입니다. 손잡이를 움직여 보고, **한 번 뽑기**를 여러 번 눌러 보세요.');
    const prompt = h('div', { style: 'font-size:15px;color:var(--mute)' }, '"', PROMPT, '"');
    const range = h('input', { type: 'range', min: '0.1', max: '2', step: '0.1', value: '0.7', 'aria-label': 'temperature' });
    const tval = h('b', {}, '0.7');
    const bars = h('div', { class: 'bars' });
    const rows = CANDS.map(c => {
      const fill = h('div', { class: 'fill' });
      const pct = h('span', { class: 'pct' });
      const row = h('div', { class: 'bar' }, h('span', { class: 'lbl' }, c.t), h('div', { class: 'track' }, fill), pct);
      bars.append(row);
      return { row, fill, pct };
    });
    const read = h('div', { class: 'temp-read' });
    const pick = h('button', { class: 'btn small primary' }, '한 번 뽑기');

    const render = () => {
      const T = parseFloat(range.value);
      tval.textContent = T.toFixed(1);
      const p = softmax(CANDS, T);
      rows.forEach((r, i) => { r.fill.style.width = (p[i] * 100) + '%'; r.pct.textContent = (p[i] * 100).toFixed(0) + '%'; r.row.classList.remove('picked'); });
      read.textContent = readout(T);
      read.classList.toggle('hot', T > 1.0);
    };
    pick.addEventListener('click', () => {
      const p = softmax(CANDS, parseFloat(range.value));
      let r = Math.random(), idx = 0;
      for (let i = 0; i < p.length; i++) { r -= p[i]; if (r <= 0) { idx = i; break; } idx = i; }
      rows.forEach((row, i) => row.row.classList.toggle('picked', i === idx));
    });
    range.addEventListener('input', render);

    panel.append(prompt,
      h('div', { class: 'row', style: 'margin-top:12px' }, h('span', { class: 'stat' }, 'temperature ', tval), h('div', { style: 'flex:1;min-width:160px' }, range), pick),
      bars, read, panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['temperature'] = { mount };
})();
