export const getOttImage = (name) => {
  switch (name.toLowerCase()) {
    case 'disney+':
      return "/assets/imgs/disney.png";
    case 'chatgpt':
      return "/assets/imgs/ChatGPT.svg";
    case 'tving':
      return "/assets/imgs/tving.png";
    case 'watcha':
      return "/assets/imgs/watcha.png";
    case 'wavve':
      return "/assets/imgs/wavve.png";
    default:
      return "/assets/imgs/default.png"; // 기본 이미지 경로
  }
};