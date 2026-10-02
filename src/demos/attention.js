// 어텐션 체험: 단어를 누르면 그 단어가 문장의 어느 단어를 얼마나 보는지 진하기로 보여 준다.
// props: { sentences:[{ name, tokens:[], weights:{ 단어번호: { 단어번호: 비중 } }, first }], hint }
// weights 가 없는 단어는 바로 앞뒤 단어를 주로 본다고 가정한다. 숫자는 설명용 예시다.
(function () {
  const { h, demoPanel } = AX.util;

  function weightsFor(sent, i) {
    const given = sent.weights[i];
    const raw = given ? { ...given } : { [i]: 0.4, [i - 1]: 0.3, [i + 1]: 0.3 };
    Object.keys(raw).forEach(k => { if (k < 0 || k >= sent.tokens.length) delete raw[k]; });
    const sum = Object.values(raw).reduce((a, v) => a + v, 0);
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v / sum]));
  }

  function mount(el, props) {
    const line = h('div', { class: 'at-line' });
    const top = h('div', { class: 'at-top' });
    let sent = props.sentences[0];

    function show(i) {
      const wts = weightsFor(sent, i);
      line.querySelectorAll('.at-tok').forEach((t, k) => {
        const v = wts[k] || 0;
        t.classList.toggle('src', k === i);
        t.style.setProperty('--a', (k === i ? 0 : Math.min(1, v * 1.8)).toFixed(2));
      });
      const ranked = Object.entries(wts).filter(([k]) => +k !== i).sort((a, b) => b[1] - a[1]).slice(0, 3);
      top.replaceChildren(h('span', { class: 'at-from' }, `"${sent.tokens[i]}"`), ' 는 ',
        ...ranked.flatMap(([k, v], n) => [n ? ' · ' : '', h('b', {}, sent.tokens[k]), ` ${Math.round(v * 100)}%`]), ' 를 봅니다');
    }
    function load(name) {
      sent = props.sentences.find(s => s.name === name);
      line.replaceChildren(...sent.tokens.map((t, i) => h('button', { class: 'at-tok', onclick: () => show(i) }, t)));
      show(sent.first);
    }

    const panel = demoPanel('어텐션: 이 단어는 어디를 보나', props.hint);
    panel.append(AX.ui.segmented(props.sentences.map(s => s.name), props.sentences[0].name, load), line, h('div', { class: 'sheet at-sheet' }, top), panel.hintEl);
    el.append(panel);
    load(props.sentences[0].name);
  }

  AX.demos['attention'] = { mount };
})();
