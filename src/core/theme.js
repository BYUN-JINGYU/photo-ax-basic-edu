// 밝은·어두운 화면 바꾸기. <html data-theme> 하나만 바꾸고, 색은 base.css 의 토큰이 맡는다.
// 처음에는 저장된 선택, 없으면 운영체제 설정을 따른다. 인쇄 보기는 늘 밝게.
(function () {
  const { store } = AX.util;
  const root = document.documentElement;
  const sys = () => (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  let chosen = store.get('theme', null);
  let held = false;
  const listeners = [];

  const current = () => chosen || sys();
  function apply() {
    root.dataset.theme = held ? 'light' : current();
    listeners.forEach(fn => fn(current()));
  }
  function toggle() {
    chosen = current() === 'dark' ? 'light' : 'dark';
    store.set('theme', chosen);
    root.classList.add('theme-anim');
    apply();
    setTimeout(() => root.classList.remove('theme-anim'), 400);
  }
  // 인쇄 보기 동안 밝게 고정
  function hold(on) { held = on; apply(); }
  // 버튼: 지금 상태에 맞춰 이름이 바뀐다
  function button(cls) {
    const b = AX.util.h('button', { class: cls, onclick: toggle, title: '화면 밝기 바꾸기 (D)' });
    const sync = t => { b.textContent = t === 'dark' ? '☀ 밝게' : '☾ 어둡게'; };
    listeners.push(sync); sync(current());
    return b;
  }

  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (!chosen) apply(); });
  apply();
  AX.theme = { toggle, hold, button, current };
})();
