import "./Main.css";

import React from "react";
import { useNavigate } from "react-router-dom";

// 빵 이미지의 위치를 배열로 정의
const breadPositions = [
  { left: "5%" },
  { left: "25%" },
  { left: "45%" },
  { left: "65%" },
  { left: "85%" },
];



const Main = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login"); // 로그인이 되어 있지 않으면 로그인 페이지로 이동
    } else {
      navigate("/add-party"); // 로그인이 되어 있으면 파티 추가 페이지로 이동
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative bg-gradient-to-b from-orange-200 via-gray-100 to-blue-200">
      {/* 빵 이미지 */}
      <div className="w-full flex justify-center mt-8">
        {" "}
        {/* Container for bread images */}
        {breadPositions.map((position, index) => (
          <div
            key={index}
            className="floating-element animate-float"
            style={{ left: position.left, position: "absolute", top: "10%" }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/imgs/nbbang.png`}
              alt="Bread"
              className="floating-image w-16 h-16" // 이미지 크기를 조정
            />
          </div>
        ))}
      </div>

      {/* 메인 문구 */}
      <h1 className="mb-2 text-4xl font-extrabold text-center text-black">
        대한민국 N등
      </h1>
      <h1 className="mb-2 text-4xl font-extrabold text-center text-black">
        구독 셰어링 서비스<br />
      </h1>

      <p className="text-center text-gray-700 mt-4">
        넷플릭스, 티빙, 웨이브, 디즈니플러스 등... <br />
        매달 나가는 구독료 부담스럽다면? <br />
        <span className="font-semibold text-black">
          안전한 계정 공유로 더 저렴하게!
        </span>
      </p>

      {/* 계정 공유 시작하기 버튼 */}
      <button
        onClick={handleButtonClick}
        className="mt-6 bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded-full shadow-lg"
      >
        계정공유 시작하기
      </button>

    </div>
  );
};

export default Main;
