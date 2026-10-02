// OpenCode 화면 흉내: 입력창에 / 를 치면 명령 목록, Tab 으로 plan/build, /models 로 모델 선택.
// props: { commands:[{c, d, when, out:[줄], effect:'clear'|'models'}], models:[이름], replies:{plan:[줄], build:[줄]} }
(function () {
  const { h, demoPanel } = AX.util;

  function mount(el, props) {
    const cmds = props.commands || [];
    const st = { mode: 'Build', model: props.models[0], log: [], pal: [], sel: 0, picking: false, chosen: null };

    const logEl = h('div', { class: 'tui-log' });
    const palEl = h('div', { class: 'tui-pal' });
    const input = h('input', { class: 'tui-input', type: 'text', placeholder: '여기에 / 를 쳐 보세요. Tab 은 모드 전환', 'aria-label': 'OpenCode 입력창' });
    const status = h('div', { class: 'tui-status' });
    const term = h('div', { class: 'tui-term' }, logEl, palEl, h('div', { class: 'tui-inbox' }, input, status),
      h('div', { class: 'tui-keys' }, h('span', {}, h('b', {}, 'tab'), ' 모드'), h('span', {}, h('b', {}, '/'), ' 명령'), h('span', {}, h('b', {}, 'enter'), ' 보내기')));

    const name = h('div', { class: 'tui-name' });
    const desc = h('div', { class: 'tui-desc' });
    const when = h('div', { class: 'tui-when' });
    const chips = h('div', { class: 'tui-chips' }, cmds.map(c => h('button', { class: 'tui-chip', onclick: () => run(c) }, c.c)));
    const side = h('div', { class: 'tui-side' }, h('div', { class: 'sheet tui-explain' }, name, desc, when), chips);

    const say = (t, cls = '') => { st.log.push({ t, cls }); st.log = st.log.slice(-9); };
    function explain(c) {
      st.chosen = c;
      name.textContent = c ? c.c : '명령을 골라 보세요';
      name.classList.toggle('empty', !c);
      desc.textContent = c ? c.d : '왼쪽 입력창에 / 를 치거나 아래 버튼을 누르면 실제 화면처럼 움직입니다.';
      when.textContent = c ? '언제: ' + c.when : '';
      chips.querySelectorAll('.tui-chip').forEach(b => b.classList.toggle('on', !!c && b.textContent === c.c));
    }
    function run(c) {
      explain(c);
      if (c.effect === 'clear') st.log = [];
      say(c.c, 'me');
      if (c.effect === 'models') { st.picking = true; st.pal = props.models.map(m => ({ c: m, d: 'codemate (사내 LLM)' })); st.sel = 0; }
      else (c.out || []).forEach(t => say(t, t.startsWith('→') ? 'tool' : ''));
      input.value = ''; draw(); input.focus();
    }
    function send(text) {
      say(text, 'me');
      (props.replies[st.mode.toLowerCase()] || []).forEach(t => say(t, t.startsWith('→') ? 'tool' : ''));
      input.value = ''; draw();
    }
    function pick(i) {
      const p = st.pal[i];
      if (!p) return;
      if (st.picking) { st.model = p.c; say(`모델을 ${p.c} 로 바꿨습니다.`, 'ok'); st.picking = false; st.pal = []; input.value = ''; draw(); return; }
      run(cmds.find(c => c.c === p.c));
    }
    function filter() {
      if (st.picking) return;
      const v = input.value;
      st.pal = v.startsWith('/') ? cmds.filter(c => c.c.startsWith(v.split(' ')[0])).map(c => ({ c: c.c, d: c.d })) : [];
      st.sel = 0;
      if (st.pal[0]) explain(cmds.find(c => c.c === st.pal[0].c));
    }
    function draw() {
      logEl.replaceChildren(...st.log.map(l => h('div', { class: 'tui-line ' + l.cls }, l.t)));
      palEl.replaceChildren(...st.pal.slice(0, 6).map((p, i) => h('div', { class: 'tui-row' + (i === st.sel ? ' on' : ''), onclick: () => pick(i) }, h('b', {}, p.c), h('span', {}, p.d))));
      palEl.classList.toggle('open', st.pal.length > 0);
      status.replaceChildren(h('b', { class: st.mode === 'Plan' ? 'plan' : 'build' }, st.mode), ` · ${st.model} `, h('span', {}, 'codemate (사내 LLM)'));
    }

    input.addEventListener('input', () => { filter(); draw(); });
    input.addEventListener('keydown', e => {
      const open = st.pal.length > 0;
      if (e.key === 'Tab') { e.preventDefault(); if (open && !st.picking) { input.value = st.pal[st.sel].c; filter(); } else { st.mode = st.mode === 'Build' ? 'Plan' : 'Build'; say(`${st.mode} 모드로 바꿨습니다.`, 'ok'); } draw(); }
      else if (e.key === 'ArrowDown' && open) { e.preventDefault(); st.sel = (st.sel + 1) % Math.min(6, st.pal.length); draw(); }
      else if (e.key === 'ArrowUp' && open) { e.preventDefault(); st.sel = (st.sel + Math.min(6, st.pal.length) - 1) % Math.min(6, st.pal.length); draw(); }
      else if (e.key === 'Escape') { st.pal = []; st.picking = false; draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (open) pick(st.sel); else if (input.value.trim()) send(input.value.trim()); }
    });

    const panel = demoPanel('OpenCode 화면 따라 해 보기', props.hint);
    panel.append(h('div', { class: 'tui-grid' }, term, side), panel.hintEl);
    el.append(panel);
    say('ax-day 폴더에서 OpenCode 를 열었습니다.', 'tool');
    explain(null); draw();
  }

  AX.demos['tui'] = { mount };
})();
