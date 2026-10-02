// Pages 설정 흉내: 저장소 Settings → Pages 에서 branch 방식으로 켜고 주소를 받는 순서를 눌러 본다.
// props: { host, repo, url, hint }
(function () {
  const { h, fmt, demoPanel } = AX.util;
  const { segmented } = AX.ui;

  function mount(el, props) {
    const s = { source: '', branch: 'None', folder: '/ (root)', saved: false };
    const note = h('div', { class: 'gp-note' });
    const url = h('div', { class: 'gp-url off' });
    const step = (n, label, ...body) => h('div', { class: 'gp-field' }, h('b', {}, h('span', { class: 'gp-step' }, n), label), ...body);

    const f1 = step(1, 'Source', segmented([{ value: 'branch', label: 'Deploy from a branch' }, { value: 'actions', label: 'GitHub Actions' }], '', v => { s.source = v; s.saved = false; draw(); }, { size: 'small' }));
    const f2 = step(2, 'Branch', h('div', { class: 'gp-row' },
      segmented(['None', 'main'], s.branch, v => { s.branch = v; s.saved = false; draw(); }, { size: 'small' }),
      segmented(['/ (root)', '/docs'], s.folder, v => { s.folder = v; s.saved = false; draw(); }, { size: 'small' })));
    const save = h('button', { class: 'btn small primary', onclick: () => { s.saved = true; draw(); } }, 'Save');
    const f3 = step(3, '저장', h('div', { class: 'gp-row' }, save, url));

    function draw() {
      const branchOk = s.source === 'branch', ready = branchOk && s.branch === 'main';
      f1.classList.toggle('done', !!s.source);
      f2.classList.toggle('wait', !branchOk);
      f2.classList.toggle('done', ready);
      f3.classList.toggle('wait', !ready);
      f3.classList.toggle('done', ready && s.saved);
      url.className = 'gp-url' + (ready && s.saved ? '' : ' off');
      url.replaceChildren(...(ready && s.saved ? ['Your site is live at ', h('code', {}, props.url)] : ['저장하면 주소가 여기 나옵니다']));
      note.innerHTML = fmt(
        s.source === 'actions' ? '오늘은 **branch 방식**입니다. Actions 는 빌드 과정이 필요한 사이트용입니다.' :
        !s.source ? '①부터 차례로 누르세요. 저장소 화면의 **Settings → Pages** 를 흉내 낸 것입니다.' :
        s.branch !== 'main' ? '② 에서 `main` 을 고르세요. 이 브랜치의 파일이 그대로 사이트가 됩니다.' :
        s.folder === '/docs' && !s.saved ? '`/docs` 를 고르면 `docs` 폴더 안의 `index.html` 이 첫 화면입니다.' :
        !s.saved ? '③ **Save**. 1~2분 뒤 주소가 열립니다.' :
        '이 주소를 팀에 보내면 끝입니다. 커밋하고 push 할 때마다 화면도 바뀝니다.');
    }

    const nav = h('div', { class: 'gp-nav' }, ...['General', 'Collaborators', 'Branches', 'Actions', 'Pages', 'Secrets'].map(t => h('span', { class: t === 'Pages' ? 'on' : '' }, t)));
    const panel = demoPanel(`${props.host} / ${props.repo} · Settings`, props.hint);
    panel.append(h('div', { class: 'gp-mock' }, nav, h('div', { class: 'gp-body' }, h('div', { class: 'gp-h' }, 'GitHub Pages'), f1, f2, f3, note)), panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['pages'] = { mount };
})();
