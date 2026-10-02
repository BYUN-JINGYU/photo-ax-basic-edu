// 양식 → 완성 텍스트 생성기. 하나의 팩토리로 요청문·데이터 요청·SKILL.md 세 가지를 만든다.
(function () {
  const { h, copy, demoPanel } = AX.util;

  function makeBuilder(cfg) {
    return function mount(el, props = {}) {
      const panel = demoPanel(cfg.title, cfg.hint);
      const inputs = {};
      const fields = h('div', { class: 'fields' });
      const defs = props.defaults || {};
      cfg.fields.forEach(f => {
        const ta = h('textarea', { rows: f.rows || 2, placeholder: f.ph || '' }, defs[f.key] ?? f.def ?? '');
        inputs[f.key] = ta;
        fields.append(h('label', {}, f.label, f.sub ? h('span', {}, f.sub) : null, ta));
      });
      const out = h('pre');
      const btn = h('button', { class: 'btn small primary', onclick: () => copy(out.textContent, btn) }, '복사');
      const render = () => {
        const v = {};
        for (const k in inputs) v[k] = inputs[k].value.trim();
        out.textContent = cfg.template(v);
      };
      Object.values(inputs).forEach(i => i.addEventListener('input', render));
      panel.append(h('div', { class: 'builder' },
        fields,
        h('div', { class: 'out' }, out, h('div', { class: 'row' }, h('span', { style: 'font-size:13px;color:var(--mute)' }, cfg.outLabel), btn))),
        panel.hintEl);
      el.append(panel);
      render();
    };
  }

  const or = (v, d) => v || d;

  // 3장: 좋은 요청의 4요소
  AX.demos['prompt-builder'] = {
    mount: makeBuilder({
      title: '요청문 만들기',
      hint: '네 칸을 채우면 오른쪽에 요청문이 완성됩니다. 복사해서 OpenCode 입력창에 붙여넣으세요.',
      outLabel: 'OpenCode에 붙여넣을 요청문',
      fields: [
        { key: 'goal', label: '목표', sub: '무엇을 만들까', def: '브라우저에서 도는 스캐너 노광 3D 패터닝 시뮬레이터' },
        { key: 'input', label: '입력', sub: '어떤 파일·데이터', def: 'Scanner.md (레일리 식·광원 표·검산값), lib/three.min.js' },
        { key: 'output', label: '출력', sub: '어떤 형태로', def: 'work/simulator.html 한 파일. 왼쪽에 광원 버튼과 NA·k1·하프피치 슬라이더, 가운데 회색 웨이퍼 위 파란 레지스트 줄무늬' },
        { key: 'limit', label: '제약', sub: '하지 말 것', def: '인터넷 없음(lib 폴더의 파일만 사용), Scanner.md 수정 금지, 검산값과 비교해 확인' }
      ],
      template: v => [
        `목표: ${or(v.goal, '(무엇을 만들지)')}`,
        `입력: ${or(v.input, '(어떤 파일을 읽을지)')}`,
        `출력: ${or(v.output, '(결과물 형태)')}`,
        `제약: ${or(v.limit, '(하지 말 것)')}`,
        '',
        '먼저 plan 모드로 단계별 계획을 보여주고, 내가 확인하면 build로 진행해줘.'
      ].join('\n')
    })
  };

  // 4장: Datalake 데이터 요청 3요소 (+ 안전장치)
  AX.demos['data-request'] = {
    mount: makeBuilder({
      title: 'Datalake 데이터 요청문',
      hint: '`Bigdataquery` 코드는 에이전트가 씁니다. 우리는 무슨 데이터·어떤 조건·어떤 형태만 말하면 됩니다. 상한은 **항상** 적으세요.',
      outLabel: 'OpenCode에 붙여넣을 요청문',
      fields: [
        { key: 'what', label: '무슨 데이터', sub: '테이블·항목 (모르면 "조회 가능한 테이블 목록 보여줘"부터)', def: '' },
        { key: 'cond', label: '어떤 조건', sub: '기간·라인·설비', def: '' },
        { key: 'form', label: '어떤 형태', sub: 'CSV·표·차트', def: '' },
        { key: 'cap', label: '상한', sub: '행 수 제한', def: '최대 10,000행' }
      ],
      template: v => [
        '사내 Bigdataquery 라이브러리와 Impala SQL 로 Datalake에서 데이터를 가져와줘.',
        `- 무슨 데이터: ${or(v.what, '(테이블·항목)')}`,
        `- 조건: ${or(v.cond, '(기간·라인·설비)')}`,
        `- 결과 형태: ${or(v.form, '(저장 위치·형식)')}`,
        `- 상한: ${or(v.cap, '최대 10,000행')}`,
        '- 규칙: SELECT 조회만, 결과 파일은 work 폴더 안에만, 개인정보 컬럼은 제외',
        '',
        '실행 전에 사용할 쿼리를 먼저 보여줘.'
      ].join('\n')
    })
  };

  // 6장: SKILL.md 생성기
  AX.demos['skill-builder'] = {
    mount: makeBuilder({
      title: 'SKILL.md 만들기',
      hint: '폴더 이름이 곧 스킬 이름입니다. 파일명은 대문자 SKILL.md.',
      outLabel: 'SKILL.md 내용',
      fields: [
        { key: 'name', label: '스킬 이름', sub: '영문 소문자와 하이픈', rows: 1 },
        { key: 'when', label: '언제 쓰나', sub: '에이전트가 이 설명을 보고 꺼내 씁니다' },
        { key: 'steps', label: '순서', sub: '한 줄에 한 단계', rows: 3 },
        { key: 'dont', label: '하지 말 것', rows: 2 },
        { key: 'out', label: '결과물', rows: 1 }
      ],
      template: v => {
        const steps = or(v.steps, '').split('\n').filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join('\n');
        const dont = or(v.dont, '').split('\n').filter(Boolean).map(s => `- ${s}`).join('\n');
        return [
          '---',
          `name: ${or(v.name, 'my-skill')}`,
          `description: ${or(v.when, '(언제 쓰는 스킬인지)')}`,
          '---',
          '',
          `# ${or(v.name, 'my-skill')}`,
          '',
          '## 순서',
          steps || '1. (첫 단계)',
          '',
          '## 하지 말 것',
          dont || '- (금지 사항)',
          '',
          '## 결과물',
          or(v.out, '(파일 이름과 형식)')
        ].join('\n');
      }
    })
  };
})();
