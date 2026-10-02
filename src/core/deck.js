// 라우터 + 장 보기: 홈 ↔ 장, 슬라이드 이동, 16:9 캔버스 맞춤, 키보드, 해시, 노트·인쇄 토글. 부팅 진입점.
(function () {
  const { h, store, chapterNo, setHash } = AX.util;
  const W = 1280, H = 720;                       // 슬라이드 설계 크기
  const narrow = matchMedia('(max-width: 700px)'); // 좁은 화면은 축소 대신 흐름 배치

  function boot() {
    const sessions = AX.content;
    const chapters = AX.render.buildAll(sessions);
    const byId = new Map(chapters.map(c => [c.session.id, c]));
    let cur = null; // { chapter, i }

    const homeBtn = h('button', { class: 'home-link', onclick: () => goHome() }, '← 홈');
    const chapEl = h('span', { class: 'chap' });
    const countEl = h('span', { class: 'count' });
    const canvas = h('div', { class: 'canvas' }, chapters.map(c => [c.head, c.slides.map(s => s.el)]));
    const frame = h('div', { class: 'frame' }, canvas);
    const notesEl = h('div', { class: 'notes-strip' });
    const prevBtn = h('button', { class: 'btn', onclick: () => step(-1) }, '이전');
    const nextBtn = h('button', { class: 'btn primary', onclick: () => step(1) }, '다음');
    const notesBtn = h('button', { class: 'btn small notes-toggle', onclick: () => toggleNotes() }, '강사 노트');
    const printBtn = h('button', { class: 'btn small', onclick: () => togglePrint() }, '인쇄 보기');
    const themeBtn = AX.theme.button('btn small theme-toggle');
    const pager = h('div', { class: 'pager' });
    const stage = h('main', { class: 'stage' },
      frame,
      h('div', { class: 'stage-top' }, homeBtn, chapEl, countEl),
      pager, notesEl,
      h('div', { class: 'stage-bottom' }, prevBtn, nextBtn, h('span', { class: 'spacer' }), themeBtn, printBtn, notesBtn));
    // 조작부: 마우스가 움직일 때만 잠깐 보인다 (키노트처럼)
    let chromeTimer = null;
    const showChrome = () => {
      stage.classList.add('chrome-on');
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(() => { if (!stage.matches(':hover .stage-bottom:hover')) stage.classList.remove('chrome-on'); }, 2500);
    };
    stage.addEventListener('mousemove', showChrome);
    stage.querySelectorAll('.stage-top, .stage-bottom').forEach(el => {
      el.addEventListener('mouseenter', () => clearTimeout(chromeTimer));
      el.addEventListener('mouseleave', showChrome);
    });
    const home = AX.homeView.create(sessions, id => open(id, 0));
    const homeStage = h('div', { class: 'home-stage' }, home);
    document.getElementById('app').replaceChildren(homeStage, stage);

    const allSlides = () => chapters.flatMap(c => c.slides);

    // 캔버스를 프레임 안에 비율 유지로 맞춘다
    function fit() {
      if (narrow.matches || document.body.classList.contains('print-view')) { canvas.style.transform = ''; home.style.transform = ''; return; }
      const box = cur ? frame : homeStage, el = cur ? canvas : home;
      const r = box.getBoundingClientRect();
      const s = Math.min(r.width / W, r.height / H);
      el.style.transform = `translate(-50%, -50%) scale(${s})`;
    }

    function goHome(pushHash = true) {
      cur = null;
      document.body.dataset.view = 'home';
      allSlides().forEach(s => s.el.classList.remove('current'));
      if (pushHash) setHash('#home');
      document.title = AX.home.title;
      window.scrollTo(0, 0);
      fit();
    }

    function open(id, i, pushHash = true) {
      const chapter = byId.get(id);
      if (!chapter) return goHome(pushHash);
      i = Math.max(0, Math.min(chapter.slides.length - 1, i));
      cur = { chapter, i };
      document.body.dataset.view = 'chapter';
      allSlides().forEach(s => s.el.classList.remove('current'));
      const s = chapter.slides[i];
      s.el.classList.add('current');
      s.el.scrollTop = 0;
      const n = chapterNo(sessions, chapter.session);
      chapEl.textContent = (n != null ? n + '장  ' : '') + chapter.session.title;
      countEl.textContent = `${i + 1} / ${chapter.slides.length}`;
      pager.replaceChildren(
        h('span', {}, n != null ? n + '장' : chapter.session.title),
        h('span', { class: 'pg-segs' }, chapter.slides.map((_, k) => h('i', { class: k <= i ? 'on' : '' }))),
        h('span', { class: 'pg-count' }, String(i + 1).padStart(2, '0'), h('span', {}, ' / ' + String(chapter.slides.length).padStart(2, '0'))));
      const idx = chapters.indexOf(chapter);
      prevBtn.textContent = i === 0 ? '홈' : '이전';
      nextBtn.textContent = i < chapter.slides.length - 1 ? '다음' : idx < chapters.length - 1 ? '다음 장' : '홈으로';
      notesEl.textContent = s.notes;
      notesEl.classList.toggle('empty', !s.notes);
      if (pushHash) setHash(`#${id}/${i + 1}`);
      document.title = `${s.label} — ${AX.home.title}`;
      fit();
    }

    // 장 경계에서는 홈 또는 다음 장으로
    function step(d) {
      if (!cur) return;
      const { chapter, i } = cur;
      const idx = chapters.indexOf(chapter);
      if (d > 0) {
        if (i < chapter.slides.length - 1) open(chapter.session.id, i + 1);
        else if (idx < chapters.length - 1) open(chapters[idx + 1].session.id, 0);
        else goHome();
      } else {
        if (i > 0) open(chapter.session.id, i - 1);
        else goHome();
      }
    }

    function toggleNotes(force) {
      const on = document.body.classList.toggle('notes-on', force);
      notesBtn.classList.toggle('on', on);
      store.set('notes', on);
      fit();
    }
    function togglePrint() {
      const on = document.body.classList.toggle('print-view');
      printBtn.textContent = on ? '슬라이드 보기' : '인쇄 보기';
      AX.theme.hold(on);
      if (on) { document.body.dataset.view = 'chapter'; canvas.style.transform = ''; window.scrollTo(0, 0); }
      else if (cur) open(cur.chapter.session.id, cur.i, false);
      else goHome(false);
    }

    document.addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'textarea' || tag === 'input' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'p' || e.key === 'P') { togglePrint(); return; }
      if (document.body.classList.contains('print-view')) return;
      if (e.key === 'n' || e.key === 'N') { toggleNotes(); return; }
      if (e.key === 'd' || e.key === 'D') { AX.theme.toggle(); return; }
      if (!cur) return;
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); step(1); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); step(-1); break;
        case 'Home': e.preventDefault(); open(cur.chapter.session.id, 0); break;
        case 'End': e.preventDefault(); open(cur.chapter.session.id, cur.chapter.slides.length - 1); break;
        case 'Escape': goHome(); break;
      }
    });
    window.addEventListener('resize', fit);
    narrow.addEventListener('change', fit);

    function route() {
      const m = /^#([\w-]+)(?:\/(\d+))?$/.exec(location.hash);
      if (!m || m[1] === 'home') goHome(false);
      else open(m[1], (parseInt(m[2], 10) || 1) - 1, false);
    }
    window.addEventListener('hashchange', route);
    if (store.get('notes', false)) toggleNotes(true);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
