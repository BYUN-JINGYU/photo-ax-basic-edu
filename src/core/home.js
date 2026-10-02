// 홈 화면: 제목 + 웨이퍼 히어로 + 장 그리드(3열) + 시작하기 링크. 항목을 누르면 onOpen(sessionId).
(function () {
  const { h, chapterNo } = AX.util;

  function create(sessions, onOpen) {
    const info = AX.home;
    const chapters = sessions.filter(s => s.kind === 'session');
    const aux = sessions.filter(s => s.kind !== 'session');

    // 타일 윗선 = 진행 막대. 장이 뒤로 갈수록 길어진다
    const grid = h('nav', { class: 'toc', 'aria-label': '목차' }, chapters.map(s => {
      const r = chapterNo(sessions, s) / chapters.length;
      return h('button', { class: 'toc-card', onclick: () => onOpen(s.id) },
        h('span', { class: 'ox-bar', style: `--r:${r}` }),
        h('span', { class: 't' }, String(chapterNo(sessions, s))),
        h('span', { class: 'n' }, s.title),
        h('span', { class: 's' }, s.short),
        h('span', { class: 'm' }, s.slides.length + '쪽'));
    }));

    const links = h('div', { class: 'home-links' }, aux.map(s =>
      h('button', { class: 'aux-link', onclick: () => onOpen(s.id) }, h('b', {}, s.title), h('span', {}, s.short))));

    return h('section', { class: 'home' },
      h('div', { class: 'home-hero' },
        h('div', { class: 'home-text' },
          h('div', { class: 'home-kicker' }, info.kicker || ''),
          h('h1', {}, info.title),
          info.subtitle ? h('p', { class: 'home-sub', html: AX.util.esc(info.subtitle).replace(/\n/g, '<br>') }) : '',
          info.credit ? h('div', { class: 'home-credit' }, info.credit) : ''),
        h('div', { class: 'home-art' },
          AX.art.wafer({ n: chapters.length, total: chapters.length, w: 280, h: 230, animate: true }),
          h('div', { class: 'chap-cap' }, h('span', {}, '샷이 찍히듯, 하루가 채워집니다'), h('b', {}, `${chapters.length}장`)))),
      grid,
      h('div', { class: 'home-aux' }, links, AX.theme.button('aux-link theme-toggle'),
        h('div', { class: 'home-foot' }, '장 안에서 ', h('kbd', {}, '←'), ' ', h('kbd', {}, '→'), ' 이동  ', h('kbd', {}, 'Esc'), ' 홈  ', h('kbd', {}, 'N'), ' 강사 노트  ', h('kbd', {}, 'P'), ' 인쇄 보기  ', h('kbd', {}, 'D'), ' 밝기')));
  }

  AX.homeView = { create };
})();
