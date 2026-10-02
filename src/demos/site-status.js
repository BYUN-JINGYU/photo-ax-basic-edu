// 사내 정보 점검: src/site/site.js 의 항목마다 확인 여부와, 그 항목을 쓰는 슬라이드를 모아 보여 준다.
// 슬라이드 목록은 콘텐츠의 site 키에서 자동으로 찾는다. 항목을 누르면 그 쪽으로 이동.
(function () {
  const { h, chapterTag } = AX.util;

  function usages(key) {
    return AX.content.flatMap(c => c.slides.map((s, i) => ({ c, s, i })).filter(x => x.s.site === key))
      .map(({ c, s, i }) => ({ tag: chapterTag(AX.content, c), title: s.title, hash: `#${c.id}/${i + 1}` }));
  }

  function mount(el) {
    const keys = Object.keys(AX.site);
    const left = keys.filter(k => !AX.site[k].checked).length;
    const rows = keys.map(k => {
      const it = AX.site[k];
      return h('div', { class: 'ss-row' + (it.checked ? ' ok' : '') },
        h('span', { class: 'badge ' + (it.checked ? 'ok' : 'warn') }, it.checked ? '✓ 사내 확인' : '! 사외 기준'),
        h('div', {}, h('b', {}, it.label), h('code', {}, `AX.site.${k}`)),
        h('div', { class: 'ss-links' }, usages(k).map(u => h('a', { href: u.hash }, `${u.tag}장 ${u.title}`))));
    });
    el.append(h('div', { class: 'demo' },
      h('div', { class: 'demo-head' }, h('b', {}, 'src/site/site.js'), h('span', { class: 'spacer' }),
        h('span', { class: 'badge ' + (left ? 'warn' : 'ok') }, left ? `남은 항목 ${left}개` : '모두 확인')),
      h('div', { class: 'ss-list' }, rows)));
  }

  AX.demos['site-status'] = { mount };
})();
