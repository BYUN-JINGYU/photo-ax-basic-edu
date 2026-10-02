// 전역 네임스페이스. 콘텐츠·데모·엔진이 여기에 등록된다 (단일 HTML로 묶이므로 모듈 대신 사용).
window.AX = {
  content: [],   // 세션 배열 (content/*.js 가 push)
  demos: {},     // 데모 레지스트리: 이름 -> mount(el, props)
  util: {}
};
