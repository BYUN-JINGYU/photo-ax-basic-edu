// 터미널 연습: 가짜 PowerShell 에서 pwd · dir · cd 로 실습 폴더에 들어가 opencode 를 연다.
// props: { home, workdir, entries:[실습 폴더 안 이름, 폴더는 끝에 \], hint }
(function () {
  const { h, demoPanel } = AX.util;
  const key = p => p.toLowerCase();

  // 아주 작은 파일 시스템: 폴더 경로 → { name, dirs:[], files:[] }
  function buildFs(home, workdir, entries) {
    const fs = new Map();
    const ensure = path => {
      const parts = path.split('\\').filter(Boolean);
      let cur = parts[0];
      if (!fs.has(key(cur))) fs.set(key(cur), { path: cur, dirs: [], files: [] });
      parts.slice(1).forEach(p => {
        const next = cur + '\\' + p, node = fs.get(key(cur));
        if (!node.dirs.includes(p)) node.dirs.push(p);
        if (!fs.has(key(next))) fs.set(key(next), { path: next, dirs: [], files: [] });
        cur = next;
      });
      return fs.get(key(cur));
    };
    ['Desktop', 'Documents'].forEach(d => ensure(home + '\\' + d));
    ensure(workdir);
    entries.forEach(e => {
      const parts = e.replace(/\\$/, '').split('\\'), isDir = e.endsWith('\\');
      const parent = ensure([workdir, ...parts.slice(0, -1)].join('\\'));
      if (isDir) ensure([workdir, ...parts].join('\\')); else parent.files.push(parts.at(-1));
    });
    return fs;
  }
  // 상대·절대 경로를 풀어서 존재하는 폴더면 그 경로를 돌려준다
  function resolve(fs, cwd, home, arg) {
    let base = cwd, rest = arg.replace(/\//g, '\\');
    if (/^[a-z]:/i.test(rest)) { base = rest.slice(0, 2).toUpperCase(); rest = rest.slice(2); }
    else if (rest.startsWith('\\')) base = cwd.slice(0, 2);
    else if (rest === '~' || rest.startsWith('~\\')) { base = home; rest = rest.slice(1); }
    const parts = base.split('\\').filter(Boolean);
    for (const p of rest.split('\\').filter(Boolean)) {
      if (p === '.') continue;
      if (p === '..') { if (parts.length > 1) parts.pop(); continue; }
      const node = fs.get(key(parts.join('\\')));
      const hit = node && node.dirs.find(d => key(d) === key(p));
      if (!hit) return null;
      parts.push(hit);
    }
    return fs.get(key(parts.join('\\'))).path;
  }

  function mount(el, props) {
    const fs = buildFs(props.home, props.workdir, props.entries);
    let cwd = props.home;
    const done = new Set(), history = [];
    let hIdx = 0;
    const log = h('div', { class: 'sh-log' });
    const promptEl = h('span', { class: 'sh-ps' });
    const input = h('input', { class: 'sh-input', type: 'text', 'aria-label': '터미널 입력', autocomplete: 'off', spellcheck: 'false' });
    const term = h('div', { class: 'sh-term', onclick: () => input.focus() }, log, h('div', { class: 'sh-row' }, promptEl, input));
    const tree = h('div', { class: 'sh-tree' });
    const MISSIONS = [['pwd', '`pwd` 로 지금 위치 확인'], ['dir', '`dir` 로 무엇이 있는지 보기'], ['cd', `\`cd\` 로 ${props.workdir.split('\\').at(-1)} 폴더에 들어가기`], ['open', '그 자리에서 `opencode` 실행']];
    const missionEls = MISSIONS.map(([, t]) => h('li', { html: AX.util.fmt(t) }));
    const result = h('div', { class: 'sh-result' });

    const out = (t, cls = '') => log.append(h('div', { class: 'sh-out ' + cls }, t));
    const ps = () => `PS ${cwd}>`;
    function run(line) {
      out(`${ps()} ${line}`, 'cmd');
      const [cmd, ...args] = line.trim().split(/\s+/);
      const arg = args.join(' ');
      switch ((cmd || '').toLowerCase()) {
        case '': break;
        case 'pwd': out(cwd); done.add('pwd'); break;
        case 'dir': case 'ls': {
          const n = fs.get(key(cwd));
          if (!n.dirs.length && !n.files.length) out('(비어 있음)', 'dim');
          n.dirs.forEach(d => out(`d----   ${d}`)); n.files.forEach(f => out(`-a---   ${f}`));
          done.add('dir'); break;
        }
        case 'cd': case 'set-location': {
          if (!arg) { out(cwd); break; }
          const to = resolve(fs, cwd, props.home, arg);
          if (!to) { out(`'${arg}' 경로를 찾을 수 없습니다. dir 로 이름을 확인하세요.`, 'err'); break; }
          cwd = to;
          if (key(cwd) === key(props.workdir)) done.add('cd');
          break;
        }
        case 'cls': case 'clear': log.replaceChildren(); break;
        case 'opencode':
          if (/^(--version|-v)$/.test(arg)) { out(props.version || '1.18.34'); break; }
          if (key(cwd) === key(props.workdir)) { out('OpenCode 를 열었습니다. 이 폴더가 프로젝트입니다.', 'ok'); out('DealGrove.md · AGENTS.md 를 읽을 수 있습니다.', 'ok'); done.add('open'); }
          else out(`OpenCode 가 ${cwd} 를 프로젝트로 열었습니다. 여기엔 실습 파일이 없습니다. 먼저 cd 로 들어가세요.`, 'err');
          break;
        case 'help': out('pwd 지금 위치 · dir 목록 · cd 폴더 들어가기 · cd .. 위로 · cls 지우기 · opencode 실행 · opencode --version 설치 확인', 'dim'); break;
        default: out(`'${cmd}' 은(는) 알 수 없는 명령입니다. help 를 쳐 보세요.`, 'err');
      }
      while (log.children.length > 12) log.firstChild.remove();
      draw();
    }
    function draw() {
      promptEl.textContent = ps();
      // 폴더 트리: 드라이브부터, 지금 위치까지 이어지는 줄은 진하게
      const lines = [];
      const walk = (path, depth) => {
        const n = fs.get(key(path));
        lines.push(h('div', { class: 'sh-node' + (key(path) === key(cwd) ? ' here' : key(cwd).startsWith(key(path) + '\\') ? ' path' : ''), style: `padding-left:${8 + depth * 16}px` },
          n.path.split('\\').at(-1) + '\\', key(path) === key(cwd) ? h('span', {}, '지금 여기') : null));
        n.dirs.forEach(d => walk(path + '\\' + d, depth + 1));
        if (key(path) === key(props.workdir)) n.files.forEach(f => lines.push(h('div', { class: 'sh-node file', style: `padding-left:${8 + (depth + 1) * 16}px` }, f)));
      };
      walk(cwd.slice(0, 2), 0);
      tree.replaceChildren(...lines);
      MISSIONS.forEach(([id], i) => missionEls[i].classList.toggle('done', done.has(id)));
      result.textContent = done.size === MISSIONS.length ? '네 단계 완료. 실제 PC 에서도 똑같습니다.' : '';
    }
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const v = input.value; if (v.trim()) history.push(v); hIdx = history.length; input.value = ''; run(v); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx > 0) input.value = history[--hIdx]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; }
      else if (e.key === 'Tab') {   // 폴더 이름 자동 완성
        e.preventDefault();
        const m = input.value.match(/^(cd\s+)(.*)$/i);
        if (!m) return;
        const n = fs.get(key(cwd)), hit = n.dirs.find(d => key(d).startsWith(key(m[2])));
        if (hit) input.value = m[1] + hit;
      }
    });

    const panel = demoPanel('터미널 따라 하기', props.hint);
    panel.append(h('div', { class: 'sh-grid' }, term,
      h('div', { class: 'sh-side' }, h('div', { class: 'sheet' }, h('div', { class: 'sheet-label' }, '미션'), h('ol', { class: 'sh-missions' }, missionEls), result),
        h('div', { class: 'sheet sh-tree-wrap' }, h('div', { class: 'sheet-label' }, '탐색기로 보면'), tree))), panel.hintEl);
    el.append(panel);
    out('Windows PowerShell', 'dim'); out('help 를 치면 쓸 수 있는 명령이 나옵니다.', 'dim');
    draw();
  }

  AX.demos['shell'] = { mount };
})();
