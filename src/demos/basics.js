// 정적 소형 데모: 2단 비교, 표, 체크리스트, OpenCode 화면 스케치
(function () {
  const { h, fmt, store } = AX.util;

  // props: { cols:[{title, sub, rows:[], uv:true}], foot }
  AX.demos['compare'] = {
    mount(el, props) {
      const grid = h('div', { class: 'compare', style: `grid-template-columns: repeat(${(props.cols || []).length || 2}, minmax(0, 1fr))` });
      (props.cols || []).forEach(c => {
        grid.append(h('div', { class: 'compare-col' + (c.uv ? ' uv' : '') },
          h('h4', {}, c.title),
          c.sub ? h('div', { class: 's' }, c.sub) : null,
          h('ul', {}, c.rows.map(r => h('li', { html: fmt(r) })))));
      });
      if (props.foot) grid.append(h('div', { class: 'compare-foot', html: fmt(props.foot) }));
      el.append(grid);
    }
  };

  // props: { head:[], rows:[[]], split:true } split 이면 행을 반으로 나눠 두 표로 나란히
  AX.demos['table'] = {
    mount(el, props) {
      const table = rows => h('table', { class: 'tbl' },
        h('thead', {}, h('tr', {}, props.head.map(x => h('th', {}, x)))),
        h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => h('td', { html: fmt(c) }))))));
      const wrap = h('div', { class: 'tbl-wrap' + (props.split ? ' split' : '') });
      if (props.split) {
        const half = Math.ceil(props.rows.length / 2);
        wrap.append(table(props.rows.slice(0, half)), table(props.rows.slice(half)));
      } else wrap.append(table(props.rows));
      el.append(wrap);
    }
  };

  // props: { items:[], key:'저장키', done:'완료 문구' }
  AX.demos['checklist'] = {
    mount(el, props) {
      const key = 'check:' + (props.key || 'default');
      const state = store.get(key, []);
      const foot = h('div', { class: 'checklist-foot' });
      const list = h('ul', { class: 'checklist' });
      const boxes = [];
      const refresh = () => {
        const n = boxes.filter(b => b.checked).length;
        boxes.forEach(b => b.closest('label').classList.toggle('done', b.checked));
        foot.innerHTML = n === boxes.length
          ? '<b>모두 확인했습니다.</b> ' + (props.done || '')
          : `${n} / ${boxes.length} 확인`;
        store.set(key, boxes.map(b => b.checked));
      };
      props.items.forEach((t, i) => {
        const box = h('input', { type: 'checkbox', onchange: refresh });
        box.checked = !!state[i];
        boxes.push(box);
        list.append(h('li', {}, h('label', {}, box, h('span', { html: fmt(t) }))));
      });
      el.append(list, foot);
      refresh();
    }
  };

  // OpenCode 화면 스케치 (개념 설명용. 실제 UI는 버전마다 조금 다르다)
  AX.demos['opencode-sketch'] = {
    mount(el) {
      el.append(h('div', { class: 'sketch' },
        h('div', { class: 'bar' }, h('i', { class: 'dot' }), h('i', { class: 'dot' }), h('i', { class: 'dot' }), 'OpenCode: ax-day'),
        h('div', { class: 'body' },
          h('div', { class: 'msg me' }, 'DealGrove.md 를 읽고 핵심을 세 줄로 요약해줘'),
          h('div', { class: 'msg' }, 'DealGrove.md 를 읽겠습니다 … 1) x² + A·x = B·(t+τ) 2) 상수는 온도의 함수 3) 얇을 땐 반응, 두꺼울 땐 확산이 속도를 정함')),
        h('div', { class: 'input' }, '여기에 말로 요청합니다', h('span', { class: 'tag' }, '입력창')),
        h('div', { class: 'status' },
          h('span', {}, 'plan', h('span', { class: 'tag' }, '모드  Tab')),
          h('span', {}, 'MAX', h('span', { class: 'tag' }, '모델')),
          h('span', {}, 'session 1', h('span', { class: 'tag' }, '세션  /new')))));
    }
  };
})();
