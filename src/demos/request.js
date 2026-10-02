// LLM 요청 해부: 요청 한 통에 들어가는 네 부분과 응답 두 종류. 부분을 누르면 JSON 에서 해당 줄이 켜진다.
(function () {
  const { h, esc, demoPanel } = AX.util;

  const PARTS = [
    { k: 'system', t: '시스템 지시', s: 'AGENTS.md, 스킬, OpenCode 기본 규칙', note: '매 요청의 맨 앞에 들어갑니다. 길면 매번 비용입니다.' },
    { k: 'chat', t: '대화 기록', s: '내 입력 + 이전 답 + 툴 결과', note: '모델은 기억이 없어서 매번 전부 다시 보냅니다. 세션이 길수록 여기가 커집니다.' },
    { k: 'tools', t: '툴 목록', s: '내장 툴 + MCP 툴', note: '이름과 설명만 보냅니다. 모델은 이 목록에서 골라 "써 달라"고 합니다.' },
    { k: 'set', t: '설정', s: '모델, temperature, 최대 길이', note: 'OpenCode 가 채웁니다. 보통 손댈 일이 없습니다.' }
  ];
  // [태그, 줄]. 태그로 하이라이트
  const LINES = [
    ['', '{'],
    ['set', '  "model": "MAX",'],
    ['', '  "messages": ['],
    ['system', '    { "role": "system",    "content": "AGENTS.md: 한국어로 답한다 …" },'],
    ['chat', '    { "role": "user",      "content": "Scanner.md 를 읽고 3D 시뮬레이터를 만들어줘" },'],
    ['chat', '    { "role": "assistant", "tool_calls": [{ "read": "Scanner.md" }] },'],
    ['chat', '    { "role": "tool",      "content": "# 스캐너 노광의 기본 원리 … R = k1·λ/NA …" }'],
    ['', '  ],'],
    ['tools', '  "tools": [ "read", "write", "bash", "query_datalake" ],'],
    ['set', '  "temperature": 0.7,  "max_tokens": 4096'],
    ['', '}']
  ];
  const RESP = {
    text: '{ "role": "assistant",\n  "content": "계획: 1) Scanner.md 식 구현 2) Three.js 웨이퍼·줄무늬 3) 슬라이더 연결 … 진행할까요?" }',
    tool: '{ "role": "assistant",\n  "tool_calls": [{ "name": "write", "args": { "path": "work/simulator.html", "content": "<!doctype html>…" } }] }'
  };

  function mount(el) {
    const panel = demoPanel('LLM 요청 한 통', '왼쪽 부분을 눌러 보세요. 모델은 이 JSON 한 통을 받고, 오른쪽 두 종류 중 하나로 답합니다.');
    const list = h('div', { class: 'rq-parts' });
    const code = h('pre', { class: 'rq-json' });
    const note = h('div', { class: 'rq-note' });
    const resp = h('pre', { class: 'rq-resp' });
    const tabText = h('button', { class: 'btn small primary' }, '글로 답한다');
    const tabTool = h('button', { class: 'btn small' }, '"툴 써 줘"라고 답한다');
    let sel = 'system';

    const render = () => {
      list.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === sel));
      code.innerHTML = LINES.map(([tag, l]) => `<span class="${tag === sel ? 'hi' : tag ? 'dim' : ''}">${esc(l)}</span>`).join('\n');
      const p = PARTS.find(x => x.k === sel);
      note.textContent = p.note;
    };
    PARTS.forEach(p => list.append(h('button', { 'data-k': p.k, onclick: () => { sel = p.k; render(); } }, h('b', {}, p.t), h('span', {}, p.s))));
    const showResp = which => {
      resp.textContent = RESP[which];
      tabText.classList.toggle('primary', which === 'text');
      tabTool.classList.toggle('primary', which === 'tool');
    };
    tabText.addEventListener('click', () => showResp('text'));
    tabTool.addEventListener('click', () => showResp('tool'));

    panel.append(
      h('div', { class: 'rq-grid' }, list, h('div', {}, code, note),
        h('div', {}, h('div', { class: 'rq-resp-head' }, h('span', {}, '응답은 둘 중 하나'), tabText, tabTool), resp)),
      panel.hintEl);
    el.append(panel);
    render(); showResp('text');
  }

  AX.demos['request'] = { mount };
})();
