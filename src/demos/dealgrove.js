// 딜-그로브 미니 시뮬레이터: 온도·시간·분위기 → 두께. 실리콘 큐브 위에 산화막이 자란다 (CSS 3D, 라이브러리 없음).
(function () {
  const { h, demoPanel } = AX.util;
  const K = 8.617e-5;
  const PX_PER_UM = 60;     // 과장 배율: 1 μm = 60 px
  const MAX_PX = 170;

  // DealGrove.md 와 같은 상수
  function dealGrove(tempC, hours, wet) {
    const kT = K * (tempC + 273.15);
    const B = wet ? 386 * Math.exp(-0.78 / kT) : 772 * Math.exp(-1.23 / kT);
    const BA = wet ? 1.63e8 * Math.exp(-2.05 / kT) : 6.23e6 * Math.exp(-2.0 / kT);
    const A = B / BA;
    const xi = wet ? 0 : 0.025;
    const tau = (xi * xi + A * xi) / B;
    const x = (A / 2) * (Math.sqrt(1 + 4 * B * (hours + tau) / (A * A)) - 1);
    return { B, A, tau, x };
  }

  // 직육면체: 바닥 평면 x∈[0,w], y∈[0,d], 높이 z∈[0,h]. 면마다 transform-origin 은 왼쪽 위.
  // rotateX(90deg): div 의 세로축을 z 로 세운다. rotateY(-90deg): div 의 가로축을 z 로 세운다.
  function box(w, d, cls) {
    const el = h('div', { class: 'dg-box ' + cls, style: `width:${w}px;height:${d}px` });
    const faces = {};
    ['back', 'left', 'right', 'front', 'top'].forEach(f => { faces[f] = h('div', { class: 'dg-face ' + f }); el.append(faces[f]); });
    const setHeight = hh => {
      faces.top.style.cssText = `width:${w}px;height:${d}px;transform:translateZ(${hh}px)`;
      faces.front.style.cssText = `width:${w}px;height:${hh}px;transform:translateY(${d}px) rotateX(90deg)`;
      faces.back.style.cssText = `width:${w}px;height:${hh}px;transform:rotateX(90deg)`;
      faces.left.style.cssText = `width:${hh}px;height:${d}px;transform:rotateY(-90deg)`;
      faces.right.style.cssText = `width:${hh}px;height:${d}px;transform:translateX(${w}px) rotateY(-90deg)`;
    };
    return { el, setHeight };
  }

  function mount(el) {
    const panel = demoPanel('딜-그로브 미니 시뮬레이터', '4장에서 에이전트에게 만들게 할 것의 축소판입니다. 그림의 층 높이는 보기 좋게 **과장**했고(1 μm = 60 px), 숫자는 DealGrove.md 수식 그대로입니다.');
    const temp = h('input', { type: 'range', min: '800', max: '1200', step: '10', value: '1000', 'aria-label': '온도' });
    const time = h('input', { type: 'range', min: '0', max: '10', step: '0.1', value: '1', 'aria-label': '시간' });
    const tVal = h('b'), hVal = h('b');
    const wetBtn = h('button', { class: 'btn small' }, '습식');
    const dryBtn = h('button', { class: 'btn small primary' }, '건식');
    let wet = false;

    const scene = h('div', { class: 'dg-scene' });
    const world = h('div', { class: 'dg-world' });
    const sub = box(180, 180, 'sub');
    const ox = box(180, 180, 'ox');
    sub.setHeight(56);
    ox.el.style.transform = 'translateZ(56px)';
    world.append(sub.el, ox.el);
    scene.append(world);

    const thick = h('div', { class: 'dg-thick' });
    const regime = h('div', { class: 'dg-regime' });
    const consts = h('div', { class: 'dg-consts' });

    const render = () => {
      const T = +temp.value, t = +time.value;
      tVal.textContent = T + ' °C'; hVal.textContent = t.toFixed(1) + ' h';
      const r = dealGrove(T, t, wet);
      const px = Math.min(MAX_PX, Math.max(r.x > 0 ? 2 : 0, r.x * PX_PER_UM));
      ox.setHeight(px);
      thick.innerHTML = `<b>${Math.round(r.x * 1000).toLocaleString()}</b> nm <span>(${r.x.toFixed(3)} μm)</span>`;
      regime.textContent = r.x < r.A ? '얇은 구간: 반응 속도(B/A)가 성장을 정합니다. 시간에 비례' : '두꺼운 구간: 산소 확산(B)이 성장을 정합니다. √시간에 비례';
      consts.innerHTML = `B = ${r.B.toFixed(4)} μm²/h &nbsp; A = ${r.A.toFixed(4)} μm &nbsp; τ = ${r.tau.toFixed(3)} h`;
      scene.style.setProperty('--heat', String((T - 800) / 400));
    };
    const setWet = w => { wet = w; wetBtn.classList.toggle('primary', w); dryBtn.classList.toggle('primary', !w); render(); };
    wetBtn.addEventListener('click', () => setWet(true));
    dryBtn.addEventListener('click', () => setWet(false));
    temp.addEventListener('input', render);
    time.addEventListener('input', render);

    panel.append(
      h('div', { class: 'dg-grid' },
        h('div', { class: 'dg-controls' },
          h('label', {}, h('span', {}, '온도 ', tVal), temp),
          h('label', {}, h('span', {}, '시간 ', hVal), time),
          h('div', { class: 'row' }, dryBtn, wetBtn),
          h('div', { class: 'dg-formula' }, 'x² + A·x = B·(t + τ)'),
          consts),
        scene,
        h('div', { class: 'dg-read' }, thick, regime)),
      panel.hintEl);
    el.append(panel);
    render();
  }

  AX.demos['dealgrove'] = { mount };
  AX.dealGrove = dealGrove;
})();
