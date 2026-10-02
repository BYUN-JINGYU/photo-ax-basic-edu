// 권한 시뮬레이터: 행동 종류마다 allow / ask / deny 를 고르면 에이전트의 시도가 어떻게 되는지와 설정 파일이 바로 바뀐다.
// props: { kinds:[{ key, label, value }], attempts:[{ kind, text }] }
(function () {
  const { h, demoPanel } = AX.util;
  const RESULT = {
    allow: ['바로 실행', 'ok'],
    ask: ['나에게 묻고 실행', 'warn'],
    deny: ['막힘', 'bad']
  };
  const NOTE = { edit: '파일 수정', bash: '명령 실행', webfetch: '외부 웹' };

  function mount(el, props) {
    const perm = Object.fromEntries(props.kinds.map(k => [k.key, k.value]));
    const json = h('pre', { class: 'pm-json' });
    const list = h('div', { class: 'pm-list' });

    const rows = props.kinds.map(k => h('div', { class: 'pm-row' },
      h('div', {}, h('b', {}, k.key), h('span', {}, k.label)),
      AX.ui.segmented(['allow', 'ask', 'deny'], k.value, v => { perm[k.key] = v; draw(); }, { size: 'small' })));

    function draw() {
      list.replaceChildren(...props.attempts.map(a => {
        const [label, cls] = RESULT[perm[a.kind]];
        return h('div', { class: 'pm-try ' + cls }, h('span', { class: 'pm-kind' }, NOTE[a.kind] || a.kind), h('code', {}, a.text), h('span', { class: 'badge ' + cls }, label));
      }));
      json.textContent = '// opencode.json\n{ "permission": { ' + props.kinds.map(k => `"${k.key}": "${perm[k.key]}"`).join(', ') + ' } }';
    }

    const panel = demoPanel('결재 권한 정하기', props.hint);
    panel.append(h('div', { class: 'pm-grid' },
      h('div', { class: 'sheet pm-left' }, h('div', { class: 'sheet-label' }, '행동마다 정하기'), rows),
      h('div', { class: 'pm-right' }, h('div', { class: 'sheet' }, h('div', { class: 'sheet-label' }, '에이전트가 하려는 일'), list), json)), panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['permission'] = { mount };
})();
