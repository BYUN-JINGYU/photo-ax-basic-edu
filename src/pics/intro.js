// 시작하기 그림: 하루의 계단, 오늘의 약속
(function () {
  const { svg, T, block, person, icon, tiles } = AX.pic;

  // 장이 갈수록 높아지는 계단. 마지막 칸에 깃발
  AX.pics.journey = () => {
    const steps = [['시뮬레이터', '4장 · 말로 만들기'], ['알람 차트', '5장 · Datalake'], ['리포트 스킬', '6장 · 규칙·스킬'],
      ['에이전트 팀', '7장 · 역할 분담'], ['저장·공유', '8장 · Git·Pages'], ['내 업무', '9장 · 적용']];
    const parts = steps.map(([t, s], i) => {
      const w = 138, x = 6 + i * 160, h = 62 + i * 26, y = 262 - h;
      return block(x, y, w, h, { t, s, c: i === 5 ? 'acc' : 'soft', d: 16, ts: 15 });
    });
    return svg(1000, 280, [
      ...parts,
      person(80, 182, { c: 'acc' }),
      icon('flag', 896, 56, 18)
    ]);
  };

  AX.pics.promise = () => tiles([
    ['shield', '마스킹 샘플', '실제 데이터는 5장 규칙대로'],
    ['hand', '막히면 손 들기', '체크포인트로 따라잡기'],
    ['search', '틀린 답도 공유', '틀리는 걸 보는 것도 교육'],
    ['clock', '서버는 다 같이', '"조별로"면 순서 지키기']
  ]);
})();
