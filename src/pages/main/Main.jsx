import "./Main.css";

import React, { useEffect } from "react";

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

//   useEffect(() => {
//     const token = localStorage.getItem("access");
//
//     if (!token) {
//       // 로컬 스토리지에 토큰이 없는 경우에만 API 호출
//       const fetchTokenFromHeader = async () => {
//         try {
//           const response = await fetch("http://localhost:8080/api/auth/token", {
//             credentials: "include", // 쿠키를 포함하여 요청
//           });
//
//           if (!response.ok) {
//             throw new Error("토큰 요청 실패");
//           }
//           const accessTokenHeader = response.headers.get("access");
//           if (accessTokenHeader) {
//             // 토큰을 로컬 스토리지에 저장
//             localStorage.setItem("access", accessTokenHeader);
//             console.log("JWT 토큰을 로컬 스토리지에 저장했습니다.");
//           } else {
//             console.error("'access' 헤더가 없습니다.");
//             navigate("/login"); // 토큰이 없으면 로그인 페이지로 리다이렉트
//           }
//         } catch (error) {
//           console.error("토큰을 가져오는 데 실패했습니다:", error);
//           navigate("/login"); // 요청 실패 시 로그인 페이지로 리다이렉트
//         }
//       };
//
//       // API 호출
//       fetchTokenFromHeader();
//     }
//   }, [navigate]); // 의존성 배열에 navigate를 추가하여 한 번만 실행

  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative bg-gradient-to-b from-green-200 via-yellow-200 to-blue-200">
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
      <h1 className="text-4xl font-extrabold text-center mt-24 text-black">
        대한민국 N등 <br /> OTT 계정공유 서비스
      </h1>

      <p className="text-center text-gray-700 mt-4">
        넷플릭스, 티빙, 웨이브, 디즈니플러스 등... <br />
        매달 나가는 구독료 부담스럽다면? <br />
        <span className="font-semibold text-black">
          안전한 계정 공유로 더 저렴하게!
        </span>
      </p>

      {/* 계정 공유 시작하기 버튼 */}
      <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
        계정공유 시작하기
      </button>
    </div>
  );
};

export default Main;
