// SQL 놀이터: 칸(SELECT) · 조건(WHERE) 을 고르면 SQL 문장과 결과 표가 같이 바뀐다.
// props: { table, columns:[{ key, label }], rows:[{...}], wheres:[{ label, sql, test:{ key, op, value } }], limit, hint }
(function () {
  const { h, demoPanel } = AX.util;
  const OPS = { '=': (a, b) => a === b, '>=': (a, b) => a >= b };
  const quote = v => typeof v === 'number' ? String(v) : `'${v}'`;

  function mount(el, props) {
    const picked = new Set(props.columns.slice(0, 2).map(c => c.key));
    let where = 0;
    const sqlBox = h('pre', { class: 'sq-sql' });
    const result = h('div', { class: 'sq-result' });
    const count = h('div', { class: 'sq-count' });

    const colBtns = props.columns.map(c => h('button', { class: 'sq-chip', onclick: () => {
      if (picked.has(c.key) && picked.size > 1) picked.delete(c.key); else picked.add(c.key);
      draw();
    } }, c.key));
    const whereSeg = AX.ui.segmented(props.wheres.map((w, i) => ({ value: String(i), label: w.label })), '0', v => { where = +v; draw(); }, { size: 'small' });

    // 한 줄 = [SQL 단어, 내용, 우리말 뜻]
    const line = (kw, body, say) => h('div', { class: 'sq-line' }, h('b', {}, kw), h('span', {}, body), h('em', {}, say));
    function draw() {
      const cols = props.columns.filter(c => picked.has(c.key));
      const w = props.wheres[where];
      colBtns.forEach((b, i) => b.classList.toggle('on', picked.has(props.columns[i].key)));
      sqlBox.replaceChildren(
        line('SELECT', cols.map(c => c.key).join(', '), '어떤 칸을'),
        line('FROM', props.table, '어느 표에서'),
        ...(w.test ? [line('WHERE', `${w.test.key} ${w.test.op} ${quote(w.test.value)}`, '어떤 줄만')] : []),
        line('LIMIT', String(props.limit), '몇 줄까지'));
      const hits = props.rows.filter(r => !w.test || OPS[w.test.op](r[w.test.key], w.test.value));
      result.replaceChildren(h('table', { class: 'tbl sq-tbl' },
        h('thead', {}, h('tr', {}, cols.map(c => h('th', {}, c.label)))),
        h('tbody', {}, hits.slice(0, props.limit).map(r => h('tr', {}, cols.map(c => h('td', {}, String(r[c.key]))))))));
      count.textContent = `조건에 맞는 줄 ${hits.length}개 중 ${Math.min(hits.length, props.limit)}개 표시 (예시 ${props.rows.length}줄에서)`;
    }

    const panel = demoPanel('SQL 놀이터: 칸과 조건을 골라 보세요', props.hint);
    panel.append(h('div', { class: 'sq-grid' },
      h('div', { class: 'sq-left' },
        h('div', { class: 'sheet-label' }, 'SELECT 어떤 칸을 (여러 개)'), h('div', { class: 'sq-chips' }, colBtns),
        h('div', { class: 'sheet-label' }, 'WHERE 어떤 줄만'), whereSeg, sqlBox),
      h('div', { class: 'sq-right' }, result, count)), panel.hintEl);
    el.append(panel);
    draw();
  }

  AX.demos['sql'] = { mount };
})();
