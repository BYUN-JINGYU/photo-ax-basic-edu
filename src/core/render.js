// 슬라이드 데이터 → DOM. 장 표지와 일반 슬라이드 두 종류.
(function () {
  const { h, esc, fmt, hl, chapterNo, chapterTag } = AX.util;

  function notes(s) {
    return s.notes ? h('div', { class: 'notes' }, h('b', {}, '강사 노트'), s.notes) : null;
  }

  // 표지: 왼쪽 번호·제목·목표, 오른쪽 그림(웨이퍼 샷맵에 지금 장까지 노광)
  function coverSlide(s, session, sessions) {
    const n = chapterNo(sessions, session);
    const total = sessions.filter(x => x.kind === 'session').length;
    return h('section', { class: 'slide cover' },
      h('div', { class: 'cover-grid' },
        h('div', { class: 'cover-text' },
          h('div', { class: 'cover-num' }, String(n)),
          h('h2', { class: 'cover-title' }, session.title),
          h('p', { class: 'cover-sub', html: esc(s.subtitle).replace(/\n/g, '<br>') }),
          s.outcomes ? h('div', { class: 'outcomes' }, h('h3', {}, '이 장이 끝나면'), h('ul', {}, s.outcomes.map(o => h('li', {}, o)))) : null),
        h('div', { class: 'cover-art' }, coverArt(s, n, total))),
      notes(s));
  }

  // 표지 그림: 기본은 웨이퍼 샷맵, art: 'oxide' 면 산화막 단면도(4장)
  function coverArt(s, n, total) {
    const cap = (left) => h('div', { class: 'chap-cap' }, h('span', {}, left), h('b', {}, `${n}장 / ${total}장`));
    if (s.art === 'oxide') return [AX.art.xsection({ ratio: 0.7, label: '1000 °C · 1 h · 건식 = 70 nm', w: 470, h: 300 }), cap('이 장에서 키울 산화막')];
    return [AX.art.wafer({ n, total, w: 420, h: 380 }), cap('샷이 찍히듯, 장마다 채워집니다')];
  }

  function demoBlock(s) {
    const el = h('div', { class: 'slide-demo' });
    const d = AX.demos[s.demo];
    if (!d) { el.append(h('div', { class: 'demo' }, '데모를 찾을 수 없습니다: ' + s.demo)); return el; }
    try { d.mount(el, s.demoProps || {}); }
    catch (e) { el.append(h('div', { class: 'demo' }, '데모 오류 (' + s.demo + '): ' + e.message)); }
    return el;
  }

  function contentSlide(s) {
    const points = s.points ? h('ul', { class: 'points' }, s.points.map(p => h('li', { html: fmt(p) }))) : null;
    const caution = s.caution ? h('div', { class: 'caution', html: '<b>주의</b>' + esc(s.caution).replace(/\n/g, '<br>') }) : null;
    const code = s.code ? h('div', { class: 'slide-code' }, h('pre', { class: 'code', html: hl(s.code.text) }), s.code.cap ? h('div', { class: 'code-cap' }, s.code.cap) : null) : null;
    const pic = !s.demo && s.pic && AX.pics[s.pic] ? h('div', { class: 'slide-pic' }, AX.pics[s.pic]()) : null;
    let body;
    if (pic && code) {           // 코드 옆에 그림
      body = h('div', { class: 'slide-body has-pic' }, h('div', { class: 'slide-text' }, points, caution), h('div', { class: 'pic-row', style: s.picW ? `--pic-w:${s.picW}px` : '' }, code, pic));
    } else if (pic) {            // 글 옆(picSide) 또는 글 아래에 그림
      body = h('div', { class: 'slide-body has-pic ' + (s.picSide ? 'pic-side' : 'text-pic'), style: s.picW ? `--pic-w:${s.picW}px` : '' }, h('div', { class: 'slide-text' }, points, caution), pic);
    } else {
      const cls = 'slide-body' + (s.demo ? ' has-demo' : '') + (!s.demo && !s.code ? ' text-only' : '');
      body = h('div', { class: cls }, h('div', { class: 'slide-text' }, points, caution, code), s.demo ? demoBlock(s) : null);
    }
    return h('section', { class: 'slide' }, siteFlag(s), h('h2', { class: 'slide-title' }, s.title), body, notes(s));
  }

  // 사내 정보(src/site/site.js)를 쓰는 쪽인데 아직 사내 기준으로 확인 전이면 오른쪽 위에 표시
  function siteFlag(s) {
    const st = s.site && AX.site[s.site];
    return st && !st.checked ? h('div', { class: 'site-flag', title: `src/site/site.js 의 ${s.site} 항목` }, '사외 기준 · 사내 확인 필요') : null;
  }

  // 인쇄 보기에서 장 사이에 들어가는 구분 머리글
  function chapterHead(session, sessions) {
    const n = chapterNo(sessions, session);
    return h('div', { class: 'print-chapter' }, h('span', { class: 't' }, n != null ? n + '장' : chapterTag(sessions, session)), session.title);
  }

  function buildAll(sessions) {
    return sessions.map(session => ({
      session,
      head: chapterHead(session, sessions),
      slides: session.slides.map(s => {
        const el = s.type === 'cover' ? coverSlide(s, session, sessions) : contentSlide(s);
        return { el, label: s.title || session.title, notes: s.notes || '' };
      })
    }));
  }

  AX.render = { buildAll };
})();
