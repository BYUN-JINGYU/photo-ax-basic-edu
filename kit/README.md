# 실습 키트 (ax-day 폴더)

수강생 PC마다 아래 구조로 복사해 둔다.

```
ax-day/
├── AGENTS.md        에이전트 규칙 (3장에서 /init 대신 써도 됨)
├── DealGrove.md     딜-그로브 모델 핸드아웃 (4장 실습의 입력)
├── 요청문.md         장별 요청문 모음
├── lib/
│   └── three.min.js 폐쇄망용 Three.js (r160, 키트에 포함)
├── data/            가상 설비 알람 데이터 eqp_alarm.csv (5·6장)
├── work/            결과물이 생기는 곳 (비워 둔다)
└── checkpoints/
    ├── 04/          4장 완성본 simulator.html (키트에 포함, ../../lib/three.min.js 사용)
    ├── 05/          5장 완성본 (eqp_alarm.csv + report.html 알람 차트)
    └── 06/          6장 완성본 (스킬 폴더 포함)
```

강사 준비:
- `lib/three.min.js`(r160) 와 `checkpoints/04/simulator.html` 은 키트에 들어 있다. 반입 절차가 있으면 이 두 파일만 신청하면 된다.
- `checkpoints/04/simulator.html` 은 브라우저로 열어 1000 °C · 1 h · 건식에서 70 nm 가 나오는지 리허설 때 한 번 확인한다.
- 5장 테이블 이름(예시: eqp_alarm)과 컬럼은 실제 Datalake 에 맞춰 `요청문.md` 와 교안 `src/site/site.js` 의 `datalake` 항목을 고친다.
- Datalake 접근이 막힌 PC 를 대비해 가상 데이터 `data/eqp_alarm.csv` 를 넣어 둔다 (키트에 포함).
- `checkpoints/05`, `06` 은 리허설 때 실제 사내 모델로 만든 결과물을 넣는다.
- 8장용: 전원 PC에 Git 설치, `git config --global user.name / user.email` 설정, github.samsungds.net 계정으로 저장소를 만들 수 있는지, Pages 가 켜져 있는지 확인한다.
- 3장 터미널 실습은 실습 폴더 위치(예: `C:\ax-day`)를 기준으로 한다. 위치가 다르면 교안 `src/site/site.js` 의 `run` 항목을 고친다.
