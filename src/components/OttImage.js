export const getOttImage = (name) => {
  switch (name) {
    case '디즈니플러스':
      return "/assets/imgs/disney.png";
    case 'ChatGPT':
      return "/assets/imgs/ChatGPT.png";
    case '티빙':
      return "/assets/imgs/tving.png";
    default:
      return "/assets/imgs/default.png"; // 기본 이미지 경로
  }
};