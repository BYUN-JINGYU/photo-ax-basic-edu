// 부록 그림: 하루 시간표(막대), 교안 사용법
(function () {
  const { svg, T, arrow, block, doc, key, pill } = AX.pic;

  AX.pics.timetable = () => {
    const k = 3.2, row = (y, items) => {
      let x = 0;
      return items.map(([t, m, c, s]) => {
        const w = m * k, out = block(x, y, w - 6, 64, { t: w > 90 ? t : '', s: w > 150 ? s : '', c, d: 12, ts: 14 }) +
          T(w <= 90 ? x : x + w / 2 - 3, y + 86, w <= 90 ? `${t} ${m}분` : `${m}분`, { size: 12, c: 'm', w: 700, a: w <= 90 ? 'start' : 'middle' });
        x += w;
        return out;
      }).join('');
    };
    return svg(1000, 330, [
      T(0, 26, '오전  08:30 →', { size: 13, c: 'a', a: 'start', w: 800 }),
      row(56, [['시작', 10, 'mist', ''], ['1 바이브 코딩', 30, 'soft', '강의'], ['2 LLM', 55, 'soft', '기초 + 데모 + 퀴즈'], ['3 OpenCode', 55, 'soft', '터미널·설치·설정'], ['4 스캐너', 90, 'acc', '만들기 40 + 개선 25'], ['점심', 60, 'warn', '12:30 ~ 13:30']]),
      T(0, 196, '오후  13:30 →', { size: 13, c: 'a', a: 'start', w: 800 }),
      row(226, [['5 MCP·Data', 65, 'soft', '개념 25 + 실습 25'], ['6 하네스', 60, 'soft', '설명 + 스킬 실습'], ['7 에이전트', 40, 'soft', '데모 + 체험'], ['8 Git', 30, 'soft', ''], ['9 내 업무', 70, 'acc', '작업 35 + 공유 20']]),
      pill(860, 196, '17:55 끝', { c: 'acc', size: 13 })
    ]);
  };

  AX.pics.usage = () => svg(1000, 200, [
    key(0, 10, '←'), key(52, 10, '→'), T(48, 80, '쪽 이동', { size: 13, w: 600 }),
    key(130, 10, 'Esc', 60), T(160, 80, '홈', { size: 13, w: 600 }),
    key(220, 10, 'N'), T(242, 80, '강사 노트', { size: 13, w: 600 }),
    key(310, 10, 'P'), T(332, 80, '인쇄 보기', { size: 13, w: 600 }),
    key(400, 10, 'D'), T(422, 80, '밝기', { size: 13, w: 600 }),
    `<rect x="490" y="10" width="510" height="40" rx="20" class="pb line"/>`,
    T(512, 36, '…/AX교육_교안.html', { size: 14, c: 'm', a: 'start', mono: true }),
    T(676, 36, '#scanner/5', { size: 14, c: 'a', a: 'start', mono: true, w: 700 }),
    T(746, 80, '주소 끝 #장id/쪽 → 그 쪽으로 바로', { size: 13, w: 600 }),
    doc(0, 120, 130, 70, { t: 'site.js', lines: 3 }),
    arrow([[140, 155], [196, 155]], { label: '고치고' }),
    block(204, 130, 200, 50, { t: 'python build.py', c: 'dark', ts: 14, d: 10 }),
    arrow([[424, 155], [468, 155]], {}),
    doc(476, 120, 170, 70, { t: '교안.html', lines: 3, c: 'soft' }),
    T(800, 160, '사내 정보는 site.js 한 파일', { size: 14, c: 'a', w: 700 })
  ]);
})();
