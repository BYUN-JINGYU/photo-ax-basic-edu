// 자동완성 → 채팅 → 에이전트. 탭을 바꾸면 화면 흉내와 "누가 하나" 표가 함께 바뀐다
(function () {
  const { h, fmt, demoPanel } = AX.util;
  const JOBS = ['코드 쓰기', '파일에 넣기', '실행하기', '결과 보고 고치기'];
  const WHO = { me: ['사람', ''], half: ['반반', 'warn'], ai: ['AI', 'acc'] };

  const code = (lines) => h('pre', { class: 'ev-code' }, lines.map(([t, cls]) => h('span', { class: cls || '' }, t + '\n')));
  const ERAS = [
    { key: '자동완성', meta: '2021~ · GitHub Copilot', who: ['half', 'me', 'me', 'me'],
      say: '내가 치는 동안 **다음 줄을 회색으로** 추천합니다. Tab 을 눌러야 들어갑니다',
      mock: () => code([['def split_bill(total, people):'], ['    """회식비를 사람 수로 나눈다"""'], ['    return round(total / people, -2)', 'ev-ghost'], ['                      Tab 으로 받기', 'ev-hint']]) },
    { key: '채팅', meta: '2022~ · ChatGPT', who: ['ai', 'me', 'me', 'me'],
      say: '물어보면 **코드를 통째로** 답합니다. 붙여넣고 돌려 보는 건 내 몫',
      mock: () => h('div', { class: 'ev-chat' },
        h('div', { class: 'ev-bubble me' }, '회식비 더치페이 계산 함수 만들어줘'),
        h('div', { class: 'ev-bubble ai' }, '이 코드를 쓰세요:', code([['def split_bill(total, people):'], ['    ...']])),
        h('div', { class: 'ev-hint' }, '복사 → 붙여넣기 → 실행 → 에러 나면 다시 질문')) },
    { key: '에이전트', meta: '2024~ · OpenCode', who: ['ai', 'ai', 'ai', 'ai'],
      say: '파일을 **읽고, 만들고, 실행하고, 고칩니다**. 나는 요청하고 결과를 확인합니다',
      mock: () => code([['→ Read  회식비.xlsx', 'ev-tool'], ['→ Write work/dutch.html', 'ev-tool'], ['→ Bash  python check.py', 'ev-tool'], ['✓ 248,000원 ÷ 8명 = 31,000원', 'ev-ok'], ['끝났습니다. 브라우저로 열어 보세요.']]) }
  ];

  function mount(el) {
    const panel = demoPanel('누가 무엇을 하나', '탭을 눌러 보세요. 파란 칸이 늘어날수록 더 많이 맡깁니다.');
    const meta = h('span', { class: 'ev-meta' });
    const mock = h('div', { class: 'ev-mock sheet' });
    const jobs = h('ul', { class: 'ev-jobs' });
    const say = h('div', { class: 'ev-say' });
    const tabs = AX.ui.segmented(ERAS.map(e => e.key), ERAS[0].key, render);
    function render(key) {
      const e = ERAS.find(x => x.key === key);
      meta.textContent = e.meta;
      mock.replaceChildren(e.mock());
      jobs.replaceChildren(...JOBS.map((j, i) => {
        const [label, cls] = WHO[e.who[i]];
        return h('li', { class: e.who[i] }, h('span', {}, j), h('span', { class: 'badge ' + cls }, label));
      }));
      say.innerHTML = fmt(e.say);
    }
    panel.append(h('div', { class: 'ev-top' }, tabs, meta), h('div', { class: 'ev-grid' }, mock, jobs), say, panel.hintEl);
    el.append(panel);
    render(ERAS[0].key);
  }

  AX.demos['evolution'] = { mount };
})();
