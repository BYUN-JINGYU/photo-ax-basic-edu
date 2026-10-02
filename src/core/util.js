// DOM 생성·텍스트 처리 유틸. 다른 모듈은 AX.util 만 의존한다.
(function () {
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // 아주 작은 인라인 서식: **굵게**, `코드`. 줄바꿈(\n) 뒤의 줄은 보조 줄(.sub)로 표시한다.
  function fmt(s) {
    const lines = String(s).split('\n').map(l => esc(l)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>'));
    return lines.length > 1 ? lines[0] + lines.slice(1).map(l => `<span class="sub">${l}</span>`).join('') : lines[0];
  }

  // 코드 블록 하이라이트 (주석·문자열·키워드만). 한 번에 훑어서 이미 만든 태그를 다시 건드리지 않는다.
  function hl(code) {
    const re = /(#[^\n]*)|("""[\s\S]*?"""|"[^"\n]*"|'[^'\n]*')|\b(from|import|def|return|if|not|and|or|class|print|True|False|None)\b/g;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? 'cm' : m[2] ? 'st' : 'kw';
      out += `<span class="${cls}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  async function copy(text, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { /* 폐쇄망·file:// 대비 폴백 */ }
    if (!ok) {
      const ta = h('textarea', { style: 'position:fixed;opacity:0' }, text);
      document.body.append(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* 무시 */ }
      ta.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = '복사됨'; setTimeout(() => { btn.textContent = o; }, 1400); }
  }

  // 로컬 저장 (file:// 나 사생활 보호 모드에서 실패해도 조용히 넘어감)
  const store = {
    get(k, d) { try { const v = localStorage.getItem('ax:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('ax:' + k, JSON.stringify(v)); } catch (e) { /* 무시 */ } }
  };

  // 주소 끝(#장/쪽) 바꾸기. 미리보기 iframe(about:srcdoc)처럼 막힌 곳에서는 조용히 넘어간다
  function setHash(h) {
    try { history.replaceState(null, '', h); } catch (e) { /* 주소 없이도 슬라이드는 그대로 동작 */ }
  }

  function demoPanel(title, hint) {
    const el = h('div', { class: 'demo' });
    if (title) el.append(h('div', { class: 'demo-head' }, h('b', {}, title)));
    // 힌트가 없으면 빈 주석 노드: append 해도 화면에 아무것도 안 나온다(null 은 글자 'null' 로 찍힌다)
    el.hintEl = hint ? h('div', { class: 'demo-hint', html: fmt(hint) }) : document.createComment('');
    return el;
  }

  // 장 번호: kind === 'session' 인 것만 순서대로 1, 2, 3 … (인트로·부록은 null)
  function chapterNo(sessions, session) {
    const chapters = sessions.filter(s => s.kind === 'session');
    const i = chapters.indexOf(session);
    return i < 0 ? null : i + 1;
  }
  // 레일·상단 표시용 짧은 라벨: '1' … '7' / '시작' / '부록'
  function chapterTag(sessions, session) {
    const n = chapterNo(sessions, session);
    return n != null ? String(n) : session.kind === 'intro' ? '시작' : '부록';
  }

  Object.assign(AX.util, { h, esc, fmt, hl, copy, store, setHash, demoPanel, chapterNo, chapterTag });
})();
