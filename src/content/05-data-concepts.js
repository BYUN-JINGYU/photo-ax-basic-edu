// 5장 앞부분 개념 쪽: Datalake, SQL, API, API 와 MCP. 05-mcp-data.js 가 이 쪽들을 끼워 넣는다.
// (파일 이름 순서로 05-mcp-data.js 보다 먼저 읽힌다)
AX.parts = AX.parts || {};
AX.parts.data = {
  intro: [
    {
      title: 'Datalake: 회사 데이터가 모이는 큰 호수',
      pic: 'datalake',
      points: [
        '**Datalake**: 설비·계측·생산 기록을 **원래 모양 그대로** 모아 둔 저장소',
        '꺼낼 때는 **SQL** 로 고릅니다. 사내 Datalake 는 **Impala SQL**',
        '**Bigdataquery**: SQL 을 보내고 결과를 표로 받는 사내 Python 라이브러리'
      ],
      notes: '창고(Data Warehouse)는 정리된 표만 넣고, 호수(Datalake)는 로그·파일·표를 원래 모양대로 쌓아 두었다가 꺼낼 때 고릅니다. Impala 는 큰 데이터 위에서 SQL 을 빠르게 돌리는 엔진입니다. 큰 테이블은 보통 날짜로 나뉘어(파티션) 있어 WHERE 에 날짜 조건을 넣으면 훨씬 빠릅니다. 수강생이 Bigdataquery 문법을 알 필요는 없습니다. 실습용 테이블 이름을 칠판에 적어 두세요.'
    },
    {
      title: 'SQL: 표에게 묻는 말, 단어 네 개',
      points: [
        '**SQL**: 데이터베이스에 묻는 말. 단어 네 개면 충분합니다',
        '**SELECT** 어떤 칸 · **FROM** 어느 표 · **WHERE** 어떤 줄 · **LIMIT** 몇 줄',
        'SQL 은 에이전트가 씁니다. 우리는 네 단어를 **읽을 줄**만 알면 됩니다'
      ],
      demo: 'sql',
      demoProps: {
        table: 'eqp_alarm', limit: 5,
        columns: [
          { key: 'alarm_time', label: '알람 시각' }, { key: 'eqp_id', label: '설비' },
          { key: 'alarm_name', label: '알람' }, { key: 'stop_min', label: '멈춘 분' }
        ],
        wheres: [
          { label: '조건 없음' },
          { label: 'EQP-03 만', test: { key: 'eqp_id', op: '=', value: 'EQP-03' } },
          { label: '온도 높음 만', test: { key: 'alarm_name', op: '=', value: '온도 높음' } },
          { label: '30분 이상', test: { key: 'stop_min', op: '>=', value: 30 } }
        ],
        rows: [
          { alarm_time: '10-01 02:47', eqp_id: 'EQP-03', alarm_name: '온도 높음', stop_min: 27 },
          { alarm_time: '10-01 04:41', eqp_id: 'EQP-05', alarm_name: '도어 열림', stop_min: 3 },
          { alarm_time: '10-01 05:41', eqp_id: 'EQP-03', alarm_name: '온도 높음', stop_min: 38 },
          { alarm_time: '10-01 06:41', eqp_id: 'EQP-03', alarm_name: '통신 끊김', stop_min: 6 },
          { alarm_time: '10-01 08:35', eqp_id: 'EQP-03', alarm_name: '온도 높음', stop_min: 32 },
          { alarm_time: '10-01 09:25', eqp_id: 'EQP-03', alarm_name: '도어 열림', stop_min: 3 },
          { alarm_time: '10-01 09:36', eqp_id: 'EQP-01', alarm_name: '통신 끊김', stop_min: 4 },
          { alarm_time: '10-01 10:19', eqp_id: 'EQP-02', alarm_name: '통신 끊김', stop_min: 10 },
          { alarm_time: '10-01 11:06', eqp_id: 'EQP-01', alarm_name: '도어 열림', stop_min: 3 },
          { alarm_time: '10-01 11:10', eqp_id: 'EQP-04', alarm_name: '압력 낮음', stop_min: 11 },
          { alarm_time: '10-01 11:15', eqp_id: 'EQP-02', alarm_name: '온도 높음', stop_min: 39 },
          { alarm_time: '10-01 11:55', eqp_id: 'EQP-03', alarm_name: '온도 높음', stop_min: 13 }
        ],
        hint: '칸을 눌러 넣고 빼 보세요. 조건을 바꾸면 **WHERE** 줄이 생기고 결과가 줄어듭니다. 데이터는 실습 키트의 가상 데이터 일부입니다.'
      },
      notes: '사내 Datalake 는 Impala SQL 을 씁니다. 오늘 쓰는 네 단어(SELECT, FROM, WHERE, LIMIT)는 Impala 에서도 표준 SQL 과 같습니다. 글자 값은 작은따옴표(\'EQP-03\'), 숫자는 그대로 씁니다. "WHERE 와 LIMIT 이 없는 SQL 은 위험하다"를 다음 데이터 규칙과 연결하세요.'
    },
    {
      title: 'API: 프로그램끼리 주문하는 창구',
      points: [
        '**API**: 다른 프로그램에게 **정해진 형식으로 주문**하는 창구',
        '식당과 같습니다. 메뉴판(문서)을 보고 주문(요청) → 음식(응답)',
        '주문서에는 **주소 · 방식 · 열쇠(키)**. GET 은 받기, POST 는 보내기'
      ],
      demo: 'api',
      demoProps: {
        base: 'http://사내-API-주소/v1', key: 'Bearer <내 API 키>',
        items: [
          { label: '설비 목록 받기', method: 'GET', path: '/eqps', res: '["EQP-01", "EQP-02", "EQP-03", "EQP-04", "EQP-05", "EQP-06"]', say: '**GET** 은 "받기". 읽기만 하니 안전합니다' },
          { label: '어제 알람 건수', method: 'GET', path: '/alarms/count?date=2026-10-01', res: '{\n  "EQP-03": 14,\n  "EQP-06": 5,\n  "EQP-01": 5\n}', say: '주소 뒤 `?date=` 가 **조건**입니다. SQL 의 WHERE 와 같은 역할' },
          { label: '메신저로 알림 보내기', method: 'POST', path: '/messages', body: '{ "to": "우리팀", "text": "EQP-03 온도 알람 급증" }', res: '{ "ok": true, "id": "m-2041" }', say: '**POST** 는 "보내기". 무언가를 바꾸므로 6장 권한에서 **ask** 로 둡니다' }
        ],
        hint: '주소와 키는 예시입니다. 키는 비밀번호와 같아서 코드에 직접 쓰지 않고 환경변수로 둡니다.'
      },
      notes: '쓰는 법은 세 단계입니다: 문서에서 주소와 방식을 찾고 → 키를 받고 → 요청을 보내 JSON 응답을 받습니다. 파이썬이면 requests.get(주소, headers=...) 한 줄이고, 이것도 에이전트가 씁니다. 수강생은 "어떤 주소에 무엇을 보내면 무엇이 오는지"만 말하면 됩니다.'
    }
  ],
  compare: [
    {
      title: 'API 와 MCP, 무엇이 다른가',
      pic: 'apimcp',
      points: [
        'MCP 는 API 를 **AI 가 쓰기 좋게 감싼 것**입니다',
        'MCP 서버를 열어 보면 안에서 결국 **API·SQL** 을 부릅니다 (뒤쪽 코드 한 장)',
        '한 흐름: API 부르는 함수 → **툴**로 설명 → **MCP 서버**로 제공'
      ],
      notes: '자주 나오는 질문: "MCP 가 있으면 API 는 필요 없나요?" 답: 아닙니다. MCP 는 API 위에 얹는 층입니다. 이미 사내 API 가 있으면 MCP 서버는 그 API 를 부르는 얇은 포장지가 됩니다.'
    },
    {
      title: 'MCP 서버를 연결하면 일어나는 일',
      pic: 'mcpflow',
      points: [
        '① 인사 → ② **툴 목록 받기** → ③ **툴 부르기**. 이 세 마디가 전부',
        '받는 건 **이름 · 설명 · 입력 형식**뿐. 서버 코드는 설치되지 않습니다',
        '`127.0.0.1` 주소면 **내 PC 안**에서만 도는 서버입니다'
      ],
      notes: 'MCP 는 Anthropic 이 2024년 11월 공개한 공개 규격입니다. 연결 방식은 두 가지: 주소(URL)로 이미 떠 있는 서버에 붙거나, 명령(npx·uv 등)으로 내 PC 에서 서버를 띄워 표준 입출력으로 주고받습니다. 127.0.0.1(localhost)은 내 컴퓨터 자신이고 :8790 같은 숫자는 포트입니다. 옆 사람이 같은 주소를 넣어도 자기 PC 를 가리킵니다. 실제 업무로 옮기면 "어떤 데이터까지, 누구에게, 읽기만?"을 정해야 합니다. 툴을 만드는 일은 권한을 정하는 일이기도 합니다.'
    }
  ]
};
